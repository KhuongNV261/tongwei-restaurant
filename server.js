const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 8088;
const ROOT = __dirname;
const LOG_FILE = path.join(ROOT, 'server.log');
const SCHEDULER_INTERVAL_MS = 15000; // Kiểm tra lịch hẹn mỗi 15 giây

// ==================== MIME TYPES DICTIONARY ====================
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const GZIP_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.svg',
  '.txt',
  '.xml',
  '.map',
  '.webmanifest'
]);

// ==================== METRICS & MONITORING ====================
const metrics = {
  requests: 0,
  publishes: 0,
  errors: 0,
  startTime: Date.now()
};

function formatLogTimestamp(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

const logger = {
  write(level, message, error = null) {
    const timestamp = formatLogTimestamp();
    let logLine = `[${timestamp}] [${level}] ${message}`;
    if (error) {
      if (error.stack) {
        logLine += `\n${error.stack}`;
      } else {
        logLine += ` ${error}`;
      }
    }

    if (level === 'ERROR') {
      console.error(logLine);
    } else if (level === 'WARN') {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }

    fs.appendFile(LOG_FILE, logLine + '\n', 'utf8', (err) => {
      if (err) {
        console.error(`[${timestamp}] [ERROR] Không thể ghi log vào ${LOG_FILE}:`, err.message);
      }
    });
  },
  info(msg) { this.write('INFO', msg); },
  warn(msg) { this.write('WARN', msg); },
  error(msg, err = null) { this.write('ERROR', msg, err); },
  debug(msg) { this.write('DEBUG', msg); }
};

// ==================== VIETNAM TIMEZONE HELPER (UTC+7) ====================
function getVietnamTimeParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const map = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }
  const timeStr = `${map.hour}:${map.minute}`;
  const dateStr = `${map.day}/${map.month}/${map.year}`;
  const isoDateStr = `${map.year}-${map.month}-${map.day}`;
  const minuteKey = `${isoDateStr} ${timeStr}`;
  return {
    hour: map.hour,
    minute: map.minute,
    second: map.second,
    timeStr,
    dateStr,
    isoDateStr,
    minuteKey
  };
}

// ==================== PUBLISH STATE ====================
const publishState = {
  scheduledTime: '16:40', // Mặc định 4h40 chiều giờ Việt Nam
  autoPublishEnabled: true,
  lastPublishedAt: null,
  lastCommitMessage: null,
  isPublishing: false,
  lastPublishError: null,
  lastTriggerMinute: null
};

// ==================== GIT HELPER (Anti Command Injection) ====================
function runGitCommand(args, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      cwd: ROOT,
      timeout: 30000, // 30s timeout
      maxBuffer: 10 * 1024 * 1024,
      env: process.env
    };
    execFile('git', args, { ...defaultOptions, ...options }, (error, stdout, stderr) => {
      const outStr = stdout ? stdout.toString() : '';
      const errStr = stderr ? stderr.toString() : '';
      if (error) {
        error.stdout = outStr;
        error.stderr = errStr;
        return reject(error);
      }
      resolve({ stdout: outStr, stderr: errStr });
    });
  });
}

