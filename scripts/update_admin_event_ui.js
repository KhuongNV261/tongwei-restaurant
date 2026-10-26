const fs = require('fs');

let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Thêm cột Trạng thái vào bảng
const oldThead = `                  <th>Huy hiệu</th>
                  <th>Nội dung tóm tắt</th>`;

const newThead = `                  <th>Huy hiệu</th>
                  <th>Trạng thái & Hạn dùng</th>
                  <th>Nội dung tóm tắt</th>`;

// 2. Thêm form fields vào eventModal
const oldFormRow = `        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Thời gian & địa điểm *</label>
            <input type="text" class="form-control" id="eventDate" placeholder="15 Tháng 06, 2026 • Chi Nhánh Hà Nội" required>
          </div>
          <div class="form-group">
            <label class="form-label">Huy hiệu (Badge tag)</label>
            <input type="text" class="form-control" id="eventBadge" placeholder="Sự kiện nổi bật" required>
          </div>
        </div>`;

const newFormRow = `        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Thời gian & địa điểm *</label>
            <input type="text" class="form-control" id="eventDate" placeholder="15 Tháng 06, 2026 • Chi Nhánh Hà Nội" required>
          </div>
          <div class="form-group">
            <label class="form-label">Huy hiệu (Badge tag)</label>
            <input type="text" class="form-control" id="eventBadge" placeholder="Sự kiện nổi bật" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ngày kết thúc ưu đãi (Tự động ẩn sau ngày này)</label>
            <input type="date" class="form-control" id="eventEndDate">
            <small style="font-size: 0.78rem; color: var(--text-secondary); display: block; margin-top: 0.25rem;">
              💡 <i>Để trống nếu sự kiện luôn diễn ra / không giới hạn ngày kết thúc.</i>
            </small>
          </div>
          <div class="form-group" style="display: flex; align-items: center; padding-top: 1.6rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600; color: var(--color-indigo-dark); user-select: none;">
              <input type="checkbox" id="eventStatusCheckbox" checked style="width: 18px; height: 18px; accent-color: var(--color-brand-red);">
              <span>Hiển thị trên website</span>
            </label>
          </div>
        </div>`;

let norm = s => s.replace(/\r\n/g, '\n');
let normHtml = norm(html);

if (normHtml.includes(norm(oldThead))) {
  normHtml = normHtml.replace(norm(oldThead), norm(newThead));
  console.log('✅ Đã thêm cột Trạng thái vào bảng sự kiện.');
}

if (normHtml.includes(norm(oldFormRow))) {
  normHtml = normHtml.replace(norm(oldFormRow), norm(newFormRow));
  console.log('✅ Đã thêm input eventEndDate & eventStatusCheckbox vào eventModal.');
}

fs.writeFileSync('admin/index.html', normHtml.replace(/\n/g, html.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
console.log('✅ admin/index.html hoàn tất.');
