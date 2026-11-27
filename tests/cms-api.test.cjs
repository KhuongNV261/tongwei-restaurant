const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');
const { execFileSync, fork } = require('node:child_process');
const { once } = require('node:events');
const { randomUUID } = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const token = randomUUID();
const editedSite = { introTitle: 'Replacement', benefitsTitle: 'Partner benefits', phone: '087 9743888' };
const contact = { name: 'Test', phone: '090 123 4567', email: 'qa@example.org', address: 'Test address', message: 'A < B & C' };
const site = {
  navIntro: 'Nhà hàng', navFranchise: 'Hợp tác', navNews: 'Sự kiện', navMenu: 'Thực đơn', navContact: 'Liên hệ',
  heroImage: '/assets/hero.webp', benefitsImage: '', metricsImage: '/assets/investment.webp',
  stepsImage: '/assets/timeline.webp', closingImage: '/assets/closing.webp', franchiseImage: '/assets/partner.webp',
  introTitle: 'Giới thiệu', introText: 'A & B', introImage: '/assets/intro.webp',
  spaces: [{ name: 'Hà Nội', image: 'assets/space.webp' }], franchiseIntro: 'Partner',
  benefits: ['One'], metrics: [{ label: 'Seats', value: '80+' }], steps: [{ title: 'Visit', text: 'Meet' }],
  commitments: ['Service'], phone: '+84 90 123 4567', menuUrl: 'https://example.org/menu',
  menuPages: ['assets/menu 1.jpg'], contactIntro: 'Get in touch', contactImage: '/assets/venue.jpg'
};
const seedSql = fs.readFileSync(path.join(root, 'schema.sql'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations/0001_site_and_contacts.sql'), 'utf8');
const mediaMigration = fs.readFileSync(path.join(root, 'migrations/0002_cms_media.sql'), 'utf8');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j1QAAAABJRU5ErkJggg==', 'base64');

async function mediaContract(dispatch) {
  const auth = { Authorization: 'Bearer ' + token };
  const post = (bytes, type, headers = auth) => dispatch('/api/media', {
    method: 'POST', headers: { ...headers, 'Content-Type': type, 'X-Image-Name': encodeURIComponent('Ảnh thử') }, body: bytes
  });
  assert.equal((await dispatch('/api/media')).status, 401);
  assert.equal((await post(png, 'image/png', {})).status, 401);
  assert.equal((await post('<svg/>', 'image/svg+xml')).status, 415);
  assert.equal((await post('<svg/>', 'image/png')).status, 415);
  assert.equal((await post(png, 'image/jpeg')).status, 415);
  assert.equal((await post(Buffer.alloc(1536 * 1024 + 1), 'image/png')).status, 413);
  const response = await post(png, 'image/png');
  assert.equal(response.status, 201);
  const { url } = await response.json();
  assert.match(url, /^\/api\/media\/[a-f0-9]{64}$/);
  assert.equal((await post(png, 'image/png')).status, 200);
  const list = await dispatch('/api/media', { headers: auth });
  assert.equal(list.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await list.json(), [{ url, label: 'Ảnh thử' }]);
  const image = await dispatch(url);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('Content-Type'), 'image/png');
  assert.equal(image.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png);
  const head = await dispatch(url, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers.get('Content-Length')), png.length);
  assert.equal(await head.text(), '');
  assert.equal((await dispatch('/api/media/' + '0'.repeat(64))).status, 404);
  for (const [file, type] of [['menu/menu_page_03.jpg', 'image/jpeg'], ['editorial/brand.webp', 'image/webp']]) {
    const original = fs.readFileSync(path.join(root, 'assets/images', file));
    const upload = await post(original, type);
    assert.equal(upload.status, 201);
    const image = await dispatch((await upload.json()).url);
    assert.equal(image.headers.get('Content-Type'), type);
    assert.deepEqual(Buffer.from(await image.arrayBuffer()), original);
  }
  return url;
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tongwei-cms-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5 }));
  return dir;
}

