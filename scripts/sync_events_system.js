const fs = require('fs');

console.log('--- 1. Cập nhật schema.sql ---');
let schema = fs.readFileSync('schema.sql', 'utf8');

const eventTableSql = `
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  badge TEXT,
  img TEXT,
  desc TEXT,
  detail TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Events
INSERT INTO events (id, title, date, badge, img, desc, detail, status) VALUES
(4, '(SOFT OPENING) TONG WEI NGUYỄN THỊ THẬP — KHAI TRƯƠNG CƠ SỞ MỚI', '15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy', '🏮 Soft Opening', 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg', 'Tặng mỗi khách hàng 01 Xửng Đại Long Bao và giảm thêm 5% khi đăng ký Zalo OA. Trải nghiệm không gian Quảng Đông hoài cổ độc bản.', '• Tặng mỗi khách hàng 01 XỬNG ĐẠI LONG BAO.\n• Giảm thêm 5% cho khách hàng đăng ký mới Zalo OA.\n• Trải nghiệm 3 Phòng VIP Mạt Chược phong lưu, ẩm thực chuẩn vị Quảng Đông.\n• Thời gian áp dụng: 15.10 – 30.10.2026 tại 5N7A Nguyễn Thị Thập, Cầu Giấy.', 'active'),
(1, 'Đại Tiệc Khai Trương TongWei Hà Nội — Mỹ Vị Quảng Đông Giao Hòa', '15 Tháng 06, 2026 • Chi Nhánh Hà Nội', 'Sự Kiện Nổi Bật', 'assets/images/concept/concept_12.jpg', 'Ưu đãi 20% toàn bộ thực đơn điểm tâm và tặng ngay xửng bánh bao kim sa cho bàn tiệc đặt trước từ 4 khách.', '- Ưu đãi 20% tổng hóa đơn dimsum và cá lăng.\n- Tặng ngay 01 xửng Bánh Bao Kim Sa cho bàn từ 4 khách.\n- Miễn phí trà Thiết Quan Âm.', 'active'),
(2, 'Ra Mắt Bộ Sưu Tập Thức Uống Mùa Hè: Thanh Mát Dưỡng Nhan', '01 Tháng 07, 2026 • Toàn Hệ Thống', 'Menu Mùa Hè', 'assets/images/concept/concept_1.jpg', 'Dòng thức uống sáng tạo kết hợp lá dứa non, dưa lưới và thảo mộc thanh lọc giải nhiệt sau tiệc nướng.', '- Trà Dưa Lưới Sương Sáo Lá Dứa.\n- Nước Chanh Vàng Mật Ong Dưỡng Nhan.\n- Đồng Vị Trái Cây Nhiệt Đới.', 'active'),
(3, 'Đêm Tiệc Thưởng Vị & Giao Lưu Mạt Chược Truyền Thống', 'Thứ 6 & Thứ 7 Hàng Tuần • Phòng VIP Cố Sự', 'Trải Nghiệm Độc Bản', 'assets/images/concept/concept_2.jpg', 'Thưởng thức dimsum nóng hổi trong không gian hoài cổ, nhâm nhi trà cổ thụ và giao lưu mạt chược phong lưu.', '- Miễn phí bàn mạt chược tiêu chuẩn trong phòng VIP.\n- Set ẩm thực Cố Sự Thượng Phẩm phục vụ riêng.\n- Phòng cách âm riêng tư 8 - 14 khách.', 'active');
`;

if (!schema.includes('CREATE TABLE events')) {
  schema = schema + '\n\n' + eventTableSql;
  fs.writeFileSync('schema.sql', schema, 'utf8');
  console.log('✅ Đã thêm bảng events vào schema.sql');
} else {
  console.log('ℹ️ Bảng events đã có trong schema.sql');
}

console.log('--- 2. Cập nhật admin/js/admin.js ---');
let adminJs = fs.readFileSync('admin/js/admin.js', 'utf8');

// Thêm sự kiện 4 vào default events và tích hợp fetch API /api/events
const oldEventSection = `  // 2. Events
  const savedEvents = localStorage.getItem('tongwei_events');
  if (savedEvents) {
    adminState.events = JSON.parse(savedEvents);
  } else {
    adminState.events = [
      {
        id: 1,`;

const newEventSection = `  // 2. Events
  try {
    const evRes = await fetch('/api/events');
    if (evRes.ok) {
      const dbEvents = await evRes.json();
      if (Array.isArray(dbEvents) && dbEvents.length > 0) {
        adminState.events = dbEvents;
        localStorage.setItem('tongwei_events', JSON.stringify(dbEvents));
      }
    }
  } catch (err) {
    console.warn('API events fallback to local:', err);
  }

  if (!adminState.events || adminState.events.length === 0) {
    const savedEvents = localStorage.getItem('tongwei_events');
    if (savedEvents) {
      try {
        adminState.events = JSON.parse(savedEvents);
      } catch (e) {}
    }
  }

  if (!adminState.events || adminState.events.length === 0) {
    adminState.events = [
      {
        id: 4,
        title: '(SOFT OPENING) TONG WEI NGUYỄN THỊ THẬP — KHAI TRƯƠNG CƠ SỞ MỚI',
        date: '15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy',
        badge: '🏮 Soft Opening',
        img: 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg',
        desc: 'Tặng mỗi khách hàng 01 Xửng Đại Long Bao và giảm thêm 5% khi đăng ký Zalo OA. Trải nghiệm không gian Quảng Đông hoài cổ độc bản.',
        detail: '• Tặng mỗi khách hàng 01 XỬNG ĐẠI LONG BAO.\n• Giảm thêm 5% cho khách hàng đăng ký mới Zalo OA.\n• Trải nghiệm 3 Phòng VIP Mạt Chược phong lưu, ẩm thực chuẩn vị Quảng Đông.\n• Thời gian áp dụng: 15.10 – 30.10.2026 tại 5N7A Nguyễn Thị Thập, Cầu Giấy.'
      },
      {
        id: 1,`;

