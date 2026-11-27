import { button, field, node } from './editorial-ui.js';
import { artworkDefaults, imageField } from './editorial-images.js';

// The first key of each group is its public navigation label.
let selectedGroup = 0;
const groups = [
  ['Giới thiệu nhà hàng', [
    ['navIntro', 'Tên mục Giới thiệu trên thanh điều hướng'],
    ['brandTagline', 'Dòng chữ dưới tên Tong Wei'],
    ['introTitle', 'Tiêu đề giới thiệu'],
    ['introText', 'Nội dung giới thiệu', 'long'],
    ['introMenuLink', 'Chữ trên liên kết đến thực đơn'],
    ['venuesTitle', 'Tiêu đề danh sách cơ sở'],
    ['heroImage', 'Ảnh bìa bàn tiệc', 'image'],
    ['introImage', 'Biểu trưng ở phần giới thiệu', 'image'],
    ['spaces', 'Không gian các cơ sở', [['name', 'Tên cơ sở hoặc chú thích ảnh'], ['image', 'Ảnh cơ sở', 'image']]]
  ]],
  ['Nhượng quyền', [
    ['navFranchise', 'Tên mục Nhượng quyền trên thanh điều hướng'],
    ['franchiseIntro', 'Lời giới thiệu nhượng quyền', 'long'],
    ['franchiseContactLink', 'Chữ trên nút tư vấn'],
    ['franchiseImage', 'Chân dung nhân viên phục vụ', 'image'],
    ['benefitsImage', 'Ảnh minh họa quyền lợi đối tác', 'image'],
    ['benefitsTitle', 'Tiêu đề phần quyền lợi'],
    ['benefits', 'Quyền lợi đối tác', [['', 'Quyền lợi']]],
    ['metricsImage', 'Biểu đồ phương án đầu tư', 'image'],
    ['metricsTitle', 'Tiêu đề phần đầu tư'],
    ['metrics', 'Chỉ số đầu tư', [['label', 'Tên chỉ số'], ['value', 'Giá trị']]],
    ['stepsImage', 'Ảnh minh họa lộ trình hợp tác', 'image'],
    ['stepsTitle', 'Tiêu đề phần lộ trình'],
    ['commitmentsTitle', 'Tiêu đề phần cam kết'],
    ['closingTitle', 'Tiêu đề lời mời hợp tác'],
    ['closingContactLink', 'Chữ trên liên kết gửi lời nhắn'],
    ['steps', 'Các bước hợp tác', [['title', 'Tên bước'], ['text', 'Nội dung bước', 'long']]],
    ['commitments', 'Cam kết với đối tác', [['', 'Cam kết']]],
    ['closingImage', 'Ảnh lời cảm ơn cuối phần nhượng quyền', 'image']
  ]],
  ['Tin tức & sự kiện', [
    ['navNews', 'Tên mục Tin tức trên thanh điều hướng']
  ]],
  ['Thực đơn', [
    ['navMenu', 'Tên mục Thực đơn trên thanh điều hướng'],
    ['menuPdfLink', 'Chữ trên liên kết đến PDF'],
    ['menuUrl', 'Liên kết thực đơn', 'url'],
    ['menuPages', 'Các trang thực đơn theo thứ tự', [['', 'Ảnh trang thực đơn', 'image']]]
  ]],
  ['Liên hệ', [
    ['navContact', 'Tên mục Liên hệ trên thanh điều hướng'],
    ['contactFormTitle', 'Tiêu đề biểu mẫu'],
    ['contactImage', 'Ảnh nền phần liên hệ', 'image'],
    ['phone', 'Số điện thoại đường dây nóng', 'tel'],
    ['contactIntro', 'Lời giới thiệu mục liên hệ', 'long']
  ]]
];

function editorField(label, name, value, type, required, library) {
  if (type === 'image') return imageField(label, name, value, library, required);
  const wrap = field(label, name, value, type, required);
  return { wrap, input: wrap.lastElementChild };
}

