const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

const targetStr = `    ];
  }`;

const replacementStr = `    ];
  } else {
    // If branches exist from older localStorage, make sure CS-03 (Nguyen Thi Thap) is included
    const hasNTT = branches.some(b => b.id === 'CS-03' || (b.address && b.address.includes('Nguyễn Thị Thập')));
    if (!hasNTT) {
      branches.unshift({
        id: 'CS-03',
        name: 'Nhà Hàng TongWei - Cơ Sở Nguyễn Thị Thập (Soft Opening)',
        address: '5N7A Nguyễn Thị Thập, Phường Yên Hòa, Cầu Giấy, Hà Nội',
        phone: '0986 688 866 / 024 3999 8888',
        hours: '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)',
        scale: '160 Chỗ ngồi • 3 Phòng VIP Mạt Chược • Tặng 01 Xửng Đại Long Bao (15.10 - 30.10)',
        status: 'active'
      });
      try {
        localStorage.setItem('tongwei_branches', JSON.stringify(branches));
      } catch (e) {}
    }
  }`;

// Handle CRLF vs LF
let normalizedTarget = targetStr;
if (!code.includes(targetStr) && code.includes(targetStr.replace(/\n/g, '\r\n'))) {
  normalizedTarget = targetStr.replace(/\n/g, '\r\n');
}

if (code.includes(normalizedTarget)) {
  code = code.replace(normalizedTarget, replacementStr.replace(/\n/g, code.includes('\r\n') ? '\r\n' : '\n'));
  fs.writeFileSync('js/app.js', code, 'utf8');
  console.log('Successfully updated js/app.js for localStorage fallback');
} else {
  console.log('Target string not found');
}