// Đảm bảo nếu adminState.events đã có nhưng thiếu sự kiện 4, thì tự chèn vào
const oldInitEnd = `localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  }`;

const newInitEnd = `localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  } else {
    // Tự động bổ sung sự kiện Nguyễn Thị Thập nếu chưa có
    if (!adminState.events.some(e => e.id === 4 || (e.title && e.title.includes('Nguyễn Thị Thập')))) {
      adminState.events.unshift({
        id: 4,
        title: '(SOFT OPENING) TONG WEI NGUYỄN THỊ THẬP — KHAI TRƯƠNG CƠ SỞ MỚI',
        date: '15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy',
        badge: '🏮 Soft Opening',
        img: 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg',
        desc: 'Tặng mỗi khách hàng 01 Xửng Đại Long Bao và giảm thêm 5% khi đăng ký Zalo OA. Trải nghiệm không gian Quảng Đông hoài cổ độc bản.',
        detail: '• Tặng mỗi khách hàng 01 XỬNG ĐẠI LONG BAO.\n• Giảm thêm 5% cho khách hàng đăng ký mới Zalo OA.\n• Trải nghiệm 3 Phòng VIP Mạt Chược phong lưu, ẩm thực chuẩn vị Quảng Đông.\n• Thời gian áp dụng: 15.10 – 30.10.2026 tại 5N7A Nguyễn Thị Thập, Cầu Giấy.'
      });
      localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
    }
  }`;

// Cập nhật submit form đồng bộ API D1
const oldSubmitLogic = `  if (editId) {
    const ev = adminState.events.find(e => e.id == editId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.badge = badge;
      ev.img = img;
      ev.desc = desc;
      ev.detail = detail;
      showToast(\`Đã cập nhật sự kiện <b>\${title}</b>!\`);
    }
  } else {
    adminState.events.unshift({
      id: Date.now(),
      title,
      date,
      badge,
      img,
      desc,
      detail
    });
    showToast(\`Đã đăng sự kiện mới <b>\${title}</b>!\`);
  }

  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  closeModal('eventModal');
  renderEventsTable();`;

const newSubmitLogic = `  let targetEvent = null;
  if (editId) {
    const ev = adminState.events.find(e => e.id == editId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.badge = badge;
      ev.img = img;
      ev.desc = desc;
      ev.detail = detail;
      targetEvent = ev;
      showToast(\`Đã cập nhật sự kiện <b>\${title}</b>!\`);
    }
  } else {
    targetEvent = {
      id: Date.now(),
      title,
      date,
      badge,
      img,
      desc,
      detail,
      status: 'active'
    };
    adminState.events.unshift(targetEvent);
    showToast(\`Đã đăng sự kiện mới <b>\${title}</b>!\`);
  }

  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  closeModal('eventModal');
  renderEventsTable();

  // Đồng bộ lên Cloudflare D1
  if (targetEvent) {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetEvent)
    }).catch(e => console.warn('Sync event to D1 failed:', e));
  }`;

// Cập nhật deleteEvent đồng bộ API D1
const oldDeleteLogic = `  if (confirm(\`Bạn có chắc chắn muốn xóa sự kiện "\${ev.title}"?\`)) {
    adminState.events = adminState.events.filter(e => e.id !== id);
    localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
    renderEventsTable();
    showToast(\`Đã xóa sự kiện thành công!\`, 'danger');
  }`;

const newDeleteLogic = `  if (confirm(\`Bạn có chắc chắn muốn xóa sự kiện "\${ev.title}"?\`)) {
    adminState.events = adminState.events.filter(e => e.id !== id);
    localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
    renderEventsTable();
    showToast(\`Đã xóa sự kiện thành công!\`, 'danger');

    // Đồng bộ xóa trên Cloudflare D1
    fetch(\`/api/events?id=\${id}\`, { method: 'DELETE' })
      .catch(e => console.warn('Delete event from D1 failed:', e));
  }`;

let norm = (str) => str.replace(/\r\n/g, '\n');
let fileContent = norm(adminJs);

if (fileContent.includes(norm(oldEventSection))) {
  fileContent = fileContent.replace(norm(oldEventSection), norm(newEventSection));
  console.log('✅ Đã cập nhật event init trong admin.js');
}

if (fileContent.includes(norm(oldInitEnd))) {
  fileContent = fileContent.replace(norm(oldInitEnd), norm(newInitEnd));
  console.log('✅ Đã cập nhật fallback Nguyễn Thị Thập trong admin.js');
}

if (fileContent.includes(norm(oldSubmitLogic))) {
  fileContent = fileContent.replace(norm(oldSubmitLogic), norm(newSubmitLogic));
  console.log('✅ Đã cập nhật sync submit event lên D1 trong admin.js');
}

if (fileContent.includes(norm(oldDeleteLogic))) {
  fileContent = fileContent.replace(norm(oldDeleteLogic), norm(newDeleteLogic));
  console.log('✅ Đã cập nhật sync delete event lên D1 trong admin.js');
}

fs.writeFileSync('admin/js/admin.js', fileContent.replace(/\n/g, adminJs.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
console.log('✅ admin/js/admin.js hoàn tất.');