function client(dispatch) {
  return async (pathname, { method = 'GET', body, auth, status = 200 } = {}) => {
    const headers = {};
    if (auth) headers.Authorization = 'Bearer ' + (auth === true ? token : auth);
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    let response;
    let data;
    try {
      response = await dispatch(pathname, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
      data = await response.json();
    } catch (error) {
      throw new Error(method + ' ' + pathname + ' (expected ' + status + ')', { cause: error });
    }
    assert.equal(response.status, status, method + ' ' + pathname + ' ' + JSON.stringify(data));
    assert.equal(response.headers.get('cache-control'), 'no-store');
    return data;
  };
}

async function contract(call) {
  assert.deepEqual(await call('/api/site'), {});
  for (const [url, method] of [
    ['/api/site', 'PUT'], ['/api/site', 'PATCH'], ['/api/events?admin=1', 'GET'], ['/api/events', 'POST'],
    ['/api/events', 'PATCH'], ['/api/events?id=1', 'DELETE'], ['/api/contacts', 'GET']
  ]) {
    await call(url, { method, status: 401 });
    await call(url, { method, auth: 'incorrect', status: 401 });
  }
  await call('/api/site', { method: 'PUT', auth: true, body: site });
  assert.deepEqual(await call('/api/site/'), site);
  for (const body of [
    { introImage: 'javascript:alert(1)' }, { menuUrl: '//bad.example/file' }, { menuPages: ['data:text/html,bad'] },
    { heroImage: 'data:image/png;base64,AA==' }, { spaces: [{ name: 'Ảnh', image: 'data:image/png;base64,AA==' }] },
    { spaces: [{ name: 'Missing image' }] }, { unknown: true }, { benefits: [4] }
  ]) await call('/api/site', { method: 'PUT', body, auth: true, status: 400 });
  await call('/api/site', { method: 'PUT', body: { introText: 'x'.repeat(300000) }, auth: true, status: 413 });
  assert.deepEqual(await call('/api/site'), site);
  await call('/api/site', { method: 'PUT', auth: true, body: { introTitle: 'Replacement' } });
  assert.deepEqual(await call('/api/site'), { introTitle: 'Replacement' });
  await Promise.all([
    call('/api/site', { method: 'PATCH', auth: true, body: { benefitsTitle: 'Partner benefits' } }),
    call('/api/site', { method: 'PATCH', auth: true, body: { phone: '087 9743888' } })
  ]);
  assert.deepEqual(await call('/api/site'), editedSite);
  await call('/api/site', { method: 'PATCH', auth: true, body: { phone: null }, status: 400 });

  const seed = await call('/api/events');
  assert.deepEqual(seed.map(e => e.id), [4, 3, 2, 1]);
  assert.match(seed[0].date, /15\.10/);
  assert.deepEqual(Object.keys(seed[0]).sort(), ['id', 'title', 'date', 'end_date', 'badge', 'img', 'desc', 'detail', 'status'].sort());
  const draft = { title: 'Private', date: 'Thứ 6 hàng tuần', status: 'hidden' };
  const { event } = await call('/api/events', { method: 'POST', auth: true, body: draft });
  assert.ok(event.id > 4);
  assert.equal((await call('/api/events')).length, 4);
  assert.deepEqual((await call('/api/events?admin=1', { auth: true }))[0], event);
  await call('/api/events', { method: 'PATCH', auth: true, body: { id: event.id, status: 'active' } });
  assert.equal((await call('/api/events'))[0].date, draft.date);
  await call('/api/events', { method: 'POST', auth: true, body: { ...event, title: 'Saved edit', status: 'active', date: '1999-12-30', end_date: '2000-01-01' } });
  assert.equal((await call('/api/events'))[0].title, 'Saved edit');
  assert.equal((await call('/api/events?admin=1', { auth: true }))[0].title, 'Saved edit');
  await call('/api/events', { method: 'POST', auth: true, body: { title: 'Bad image', img: 'data:text/html,test' }, status: 400 });
  await call('/api/events', { method: 'POST', auth: true, body: { title: 'Bad status', status: 'draft' }, status: 400 });
  await call('/api/events?id=' + event.id, { method: 'DELETE', auth: true });
  assert.deepEqual(await call('/api/events?admin=1', { auth: true }), seed);
  await call('/api/events?id=1', { method: 'DELETE', auth: true });

  for (const body of [{ ...contact, phone: 'xx' }, { ...contact, name: '  ' }, { ...contact, email: 'invalid' }, { ...contact, message: {} }]) {
    await call('/api/contacts', { method: 'POST', body, status: 400 });
  }
  await Promise.all(Array.from({ length: 10 }, (_, i) =>
    call('/api/contacts', { method: 'POST', body: { ...contact, name: 'Guest ' + i }, status: 201 })));
  const contacts = await call('/api/contacts', { auth: true });
  assert.equal(new Set(contacts.map(c => c.id)).size, 10);
  assert.equal(new Set(contacts.map(c => c.name)).size, 10);
  assert.deepEqual(Object.keys(contacts[0]).sort(), ['id', 'name', 'phone', 'email', 'address', 'message', 'created_at'].sort());
  assert.equal(contacts[0].message, contact.message);
  assert.ok(Number.isFinite(Date.parse(contacts[0].created_at)));
}

async function startNode(dir, secret = token) {
  const child = fork(path.join(root, 'server.js'), [], {
    cwd: root, silent: true, execArgv: [],
    env: { ...process.env, PORT: '0', TONGWEI_DATA_DIR: dir, NODE_ENV: 'test',
      TONGWEI_DISABLE_SCHEDULER: '1', TONGWEI_ADMIN_TOKEN: secret }
  });
  const exited = once(child, 'exit');
  const listening = new Promise(resolve => {
    child.stdout.setEncoding('utf8');
    let log = '';
    child.stdout.on('data', chunk => {
      log += chunk;
      const match = log.match(/running at http:\/\/localhost:(\d+)\//);
      if (match) resolve(Number(match[1]));
    });
  });
  const port = await Promise.race([listening, exited.then(([code]) => {
    throw new Error('Node server exited during startup with code ' + code);
  })]);
  const fetchAt = (url, init) => fetch('http://127.0.0.1:' + port + url, init);
  return { fetchAt, call: client(fetchAt), stop: async () => { child.kill(); await exited; } };
}

test('Node HTTP API, shared SQLite file, restart and fail-closed auth', async t => {
  const dir = tempDir(t);
  const first = await startNode(dir);
  let imageUrl;
  try {
    await contract(first.call);
    imageUrl = await mediaContract(first.fetchAt);
    assert.equal((await (await first.fetchAt('/api/publish-status')).json()).autoPublishEnabled, false);
    for (const url of ['/cms.sqlite', '/data/cms.sqlite', '/server.log', '/.git', '/schema.sql']) {
      assert.equal((await first.fetchAt(url)).status, 404);
    }
    assert.equal((await first.fetchAt('/data/dishes.json')).status, 200);
    const second = await startNode(dir);
    try {
      await Promise.all(Array.from({ length: 16 }, (_, i) =>
        (i % 2 ? first : second).call('/api/events', { method: 'POST', auth: true, body: { title: 'Concurrent ' + i } })));
      assert.equal((await first.call('/api/events')).length, 19);
    } finally { await second.stop(); }
  } finally { await first.stop(); }
  const reopened = await startNode(dir);
  try {
    assert.deepEqual(Buffer.from(await (await reopened.fetchAt(imageUrl)).arrayBuffer()), png);
    assert.deepEqual(await reopened.call('/api/site'), editedSite);
    assert.equal((await reopened.call('/api/contacts', { auth: true })).length, 10);
    assert.ok(!(await reopened.call('/api/events')).some(event => event.id === 1));
  } finally { await reopened.stop(); }
  const unconfigured = await startNode(dir, '');
  try { await unconfigured.call('/api/contacts', { auth: true, status: 401 }); }
  finally { await unconfigured.stop(); }
});

for (const existingEndDate of [false, true]) {
  test('Upgrade preserves records with end_date column ' + (existingEndDate ? 'present' : 'absent'), async t => {
    const dir = tempDir(t);
    const sql = new DatabaseSync(path.join(dir, 'cms.sqlite'));
    sql.exec(seedSql);
    if (!existingEndDate) sql.exec('ALTER TABLE events DROP COLUMN end_date');
    else sql.exec("UPDATE events SET end_date = '2099-12-31' WHERE id = 4");
    sql.exec("DROP TABLE contacts; DROP TABLE site_content; DROP TABLE cms_media; DELETE FROM events WHERE id = 1");
    sql.exec("UPDATE events SET title = 'Customized', img = 'javascript:legacy' WHERE id = 4");
    sql.close();
    const node = await startNode(dir);
    try {
      const events = await node.call('/api/events');
      assert.equal(events.length, 3);
      assert.equal(events[0].title, 'Customized');
      assert.match(events[0].img, /^assets\//);
      assert.equal(events[0].end_date, existingEndDate ? '2099-12-31' : '');
      assert.deepEqual(await node.call('/api/site'), {});
      assert.deepEqual(await node.call('/api/contacts', { auth: true }), []);
      assert.deepEqual(await node.call('/api/media', { auth: true }), []);
    } finally { await node.stop(); }
  });
}

test('Node refuses a private data directory under the static root', () => {
  const dir = path.join(root, 'data', 'cms-test-' + randomUUID());
  assert.throws(() => execFileSync(process.execPath, [path.join(root, 'server.js')], {
    stdio: 'pipe', env: { ...process.env, NODE_ENV: 'test', TONGWEI_DISABLE_SCHEDULER: '1', TONGWEI_DATA_DIR: dir }
  }), /must be outside/);
  assert.equal(fs.existsSync(dir), false);
});

const booking = { id: 'test-booking', name: 'Test guest', phone: '0000000000' };
const bookingEdit = { id: booking.id, status: 'confirmed' };
const dish = { id: 'test-dish', name: 'Test dish', tags: ['test'], isSignature: true };
const privateOperations = [
  ['/api/bookings/', { method: 'GET' }],
  ['/api/bookings', { method: 'PATCH', body: bookingEdit }],
  ['/api/dishes/', { method: 'POST', body: dish }]
];

async function bookingAndDishContract(dispatch, call) {
  const created = await dispatch('/api/bookings/', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) });
  assert.equal(created.status, 200);
  assert.equal((await created.json()).bookingId, booking.id);
  for (const [path, options] of privateOperations) {
    for (const auth of [false, 'wrong-token']) {
      assert.deepEqual(await call(path, { ...options, auth, status: 401 }), { error: 'Unauthorized' });
    }
  }
  const getBooking = async () => (await call('/api/bookings', { auth: true })).find(row => row.id === booking.id);
  const getDish = async () => {
    const response = await dispatch('/api/dishes');
    assert.equal(response.status, 200);
    return (await response.json()).find(row => row.id === dish.id);
  };
  assert.equal((await getBooking()).status, 'pending');
  assert.equal(await getDish(), undefined);
  assert.equal((await call('/api/bookings/', { auth: true, method: 'PATCH', body: bookingEdit })).success, true);
  assert.equal((await getBooking()).status, 'confirmed');
  for (const name of ['Test dish', 'Updated dish']) {
    assert.equal((await call('/api/dishes', { auth: true, method: 'POST', body: { ...dish, name } })).success, true);
    const saved = await getDish();
    assert.equal(saved.name, name);
    assert.equal(saved.isSignature, true);
    assert.deepEqual(saved.tags, dish.tags);
  }
}

// Wrangler supplies the same workerd, local D1 implementation and Pages compiler used by wrangler dev.
let wranglerPath;
try { wranglerPath = require.resolve('wrangler/package.json'); } catch {}
for (const entry of ['Worker', 'Pages Functions']) {
  test(entry + ' HTTP API with local D1', { skip: !wranglerPath && 'Wrangler 4 required (see README)' }, async t => {
    const dir = tempDir(t);
    const localRequire = createRequire(wranglerPath);
    const { Miniflare, convertV4MiniflareOptions = value => value } = localRequire('miniflare');
    let script;
    if (entry === 'Worker') {
      script = localRequire('esbuild').buildSync({ entryPoints: [path.join(root, 'worker.js')], bundle: true,
        format: 'esm', write: false }).outputFiles[0].text;
    } else {
      const outdir = path.join(dir, 'pages');
      execFileSync(process.execPath, [localRequire.resolve('./bin/wrangler.js'), 'pages', 'functions', 'build',
        path.join(root, 'functions'), '--outdir', outdir], { cwd: dir, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } });
      script = fs.readFileSync(path.join(outdir, 'index.js'), 'utf8');
    }
    const options = { modules: true, script, d1Databases: ['DB'], d1Persist: dir, cf: false, compatibilityDate: '2025-10-01' };
    const mf = new Miniflare(convertV4MiniflareOptions({ ...options, bindings: { TONGWEI_ADMIN_TOKEN: token } }));
    try {
      const db = await mf.getD1Database('DB');
      const statements = (seedSql + '\n' + migration).trim().split(/;\s*\r?\n/).filter(s => s.trim());
      await db.batch(statements.map(s => db.prepare(s)));
      const dispatch = (url, init) => mf.dispatchFetch('http://local' + url, init);
      const call = client(dispatch);
      await bookingAndDishContract(dispatch, call);
      await contract(call);
      await db.exec('DROP TABLE cms_media');
      await db.prepare(mediaMigration).run();
      const imageUrl = await mediaContract(dispatch);
      // Exercise the README upgrade against both deployed layouts, including edited and deleted seeds.
      if (entry === 'Worker') await db.exec('ALTER TABLE events DROP COLUMN end_date');
      else await db.exec("UPDATE events SET end_date = '2099-12-31' WHERE id = 4");
      await db.exec("UPDATE events SET title = 'Edited in D1' WHERE id = 4");
      const { results } = await db.prepare('PRAGMA table_info(events)').all();
      if (!results.some(column => column.name === 'end_date')) await db.exec('ALTER TABLE events ADD COLUMN end_date TEXT');
      await db.batch(migration.trim().split(/;\s*\r?\n/).map(s => db.prepare(s)));
      const events = await call('/api/events');
      assert.deepEqual(events.map(event => event.id), [4, 3, 2]);
      assert.equal(events[0].title, 'Edited in D1');
      assert.equal(events[0].end_date, entry === 'Worker' ? '' : '2099-12-31');
      assert.equal((await call('/api/contacts', { auth: true })).length, 10);
      await mf.setOptions(convertV4MiniflareOptions(options));
      for (const [url, options] of privateOperations) {
        await call(url, { ...options, auth: true, status: 401 });
      }
      await call('/api/events?admin=1', { auth: true, status: 401 });
      await call('/api/contacts', { auth: true, status: 401 });
      assert.deepEqual(await call('/api/site'), editedSite);
      assert.deepEqual(Buffer.from(await (await dispatch(imageUrl)).arrayBuffer()), png);
    } finally { await mf.dispose(); }
  });
}