// ==================== DATA FILE HANDLING (Atomic & Backup) ====================
async function saveDishesData(dishes) {
  if (!Array.isArray(dishes)) {
    throw new Error('Dữ liệu dishes không hợp lệ: phải là một mảng (Array).');
  }

  const dataDir = path.join(ROOT, 'data');
  const dishesPath = path.join(dataDir, 'dishes.json');
  const tmpPath = path.join(dataDir, 'dishes.json.tmp');
  const bakPath = path.join(dataDir, 'dishes.json.bak');

  await fs.promises.mkdir(dataDir, { recursive: true });

  let backupCreated = false;
  try {
    // 1. Tạo bản sao lưu dự phòng nếu file dishes.json đã tồn tại
    if (fs.existsSync(dishesPath)) {
      await fs.promises.copyFile(dishesPath, bakPath);
      backupCreated = true;
    }

    // 2. Ghi ra file tạm tmp với UTF-8 và Pretty-print
    const serialized = JSON.stringify(dishes, null, 2);
    await fs.promises.writeFile(tmpPath, serialized, 'utf8');

    // 3. Đổi tên nguyên tử (Atomic rename), fallback copy/unlink nếu dính lock trên Windows
    try {
      await fs.promises.rename(tmpPath, dishesPath);
    } catch (renameErr) {
      await fs.promises.copyFile(tmpPath, dishesPath);
      await fs.promises.unlink(tmpPath);
    }

    logger.info(`Đã lưu ${dishes.length} món ăn vào data/dishes.json an toàn (Atomic Write).`);
  } catch (err) {
    logger.error('Lỗi khi ghi file data/dishes.json, đang rollback từ bản backup:', err);
    if (fs.existsSync(tmpPath)) {
      try { await fs.promises.unlink(tmpPath); } catch (_) {}
    }
    if (backupCreated && fs.existsSync(bakPath)) {
      try {
        await fs.promises.copyFile(bakPath, dishesPath);
        logger.info('Đã rollback khôi phục data/dishes.json thành công từ backup.');
      } catch (rbErr) {
        logger.error('Lỗi nghiêm trọng khi rollback từ backup:', rbErr);
      }
    }
    throw err;
  }
}

// ==================== EXECUTE PUBLISH PROCESS ====================
async function executePublish(triggerSource = 'Manual trigger', customData = null) {
  if (publishState.isPublishing) {
    return {
      success: false,
      error: 'Publish already in progress',
      message: 'Đang có một tiến trình xuất bản đang chạy!'
    };
  }

  publishState.isPublishing = true;
  publishState.lastPublishError = null;

  try {
    // 1. Lưu dữ liệu dishes nếu có customData
    if (customData && customData.dishes !== undefined) {
      await saveDishesData(customData.dishes);
    }

    // 2. Định dạng Conventional Commit message theo giờ Việt Nam
    const vt = getVietnamTimeParts(new Date());
    const timeStr = vt.timeStr;
    const dateStr = vt.dateStr;
    const commitMsg = `feat(publish): cập nhật dữ liệu online (${triggerSource} lúc ${timeStr} ${dateStr})`;

    logger.info(`Bắt đầu quy trình Git Publish (${triggerSource}): "${commitMsg}"`);

    // 3. Stage các file dữ liệu cần thiết (ưu tiên data/dishes.json)
    if (fs.existsSync(path.join(ROOT, 'data', 'dishes.json'))) {
      try {
        await runGitCommand(['add', 'data/dishes.json']);
      } catch (addErr) {
        logger.error('Lỗi khi chạy git add data/dishes.json:', addErr);
        throw new Error(`Git add failed: ${addErr.stderr || addErr.message}`);
      }
    }

    // 4. Git Commit
    let isClean = false;
    let commitStdout = '';
    try {
      const commitRes = await runGitCommand(['commit', '-m', commitMsg]);
      commitStdout = commitRes.stdout;
      logger.info(`Git commit thành công: ${commitStdout.trim()}`);
    } catch (commitErr) {
      const combinedOutput = ((commitErr.stdout || '') + ' ' + (commitErr.stderr || '')).toLowerCase();
      const isCleanMsg = /nothing to commit|no changes added to commit|nothing added to commit|working tree clean/i.test(combinedOutput);

      if (isCleanMsg) {
        isClean = true;
        logger.info('Git: Không có thay đổi mới để commit (mã nguồn đã đồng bộ).');
      } else {
        logger.error('Git commit error:', commitErr);
        throw new Error(`Git commit failed: ${commitErr.stderr || commitErr.message}`);
      }
    }

    // Nếu không có gì thay đổi, kết luận thành công đồng bộ
    if (isClean) {
      publishState.lastPublishedAt = new Date().toISOString();
      publishState.lastCommitMessage = 'Mã nguồn đã đồng bộ mới nhất (không có thay đổi mới)';
      metrics.publishes++;
      return {
        success: true,
        message: 'Mã nguồn đã ở trạng thái mới nhất trên GitHub!',
        timestamp: publishState.lastPublishedAt,
        stdout: 'nothing to commit'
      };
    }

    // 5. Git Push origin main
    let pushStdout = '';
    try {
      const pushRes = await runGitCommand(['push', 'origin', 'main']);
      pushStdout = pushRes.stdout || pushRes.stderr;
      logger.info(`Git push thành công: ${pushStdout.trim()}`);
    } catch (pushErr) {
      logger.error('Git push error:', pushErr);
      throw new Error(`Git push failed: ${pushErr.stderr || pushErr.message}`);
    }

    publishState.lastPublishedAt = new Date().toISOString();
    publishState.lastCommitMessage = commitMsg;
    metrics.publishes++;
    logger.info(`[Publish Success] Đã xuất bản lên GitHub lúc ${timeStr}: ${commitMsg}`);

    return {
      success: true,
      message: `Đã xuất bản thành công lên GitHub Pages! (${commitMsg})`,
      timestamp: publishState.lastPublishedAt,
      stdout: pushStdout || commitStdout
    };

  } catch (err) {
    publishState.lastPublishError = err.message;
    logger.error(`[Publish Error]: ${err.message}`, err);
    throw err;
  } finally {
    // Reset cờ lock trong khối finally để không bao giờ bị khóa kẹt
    publishState.isPublishing = false;
  }
}

