// The three entry points use the same JSON contract and parameterized SQLite queries.
const methods = {
  '/api/site': ['GET', 'PUT', 'PATCH'],
  '/api/events': ['GET', 'POST', 'PATCH', 'DELETE'],
  '/api/contacts': ['GET', 'POST'],
  '/api/media': ['GET', 'POST'],
  '/api/media/:id': ['GET', 'HEAD']
};

export function cmsPath(pathname) {
  const path = pathname.replace(/\/$/, '');
  if (/^\/api\/media\/[a-f0-9]{64}$/.test(path)) return '/api/media/:id';
  return Object.hasOwn(methods, path) ? path : null;
}

class InputError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  } });
}

async function readBytes(request, limit) {
  if (Number(request.headers.get('Content-Length')) > limit) throw new InputError('Request body too large', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError('Missing request body');
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) throw new InputError('Request body too large', 413);
    chunks.push(value);
  }
  return new Uint8Array(await new Blob(chunks).arrayBuffer());
}

async function readObject(request) {
  const bytes = await readBytes(request, 256 * 1024);
  let value;
  try {
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new InputError('Invalid JSON');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InputError('Expected a JSON object');
  }
  return value;
}

function text(value, field, max = 4000, required = false) {
  if (typeof value !== 'string' || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)) {
    throw new InputError('Invalid ' + field);
  }
  const trimmed = value.trim();
  if (required && !trimmed) throw new InputError('Missing ' + field);
  return trimmed;
}

function safeUrl(value, field) {
  const url = text(value, field, 2048);
  if (!url) return '';
  if (/[\\<>"'`\x00-\x1f\x7f]/.test(url) || url.startsWith('//')) throw new InputError('Invalid ' + field);
  let parsed;
  try {
    parsed = new URL(url, 'https://site.invalid/');
  } catch {
    throw new InputError('Invalid ' + field);
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new InputError('Invalid ' + field);
  }
  return url;
}

function arrayOf(validate) {
  return (items, field) => {
    if (!Array.isArray(items) || items.length > 200) throw new InputError('Invalid ' + field);
    return items.map(item => validate(item, field));
  };
}

function fields(value, shape, required = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('Expected an object');
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (!Object.hasOwn(shape, key)) throw new InputError('Unknown field');
    result[key] = shape[key](item, key);
  }
  if (required && Object.keys(result).length !== Object.keys(shape).length) throw new InputError('Incomplete list item');
  return result;
}

const siteFields = {
  navIntro: text, navFranchise: text, navNews: text, navMenu: text, navContact: text,
  brandTagline: text, introMenuLink: text, venuesTitle: text, franchiseContactLink: text,
  benefitsTitle: text, metricsTitle: text, stepsTitle: text, commitmentsTitle: text,
  closingTitle: text, closingContactLink: text, menuPdfLink: text, contactFormTitle: text,
  heroImage: safeUrl, benefitsImage: safeUrl, metricsImage: safeUrl, stepsImage: safeUrl, closingImage: safeUrl,
  introTitle: text, introText: text, introImage: safeUrl,
  spaces: arrayOf(item => fields(item, { name: text, image: safeUrl }, true)),
  franchiseIntro: text, franchiseImage: safeUrl, benefits: arrayOf(text),
  metrics: arrayOf(item => fields(item, { label: text, value: text }, true)),
  steps: arrayOf(item => fields(item, { title: text, text }, true)),
  commitments: arrayOf(text), phone: text, menuUrl: safeUrl, menuPages: arrayOf(safeUrl), contactIntro: text, contactImage: safeUrl
};

async function site(request, db) {
  if (request.method === 'GET') {
    const row = await db.one('SELECT content FROM site_content WHERE id = 1');
    return json(row ? JSON.parse(row.content) : {});
  }
  const content = fields(await readObject(request), siteFields);
  if (request.method === 'PATCH') {
    // Merge only the edited fields atomically so staff editing other sections keep their work.
    const row = await db.one(`INSERT INTO site_content (id, content) VALUES (1, ?)
      ON CONFLICT(id) DO UPDATE SET content = json_patch(site_content.content, excluded.content)
      RETURNING content`, JSON.stringify(content));
    return json(JSON.parse(row.content));
  }
  await db.run('INSERT INTO site_content (id, content) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content', JSON.stringify(content));
  return json(content);
}

function eventId(value) {
  if (typeof value !== 'string' && typeof value !== 'number') throw new InputError('Invalid event id');
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) throw new InputError('Invalid event id');
  return Number(value);
}

