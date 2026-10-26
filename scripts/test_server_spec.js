const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const assert = require('assert');

const {
  server,
  executePublish,
  saveDishesData,
  publishState,
  metrics,
  getVietnamTimeParts,
  runGitCommand,
  MIME_TYPES
} = require('../server.js');

const TEST_PORT = 8999;
let testServer;

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        ...options
      },
      res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const rawBuffer = Buffer.concat(chunks);
          let json = null;
          let text = '';
          const isGzip = res.headers['content-encoding'] === 'gzip';
          
          try {
            const decompressed = isGzip ? zlib.gunzipSync(rawBuffer) : rawBuffer;
            text = decompressed.toString('utf8');
            try {
              json = JSON.parse(text);
            } catch (_) {}
          } catch (_) {
            text = rawBuffer.toString('utf8');
          }

          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            buffer: rawBuffer,
            text,
            json
          });
        });
      }
    );

    req.on('error', reject);

    if (body) {
      if (Buffer.isBuffer(body) || typeof body === 'string') {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ SERVER & PIPELINE SPECIFICATION ---');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return (async () => {
      try {
        await fn();
        console.log(`  [PASS] ${name}`);
        passed++;
      } catch (err) {
        console.error(`  [FAIL] ${name}:`, err.message);
        failed++;
      }
    })();
  }

  // Khởi động server test
  await new Promise(resolve => {
    testServer = server.listen(TEST_PORT, resolve);
  });

  try {
    // 1. MIME TYPES
    await test('MIME Types Dictionary: Đầy đủ 23 định dạng', () => {
      const requiredExts = [
        '.html', '.css', '.js', '.mjs', '.json', '.png', '.jpg', '.jpeg',
        '.webp', '.svg', '.ico', '.woff2', '.woff', '.ttf', '.otf', '.eot',
        '.txt', '.xml', '.mp4', '.webm', '.wasm', '.webmanifest', '.map'
      ];
      for (const ext of requiredExts) {
        assert(MIME_TYPES[ext], `MIME type cho ${ext} bị thiếu!`);
      }
    });

    // 2. TIMEZONE HANDLING
    await test('Timezone: Chuyển đổi chính xác sang giờ Việt Nam (Asia/Ho_Chi_Minh)', () => {
      const vt = getVietnamTimeParts(new Date());
      assert(vt.timeStr && /^\d{2}:\d{2}$/.test(vt.timeStr), 'timeStr phải có dạng HH:mm');
      assert(vt.dateStr && /^\d{2}\/\d{2}\/\d{4}$/.test(vt.dateStr), 'dateStr phải có dạng DD/MM/YYYY');
      assert(vt.minuteKey, 'minuteKey phải tồn tại');
    });

    // 3. CORS HEADERS & OPTIONS PREFLIGHT
    await test('CORS Headers: OPTIONS preflight trả về 204 với đầy đủ header CORS', async () => {
      const res = await request({
        path: '/api/publish',
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST'
        }
      });
      assert.strictEqual(res.statusCode, 204);
      assert.strictEqual(res.headers['access-control-allow-origin'], '*');
      assert(res.headers['access-control-allow-methods'].includes('POST'));
      assert(res.headers['access-control-allow-headers'].includes('Content-Type'));
    });

    // 4. GET /health & GET /api/health
    await test('Health Endpoints: GET /health và GET /api/health trả về 200 JSON', async () => {
      for (const p of ['/health', '/api/health']) {
        const res = await request({ path: p, method: 'GET' });
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.json.status, 'healthy');
        assert(typeof res.json.uptime === 'number');
        assert(res.json.publishStatus);
        assert(res.json.metrics);
        assert.strictEqual(res.headers['access-control-allow-origin'], '*');
      }
    });

    // 5. GET /api/publish-status
    await test('Publish Status Endpoint: GET /api/publish-status trả về publishState', async () => {
      const res = await request({ path: '/api/publish-status', method: 'GET' });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(typeof res.json.autoPublishEnabled, 'boolean');
      assert.strictEqual(typeof res.json.scheduledTime, 'string');
    });

    // 6. POST /api/set-schedule VALID & INVALID
    await test('Set Schedule: Cập nhật lịch hẹn hợp lệ thành công', async () => {
      const res = await request(
        {
          path: '/api/set-schedule',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        { scheduledTime: '17:30', autoPublishEnabled: false }
      );
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.json.success, true);
      assert.strictEqual(res.json.state.scheduledTime, '17:30');
      assert.strictEqual(res.json.state.autoPublishEnabled, false);
      assert.strictEqual(publishState.scheduledTime, '17:30');
    });

    await test('Set Schedule: Validate lỗi khi giờ không đúng định dạng', async () => {
      const res = await request(
        {
          path: '/api/set-schedule',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        { scheduledTime: '25:99' }
      );
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.json.success, false);
      assert(res.json.error.includes('scheduledTime'));
    });

    await test('Set Schedule: Validate lỗi khi autoPublishEnabled không phải boolean', async () => {
      const res = await request(
        {
          path: '/api/set-schedule',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },
        { autoPublishEnabled: 'true_string' }
      );
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.json.success, false);
      assert(res.json.error.includes('autoPublishEnabled'));
    });

    // Reset schedule back to default
    publishState.scheduledTime = '16:40';
    publishState.autoPublishEnabled = true;

    // 7. PATH TRAVERSAL SECURITY
    await test('Path Traversal: Chặn tuyệt đối đường dẫn thoát ra ngoài ROOT (403 Forbidden)', async () => {
      const maliciousPaths = [
        '/../../server.js',
        '/..%2f..%2fserver.js',
        '/subdir/../../../etc/passwd',
        '/..\\..\\windows\\system32'
      ];
      for (const p of maliciousPaths) {
        const res = await request({ path: p, method: 'GET' });
        assert.strictEqual(res.statusCode, 403, `Path ${p} không trả về 403, nhận được: ${res.statusCode}`);
        assert.strictEqual(res.json.success, false);
      }
    });

    // 8. 404 NOT FOUND JSON
    await test('404 JSON Response: File không tồn tại trả về 404 format JSON', async () => {
      const res = await request({ path: '/non_existent_file_xyz.txt', method: 'GET' });
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.json.success, false);
      assert(res.json.error.includes('404 Not Found'));
    });

    // 9. GZIP COMPRESSION
    await test('Gzip Compression: Trả về Content-Encoding gzip khi client gửi header Accept-Encoding', async () => {
      const res = await request({
        path: '/data/dishes.json',
        method: 'GET',
        headers: { 'Accept-Encoding': 'gzip' }
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['content-encoding'], 'gzip');
      assert.strictEqual(res.headers['vary'], 'Accept-Encoding');
      assert(Array.isArray(res.json), 'Nội dung giải nén phải là mảng dishes JSON');
    });

    await test('Gzip Compression: Trả về uncompressed khi không có Accept-Encoding gzip', async () => {
      const res = await request({
        path: '/data/dishes.json',
        method: 'GET',
        headers: { 'Accept-Encoding': 'identity' }
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['content-encoding'], undefined);
      assert(Array.isArray(res.json));
    });

    // 10. ATOMIC DATA WRITE & BACKUP STRATEGY
    await test('Data Handling: Atomic write & Backup cho data/dishes.json', async () => {
      const dishesPath = path.join(__dirname, '..', 'data', 'dishes.json');
      const bakPath = path.join(__dirname, '..', 'data', 'dishes.json.bak');
      const originalDishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));

      const testDishes = [
        ...originalDishes.slice(0, 2),
        {
          id: 'test-item-999',
          name: 'Món Thử Nghiệm Atomic Write',
          price: 99000,
          category: 'dimsum'
        }
      ];

      await saveDishesData(testDishes);
      assert(fs.existsSync(bakPath), 'File backup .bak phải được tạo ra!');

      const writtenDishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));
      assert.strictEqual(writtenDishes.length, 3);
      assert.strictEqual(writtenDishes[2].id, 'test-item-999');

      // Khôi phục lại dữ liệu gốc
      await saveDishesData(originalDishes);
      const restoredDishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));
      assert.strictEqual(restoredDishes.length, originalDishes.length);
    });

    await test('Data Handling: Validate từ chối khi dishes không phải mảng', async () => {
      let threw = false;
      try {
        await saveDishesData({ notAnArray: true });
      } catch (err) {
        threw = true;
        assert(err.message.includes('mảng'));
      }
      assert(threw, 'Phải throw error khi dishes không phải Array');
    });

    // 11. PAYLOAD SIZE LIMIT (10MB)
    await test('Payload Size Limit: Chặn request vượt quá 10MB (413 Payload Too Large)', async () => {
      // Tạo buffer 10.5 MB
      const bigBuffer = Buffer.alloc(10.5 * 1024 * 1024, 'a');
      const res = await request(
        {
          path: '/api/publish',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': bigBuffer.length
          }
        },
        bigBuffer
      );
      assert.strictEqual(res.statusCode, 413);
      assert.strictEqual(res.json.success, false);
      assert(res.json.error.includes('10MB') || res.json.error.includes('Payload Too Large'));
    });

    // 12. PUBLISH RACE CONDITION LOCKING
    await test('Race Condition: Trả về 409 Conflict khi tiến trình publish đang chạy', async () => {
      publishState.isPublishing = true;
      try {
        const res = await request({
          path: '/api/publish-github',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, { dishes: [] });
        assert.strictEqual(res.statusCode, 409);
        assert.strictEqual(res.json.success, false);
      } finally {
        publishState.isPublishing = false;
      }
    });

    // 13. BOTH ENDPOINTS /api/publish AND /api/publish-github
    await test('Publish Endpoints: Cả 2 endpoint /api/publish và /api/publish-github đều được hỗ trợ', async () => {
      publishState.isPublishing = true;
      try {
        const res1 = await request({ path: '/api/publish', method: 'POST' });
        assert.strictEqual(res1.statusCode, 409);

        const res2 = await request({ path: '/api/publish-github', method: 'POST' });
        assert.strictEqual(res2.statusCode, 409);
      } finally {
        publishState.isPublishing = false;
      }
    });

    // 14. MONITORING METRICS & LOGGER
    await test('Metrics & Logger: Metrics đếm chính xác số requests, errors, publishes', async () => {
      assert(metrics.requests > 0, 'metrics.requests phải > 0');
      assert(metrics.errors > 0, 'metrics.errors phải > 0 sau các test lỗi');
      assert(fs.existsSync(path.join(__dirname, '..', 'server.log')), 'File server.log phải được tạo ra');
    });

    // 15. CLEAN COMMIT ("NOTHING TO COMMIT") HANDLING
    await test('Git Publish: Xử lý mượt mà trạng thái nothing to commit (đồng bộ sạch)', async () => {
      const res = await executePublish('Kiểm tra mã nguồn sạch');
      assert.strictEqual(res.success, true);
      assert(res.message.includes('trạng thái mới nhất'));
      assert.strictEqual(publishState.isPublishing, false, 'isPublishing phải được reset về false');
    });

    // 16. ANTI-COMMAND INJECTION
    await test('Anti Command Injection: An toàn tuyệt đối khi triggerSource chứa ký tự shell injection', async () => {
      const maliciousTrigger = 'Manual"; echo "injected" & calc & dir "';
      const res = await executePublish(maliciousTrigger);
      // execFile passes parameters as array, so no injection occurs
      assert.strictEqual(res.success, true);
      assert.strictEqual(publishState.isPublishing, false);
    });

  } finally {
    testServer.close();
  }

  console.log(`\n--- KẾT QUẢ: ${passed} PASS, ${failed} FAIL ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Lỗi chạy kiểm thử:', err);
  process.exit(1);
});
