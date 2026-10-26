const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(':memory:');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
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
  `);
  console.log('CREATE TABLE passed');
} catch (e) {
  console.log('CREATE TABLE failed:', e.message);
}

try {
  db.exec(`
    INSERT OR REPLACE INTO events (id, title, date, badge, img, desc, detail, status) VALUES
    (4, '(SOFT OPENING) TONG WEI NGUYỄN THỊ THẬP — KHAI TRƯƠNG CƠ SỞ MỚI', '15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy', '🏮 Soft Opening', 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg', 'Tặng mỗi khách hàng 01 Xửng Đại Long Bao và giảm thêm 5% khi đăng ký Zalo OA. Trải nghiệm không gian Quảng Đông hoài cổ độc bản.', '• Tặng mỗi khách hàng 01 XỬNG ĐẠI LONG BAO.\n• Giảm thêm 5% cho khách hàng đăng ký mới Zalo OA.\n• Trải nghiệm 3 Phòng VIP Mạt Chược phong lưu, ẩm thực chuẩn vị Quảng Đông.\n• Thời gian áp dụng: 15.10 – 30.10.2026 tại 5N7A Nguyễn Thị Thập, Cầu Giấy.', 'active');
  `);
  console.log('INSERT passed');
} catch (e) {
  console.log('INSERT failed:', e.message);
}