function listEditor(name, title, columns, values, changed, library) {
  const section = node('section', 'cms-list');
  const items = node('div', 'cms-items');
  const empty = node('p', 'cms-muted', 'Chưa có mục nào.');
  const add = button('Thêm mục', () => {
    const row = appendRow('');
    updateOrder();
    row.querySelector('input[name], textarea[name]').focus();
    changed();
  });
  add.setAttribute('aria-label', 'Thêm mục vào ' + title);

  function updateOrder() {
    const rows = [...items.children];
    rows.forEach((row, index) => {
      for (const control of row.querySelectorAll('[data-move]')) {
        const up = control.dataset.move === 'up';
        control.disabled = up ? index === 0 : index === rows.length - 1;
        control.setAttribute('aria-label', (up ? 'Đưa lên' : 'Đưa xuống') + ' · ' + title + ' · mục ' + (index + 1));
      }
    });
  }

  function appendRow(entry) {
    const row = node('div', 'cms-row');
    for (const [key, label, type] of columns) {
      const required = name !== 'spaces' || key !== 'image';
      const { wrap } = editorField(label, key || name, key ? entry[key] : entry, type, required, library);
      row.append(wrap);
    }
    const remove = button('Bỏ mục', () => {
      row.remove();
      updateOrder();
      empty.hidden = Boolean(items.childElementCount);
      changed();
      add.focus();
    }, 'cms-remove');
    remove.setAttribute('aria-label', 'Bỏ mục trong ' + title);
    const actions = node('div', 'cms-row-actions');
    if (['menuPages', 'steps', 'spaces'].includes(name)) {
      for (const [direction, text] of [['up', '↑'], ['down', '↓']]) {
        const move = button(text, () => {
          const up = direction === 'up';
          const other = up ? row.previousElementSibling : row.nextElementSibling;
          if (!other) return;
          items.insertBefore(up ? row : other, up ? other : row);
          updateOrder();
          (move.disabled ? actions.querySelector('[data-move]:enabled') : move)?.focus();
          changed();
        });
        move.dataset.move = direction;
        actions.append(move);
      }
    }
    actions.append(remove);
    row.append(actions);
    items.append(row);
    empty.hidden = true;
    return row;
  }
  values.forEach(appendRow);
  updateOrder();
  section.append(node('h4', '', title), items, empty, add);
  return {
    section,
    read: () => Array.from(items.children, row => {
      const inputs = Array.from(row.querySelectorAll('input[name], textarea[name]'));
      if (!columns[0][0]) return inputs[0].value.trim();
      return Object.fromEntries(inputs.map(input => [input.name, input.value.trim()]));
    })
  };
}

export function siteEditor(defaults, saved, save, changed, library, openNews) {
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  if (!object(defaults) || !object(saved)) throw new Error('Dữ liệu cấu hình website không hợp lệ.');
  const data = { navIntro: 'Giới thiệu', navFranchise: 'Nhượng quyền', navNews: 'Tin tức', navMenu: 'Thực đơn',
    navContact: 'Liên hệ', ...artworkDefaults, ...defaults, ...saved };
  const form = node('form', 'cms-site');
  const readers = {};
  const chooser = node('label', 'cms-field cms-chooser', 'Tab cần sửa');
  const select = node('select');
  chooser.append(select);
  form.append(chooser);
  const panels = [];
  function showGroup(index) {
    selectedGroup = index;
    select.selectedIndex = index;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
  }
  select.addEventListener('input', event => event.stopPropagation());
  select.addEventListener('change', () => showGroup(select.selectedIndex));
  groups.forEach(([title, fields], index) => {
    const label = data[fields[0][0]] || title;
    select.add(new Option(label, String(index)));
    const panel = node('section', 'cms-card cms-section');
    panel.setAttribute('aria-label', label);
    panels.push(panel);
    const body = node('div', 'cms-stack');
    if (fields[0][0] === 'navNews') body.append(button('Quản lý bài viết và sự kiện', openNews));
    for (const [key, label, type] of fields) {
      const value = data[key];
      const invalid = () => new Error('Dữ liệu không hợp lệ ở mục “' + label + '”.');
      if (Array.isArray(type)) {
        if (!Array.isArray(value) || value.some(entry => type[0][0]
          ? !object(entry) || type.some(([prop]) => typeof entry[prop] !== 'string')
          : typeof entry !== 'string')) throw invalid();
        const list = listEditor(key, label, type, value, changed, library);
        body.append(list.section);
        readers[key] = list.read;
      } else {
        if (typeof value !== 'string') throw invalid();
        const { wrap, input } = editorField(label, key, value, type, key.startsWith('nav'), library);
        body.append(wrap);
        readers[key] = () => input.value.trim();
      }
    }
    panel.append(body);
    form.append(panel);
  });
  showGroup(selectedGroup);
  form.addEventListener('invalid', e => {
    const first = form.querySelector('input:invalid, textarea:invalid, select:invalid');
    if (e.target === first) showGroup(panels.indexOf(first.closest('.cms-section')));
  }, true);
  form.addEventListener('input', changed);
  const actions = node('div', 'cms-actions cms-save');
  const submit = node('button', 'btn btn-primary', 'Lưu nội dung website');
  submit.type = 'submit';
  actions.append(submit);
  form.append(actions);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const overrides = {};
    for (const [key, read] of Object.entries(readers)) {
      const value = read();
      if (JSON.stringify(value) !== JSON.stringify(data[key])) overrides[key] = value;
    }
    save(overrides);
  });
  return form;
}
