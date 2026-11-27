import { eventsList, eventEditor } from './editorial-events.js';
import { siteEditor } from './editorial-site.js';
import { node } from './editorial-ui.js';

const byId = id => document.getElementById(id);
const content = byId('cmsContent'), access = byId('cmsAccess'), status = byId('cmsStatus');
const reload = byId('cmsReload'), lockButton = byId('cmsLock');
const views = {
  site: ['Nội dung website', 'Chọn tab cần sửa, cập nhật nội dung rồi nhấn Lưu.'],
  events: ['Tin tức & sự kiện', 'Soạn bài, cập nhật lịch và chọn bài hiển thị cho khách.'],
  contacts: ['Hộp thư liên hệ', 'Đọc thông tin khách gửi từ biểu mẫu liên hệ trên website.']
};
const tabs = document.querySelectorAll('.cms-nav button');
let view = location.hash === '#events' ? 'events' : 'site';
let token = '', verified = false, busy = false, dirty = false;
let generation = 0;

function notice(message = '', type = '') {
  status.textContent = message;
  status.className = type;
}

function controls() {
  access.hidden = verified;
  access.inert = busy;
  content.hidden = !verified;
  content.inert = busy;
  reload.hidden = !verified;
  reload.disabled = busy;
  lockButton.hidden = !verified;
  lockButton.disabled = busy;
  for (const tab of tabs) {
    tab.disabled = busy;
    if (tab.dataset.view === view) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  byId('cmsHeading').textContent = views[view][0];
  byId('cmsDescription').textContent = views[view][1];
}

function lock() {
  generation++;
  token = '';
  verified = busy = dirty = false;
  view = 'site';
  content.replaceChildren();
  access.reset();
  notice();
  controls();
}

function changed() {
  dirty = true;
  notice('Có thay đổi chưa lưu.');
}

function canDiscard() {
  return !dirty || confirm('Bỏ các thay đổi chưa lưu?');
}

async function request(path, { method = 'GET', body, imageName, privateApi = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (privateApi) headers.Authorization = 'Bearer ' + token;
  const binary = body instanceof Blob;
  if (imageName) headers['X-Image-Name'] = encodeURIComponent(imageName);
  if (body !== undefined) headers['Content-Type'] = binary ? body.type : 'application/json';
  let response;
  try {
    response = await fetch(path, {
      method, headers, body: binary ? body : JSON.stringify(body), cache: 'no-store', redirect: 'error'
    });
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng kiểm tra kết nối và tải lại.');
  }
  if (response.status === 401 || response.status === 403) {
    const error = new Error('Mã truy cập không hợp lệ hoặc đã hết hạn. Vui lòng nhập lại.');
    error.auth = true;
    throw error;
  }
  const raw = await response.text();
  let data;
  if (raw.trim()) {
    try { data = JSON.parse(raw); } catch { /* Report non-JSON below. */ }
  }
  if (!response.ok || data?.error || data?.success === false) {
    const messages = {
      400: 'Dữ liệu chưa hợp lệ. Hãy kiểm tra các trường vừa nhập.',
      404: 'Không tìm thấy dữ liệu yêu cầu.', 413: 'Tệp hoặc nội dung vượt quá dung lượng cho phép.',
      500: 'Máy chủ chưa xử lý được yêu cầu. Vui lòng thử lại hoặc liên hệ quản trị viên.',
      503: 'Cơ sở dữ liệu chưa sẵn sàng. Vui lòng liên hệ quản trị viên.'
    };
    throw new Error(messages[response.status] || (typeof data?.error === 'string' ? data.error : 'Máy chủ từ chối yêu cầu (HTTP ' + response.status + ').'));
  }
  if (data === undefined && (method === 'GET' || response.status !== 204)) {
    throw new Error('Máy chủ chưa trả về dữ liệu xác nhận hợp lệ.');
  }
  return data;
}

async function arrayFrom(path) {
  const rows = await request(path);
  if (!Array.isArray(rows) || rows.some(row => !row || row.id == null)) {
    throw new Error('Máy chủ trả về danh sách không hợp lệ.');
  }
  return rows;
}

function inbox(rows) {
  const list = node('div', 'cms-stack');
  if (!rows.length) list.append(node('p', 'cms-card cms-empty', 'Chưa có liên hệ nào.'));
  for (const row of rows) {
    const card = node('article', 'cms-card cms-message');
    const header = node('div', 'cms-message-head');
    header.append(node('h3', '', 'Liên hệ #' + row.id));
    if (row.created_at) header.append(node('span', 'cms-muted', 'Thời điểm gửi · ' + row.created_at));
    const data = node('dl');
    for (const [key, label] of Object.entries({
      name: 'Họ và tên', phone: 'Điện thoại', email: 'Email', address: 'Địa chỉ', message: 'Lời nhắn'
    })) {
      data.append(node('dt', '', label), node('dd', 'cms-prose', row[key] || '—'));
    }
    card.append(header, data);
    list.append(card);
  }
  return list;
}

const uploadLimit = 1536 * 1024;

async function prepareImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Chọn tệp ảnh JPEG, PNG hoặc WebP.');
  if (!file.size || file.size > 16 * 1024 * 1024) throw new Error('Chọn ảnh có dữ liệu và dung lượng tối đa 16 MB.');
  if (file.size <= uploadLimit) return file;
  // Scale larger camera photos in the browser to fit the same database limit on both runtimes.
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    let scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    for (let attempt = 0; attempt < 3; attempt++) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .8));
      if (!blob?.size) break;
      if (blob.size <= uploadLimit) return blob;
      scale *= .85 * Math.sqrt(uploadLimit / blob.size);
    }
  } catch { /* Show the same actionable message when this browser cannot decode or compress the file. */ }
  finally { bitmap?.close(); }
  throw new Error('Chưa thể thu nhỏ ảnh này. Hãy chọn bản JPEG, PNG hoặc WebP dưới 1,5 MB.');
}