// ==================== AUTO-PUBLISH SCHEDULER (16:40 Task) ====================
const schedulerTimer = setInterval(async () => {
  if (!publishState.autoPublishEnabled) return;

  const vt = getVietnamTimeParts(new Date());
  const currentTime = vt.timeStr;
  const minuteKey = vt.minuteKey;

  if (currentTime === publishState.scheduledTime && publishState.lastTriggerMinute !== minuteKey) {
    if (publishState.isPublishing) {
      logger.warn(`[Auto-Scheduler] Bỏ qua lịch hẹn ${publishState.scheduledTime} do tiến trình publish khác đang chạy.`);
      return;
    }

    publishState.lastTriggerMinute = minuteKey;
    logger.info(`[Auto-Scheduler] Đã đến giờ hẹn ${publishState.scheduledTime} (giờ Việt Nam). Bắt đầu tự động đẩy lên GitHub...`);

    try {
      const res = await executePublish(`Tự động theo lịch hẹn ${publishState.scheduledTime}`);
      logger.info(`[Auto-Scheduler Success]: ${res.message}`);
    } catch (err) {
      logger.error(`[Auto-Scheduler Error]: ${err.message}`, err);
    }
  }
}, SCHEDULER_INTERVAL_MS);

// Cho phép unref timer để không chặn tiến trình thoát khi test
if (schedulerTimer && typeof schedulerTimer.unref === 'function') {
  schedulerTimer.unref();
}

// ==================== HTTP HELPERS ====================
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function sendJsonResponse(res, statusCode, data) {
  const payload = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    ...CORS_HEADERS,
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(payload);
}

function readRequestBody(req, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytesReceived = 0;
    let tooLarge = false;

    req.on('data', chunk => {
      if (tooLarge) return;
      bytesReceived += chunk.length;
      if (bytesReceived > maxBytes) {
        tooLarge = true;
        const err = new Error('Payload Too Large: Tối đa 10MB');
        err.statusCode = 413;
        req.pause();
        return reject(err);
      }
      body += chunk;
    });

    req.on('end', () => {
      if (!tooLarge) resolve(body);
    });
    req.on('error', err => reject(err));
  });
}