function eventStatus(value) {
  if (value !== 'active' && value !== 'hidden') throw new InputError('Invalid event status');
  return value;
}

const eventColumns = 'id, title, date, COALESCE(end_date, \'\') AS end_date, badge, img, "desc", detail, status';
const defaultEventImage = 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg';

async function events(request, url, db) {
  if (request.method === 'GET') {
    // Published events stay in the news archive after their scheduled end.
    const where = url.searchParams.get('admin') === '1' ? '' : "WHERE status = 'active'";
    const rows = await db.all('SELECT ' + eventColumns + ' FROM events ' + where + ' ORDER BY id DESC');
    // Older event writers accepted arbitrary URLs. Preserve the source record when serving a fallback.
    for (const row of rows) {
      try { row.img = safeUrl(row.img ?? '', 'img'); }
      catch { row.img = defaultEventImage; }
    }
    return json(rows);
  }
  if (request.method === 'DELETE') {
    const id = eventId(url.searchParams.get('id'));
    const row = await db.one('DELETE FROM events WHERE id = ? RETURNING id', id);
    return row ? json({ success: true }) : json({ error: 'Event not found' }, 404);
  }
  const data = await readObject(request);
  if (request.method === 'PATCH') {
    const id = eventId(data.id);
    const row = await db.one('UPDATE events SET status = ? WHERE id = ? RETURNING id', eventStatus(data.status), id);
    return row ? json({ success: true }) : json({ error: 'Event not found' }, 404);
  }
  const row = await db.one(`INSERT INTO events (id, title, date, end_date, badge, img, "desc", detail, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET
    title = excluded.title, date = excluded.date, end_date = excluded.end_date, badge = excluded.badge,
    img = excluded.img, "desc" = excluded."desc", detail = excluded.detail, status = excluded.status
    RETURNING ` + eventColumns,
    data.id == null ? null : eventId(data.id), text(data.title, 'title', 300, true),
    text(data.date ?? '', 'date', 300), text(data.end_date ?? data.endDate ?? '', 'end_date', 300),
    text(data.badge ?? 'Sự Kiện', 'badge', 150), safeUrl(data.img ?? defaultEventImage, 'img'),
    text(data.desc ?? '', 'desc'), text(data.detail ?? '', 'detail', 20000), eventStatus(data.status ?? 'active'));
  return json({ success: true, event: row });
}

