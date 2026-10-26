const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');
const jsPath = path.join(rootDir, 'js/app.js');
const sqlPath = path.join(rootDir, 'schema.sql');

// 1. UPDATE index.html
console.log('Updating index.html...');
let html = fs.readFileSync(htmlPath, 'utf8');

// Event card HTML for Nguyen Thi Thap
const newEventCardHtml = `          <!-- Event 4 (Spotlight: Khai Trương Nguyễn Thị Thập) -->
          <div class="event-card featured-event-card" onclick="openEventDetail(4)" style="border: 2px solid var(--color-brand-red); box-shadow: var(--shadow-md);">
            <div class="event-img-wrap" style="position: relative;">
              <img src="assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg" alt="Khai trương TongWei Nguyễn Thị Thập" class="event-img" loading="lazy">
              <span class="event-badge" style="background: var(--color-brand-red); color: #fff;">🏮 Soft Opening (15.10 - 30.10)</span>
            </div>
            <div class="event-content">
              <div class="event-date">📅 15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, Cầu Giấy</div>
              <h3 class="event-title" style="color: var(--color-brand-red);">Khai Trương TongWei Nguyễn Thị Thập — Tặng 01 Xửng Đại Long Bao</h3>
              <p class="event-desc">Mừng cơ sở mới: Tặng mỗi khách hàng 01 Xửng Đại Long Bao thượng phẩm và giảm thêm 5% cho khách hàng đăng ký mới Zalo OA!</p>
              <span class="event-link" style="color: var(--color-brand-red); font-weight: 700;">Xem Chi Tiết & Đặt Bàn Nhận Ưu Đãi ↗</span>
            </div>
          </div>
`;

if (!html.includes('openEventDetail(4)')) {
  html = html.replace(
    '<div class="events-grid">',
    '<div class="events-grid">\r\n' + newEventCardHtml
  );
  console.log('✅ Added Nguyen Thi Thap event card to index.html');
}

// Add branch option in Booking Form select
const branchSelectTarget = '<select class="form-control" id="bookBranch" required>';
const branchOptions = `<select class="form-control" id="bookBranch" required>
                    <option value="Nhà Hàng TongWei - Cơ Sở Nguyễn Thị Thập (5N7A Nguyễn Thị Thập)" selected>Nhà Hàng TongWei - Cơ Sở Nguyễn Thị Thập (5N7A Nguyễn Thị Thập, Cầu Giấy) [Soft Opening Tặng Đại Long Bao]</option>
                    <option value="Nhà Hàng TongWei - Cơ Sở Hoàn Kiếm (68A Trần Hưng Đạo)">Nhà Hàng TongWei - Cơ Sở Hoàn Kiếm (68A Trần Hưng Đạo, HN)</option>
                    <option value="Nhà Hàng TongWei - Cơ Sở Cầu Giấy (12 Duy Tân)">Nhà Hàng TongWei - Cơ Sở Cầu Giấy (12 Duy Tân, HN)</option>`;

if (!html.includes('5N7A Nguyễn Thị Thập')) {
  html = html.replace(
    /<select class="form-control" id="bookBranch" required>[\s\S]*?<\/select>/i,
    branchOptions + '\r\n                  </select>'
  );
  console.log('✅ Updated bookBranch select options in index.html');
}

fs.writeFileSync(htmlPath, html, 'utf8');

// 2. UPDATE js/app.js
console.log('Updating js/app.js...');
let js = fs.readFileSync(jsPath, 'utf8');

const event4Data = `    4: {
      title: 'Soft Opening TongWei Nguyễn Thị Thập — Tặng 01 Xửng Đại Long Bao Cho Mỗi Khách Hàng',
      date: '📅 15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy, Hà Nội',
      img: 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg',
      content: \`
        <div style="background: rgba(226, 35, 41, 0.06); border-left: 4px solid var(--color-brand-red); padding: 0.85rem 1rem; border-radius: 4px; margin-bottom: 1.25rem;">
          <b style="color: var(--color-brand-red); font-size: 1.05rem;">🎉 ĐẠI TIỆC KHAI TRƯƠNG CƠ SỞ MỚI: TONG WEI NGUYỄN THỊ THẬP</b>
          <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--color-text-secondary);">Thời gian áp dụng: <b>15.10 – 30.10.2026</b> tại <b>5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy, Hà Nội</b></p>
        </div>
        <p style="margin-bottom: 1rem; line-height: 1.7; color: var(--color-text-secondary);">
          TongWei hân hạnh chào đón quý thực khách đến với cơ sở mới tại khu đô thị sầm uất Trung Hòa - Cầu Giấy. Không gian ẩm thực Quảng Đông đương đại ấm cúng, thiết kế trang nhã kết hợp văn hóa ẩm thực nghệ nhân và phòng tiệc bàn tròn đại yến sang trọng.
        </p>
        <ul style="margin-bottom: 1.5rem; line-height: 1.8; color: var(--color-indigo); padding-left: 1.25rem; font-weight: 600;">
          <li>🥟 <b style="color: var(--color-brand-red);">TẶNG MỖI KHÁCH HÀNG 01 XỬNG ĐẠI LONG BAO:</b> Thưởng thức món bánh trứ danh nóng hổi nghi ngút khói, nhân thịt tôm thơm ngọt mọng nước dùng ngọt đậm đà.</li>
          <li>📱 <b style="color: var(--color-brand-red);">GIẢM THÊM 5% TOÀN BỘ HÓA ĐƠN:</b> Dành cho khách hàng đăng ký mới thành viên Zalo Official Account (Zalo OA) ngay tại bàn.</li>
          <li>🍵 <b>Miễn phí thưởng trà:</b> Trà Thiết Quan Âm & Trà hoa cúc thảo mộc phục vụ xuyên suốt bữa tiệc.</li>
          <li>🀄 <b>Không gian độc bản:</b> Trang bị bàn mạt chược và góc thưởng trà cố sự phục vụ khách hàng đặt phòng VIP.</li>
        </ul>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">
          * Chương trình áp dụng cho tất cả thực khách đến dùng bữa trực tiếp hoặc đặt bàn trực tuyến qua website.
        </p>
      \`
    },`;