// ==================== HTTP SERVER ====================
const server = http.createServer(async (req, res) => {
  metrics.requests++;
  const parsedUrl = (req.url || '/').split('?')[0];

  // 1. CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      ...CORS_HEADERS,
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // ==================== API ROUTES ====================

  // 2. GET /health & GET /api/health
  if (req.method === 'GET' && (parsedUrl === '/health' || parsedUrl === '/api/health')) {
    const uptimeSeconds = Math.floor(process.uptime());
    return sendJsonResponse(res, 200, {
      status: 'healthy',
      uptime: uptimeSeconds,
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      publishStatus: {
        scheduledTime: publishState.scheduledTime,
        autoPublishEnabled: publishState.autoPublishEnabled,
        isPublishing: publishState.isPublishing,
        lastPublishedAt: publishState.lastPublishedAt,
        lastCommitMessage: publishState.lastCommitMessage,
        lastPublishError: publishState.lastPublishError
      },
      metrics: {
        totalRequests: metrics.requests,
        totalPublishes: metrics.publishes,
        totalErrors: metrics.errors
      }
    });
  }

  // 3. GET /api/publish-status
  if (req.method === 'GET' && parsedUrl === '/api/publish-status') {
    return sendJsonResponse(res, 200, publishState);
  }

  // 4. POST /api/publish & POST /api/publish-github
  if (req.method === 'POST' && (parsedUrl === '/api/publish' || parsedUrl === '/api/publish-github')) {
    if (publishState.isPublishing) {
      metrics.errors++;
      return sendJsonResponse(res, 409, {
        success: false,
        error: 'Publish already in progress',
        message: 'Đang có một tiến trình xuất bản đang chạy!'
      });
    }

    const contentLength = parseInt(req.headers['content-length'], 10);
    if (contentLength && contentLength > 10 * 1024 * 1024) {
      metrics.errors++;
      return sendJsonResponse(res, 413, {
        success: false,
        error: 'Payload Too Large: Tối đa 10MB'
      });
    }

    let body = '';
    try {
      body = await readRequestBody(req, 10 * 1024 * 1024);
    } catch (readErr) {
      metrics.errors++;
      const status = readErr.statusCode || 500;
      return sendJsonResponse(res, status, {
        success: false,
        error: readErr.message
      });
    }

    let data = null;
    if (body && body.trim().length > 0) {
      try {
        data = JSON.parse(body);
      } catch (parseErr) {
        metrics.errors++;
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Invalid JSON payload: ' + parseErr.message
        });
      }
    }

    // Input validation cho dishes
    if (data && data.dishes !== undefined && !Array.isArray(data.dishes)) {
      metrics.errors++;
      return sendJsonResponse(res, 400, {
        success: false,
        error: 'Dữ liệu dishes không hợp lệ: phải là một mảng (Array).'
      });
    }

    try {
      const triggerSource = (data && data.triggerSource) || 'Quản trị viên xuất bản thủ công';
      const result = await executePublish(triggerSource, data);
      return sendJsonResponse(res, 200, result);
    } catch (err) {
      metrics.errors++;
      return sendJsonResponse(res, 500, {
        success: false,
        error: err.message,
        message: err.message
      });
    }
  }

  // 5. POST /api/set-schedule
  if (req.method === 'POST' && parsedUrl === '/api/set-schedule') {
    let body = '';
    try {
      body = await readRequestBody(req, 1024 * 1024);
    } catch (readErr) {
      metrics.errors++;
      const status = readErr.statusCode || 500;
      return sendJsonResponse(res, status, {
        success: false,
        error: readErr.message
      });
    }

    let data = null;
    try {
      data = JSON.parse(body || '{}');
    } catch (parseErr) {
      metrics.errors++;
      return sendJsonResponse(res, 400, {
        success: false,
        error: 'Invalid JSON payload: ' + parseErr.message
      });
    }

    // Validate regex định dạng giờ HH:mm
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (data.scheduledTime !== undefined) {
      if (typeof data.scheduledTime !== 'string' || !timeRegex.test(data.scheduledTime)) {
        metrics.errors++;
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Invalid scheduledTime format. Expected HH:mm in 24-hour format (e.g., 16:40).'
        });
      }
      publishState.scheduledTime = data.scheduledTime;
    }

    // Validate autoPublishEnabled là boolean
    if (data.autoPublishEnabled !== undefined) {
      if (typeof data.autoPublishEnabled !== 'boolean') {
        metrics.errors++;
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Invalid autoPublishEnabled. Expected boolean (true or false).'
        });
      }
      publishState.autoPublishEnabled = data.autoPublishEnabled;
    }

    logger.info(`Cập nhật lịch publish: scheduledTime=${publishState.scheduledTime}, autoPublishEnabled=${publishState.autoPublishEnabled}`);
    return sendJsonResponse(res, 200, {
      success: true,
      state: publishState
    });
  }

  // Từ chối các method khác GET/HEAD đối với file tĩnh
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    metrics.errors++;
    return sendJsonResponse(res, 405, {
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }

  // ==================== STATIC FILE SERVING & PATH SECURITY ====================
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(parsedUrl);
  } catch (e) {
    metrics.errors++;
    return sendJsonResponse(res, 400, {
      success: false,
      error: 'Bad Request: Malformed URI component'
    });
  }

  if (decodedUrl.includes('\0')) {
    metrics.errors++;
    logger.warn(`Blocked Null Byte attempt: ${decodedUrl}`);
    return sendJsonResponse(res, 403, {
      success: false,
      error: '403 Forbidden: Invalid character in path'
    });
  }

  // Path resolution & traversal guard
  const resolved = path.resolve(ROOT, '.' + path.sep + decodedUrl);
  const relativeFromRoot = path.relative(ROOT, resolved);
  const isOutside = relativeFromRoot.startsWith('..') || path.isAbsolute(relativeFromRoot);

  if (isOutside) {
    metrics.errors++;
    logger.warn(`Blocked Path Traversal attempt: "${decodedUrl}" -> "${resolved}"`);
    return sendJsonResponse(res, 403, {
      success: false,
      error: '403 Forbidden: Access outside root directory is denied'
    });
  }

  let targetPath = resolved;
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    targetPath = path.join(targetPath, 'index.html');
  }

  const finalRelative = path.relative(ROOT, targetPath);
  if (finalRelative.startsWith('..') || path.isAbsolute(finalRelative)) {
    metrics.errors++;
    logger.warn(`Blocked Directory Traversal attempt: "${decodedUrl}" -> "${targetPath}"`);
    return sendJsonResponse(res, 403, {
      success: false,
      error: '403 Forbidden: Access denied'
    });
  }

  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
    metrics.errors++;
    return sendJsonResponse(res, 404, {
      success: false,
      error: `404 Not Found: ${decodedUrl}`
    });
  }

  // Serve static file with Gzip compression support
  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  fs.readFile(targetPath, (err, content) => {
    if (err) {
      metrics.errors++;
      logger.error(`Error reading static file: ${targetPath}`, err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: '500 Server Error: ' + err.code
      });
    }

    const headers = {
      ...CORS_HEADERS,
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    };

    if (req.method === 'HEAD') {
      headers['Content-Length'] = Buffer.byteLength(content);
      res.writeHead(200, headers);
      return res.end();
    }

    if (GZIP_EXTENSIONS.has(ext) && /\bgzip\b/i.test(acceptEncoding)) {
      zlib.gzip(content, (gzipErr, compressed) => {
        if (gzipErr) {
          logger.error('Gzip compression error, falling back to uncompressed:', gzipErr);
          headers['Content-Length'] = Buffer.byteLength(content);
          res.writeHead(200, headers);
          return res.end(content);
        }
        headers['Content-Encoding'] = 'gzip';
        headers['Vary'] = 'Accept-Encoding';
        headers['Content-Length'] = compressed.length;
        res.writeHead(200, headers);
        res.end(compressed);
      });
    } else {
      headers['Content-Length'] = Buffer.byteLength(content);
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    logger.info(`TongWei Restaurant Server running at http://localhost:${PORT}/`);
    logger.info(`Admin Portal available at http://localhost:${PORT}/admin/`);
    logger.info(`Auto-publish timer initialized: Every day at ${publishState.scheduledTime} (Asia/Ho_Chi_Minh).`);
  });
}

module.exports = {
  server,
  executePublish,
  saveDishesData,
  publishState,
  metrics,
  getVietnamTimeParts,
  runGitCommand,
  MIME_TYPES,
  schedulerTimer
};
