import { button, field, node, thumbnail } from './editorial-ui.js';
import { imageField } from './editorial-images.js';

function isoDate(year, month, day) {
  const iso = [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  const date = new Date(iso + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(iso) ? iso : '';
}

// Seeded articles predate the ISO date contract. Preserve their wording on unrelated edits.
function dates(event) {
  const raw = event.date || '';
  let start = '', end = '';
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const range = /(\d{1,2})[./](\d{1,2})\s*[–-]\s*(\d{1,2})[./](\d{1,2})[./](\d{4})/.exec(raw);
  const single = /(\d{1,2})(?:\s+tháng\s+|[./])(\d{1,2})(?:,\s*|[./])(\d{4})/i.exec(raw);
  if (iso) start = isoDate(iso[1], iso[2], iso[3]);
  else if (range) {
    start = isoDate(range[5], range[2], range[1]);
    end = isoDate(range[5], range[4], range[3]);
  } else if (single) start = isoDate(single[3], single[2], single[1]);
  return { start, end: event.end_date || end };
}

function timing(event) {
  const { start, end } = dates(event);
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  if ((end || start) && (end || start) < today) return 'Đã diễn ra';
  if (start > today) return 'Sắp diễn ra';
  if (start) return 'Đang diễn ra';
  if (/hàng tuần/i.test(event.date)) return 'Hằng tuần';
  return 'Chưa rõ lịch';
}

function dateLabel(event) {
  const format = date => /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split('-').reverse().join('/') : date;
  const start = format(event.date || '');
  const end = format(event.end_date || '');
  return [start, end].filter(Boolean).join(' – ') || 'Chưa có ngày';
}

export function eventsList(events, edit, mutate) {
  const list = node('div', 'cms-stack');
  const create = button('Thêm bài viết', () => edit(), 'btn-primary');
  list.append(create);
  if (!events.length) list.append(node('p', 'cms-card cms-empty', 'Chưa có tin tức hoặc sự kiện.'));
  for (const event of events) {
    const card = node('article', 'cms-card cms-article');
    const heading = node('div', 'cms-article-head');
    const img = thumbnail(event.img, '');
    if (img) heading.append(img);
    const text = node('div');
    const labels = node('div', 'cms-tags');
    const hidden = event.status === 'hidden';
    labels.append(node('span', hidden ? 'cms-tag' : 'cms-tag cms-visible', hidden ? 'Đang ẩn' : 'Công khai'));
    labels.append(node('span', 'cms-tag', timing(event)));
    if (event.badge) labels.append(node('span', 'cms-tag', event.badge));
    text.append(labels, node('h3', '', event.title), node('p', 'cms-muted', dateLabel(event)));
    heading.append(text);
    const detail = node('details', 'cms-detail');
    detail.append(node('summary', '', 'Xem chi tiết bài viết'), node('p', 'cms-prose', event.detail || 'Chưa có nội dung chi tiết.'));
    const actions = node('div', 'cms-actions');
    actions.append(
      button('Chỉnh sửa', () => edit(event)),
      button(hidden ? 'Hiện bài' : 'Ẩn bài', () => mutate('PATCH', { id: event.id, status: hidden ? 'active' : 'hidden' })),
      button('Xóa bài', () => {
        if (confirm('Xóa vĩnh viễn bài “' + event.title + '”?')) mutate('DELETE', event);
      }, 'cms-remove')
    );
    card.append(heading, node('p', 'cms-prose', event.desc), detail, actions);
    list.append(card);
  }
  return list;
}

export function eventEditor(existing, save, cancel, changed, library) {
  const event = existing || {};
  const form = node('form', 'cms-card cms-stack cms-event-form');
  form.append(node('h3', '', existing ? 'Chỉnh sửa bài viết' : 'Bài viết mới'));
  form.append(field('Tiêu đề bài viết', 'title', event.title, 'text', true));
  const schedule = node('div', 'cms-columns');
  const { start, end } = dates(event);
  const from = field('Ngày bắt đầu', 'date', start, 'date', !existing || !event.date);
  const to = field('Ngày kết thúc (nếu kéo dài nhiều ngày)', 'end_date', end, 'date');
  const startInput = from.lastElementChild, endInput = to.lastElementChild;
  const updateMin = () => { endInput.min = startInput.value; };
  updateMin();
  startInput.addEventListener('input', updateMin);
  schedule.append(from, to);
  form.append(schedule);
  if (event.date && event.date !== start) {
    form.append(node('p', 'cms-muted', 'Lịch đã lưu: ' + event.date + '. Chọn ngày mới để thay lịch này.'));
  }
  form.append(field('Nhãn bài viết', 'badge', event.badge ?? 'Sự kiện'));
  form.append(imageField('Ảnh đại diện bài viết', 'img', event.img, library).wrap);
  form.append(field('Tóm tắt', 'desc', event.desc, 'long'));
  form.append(field('Nội dung chi tiết', 'detail', event.detail, 'long'));
  const visibility = node('label', 'cms-field', 'Hiển thị trên website');
  const select = node('select');
  select.name = 'status';
  select.append(new Option('Công khai', 'active'), new Option('Đang ẩn', 'hidden'));
  select.value = event.status || 'active';
  visibility.append(select);
  const actions = node('div', 'cms-actions');
  const submit = node('button', 'btn btn-primary', 'Lưu bài viết');
  submit.type = 'submit';
  actions.append(submit, button('Quay lại danh sách', cancel));
  form.append(visibility, actions);
  form.addEventListener('input', changed);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = Object.fromEntries(Array.from(new FormData(form), ([key, val]) => [key, val.trim()]));
    if (existing) {
      payload.id = event.id;
      if (payload.date === start && payload.end_date === end) {
        payload.date = event.date;
        payload.end_date = event.end_date || '';
      } else if (!payload.date) {
        startInput.required = true;
        startInput.reportValidity();
        return;
      }
    }
    save(payload);
  });
  return form;
}
