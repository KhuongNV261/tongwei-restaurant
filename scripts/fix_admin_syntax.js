const fs = require('fs');
let code = fs.readFileSync('admin/js/admin.js', 'utf8');

// Replace multiline in single quotes with escaped \n
const multilineDetail = `detail: '• Tặng mỗi khách hàng 01 XỬNG ĐẠI LONG BAO.
• Giảm thêm 5% cho khách hàng đăng ký mới Zalo OA.
• Trải nghiệm 3 Phòng VIP Mạt Chược phong lưu, ẩm thực chuẩn vị Quảng Đông.
• Thời gian áp dụng: 15.10 – 30.10.2026 tại 5N7A Nguyễn Thị Thập, Cầu Giấy.'`;

const fixedDetail = `detail: '• Tặng mỗi khách hàng 01 XỬNG ĐẠI LONG BAO.\\n• Giảm thêm 5% cho khách hàng đăng ký mới Zalo OA.\\n• Trải nghiệm 3 Phòng VIP Mạt Chược phong lưu, ẩm thực chuẩn vị Quảng Đông.\\n• Thời gian áp dụng: 15.10 – 30.10.2026 tại 5N7A Nguyễn Thị Thập, Cầu Giấy.'`;

let norm = s => s.replace(/\r\n/g, '\n');
let normCode = norm(code);
let normMulti = norm(multilineDetail);

while (normCode.includes(normMulti)) {
  normCode = normCode.replace(normMulti, fixedDetail);
}

fs.writeFileSync('admin/js/admin.js', normCode.replace(/\n/g, code.includes('\r\n') ? '\r\n' : '\n'), 'utf8');
console.log('Fixed multiline string in admin.js');
