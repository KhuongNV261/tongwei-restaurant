import { button, field, node, safeUrl, thumbnail } from './editorial-ui.js';

const imageDir = '/assets/images/';
const images = (folder, entries) => entries.map(([file, label]) => ({ url: imageDir + folder + '/' + file, label }));
const numbered = (count, entry) => Array.from({ length: count }, (_, i) => entry(i + 1));
const artwork = {
  heroImage: ['hero.webp', 'Bàn tiệc Quảng Đông'], introImage: ['brand.webp', 'Biểu trưng Đồng Vị trên nền xanh'],
  benefitsImage: ['benefits.webp', 'Điểm tâm sắc vàng'], metricsImage: ['investment.webp', 'Biểu đồ đầu tư'],
  stepsImage: ['timeline.webp', 'Lộ trình hợp tác'], franchiseImage: ['partner.webp', 'Chân dung nhân viên phục vụ'],
  closingImage: ['closing.webp', 'Lời cảm ơn']
};
export const artworkDefaults = Object.fromEntries(Object.entries(artwork).map(([key, [file]]) => [key, imageDir + 'editorial/' + file]));

export const catalog = {
  'Bộ ảnh biên tập': images('editorial', Object.values(artwork)),
  'Không gian nhà hàng': [
    ...images('home', numbered(4, n => ['home_gallery_' + n + '.jpg', 'Không gian nhà hàng ' + n])),
    ...images('branches', numbered(5, n => ['nguyen_thi_thap_fb_' + n + '.jpg', 'Nguyễn Thị Thập · ảnh ' + n])),
    ...images('branches', numbered(18, n => ['fb_tongwei_branch_' + n + ([2, 3].includes(n) ? '.png' : '.jpg'), 'Cơ sở Tong Wei · ảnh ' + n]))
  ],
  'Trang thực đơn': images('menu', numbered(14, n => ['menu_page_' + String(n).padStart(2, '0') + '.jpg', 'Trang ' + n])),
  'Hình ảnh Tong Wei': images('concept', numbered(25, n => ['concept_' + n + '.jpg', 'Bộ ảnh Tong Wei · ảnh ' + n])),
  'Nhận diện thương hiệu': images('branding', [
    ['tv_tongwei_nguyen_thi_thap.jpg', 'Khai trương Nguyễn Thị Thập'], ['tongwei-intro.webp', 'Ảnh giới thiệu Đồng Vị'],
    ['tongwei_avatar.png', 'Ảnh đại diện'], ['fb_avatar_raw.png', 'Ảnh đại diện gốc'], ['fb_cover_banner.png', 'Ảnh bìa'],
    ['tongwei_badge_transparent.png', 'Huy hiệu nền trong'], ['tongwei_brand_logo.png', 'Biểu trưng thương hiệu'],
    ['tongwei_logo_clean.png', 'Biểu trưng rút gọn'], ['tongwei_logo_official.png', 'Biểu trưng chính thức'],
    ['tongwei_logo_transparent.png', 'Biểu trưng nền trong'], ['tongwei_official_master.png', 'Biểu trưng gốc']
  ]),
  'Món ăn': images('dishes', [
    'Ba chỉ chiên cơm giòn', 'Ba chỉ cuộn gulu sốt ô mai', 'Ba chỉ xào cay', 'Bánh bao kim sa', 'Bánh bao matcha',
    'Bánh bao trường thọ', 'Bánh bao xá xíu', 'Bánh cuốn phỉ thúy', 'Bánh cuốn tôm', 'Bánh xếp áp chảo',
    'Bò bằm cà tím nồi đất', 'Bò nhúng cay Trùng Khánh', 'Bò xào mướp đăng tàu xì', 'Bò xào mướp đắng tàu xì',
    'Bò xào song nấm sốt tôm khô', 'Bông cải sốt dầu hào', 'Cam ép Tongwei', 'Canh gà nấm dưỡng sinh',
    'Canh lê tiềm tuyết nhĩ', 'Canh rau trứng tam sắc', 'Cá lăng hấp tàu xì', 'Cá lăng hấp tỏi ớt',
    'Cá lăng nhúng cay', 'Cá lăng nấu cải chua', 'Cánh lưỡi vịt cay hồ nam', 'Cải chíp sốt nấm đông cô',
    'Cải Hongkong sốt bào ngư'
  ].map(label => [label + '.png', label]))
};