const library = {
  list: () => request('/api/media'),
  upload: (file, select, message) => run('Đang tải ảnh lên…', async () => {
    message.textContent = 'Đang tải ảnh lên…';
    try {
      const body = await prepareImage(file);
      const result = await request('/api/media', { method: 'POST', body, imageName: file.name.slice(0, 120) });
      if (!/^\/api\/media\/[a-f0-9]{64}$/.test(result?.url)) throw new Error('Máy chủ chưa trả về đường dẫn ảnh hợp lệ.');
      select(result.url);
      return 'Đã tải ảnh lên và chọn cho mục này. Nhấn Lưu để áp dụng.';
    } catch (error) {
      message.textContent = error.message;
      throw error;
    }
  })
};

function editEvent(event) {
  notice();
  content.replaceChildren(eventEditor(event, body => mutate('POST', body), () => open(view), changed, library));
  content.querySelector('[name=title]').focus();
}

function eventList() {
  return arrayFrom('/api/events?admin=1');
}

async function load(ticket) {
  let panel;
  if (view === 'site') {
    const [defaults, saved] = await Promise.all([
      request('/data/site.json', { privateApi: false }), request('/api/site', { privateApi: false })
    ]);
    panel = siteEditor(defaults, saved, body => mutate('PATCH', body), changed, library, () => open('events'));
  } else if (view === 'events') {
    panel = eventsList(await eventList(), editEvent, mutate);
  } else {
    panel = inbox(await arrayFrom('/api/contacts'));
  }
  if (ticket === generation) content.replaceChildren(panel);
}

async function run(message, operation) {
  if (busy) return;
  const ticket = ++generation;
  busy = true;
  controls();
  notice(message);
  if (byId('pane-editorial').classList.contains('active')) status.scrollIntoView({ block: 'nearest' });
  try {
    const result = await operation(ticket);
    if (ticket === generation) notice(result || '', result ? 'cms-ok' : '');
  } catch (error) {
    if (ticket !== generation) return;
    if (error.auth) {
      token = '';
      verified = false;
      access.reset();
      if (!dirty) content.replaceChildren();
    }
    notice(error.message, 'cms-error');
  } finally {
    if (ticket === generation) {
      busy = false;
      controls();
    }
  }
}

function mutate(method, record) {
  return run('Đang gửi thay đổi…', async ticket => {
    const path = view === 'site' ? '/api/site' : '/api/events';
    if (method === 'DELETE') await request(path + '?id=' + encodeURIComponent(record.id), { method });
    else await request(path, { method, body: record });
    try { localStorage.setItem('tongwei:published', String(Date.now())); } catch { /* Other sessions refresh on focus and periodically. */ }
    if (ticket !== generation) return;
    dirty = false;
    content.replaceChildren();
    try {
      await load(ticket);
    } catch (error) {
      error.message = 'Máy chủ đã xác nhận thay đổi. Chưa tải lại được dữ liệu. ' + error.message;
      throw error;
    }
    return method === 'DELETE' ? 'Đã xóa bài viết.' : 'Đã lưu thay đổi trên máy chủ.';
  });
}

function open(next) {
  if (busy || !Object.hasOwn(views, next) || !canDiscard()) return;
  view = next;
  dirty = false;
  content.replaceChildren();
  notice();
  controls();
  if (verified) run('Đang tải dữ liệu…', load);
}

access.addEventListener('submit', e => {
  e.preventDefault();
  if (busy) return;
  token = access.elements.token.value.trim();
  access.reset();
  if (!token) return notice('Vui lòng nhập mã truy cập.', 'cms-error');
  run('Đang kiểm tra quyền truy cập…', async ticket => {
    // The site GET is public. Verify its editor via the private admin event list.
    const rows = view === 'contacts' ? await arrayFrom('/api/contacts') : await eventList();
    if (ticket !== generation) return;
    verified = true;
    if (dirty && content.childElementCount) return 'Đã mở lại phiên. Bạn có thể lưu bản đang chỉnh sửa.';
    if (view === 'events') content.replaceChildren(eventsList(rows, editEvent, mutate));
    else if (view === 'contacts') content.replaceChildren(inbox(rows));
    else await load(ticket);
  });
});
tabs.forEach(tab => tab.addEventListener('click', () => {
  if (tab.dataset.view !== view) open(tab.dataset.view);
}));
reload.addEventListener('click', () => open(view));
lockButton.addEventListener('click', () => { if (canDiscard()) lock(); });
controls();