if (!js.includes('Soft Opening TongWei Nguyễn Thị Thập')) {
  js = js.replace('const eventData = {', 'const eventData = {\r\n' + event4Data);
  console.log('✅ Added Event 4 into js/app.js eventData');
}

// Update default branches in js/app.js
const oldBranchesRegex = /branches\s*=\s*\[\s*\{\s*id:\s*'CS-01'[\s\S]*?id:\s*'CS-02'[\s\S]*?\}\s*\];/;
const newBranchesCode = `branches = [
      {
        id: 'CS-03',
        name: 'Nhà Hàng TongWei - Cơ Sở Nguyễn Thị Thập (Soft Opening)',
        address: '5N7A Nguyễn Thị Thập, Phường Yên Hòa, Cầu Giấy, Hà Nội',
        phone: '0986 688 866 / 024 3999 8888',
        hours: '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)',
        scale: '160 Chỗ ngồi • 3 Phòng VIP Mạt Chược • Tặng 01 Xửng Đại Long Bao (15.10 - 30.10)',
        status: 'active'
      },
      {
        id: 'CS-01',
        name: 'Nhà Hàng TongWei - Cơ Sở Hoàn Kiếm (Flagship)',
        address: '68A Trần Hưng Đạo, Phường Cửa Nam, Hoàn Kiếm, Hà Nội',
        phone: '0989 123 456 / 024 3987 6543',
        hours: '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)',
        scale: '180 Chỗ ngồi • 4 Phòng VIP Hoàng Kim',
        status: 'active'
      },
      {
        id: 'CS-02',
        name: 'Nhà Hàng TongWei - Cơ Sở Cầu Giấy',
        address: '12 Duy Tân, Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
        phone: '0988 567 890 / 024 3888 9999',
        hours: '10:00 - 14:00 | 17:30 - 22:30',
        scale: '140 Chỗ ngồi • 3 Phòng VIP',
        status: 'active'
      }
    ];`;

if (oldBranchesRegex.test(js)) {
  js = js.replace(oldBranchesRegex, newBranchesCode);
  console.log('✅ Updated default branches in js/app.js');
}

fs.writeFileSync(jsPath, js, 'utf8');

// 3. UPDATE schema.sql
console.log('Updating schema.sql...');
let sql = fs.readFileSync(sqlPath, 'utf8');
if (!sql.includes('CS-03')) {
  sql = sql.replace(
    "('CS-02', 'Nhà Hàng TongWei - Cơ Sở Cầu Giấy', 'Cơ sở 2 (Cầu Giấy)', '12 Duy Tân, P. Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '0988 567 890 / 024 3888 9999', '10:00 - 14:00 | 17:30 - 22:30', '140 Chỗ ngồi • 3 Phòng VIP', 'active');",
    "('CS-02', 'Nhà Hàng TongWei - Cơ Sở Cầu Giấy', 'Cơ sở 2 (Cầu Giấy)', '12 Duy Tân, P. Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '0988 567 890 / 024 3888 9999', '10:00 - 14:00 | 17:30 - 22:30', '140 Chỗ ngồi • 3 Phòng VIP', 'active'),\r\n('CS-03', 'Nhà Hàng TongWei - Cơ Sở Nguyễn Thị Thập', 'Cơ sở 3 (Nguyễn Thị Thập)', '5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy, Hà Nội', '0986 688 866 / 024 3999 8888', '10:00 - 14:00 | 17:30 - 22:30', '160 Chỗ ngồi • 3 Phòng VIP • Tặng 01 Xửng Đại Long Bao', 'active');"
  );
  fs.writeFileSync(sqlPath, sql, 'utf8');
  console.log('✅ Updated schema.sql with CS-03');
}

console.log('All updates completed!');