const uploaded = 'Ảnh đã tải lên';

function showLibrary(parent, title, current, choose, library, preferred) {
  const dialog = node('dialog', 'cms-library');
  dialog.setAttribute('aria-label', 'Thư viện ảnh · ' + title);
  const head = node('div', 'cms-actions');
  head.append(node('h3', '', 'Chọn ảnh cho ' + title.toLocaleLowerCase('vi')), button('Đóng', () => dialog.close()));
  const wrap = node('label', 'cms-field', 'Nhóm ảnh');
  const category = node('select');
  for (const label of [...Object.keys(catalog), uploaded]) category.add(new Option(label, label));
  const currentUrl = safeUrl(current);
  category.value = currentUrl.startsWith(location.origin + '/api/media/') ? uploaded :
    Object.keys(catalog).find(key => catalog[key].some(item => safeUrl(item.url) === currentUrl)) || preferred;
  wrap.append(category);
  const grid = node('div', 'cms-library-grid');
  const state = node('p', 'cms-muted');
  state.setAttribute('role', 'status');
  async function draw() {
    const key = category.value;
    grid.replaceChildren();
    state.textContent = key === uploaded ? 'Đang tải ảnh…' : '';
    try {
      const entries = key === uploaded ? await library.list() : catalog[key];
      if (!dialog.open || category.value !== key) return;
      state.textContent = entries.length ? '' : 'Chưa có ảnh tải lên.';
      for (const { label, url } of entries) {
        const tile = button('', () => { choose(url); dialog.close(); }, 'cms-tile');
        const preview = thumbnail(url, '');
        if (preview) tile.append(preview);
        tile.append(node('span', '', label));
        tile.setAttribute('aria-pressed', String(safeUrl(url) === currentUrl));
        grid.append(tile);
      }
    } catch (error) {
      if (dialog.open && key === category.value) state.textContent = error.message;
    }
  }
  category.addEventListener('change', draw);
  category.addEventListener('input', event => event.stopPropagation());
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.append(head, wrap, state, grid);
  parent.append(dialog);
  dialog.showModal();
  draw();
}

export function imageField(label, name, value, library, required = false) {
  const wrap = node('fieldset', 'cms-image-field');
  const urlLabel = field('Đường dẫn ảnh', name, value, 'url', required);
  const input = urlLabel.lastElementChild;
  const preview = node('div', 'cms-image-preview');
  const refresh = () => {
    const img = thumbnail(input.value, 'Xem trước · ' + label);
    preview.replaceChildren(...(img ? [img] : []));
    img?.addEventListener('error', () => img.replaceWith(node('span', 'cms-muted', 'Không xem trước được ảnh. Kiểm tra đường dẫn hoặc chọn ảnh khác.')));
  };
  refresh();
  input.addEventListener('change', refresh);
  function choose(url) {
    input.value = url;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    refresh();
    message.textContent = 'Đã chọn ảnh. Nhấn Lưu để áp dụng.';
  }
  const actions = node('div', 'cms-actions');
  const preferred = name === 'menuPages' ? 'Trang thực đơn' : ['image', 'contactImage'].includes(name) ? 'Không gian nhà hàng' : 'Bộ ảnh biên tập';
  const file = node('input');
  file.type = 'file';
  file.hidden = true;
  file.accept = 'image/jpeg,image/png,image/webp';
  file.addEventListener('input', event => event.stopPropagation());
  file.addEventListener('change', () => {
    const selected = file.files[0];
    file.value = '';
    if (selected) library.upload(selected, choose, message);
  });
  actions.append(button('Chọn từ thư viện', () => showLibrary(wrap, label, input.value, choose, library, preferred)),
    button('Tải ảnh từ máy', () => file.click()), file);
  const message = node('p', 'cms-muted');
  message.setAttribute('role', 'status');
  wrap.append(node('legend', '', label), preview, actions, urlLabel, message);
  return { wrap, input };
}