async function contacts(request, db) {
  if (request.method === 'GET') {
    return json(await db.all('SELECT id, name, phone, email, address, message, created_at FROM contacts ORDER BY id DESC'));
  }
  const data = await readObject(request);
  const name = text(data.name, 'name', 150, true);
  const phone = text(data.phone, 'phone', 32, true);
  const digits = phone.replace(/\D/g, '');
  if (!/^\+?[0-9 ().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) throw new InputError('Invalid phone');
  const email = text(data.email ?? '', 'email', 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError('Invalid email');
  const address = text(data.address ?? '', 'address', 500);
  const message = text(data.message, 'message', 4000, true);
  await db.run('INSERT INTO contacts (name, phone, email, address, message) VALUES (?, ?, ?, ?, ?)', name, phone, email, address, message);
  return json({ success: true }, 201);
}

// Keep each BLOB below the D1 row limit. Only authenticated editors can add or list media.
const maxImageBytes = 1536 * 1024;
const mediaPrefix = '/api/media/';

function imageType(bytes) {
  const tag = (offset, length) => String.fromCharCode(...bytes.subarray(offset, offset + length));
  const size = bytes.length;
  if (size >= 33 && tag(0, 8) === '\x89PNG\r\n\x1a\n' && tag(12, 4) === 'IHDR'
    && tag(size - 8, 4) === 'IEND') return 'image/png';
  if (size >= 12 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    && bytes[size - 2] === 0xff && bytes[size - 1] === 0xd9) return 'image/jpeg';
  if (size >= 24 && tag(0, 4) === 'RIFF' && tag(8, 4) === 'WEBP'
    && ['VP8 ', 'VP8L', 'VP8X'].includes(tag(12, 4))
    && new DataView(bytes.buffer).getUint32(4, true) === size - 8) return 'image/webp';
  throw new InputError('Tệp ảnh không hợp lệ. Hãy chọn ảnh JPEG, PNG hoặc WebP.', 415);
}

async function media(request, db, id) {
  if (id) {
    const head = request.method === 'HEAD';
    const columns = head ? 'type, length(bytes) AS size' : 'type, length(bytes) AS size, bytes';
    const row = await db.one('SELECT ' + columns + ' FROM cms_media WHERE id = ?', id);
    if (!row) return json({ error: 'Không tìm thấy ảnh.' }, 404);
    return new Response(head ? null : new Uint8Array(row.bytes), { headers: {
      'Content-Type': row.type, 'Content-Length': String(row.size),
      'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox"
    } });
  }
  if (request.method === 'GET') {
    const rows = await db.all('SELECT id, label FROM cms_media ORDER BY rowid DESC');
    return json(rows.map(row => ({ url: mediaPrefix + row.id, label: row.label })));
  }
  const declared = request.headers.get('Content-Type');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(declared)) throw new InputError('Chọn ảnh JPEG, PNG hoặc WebP.', 415);
  const bytes = await readBytes(request, maxImageBytes);
  const type = imageType(bytes);
  if (type !== declared) throw new InputError('Định dạng tệp không khớp với nội dung ảnh.', 415);
  let name;
  try { name = decodeURIComponent(request.headers.get('X-Image-Name') || ''); }
  catch { throw new InputError('Tên ảnh không hợp lệ.'); }
  const label = text(name, 'label', 120) || 'Ảnh đã tải lên';
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  const hash = Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
  // Identical files share one URL, including simultaneous uploads.
  const inserted = await db.one(`INSERT INTO cms_media (id, label, type, bytes)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING RETURNING id`, hash, label, type, bytes);
  return json({ url: mediaPrefix + hash }, inserted ? 201 : 200);
}

export async function handleCms(request, token, db) {
  const url = new URL(request.url);
  const path = cmsPath(url.pathname);
  if (!path) return json({ error: 'Not found' }, 404);
  if (!methods[path].includes(request.method)) return json({ error: 'Method not allowed' }, 405, { Allow: methods[path].join(', ') });
  const publicRequest = request.method === 'GET' && (path === '/api/site' || (path === '/api/events' && url.searchParams.get('admin') !== '1'))
    || request.method === 'POST' && path === '/api/contacts' || path === '/api/media/:id';
  if (!publicRequest) {
    const bearer = /^Bearer (\S+)$/i.exec(request.headers.get('Authorization') || '');
    if (!token || !bearer || bearer[1] !== token) {
      return json({ error: 'Unauthorized' }, 401, { 'WWW-Authenticate': 'Bearer' });
    }
  }
  if (!db) return json({ error: 'Database unavailable' }, 503);
  try {
    if (path === '/api/media/:id') return await media(request, db, url.pathname.split('/').filter(Boolean).pop());
    if (path === '/api/media') return await media(request, db);
    if (path === '/api/site') return await site(request, db);
    if (path === '/api/contacts') return await contacts(request, db);
    return await events(request, url, db);
  } catch (err) {
    if (err instanceof InputError) return json({ error: err.message }, err.status);
    return json({ error: 'Database request failed' }, 500);
  }
}

export function cloudflareCms({ request, env }) {
  const db = env.DB;
  const statement = (sql, args) => args.length ? db.prepare(sql).bind(...args) : db.prepare(sql);
  return handleCms(request, env.TONGWEI_ADMIN_TOKEN, db && {
    one: (sql, ...args) => statement(sql, args).first(),
    all: async (sql, ...args) => (await statement(sql, args).all()).results,
    run: (sql, ...args) => statement(sql, args).run()
  });
}
