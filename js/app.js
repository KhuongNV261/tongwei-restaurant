'use strict';

const byId = id => document.getElementById(id);
const string = value => typeof value === 'string' ? value.trim() : '';
const list = value => Array.isArray(value) ? value : [];

function element(tag, text) {
  const item = document.createElement(tag);
  if (text) item.textContent = text;
  return item;
}

function safeUrl(value) {
  const raw = string(value);
  if (!raw || raw.startsWith('//') || /[\\<>"'`\x00-\x1f\x7f]/.test(raw)) return '';
  try {
    const url = new URL(raw, document.baseURI);
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* An invalid URL has no public link or image. */ }
  return '';
}

async function getJSON(path) {
  const response = await fetch(path, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error('Không tải được dữ liệu.');
  return response.json();
}

const navigation = byId('main-nav');
const main = byId('main');
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const tabs = new Map(navLinks.map(link => [link.hash, link]));
let activeTab = navLinks[0];

navigation.setAttribute('role', 'tablist');
main.tabIndex = -1;
for (const tab of navLinks) {
  const panel = byId(tab.hash.slice(1));
  tab.id ||= 'tab-' + panel.id;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', panel.id);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.tabIndex = 0;
}

function revealActiveTab() {
  if (navigation.scrollWidth <= navigation.clientWidth) return;
  const bounds = navigation.getBoundingClientRect();
  const link = activeTab.getBoundingClientRect();
  const left = bounds.left + navigation.clientLeft;
  const right = left + navigation.clientWidth;
  if (link.left < left) navigation.scrollLeft += link.left - left;
  else if (link.right > right) navigation.scrollLeft += link.right - right;
}

function updateTitle() {
  document.title = activeTab.textContent.trim() + ' · Tong Wei';
}

function selectTab(tab, focusTarget) {
  activeTab = tab;
  if (reader.open && tab.hash !== '#menu') reader.close();
  navLinks.forEach(link => {
    const selected = link === tab;
    byId(link.hash.slice(1)).hidden = !selected;
    link.tabIndex = selected ? 0 : -1;
    link.setAttribute('aria-selected', String(selected));
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  updateTitle();
  focusTarget?.focus({ preventScroll: true });
  revealActiveTab();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function navigate(tab, focusTarget) {
  if (location.hash !== tab.hash) history.pushState(null, '', tab.hash);
  selectTab(tab, focusTarget);
}

function readRoute(initial = false) {
  const hash = location.hash;
  const skip = hash === '#main';
  const tab = skip ? activeTab : tabs.get(hash) || navLinks[0];
  if (hash && hash !== tab.hash) history.replaceState(history.state, '', tab.hash);
  const panel = byId(tab.hash.slice(1));
  const target = skip ? main : panel;
  selectTab(tab, initial && !hash ? null : target);

  // The browser may focus and scroll to the URL fragment again after scripts run.
  if (initial && hash) {
    window.addEventListener('pageshow', () => requestAnimationFrame(() => {
      if (location.hash !== tab.hash || ![panel, main].includes(document.activeElement)) return;
      target.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }), { once: true });
  }
}

// Handle links outside the tablist too, including repeated clicks on the current hash.
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  if (link.hash === '#main') {
    event.preventDefault();
    selectTab(activeTab, main);
    return;
  }
  const tab = tabs.get(link.hash);
  if (!tab) return;
  event.preventDefault();
  navigate(tab, link === tab ? tab : byId(tab.hash.slice(1)));
});

navigation.addEventListener('keydown', event => {
  const index = navLinks.indexOf(event.target.closest('a'));
  if (index < 0 || event.altKey || event.ctrlKey || event.metaKey) return;
  let next;
  switch (event.key) {
    case 'ArrowRight': next = (index + 1) % navLinks.length; break;
    case 'ArrowLeft': next = (index - 1 + navLinks.length) % navLinks.length; break;
    case 'Home': next = 0; break;
    case 'End': next = navLinks.length - 1; break;
    case ' ': next = index; break;
    default: return;
  }
  event.preventDefault();
  navigate(navLinks[next], navLinks[next]);
});
history.scrollRestoration = 'manual';
window.addEventListener('hashchange', () => readRoute());
window.addEventListener('resize', revealActiveTab);

let venuePhotos = [];
let venueIndex = 0;
function showVenue(index) {
  byId('gallery').hidden = byId('venue').hidden = !venuePhotos.length;
  byId('venue-controls').hidden = venuePhotos.length < 2;
  if (!venuePhotos.length) {
    byId('venue-photo').removeAttribute('src');
    byId('venue-caption').textContent = '';
    return;
  }
  venueIndex = (index + venuePhotos.length) % venuePhotos.length;
  const place = venuePhotos[venueIndex];
  byId('venue-photo').src = place.image;
  byId('venue-photo').alt = 'Không gian Tong Wei tại ' + place.name;
  byId('venue-caption').textContent = place.name;
  if (venuePhotos.length > 1) {
    byId('venue-caption').append(element('span', ' · ' + (venueIndex + 1) + '/' + venuePhotos.length));
  }
}

byId('venue-prev').addEventListener('click', () => showVenue(venueIndex - 1));
byId('venue-next').addEventListener('click', () => showVenue(venueIndex + 1));
byId('venue-photo').addEventListener('error', () => {
  if (!venuePhotos.length) return;
  venuePhotos.splice(venueIndex, 1);
  showVenue(venueIndex);
});

function renderIntro(site) {
  byId('intro-title').textContent = string(site.introTitle);
  byId('story').replaceChildren(...string(site.introText).split(/\n+/).filter(Boolean).map(line => element('p', line)));
  const spaces = list(site.spaces).map(place => ({ name: string(place?.name), image: safeUrl(place?.image) }));
  const names = [...new Set(spaces.map(place => place.name).filter(Boolean))];
  const locations = byId('locations');
  locations.replaceChildren(...names.map(name => element('li', name)));
  locations.closest('.venues').hidden = !names.length;
  const currentPhoto = venuePhotos[venueIndex]?.image;
  venuePhotos = spaces.filter(place => place.image && place.name);
  showVenue(Math.max(0, venuePhotos.findIndex(place => place.image === currentPhoto)));
}

function renderList(id, items) {
  const target = byId(id);
  target.replaceChildren(...items);
  target.closest('.chapter').hidden = !items.length;
}

const labels = [...document.querySelectorAll('[data-site-label]')].map(node => ({
  node, fallback: node.textContent
}));
const artwork = document.querySelectorAll('img[data-site-image]');

function setArtworkVisible(image, visible) {
  image.hidden = !visible;
  const parent = image.parentElement;
  const siblings = [...parent.children];
  if (siblings.every(child => child.matches('img[data-site-image]'))) {
    parent.hidden = siblings.every(child => child.hidden);
  }
}

for (const image of artwork) {
  image.addEventListener('error', () => setArtworkVisible(image, false));
  if (image.complete && !image.naturalWidth) setArtworkVisible(image, false);
}

let displayedSite;
function renderSite(site) {
  if (JSON.stringify(site) === JSON.stringify(displayedSite)) return;
  for (const { node, fallback } of labels) {
    node.textContent = string(site[node.dataset.siteLabel]) || fallback;
  }
  for (const image of artwork) {
    const url = safeUrl(site[image.dataset.siteImage]);
    if (!url) image.removeAttribute('src');
    else if (image.src !== url) image.src = url;
    setArtworkVisible(image, Boolean(url) && !(image.complete && !image.naturalWidth));
  }
  renderIntro(site);
  byId('franchise-intro').textContent = string(site.franchiseIntro);
  for (const key of ['benefits', 'commitments']) {
    renderList(key, list(site[key]).map(string).filter(Boolean).map(value => element('li', value)));
  }
  renderList('metrics', list(site.metrics).filter(row => string(row?.label) && string(row?.value)).map(row => {
    const pair = element('div');
    pair.append(element('dt', row.label), element('dd', row.value));
    return pair;
  }));
  renderList('steps', list(site.steps).filter(step => string(step?.title)).map(step => {
    const item = element('li');
    item.append(element('h4', step.title), element('p', string(step.text)));
    return item;
  }));
  byId('contact-intro').textContent = string(site.contactIntro);
  const phone = string(site.phone);
  const number = phone.replace(/[\s().-]/g, '');
  document.querySelectorAll('[data-phone]').forEach(link => {
    link.hidden = !/^\+?\d{7,15}$/.test(number);
    link.querySelector('span').textContent = phone;
    if (link.hidden) link.removeAttribute('href');
    else link.href = 'tel:' + number;
  });
  if (!displayedSite || displayedSite.menuUrl !== site.menuUrl ||
      JSON.stringify(displayedSite.menuPages) !== JSON.stringify(site.menuPages)) renderMenu(site);
  displayedSite = site;
  updateTitle();
  revealActiveTab();
}

let siteRequest = 0;
let defaultsRequest;
async function loadSite() {
  const ticket = ++siteRequest;
  defaultsRequest ??= getJSON('/data/site.json').catch(() => {
    defaultsRequest = null;
    return null;
  });
  const [defaults, saved] = await Promise.all([defaultsRequest, getJSON('/api/site').catch(() => null)]);
  if (ticket !== siteRequest) return;
  if (saved && typeof saved === 'object' && !Array.isArray(saved) && (defaults || Object.keys(saved).length)) {
    renderSite({ ...defaults, ...saved });
  } else if (defaults && !displayedSite) {
    renderSite(defaults);
  } else if (!displayedSite) {
    byId('story').textContent = 'Chưa tải được nội dung. Vui lòng tải lại trang.';
  }
}

// Compare calendar days in Hà Nội regardless of the visitor's time zone.
const vietnamDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'
});
function dayKey(year, month, day) {
  const date = new Date(Date.UTC(+year, +month - 1, +day));
  if (date.getUTCFullYear() !== +year || date.getUTCMonth() + 1 !== +month || date.getUTCDate() !== +day) return '';
  return date.toISOString().slice(0, 10);
}

function eventDates(value) {
  const raw = string(value).split('•')[0].trim();
  const iso = [...raw.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)];
  if (iso.length) return iso.map(([, year, month, day]) => dayKey(year, month, day));
  // Earlier records contain e.g. "15.10 – 30.10.2026" and "15 Tháng 06, 2026".
  const range = raw.match(/(\d{1,2})[./](\d{1,2})(?:[./](\d{4}))?\s*[-–—]\s*(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (range) {
    const [, day, month, year, endDay, endMonth, endYear] = range;
    return [dayKey(year || (+endYear - (+month > +endMonth ? 1 : 0)), month, day), dayKey(endYear, endMonth, endDay)];
  }
  const single = raw.match(/\b(\d{1,2})(?:[./]|\s+tháng\s+)(\d{1,2})(?:[./]|,?\s+)(\d{4})\b/i);
  return single ? [dayKey(single[3], single[2], single[1])] : [];
}
function eventTiming(event, today) {
  const [start, rangeEnd] = eventDates(event.date);
  const end = eventDates(event.end_date)[0] || rangeEnd || start;
  if (start && today < start) return 'Sắp diễn ra';
  if (end && today > end) return 'Đã diễn ra';
  if (start || end) return 'Đang diễn ra';
  return /h[àằ]ng tuần/i.test(string(event.date)) ? 'Hằng tuần' : '';
}

function readableDate(value) {
  const raw = string(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? match[3] + '/' + match[2] + '/' + match[1] : raw;
}

function renderEvent(event, today) {
  const article = element('article');
  const image = safeUrl(event.img);
  if (image) {
    const photo = element('img');
    photo.src = image;
    photo.alt = '';
    photo.loading = 'lazy';
    photo.addEventListener('error', () => photo.remove());
    article.append(photo);
  }
  const timing = eventTiming(event, today);
  const labels = [string(event.badge), timing].filter(Boolean).join(' · ');
  if (labels) {
    const label = element('p', labels);
    label.className = 'news-labels';
    article.append(label);
  }
  article.append(element('h3', event.title));
  const dates = [readableDate(event.date), readableDate(event.end_date)].filter(Boolean);
  if (dates.length) {
    const line = element('p', [...new Set(dates)].join(' – '));
    line.className = 'event-date';
    article.append(line);
  }
  if (string(event.desc)) article.append(element('p', event.desc));
  if (string(event.detail)) {
    const details = element('details');
    const summary = element('summary', 'Xem chi tiết');
    summary.setAttribute('aria-label', 'Chi tiết sự kiện ' + event.title);
    details.append(summary, element('p', event.detail));
    article.append(details);
  }
  return article;
}

let eventsRequest = 0;
let displayedEvents;
async function loadEvents() {
  const ticket = ++eventsRequest;
  const state = byId('news-state');
  if (!displayedEvents) {
    byId('news-retry').hidden = true;
    state.hidden = false;
    state.textContent = 'Đang tải tin tức…';
  }
  try {
    const rows = await getJSON('/api/events');
    if (ticket !== eventsRequest) return;
    if (!Array.isArray(rows)) throw new Error();
    const published = rows.filter(row => row && (!row.status || row.status === 'active') && string(row.title));
    const today = vietnamDate.format(new Date());
    const snapshot = JSON.stringify([today, published]);
    if (snapshot !== displayedEvents) {
      const container = byId('events');
      const open = new Set([...container.querySelectorAll('details[open]')].map(item => item.closest('article').dataset.id));
      const focused = document.activeElement?.closest('#events article')?.dataset.id;
      container.replaceChildren(...published.map(row => {
        const article = renderEvent(row, today);
        article.dataset.id = String(row.id);
        const details = article.querySelector('details');
        if (details && open.has(article.dataset.id)) details.open = true;
        return article;
      }));
      if (focused) [...container.children].find(item => item.dataset.id === focused)?.querySelector('summary')?.focus({ preventScroll: true });
      displayedEvents = snapshot;
    }
    byId('news-retry').hidden = true;
    state.textContent = published.length ? '' : 'Chưa có tin tức mới.';
    state.hidden = Boolean(published.length);
  } catch {
    if (ticket !== eventsRequest || displayedEvents) return;
    state.textContent = 'Chưa tải được tin tức.';
    byId('news-retry').hidden = false;
  }
}
byId('news-retry').addEventListener('click', loadEvents);

let menuPages = [];
let menuIndex = 0;
const reader = byId('menu-dialog');
const viewport = byId('reader-scroll');
function setZoom(zoomed) {
  viewport.classList.toggle('zoomed', zoomed);
  byId('reader-zoom').setAttribute('aria-pressed', String(zoomed));
  byId('reader-zoom').textContent = zoomed ? 'Thu nhỏ' : 'Phóng to';
  viewport.scrollTo(0, 0);
}

function updateReader() {
  const img = byId('reader-img');
  img.src = menuPages[menuIndex];
  img.alt = 'Trang ' + (menuIndex + 1) + ' của thực đơn Tong Wei';
  byId('reader-count').textContent = (menuIndex + 1) + ' / ' + menuPages.length;
  setZoom(false);
}
byId('reader-img').addEventListener('load', event => {
  viewport.style.setProperty('--page-width', event.target.naturalWidth + 'px');
});
function showMenuPage(index) {
  if (index < 0 || index >= menuPages.length) return;
  menuIndex = index;
  byId('menu-select').value = String(index);
  byId('menu-img').src = menuPages[index];
  byId('menu-img').alt = 'Thực đơn Tong Wei, trang ' + (index + 1);
  byId('menu-preview').setAttribute('aria-label', 'Phóng to trang ' + (index + 1) + ' của thực đơn');
  for (const prefix of ['menu', 'reader']) {
    byId(prefix + '-prev').disabled = index === 0;
    byId(prefix + '-next').disabled = index === menuPages.length - 1;
  }
  if (reader.open) updateReader();
}
function renderMenu(site) {
  menuPages = list(site.menuPages).map(safeUrl).filter(Boolean);
  const url = safeUrl(site.menuUrl);
  const link = byId('menu-link');
  link.hidden = !url;
  if (url) link.href = url;
  else link.removeAttribute('href');
  byId('menu-controls').hidden = byId('menu-preview').hidden = !menuPages.length;
  byId('menu-select').replaceChildren(...menuPages.map((_, index) =>
    new Option('Trang ' + (index + 1) + ' / ' + menuPages.length, String(index))
  ));
  if (menuPages.length) showMenuPage(Math.min(menuIndex, menuPages.length - 1));
  else if (reader.open) reader.close();
}

byId('menu-select').addEventListener('change', event => showMenuPage(Number(event.target.value)));
for (const prefix of ['menu', 'reader']) {
  byId(prefix + '-prev').addEventListener('click', () => showMenuPage(menuIndex - 1));
  byId(prefix + '-next').addEventListener('click', () => showMenuPage(menuIndex + 1));
}
byId('menu-preview').addEventListener('click', () => {
  updateReader();
  reader.showModal();
});
byId('reader-close').addEventListener('click', () => reader.close());
byId('reader-zoom').addEventListener('click', () => setZoom(!viewport.classList.contains('zoomed')));
reader.addEventListener('keydown', event => {
  if (viewport.classList.contains('zoomed')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showMenuPage(menuIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});

const form = byId('contact-form');
const state = byId('form-state');
const messages = {
  name: 'Vui lòng nhập họ tên.',
  phone: 'Vui lòng nhập số điện thoại hợp lệ.',
  email: 'Vui lòng kiểm tra địa chỉ email.',
  message: 'Vui lòng nhập nội dung cần tư vấn.'
};
form.noValidate = true;
form.addEventListener('input', event => {
  event.target.setCustomValidity('');
  event.target.removeAttribute('aria-invalid');
  state.textContent = '';
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  const send = form.querySelector('[type="submit"]');
  if (send.disabled) return;
  const entry = Object.fromEntries([...new FormData(form)].map(([name, value]) => [name, value.trim()]));
  for (const field of form.querySelectorAll('input, textarea')) {
    field.setCustomValidity('');
    const value = entry[field.name];
    const invalidPhone = field.name === 'phone' && !/^\+?\d{8,15}$/.test(value.replace(/[\s().-]/g, ''));
    if ((field.required && !value) || field.validity.typeMismatch || invalidPhone) {
      field.setCustomValidity(messages[field.name]);
      field.setAttribute('aria-invalid', 'true');
      field.reportValidity();
      state.className = 'error';
      state.textContent = messages[field.name];
      return;
    }
  }
  send.disabled = true;
  state.className = '';
  state.textContent = 'Đang gửi…';
  let errorMessage = 'Chưa xác nhận được yêu cầu. Vui lòng thử lại hoặc gọi Tong Wei.';
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(15000)
    });
    const result = response.status === 204 ? {} : await response.json();
    if (!response.ok || !result || result.success === false || result.error) {
      if ([400, 422].includes(response.status) && string(result?.error)) errorMessage = result.error;
      throw new Error();
    }
    const stillOriginal = Object.entries(entry).every(([key, value]) => form.elements[key].value.trim() === value);
    if (stillOriginal) form.reset();
    state.textContent = 'Tong Wei đã nhận được yêu cầu tư vấn của bạn.';
  } catch {
    state.className = 'error';
    state.textContent = errorMessage;
  } finally {
    send.disabled = false;
  }
});

readRoute(true);
function refreshContent() {
  loadSite();
  loadEvents();
}
// Coalesce the focus and visibility notifications produced by a tab switch.
let refreshTimer;
function queueRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshContent, 50);
}
window.addEventListener('focus', queueRefresh);
window.addEventListener('pageshow', event => { if (event.persisted) queueRefresh(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) queueRefresh(); });
window.addEventListener('storage', event => { if (event.key === 'tongwei:published') queueRefresh(); });
setInterval(() => { if (!document.hidden) queueRefresh(); }, 30000);
refreshContent();
