const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8088;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Scheduler & Publish State
let publishState = {
  scheduledTime: '16:40', // Mặc định 4h40 chiều
  autoPublishEnabled: true,
  lastPublishedAt: null,
  lastCommitMessage: null,
  isPublishing: false,
  lastPublishError: null,
  lastTriggerMinute: null
};

// Helper: execute publish to GitHub
function executePublish(triggerSource = 'Manual trigger', customData = null) {
  return new Promise((resolve, reject) => {
    if (publishState.isPublishing) {
      return resolve({ success: false, message: 'Đang có một tiến trình xuất bản đang chạy!' });
    }

    publishState.isPublishing = true;
    publishState.lastPublishError = null;

    try {
      // 1. If customData provided (dishes, etc.), save to data/dishes.json
      if (customData && customData.dishes && Array.isArray(customData.dishes)) {
        const dishesPath = path.join(ROOT, 'data', 'dishes.json');
        fs.writeFileSync(dishesPath, JSON.stringify(customData.dishes, null, 2), 'utf8');
      }

      // 2. Format commit message
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('vi-VN');
      const commitMsg = `feat(publish): cập nhật dữ liệu online (${triggerSource} lúc ${timeStr} ${dateStr})`;

      // 3. Run git commands: git add, commit, push
      const gitCmd = `git add . && git commit -m "${commitMsg}" && git push origin main`;

      exec(gitCmd, { cwd: ROOT }, (error, stdout, stderr) => {
        publishState.isPublishing = false;

        if (error) {
          // If no changes to commit, treat as clean state
          if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit')) {
            publishState.lastPublishedAt = new Date().toISOString();
            publishState.lastCommitMessage = 'Mã nguồn đã đồng bộ mới nhất (không có thay đổi mới)';
            return resolve({
              success: true,
              message: 'Mã nguồn đã ở trạng thái mới nhất trên GitHub!',
              timestamp: publishState.lastPublishedAt,
              stdout
            });
          }

          console.error('[Publish Error]:', error.message, stderr);
          publishState.lastPublishError = stderr || error.message;
          return reject(new Error(stderr || error.message));
        }

        publishState.lastPublishedAt = new Date().toISOString();
        publishState.lastCommitMessage = commitMsg;
        console.log(`[Publish Success] Published to GitHub at ${timeStr}: ${commitMsg}`);

        resolve({
          success: true,
          message: `Đã xuất bản thành công lên GitHub Pages! (${commitMsg})`,
          timestamp: publishState.lastPublishedAt,
          stdout
        });
      });
    } catch (err) {
      publishState.isPublishing = false;
      publishState.lastPublishError = err.message;
      reject(err);
    }
  });
}

// Background Cron: Check every 30 seconds for scheduled 16:40 (4h40 chiều)
setInterval(() => {
  if (!publishState.autoPublishEnabled) return;

  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, '0');
  const currentMinute = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;
  const minuteKey = `${now.toDateString()} ${currentTime}`;

  if (currentTime === publishState.scheduledTime && publishState.lastTriggerMinute !== minuteKey) {
    publishState.lastTriggerMinute = minuteKey;
    console.log(`[Auto-Scheduler] Đã đến giờ hẹn ${publishState.scheduledTime} (4h40). Bắt đầu tự động đẩy lên GitHub...`);
    executePublish('Tự động theo lịch hẹn 16:40')
      .then(res => console.log('[Auto-Scheduler Success]:', res.message))
      .catch(err => console.error('[Auto-Scheduler Error]:', err.message));
  }
}, 30000);

const server = http.createServer((req, res) => {
  const parsedUrl = req.url.split('?')[0];

  // ==================== API ENDPOINTS ====================

  // 1. GET /api/publish-status
  if (req.method === 'GET' && parsedUrl === '/api/publish-status') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify(publishState));
  }

  // 2. POST /api/publish-github
  if (req.method === 'POST' && parsedUrl === '/api/publish-github') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      let data = null;
      if (body) {
        try { data = JSON.parse(body); } catch(e) {}
      }

      try {
        const result = await executePublish('Quản trị viên xuất bản thủ công', data);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // 3. POST /api/set-schedule
  if (req.method === 'POST' && parsedUrl === '/api/set-schedule') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.scheduledTime) publishState.scheduledTime = data.scheduledTime;
        if (typeof data.autoPublishEnabled === 'boolean') publishState.autoPublishEnabled = data.autoPublishEnabled;

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, state: publishState }));
      } catch(e) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ==================== STATIC FILE SERVING ====================
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(parsedUrl);
  } catch (e) {
    decodedUrl = parsedUrl;
  }

  let filePath = path.join(ROOT, decodedUrl);

  // If path is a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Handle case where file doesn't exist
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found: ' + decodedUrl);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Server Error: ' + err.code);
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`TongWei Server running at http://localhost:${PORT}/`);
  console.log(`Admin Portal: http://localhost:${PORT}/admin/`);
  console.log(`Auto-publish timer initialized: Every day at ${publishState.scheduledTime} (4h40).`);
});
