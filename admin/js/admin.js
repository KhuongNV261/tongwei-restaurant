/**
 * TONGWEI MANAGEMENT PORTAL (CMS) JAVASCRIPT ENGINE
 * Luxury Royal Indigo & Porcelain Theme - Built by Antigravity Web Team
 */

// Global State
const adminState = {
  activeTab: 'dashboard',
  dishes: [],
  filteredDishes: [],
  dishFilterCat: 'all',
  dishSearchQuery: '',
  dishViewMode: 'table', // 'table' or 'grid'
  events: [],
  photos: [],
  mediaFilterCat: 'all',
  bookings: [],
  candidates: [],
  jobs: [],
  franchiseLeads: [],
  franchisePackages: [],
  branches: [],
  users: []
};

// Format currency
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Show Toast
function showToast(message, type = 'success') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast`;
  const icon = type === 'success' ? '✔' : (type === 'danger' ? '✕' : 'ℹ');
  const color = type === 'success' ? 'var(--status-success)' : (type === 'danger' ? 'var(--status-danger)' : 'var(--color-indigo)');
  toast.style.borderLeftColor = color;
  toast.innerHTML = `
    <span style="color: ${color}; font-size: 1.15rem; font-weight: 800;">${icon}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Modal Helpers
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

// ==================== INITIAL DATA SEEDING ====================
async function initializeData() {
  // 1. Dishes
  const savedDishes = localStorage.getItem('tongwei_dishes');
  if (savedDishes) {
    try {
      adminState.dishes = JSON.parse(savedDishes);
    } catch (e) {
      console.error(e);
    }
  }
  if (!adminState.dishes || adminState.dishes.length === 0) {
    try {
      const res = await fetch('../data/dishes.json');
      if (res.ok) {
        adminState.dishes = await res.json();
        localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
      }
    } catch (err) {
      console.warn('Fallback dishes load:', err);
    }
  }

  // 2. Events
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
        id: 1,
        title: 'Đại Tiệc Khai Trương TongWei Hà Nội — Mỹ Vị Quảng Đông Giao Hòa',
        date: '15 Tháng 06, 2026 • Chi Nhánh Hà Nội',
        badge: 'Sự Kiện Nổi Bật',
        img: 'assets/images/concept/concept_12.jpg',
        desc: 'Ưu đãi 20% toàn bộ thực đơn điểm tâm và tặng ngay xửng bánh bao kim sa cho bàn tiệc đặt trước từ 4 khách.',
        detail: '- Ưu đãi 20% tổng hóa đơn dimsum và cá lăng.\n- Tặng ngay 01 xửng Bánh Bao Kim Sa cho bàn từ 4 khách.\n- Miễn phí trà Thiết Quan Âm.'
      },
      {
        id: 2,
        title: 'Ra Mắt Bộ Sưu Tập Thức Uống Mùa Hè: Thanh Mát Dưỡng Nhan',
        date: '01 Tháng 07, 2026 • Toàn Hệ Thống',
        badge: 'Menu Mùa Hè',
        img: 'assets/images/concept/concept_1.jpg',
        desc: 'Dòng thức uống sáng tạo kết hợp lá dứa non, dưa lưới và thảo mộc thanh lọc giải nhiệt sau tiệc nướng.',
        detail: '- Trà Dưa Lưới Sương Sáo Lá Dứa.\n- Nước Chanh Vàng Mật Ong Dưỡng Nhan.\n- Đồng Vị Trái Cây Nhiệt Đới.'
      },
      {
        id: 3,
        title: 'Đêm Tiệc Thưởng Vị & Giao Lưu Mạt Chược Truyền Thống',
        date: 'Thứ 6 & Thứ 7 Hàng Tuần • Phòng VIP Cố Sự',
        badge: 'Trải Nghiệm Độc Bản',
        img: 'assets/images/concept/concept_2.jpg',
        desc: 'Thưởng thức dimsum nóng hổi trong không gian hoài cổ, nhâm nhi trà cổ thụ và giao lưu mạt chược phong lưu.',
        detail: '- Miễn phí bàn mạt chược tiêu chuẩn trong phòng VIP.\n- Set ẩm thực Cố Sự Thượng Phẩm phục vụ riêng.\n- Phòng cách âm riêng tư 8 - 14 khách.'
      }
    ];
    localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
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
  }

  // 3. Concept Photos (25)
  const savedPhotos = localStorage.getItem('tongwei_photos');
  if (savedPhotos) {
    adminState.photos = JSON.parse(savedPhotos);
  } else {
    adminState.photos = [
      { id: 1, src: 'assets/images/concept/concept_1.jpg', title: 'Bộ Sưu Tập Thức Uống Nhiệt Đới', category: 'drinks', categoryName: 'Thức Uống', desc: 'Các dòng nước thanh mát kết hợp lá dứa non, dưa lưới mọng nước và chanh vàng thanh nhiệt giải khát trọn vẹn.' },
      { id: 2, src: 'assets/images/concept/concept_2.jpg', title: 'Văn Hóa Cố Sự & Bàn Mạt Chược', category: 'banquet', categoryName: 'Văn Hóa & Không Gian', desc: 'Nét sinh hoạt hoài niệm tao nhã bên bàn mạt chược truyền thống và trà thơm.' },
      { id: 3, src: 'assets/images/concept/concept_3.jpg', title: 'Mâm Cơm Quảng Đông & Trà Đạo', category: 'banquet', categoryName: 'Bàn Tiệc Đại Yến', desc: 'Bàn ăn chuẩn vị gia đình với các món xào lửa lớn, thịt nướng xá xíu thơm ngát.' },
      { id: 4, src: 'assets/images/concept/concept_4.jpg', title: 'Đại Tiệc Sum Vầy Gia Tộc', category: 'banquet', categoryName: 'Bàn Tiệc Đại Yến', desc: 'Thịt nướng mật ong, xiên nướng than hoa và các món khai vị cung đình.' },
      { id: 5, src: 'assets/images/concept/concept_5.jpg', title: 'Thịt Nướng Xá Xíu & Trà Cổ Thụ', category: 'bbq', categoryName: 'Món Quay & Nướng', desc: 'Lớp thịt nướng xém cạnh mật ong rừng chấm cùng tương ngọt đặc chế.' },
      { id: 6, src: 'assets/images/concept/concept_6.jpg', title: 'Cơm Chiên Hoàng Kim & Canh Tiềm', category: 'banquet', categoryName: 'Bàn Tiệc Đại Yến', desc: 'Thố cơm chiên tôm khô giòn rụm và canh tiềm thảo mộc cách thủy 4 tiếng.' },
      { id: 7, src: 'assets/images/concept/concept_7.jpg', title: 'Tháp Xửng Dimsum Trúc Bốc Khói', category: 'dimsum', categoryName: 'Dimsum Nghệ Nhân', desc: 'Há cảo tôm sò điệp trong suốt và xíu mại gạch cua nóng hổi.' },
      { id: 8, src: 'assets/images/concept/concept_8.jpg', title: 'Set Điểm Tâm Sáng & Súp Khai Vị', category: 'dimsum', categoryName: 'Dimsum Nghệ Nhân', desc: 'Phong cách ẩm thực thán trà tinh tế của người Quảng Châu.' },
      { id: 9, src: 'assets/images/concept/concept_9.jpg', title: 'Bánh Bao Đào Tiên Trường Thọ', category: 'dimsum', categoryName: 'Dimsum Nghệ Nhân', desc: 'Tác phẩm thủ công nặn tay mang ý nghĩa chúc thọ cát tường.' },
      { id: 10, src: 'assets/images/concept/concept_10.jpg', title: 'Đại Tiệc Hội Nghị & Tiệc Cưới', category: 'banquet', categoryName: 'Bàn Tiệc Đại Yến', desc: 'Bố trí bàn tiệc tròn hoành tráng phục vụ sự kiện thượng khách.' },
      { id: 11, src: 'assets/images/concept/concept_11.jpg', title: 'Tuyệt Tác Quay Nướng Quảng Đông', category: 'bbq', categoryName: 'Món Quay & Nướng', desc: 'Vịt quay da giòn, sườn nướng mật ong và dimsum tươi mới.' },
      { id: 12, src: 'assets/images/concept/concept_12.jpg', title: 'Bàn Tiệc Toàn Bích 12 Món Mỹ Vị', category: 'banquet', categoryName: 'Bàn Tiệc Đại Yến', desc: 'Sự cân bằng hoàn hảo giữa âm dương ngũ hành trong ẩm thực Quảng Đông.' },
      { id: 13, src: 'assets/images/concept/concept_13.jpg', title: 'Súp Bí Đỏ Hạt Sen Hoàng Kim', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Vị bùi béo mịn từ bí ngô sạch ninh nhừ cùng hạt sen bồi bổ sức khỏe.' },
      { id: 14, src: 'assets/images/concept/concept_14.jpg', title: 'Mộc Nhĩ Đen Ngâm Chua Ngọt', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Món khai vị giòn sần sật ngâm giấm đen Trấn Giang lâu năm.' },
      { id: 15, src: 'assets/images/concept/concept_15.jpg', title: 'Cánh Vịt Tiềm Cay Thảo Mộc', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Hương vị cay nồng quyến rũ từ ớt Tứ Xuyên và 12 vị thảo mộc.' },
      { id: 16, src: 'assets/images/concept/concept_16.jpg', title: 'Cổ Vịt Rút Xương Sốt Tiềm Đậm Đà', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Món nhắm ẩm thực truyền thống với thớ thịt săn chắc ngấm đẫm gia vị.' },
      { id: 17, src: 'assets/images/concept/concept_17.jpg', title: 'Đậu Hũ Non Trứng Bắc Thảo Sốt Cay', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Đậu hũ mát lạnh kết hợp trứng bắc thảo bùi béo ngậy sốt ớt gừng.' },
      { id: 18, src: 'assets/images/concept/concept_18.jpg', title: 'Đặc Sản Trứng Bắc Thảo Ngũ Vị', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Thanh lọc vị giác kinh điển trong bàn tiệc sang trọng.' },
      { id: 19, src: 'assets/images/concept/concept_19.jpg', title: 'Món Tiềm Cay Cổ Truyền', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Màu hổ phách óng ánh từ tương già thượng phẩm lên men tự nhiên.' },
      { id: 20, src: 'assets/images/concept/concept_20.jpg', title: 'Bộ Đôi Khai Vị Thanh Nhã', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Khởi đầu bữa tiệc thanh lịch chuẩn phong vị cố sự.' },
      { id: 21, src: 'assets/images/concept/concept_21.jpg', title: 'Súp Dưỡng Nhan Thảo Mộc Cung Đình', category: 'appetizer', categoryName: 'Khai Vị & Súp', desc: 'Món canh bồi bổ nguyên khí, dưỡng ẩm làn da dành riêng cho phái đẹp.' },
      { id: 22, src: 'assets/images/concept/concept_22.jpg', title: 'Đậu Que Xào Thịt Xá Xíu Bóng Bẩy', category: 'bbq', categoryName: 'Món Quay & Nướng', desc: 'Chảo lửa lớn giữ trọn sắc xanh và độ giòn ngọt tự nhiên của rau quả sạch.' },
      { id: 23, src: 'assets/images/concept/concept_23.jpg', title: 'Rau Củ Tươi Xào Tôm Khô Tàu Xì', category: 'bbq', categoryName: 'Món Quay & Nướng', desc: 'Hương vị khí chảo đặc trưng thơm lừng từ tàu xì và tôm khô hảo hạng.' },
      { id: 24, src: 'assets/images/concept/concept_24.jpg', title: 'Thịt Xá Xíu Nướng Mật Ong Rừng', category: 'bbq', categoryName: 'Món Quay & Nướng', desc: 'Món signature của TongWei: thịt ba chỉ nướng mật ong vàng ruộm thơm phức.' },
      { id: 25, src: 'assets/images/concept/concept_25.jpg', title: 'Xá Xíu Phủ Ớt Tươi & Hành Hoa', category: 'bbq', categoryName: 'Món Quay & Nướng', desc: 'Sắc đỏ mang lại may mắn, kích thích trọn vẹn vị giác thực khách.' }
    ];
    localStorage.setItem('tongwei_photos', JSON.stringify(adminState.photos));
  }

  // 4. Bookings
  const savedBookings = localStorage.getItem('tongwei_bookings');
  if (savedBookings) {
    try {
      const parsed = JSON.parse(savedBookings);
      // Auto-migrate: ensure every booking has 'name' populated from 'customer' if needed
      adminState.bookings = parsed.map(b => {
        if (!b.name && b.customer) b.name = b.customer;
        return b;
      });
      localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
    } catch (e) {
      console.error(e);
    }
  } else {
    adminState.bookings = [
      { id: 'TB-101', name: 'Nguyễn Hoàng Long', customer: 'Nguyễn Hoàng Long', phone: '0988 234 567', date: '2026-10-21', time: '18:30', guests: '4 Khách', branch: 'Cơ Sở 1 (Hoàn Kiếm)', area: 'Gần Cửa Sổ', preOrder: 'Bánh bao kim sa (x2), Cá lăng hấp tàu xì (x1)', status: 'confirmed' },
      { id: 'TB-102', name: 'Trần Thị Thu Trang', customer: 'Trần Thị Thu Trang', phone: '0912 345 678', date: '2026-10-21', time: '19:00', guests: '6 Khách', branch: 'Cơ Sở 1 (Hoàn Kiếm)', area: 'Phòng VIP Cung Đình', preOrder: 'Thịt xá xíu mật ong (x2), Canh gà tiềm dưỡng sinh (x1)', status: 'confirmed' },
      { id: 'TB-103', name: 'Lê Minh Tuấn', customer: 'Lê Minh Tuấn', phone: '0936 789 012', date: '2026-10-22', time: '12:00', guests: '2 Khách', branch: 'Cơ Sở 2 (Cầu Giấy)', area: 'Sảnh Chính', preOrder: 'Há cảo tôm sò điệp (x1), Bánh xếp áp chảo (x1)', status: 'pending' }
    ];
    localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
  }

  // 5. Jobs & Applicants
  adminState.jobs = [
    { id: 'JOB-1', title: 'Bếp Phó / Thợ Làm Bánh Dimsum Nghệ Nhân', location: 'Hà Nội', type: 'Toàn thời gian', salary: '15.000.000 ₫ - 22.000.000 ₫', exp: '≥ 1 năm', status: 'active' },
    { id: 'JOB-2', title: 'Đầu Bếp Chảo Món Hoa (Quảng Đông / Tứ Xuyên)', location: 'Hà Nội', type: 'Toàn thời gian', salary: '14.000.000 ₫ - 20.000.000 ₫', exp: 'Đứng chảo ≥ 2 năm', status: 'active' },
    { id: 'JOB-3', title: 'Quản Lý Nhà Hàng (Restaurant Manager)', location: 'Hà Nội', type: 'Toàn thời gian', salary: '18.000.000 ₫ - 26.000.000 ₫ + KPI', exp: 'Quản trị F&B', status: 'active' },
    { id: 'JOB-4', title: 'Nhân Viên Phục Vụ / Lễ Tân Nhà Hàng', location: 'Hà Nội', type: 'Full-time / Part-time', salary: '7.500.000 ₫ - 10.500.000 ₫ + Tip', exp: 'Không yêu cầu', status: 'active' }
  ];

  adminState.candidates = [
    { name: 'Phạm Đức Anh', phone: '0977 112 233', job: 'Bếp Phó / Thợ Làm Bánh Dimsum', exp: '3 năm kinh nghiệm làm há cảo tại Dimsum House', date: '20/10/2026', status: 'interview' },
    { name: 'Hoàng Mai Chi', phone: '0966 445 566', job: 'Nhân Viên Phục Vụ / Lễ Tân', exp: 'Sinh viên năm cuối, tiếng Trung giao tiếp tốt', date: '20/10/2026', status: 'new' },
    { name: 'Vũ Quốc Huy', phone: '0915 778 899', job: 'Đầu Bếp Chảo Món Hoa', exp: '5 năm đứng chảo khách sạn 4 sao', date: '19/10/2026', status: 'interview' },
    { name: 'Đặng Ngọc Lan', phone: '0983 221 100', job: 'Quản Lý Nhà Hàng', exp: 'Quản lý chuỗi lẩu 2 năm', date: '18/10/2026', status: 'hired' },
    { name: 'Bùi Thanh Hằng', phone: '0944 556 677', job: 'Nhân Viên Phục Vụ / Lễ Tân', exp: 'Đã từng làm lễ tân nhà hàng tiệc cưới', date: '17/10/2026', status: 'new' }
  ];

  // 6. Franchise Leads & Packages
  const savedPackages = localStorage.getItem('tongwei_franchise_packages');
  if (savedPackages) {
    try {
      adminState.franchisePackages = JSON.parse(savedPackages);
    } catch (e) {}
  }
  if (!adminState.franchisePackages || adminState.franchisePackages.length === 0) {
    adminState.franchisePackages = [
      {
        id: 'express',
        name: 'TongWei Express',
        badge: 'Mô Hình Tinh Gọn',
        scale: 'Diện tích: 45 - 70m² | 35 - 50 Chỗ ngồi',
        cost: '850 Triệu',
        costSub: '/ trọn gói',
        payback: '9 - 12 tháng',
        perks: [
          'Phù hợp trung tâm thương mại, khu văn phòng đông đúc',
          'Menu tinh gọn: Dimsum, bánh bao mang đi, đồ uống thanh vị',
          'Vận hành cực đơn giản với 3-4 nhân sự mỗi ca',
          'Thời gian hoàn vốn dự kiến nhanh: 9 - 12 tháng'
        ],
        desc: 'Phù hợp TTTM, khu văn phòng đông đúc. Menu dimsum tinh gọn mang đi.'
      },
      {
        id: 'standard',
        name: 'TongWei Standard',
        badge: 'Khuyên Dùng • Tối Ưu Lợi Nhuận',
        scale: 'Diện tích: 120 - 200m² | 80 - 120 Chỗ ngồi',
        cost: '1.9 Tỷ',
        costSub: '/ trọn gói setup',
        payback: '7 - 10 tháng',
        perks: [
          'Nhà hàng ẩm thực tiêu chuẩn mặt phố đắc địa',
          'Phục vụ đầy đủ 28+ món dimsum, hải sản cá lăng & món xào',
          'Bàn giao hệ thống phần mềm quản trị, CRM & đào tạo nhân sự',
          'Chiến dịch Marketing khai trương cam kết doanh số ấn tượng'
        ],
        desc: 'Mặt phố đắc địa, phục vụ đủ 28+ món dimsum, cá lăng và món xào.'
      },
      {
        id: 'flagship',
        name: 'TongWei Flagship',
        badge: 'Đẳng Cấp Thượng Đỉnh',
        scale: 'Diện tích: 280 - 450m² | 160 - 250 Chỗ ngồi',
        cost: '3.8 Tỷ',
        costSub: '/ đẳng cấp đại yến',
        payback: '12 - 15 tháng',
        perks: [
          'Không gian VIP sang trọng phục vụ hội nghị và tiệc gia đình',
          'Khu vực quầy trà đạo & bếp mở dimsum độc bản',
          'Hỗ trợ Giám đốc Vận hành trực tiếp đồng hành 3 tháng đầu',
          'Độc quyền phát triển thương hiệu toàn khu vực'
        ],
        desc: 'Đẳng cấp đại yến, phòng VIP cổ sự, quầy trà đạo độc bản.'
      }
    ];
    localStorage.setItem('tongwei_franchise_packages', JSON.stringify(adminState.franchisePackages));
  }

  adminState.franchiseLeads = [
    { name: 'Đỗ Hữu Thắng', phone: '0989 333 444', city: 'Hà Nội (Cầu Giấy)', budget: '1.5 - 2.5 Tỷ (Standard)', note: 'Đã có sẵn mặt bằng phố Duy Tân 160m2', date: '21/10/2026', status: 'contacted' },
    { name: 'Nguyễn Thị Bích Ngọc', phone: '0903 555 666', city: 'Hải Phòng', budget: '800 Tr - 1.2 Tỷ (Express)', note: 'Mặt bằng phố đi bộ Hải Phòng', date: '20/10/2026', status: 'new' },
    { name: 'Lê Văn Khải', phone: '0918 777 888', city: 'TP. Hồ Chí Minh (Quận 1)', budget: 'Trên 3.5 Tỷ (Flagship)', note: 'Cần tư vấn nhượng quyền độc quyền khu vực', date: '19/10/2026', status: 'meeting' },
    { name: 'Vũ Đình Dũng', phone: '0972 888 111', city: 'Đà Nẵng', budget: '1.5 - 2.5 Tỷ (Standard)', note: 'Mặt bằng đường Bạch Đằng ven sông Hàn', date: '18/10/2026', status: 'contacted' }
  ];

  // 7. Branches (Cơ Sở Nhà Hàng)
  const savedBranches = localStorage.getItem('tongwei_branches');
  if (savedBranches) {
    try {
      adminState.branches = JSON.parse(savedBranches);
    } catch (e) {}
  }
  if (!adminState.branches || adminState.branches.length === 0) {
    adminState.branches = [
      {
        id: 'CS-01',
        name: 'Nhà Hàng TongWei - Cơ Sở Hoàn Kiếm (Flagship)',
        shortName: 'Cơ Sở 1 (Hoàn Kiếm)',
        address: '68A Trần Hưng Đạo, Phường Cửa Nam, Hoàn Kiếm, Hà Nội',
        phone: '0989 123 456 / 024 3987 6543',
        hours: '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)',
        scale: '180 Chỗ ngồi • 4 Phòng VIP Cung Đình • Quầy Trà Đạo',
        status: 'active'
      },
      {
        id: 'CS-02',
        name: 'Nhà Hàng TongWei - Cơ Sở Cầu Giấy',
        shortName: 'Cơ Sở 2 (Cầu Giấy)',
        address: '12 Duy Tân, Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
        phone: '0988 567 890 / 024 3888 9999',
        hours: '10:00 - 14:00 | 17:30 - 22:30',
        scale: '140 Chỗ ngồi • 3 Phòng VIP • Có bãi đỗ xe ô tô',
        status: 'active'
      }
    ];
    localStorage.setItem('tongwei_branches', JSON.stringify(adminState.branches));
  }

  // 8. Factory Settings
  const savedFactory = localStorage.getItem('tongwei_factory_settings');
  if (savedFactory) {
    try {
      const f = JSON.parse(savedFactory);
      if (document.getElementById('factoryName') && f.name) document.getElementById('factoryName').value = f.name;
      if (document.getElementById('factoryHotline') && f.hotline) document.getElementById('factoryHotline').value = f.hotline;
      if (document.getElementById('factoryAddress') && f.address) document.getElementById('factoryAddress').value = f.address;
      if (document.getElementById('factoryCapacity') && f.capacity) document.getElementById('factoryCapacity').value = f.capacity;
      if (document.getElementById('factoryStandards') && f.standards) document.getElementById('factoryStandards').value = f.standards;
    } catch(e) {}
  }

  // 9. Users Initialization
  const savedUsers = localStorage.getItem('tongwei_users');
  if (savedUsers) {
    try {
      adminState.users = JSON.parse(savedUsers);
      // Normalize roleName casing for existing users
      adminState.users.forEach(u => {
        if (u.role === 'admin') u.roleName = 'Quản trị viên cấp cao';
        else if (u.role === 'kitchen') u.roleName = 'Quản lý bếp & thực đơn';
        else if (u.role === 'cashier') u.roleName = 'Vận hành đặt bàn & CSKH';
        if (u.username === 'admin') u.fullName = 'Khuongnv (Quản trị viên)';
      });
      localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));
    } catch(e) {}
  }
  if (!adminState.users || adminState.users.length === 0) {
    adminState.users = [
      {
        id: 'usr_admin',
        username: 'admin',
        password: '123456',
        fullName: 'Khuongnv (Quản trị viên)',
        role: 'admin',
        roleName: 'Quản trị viên cấp cao',
        status: 'active',
        createdAt: '2026-10-21',
        avatar: 'AD'
      },
      {
        id: 'usr_kitchen',
        username: 'bep_truong',
        password: '123456',
        fullName: 'Lý Quốc Dũng (Bếp trưởng)',
        role: 'kitchen',
        roleName: 'Quản lý bếp & thực đơn',
        status: 'active',
        createdAt: '2026-10-22',
        avatar: 'QD'
      },
      {
        id: 'usr_cashier',
        username: 'thu_ngan',
        password: '123456',
        fullName: 'Trần Mỹ Linh (Lễ tân / Thu ngân)',
        role: 'cashier',
        roleName: 'Vận hành đặt bàn & CSKH',
        status: 'active',
        createdAt: '2026-10-22',
        avatar: 'ML'
      }
    ];
    localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));
  }

  // Refresh KPIs and Views
  refreshDashboardStats();
  renderDishesTable();
  renderEventsTable();
  renderAdminMedia();
  renderBookingsTable();
  renderFranchiseView();
  renderCareersView();
  renderBranchesView();
  renderUsersTable();
  checkAuthState();
}

// ==================== DASHBOARD & KPIS ====================
function refreshDashboardStats() {
  document.getElementById('kpiDishesCount').textContent = adminState.dishes.length;
  document.getElementById('menuCountBadge').textContent = adminState.dishes.length;
  document.getElementById('countAllDishes').textContent = adminState.dishes.length;
  document.getElementById('kpiBookingsCount').textContent = adminState.bookings.length;
  document.getElementById('bookingCountBadge').textContent = adminState.bookings.filter(b => b.status === 'confirmed').length;
  document.getElementById('kpiApplicantsCount').textContent = adminState.candidates.length;
  document.getElementById('kpiFranchiseCount').textContent = adminState.franchiseLeads.length;

  // Recent Bookings in Dashboard Table
  const tbody = document.getElementById('dashboardBookingsTbody');
  if (tbody) {
    const recents = adminState.bookings.slice(0, 5);
    tbody.innerHTML = recents.map(b => {
      const displayName = b.name || b.customer || 'Khách Đặt Bàn';
      const displayPhone = b.phone || 'Chưa cung cấp';
      const displayTime = b.time ? `${b.time} ${b.date ? `(${b.date})` : ''}` : (b.date || 'Hôm nay');
      const displayArea = b.branch ? b.branch.split(':')[0] : (b.area || 'Sảnh Chính');

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem;">${displayName}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${displayPhone}</div>
          </td>
          <td>${displayTime}</td>
          <td><b>${b.guests || '4 Khách'}</b></td>
          <td><span class="badge badge-indigo">${displayArea}</span></td>
          <td>
            <span class="badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-warning'}">
              ${b.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ phản hồi'}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabId) {
  adminState.activeTab = tabId;
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.tab === tabId) item.classList.add('active');
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) targetPane.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== DISHES MANAGEMENT ====================
function renderDishesTable() {
  const tbody = document.getElementById('dishesTbody');
  const gridWrap = document.getElementById('dishesGridView');
  if (!tbody || !gridWrap) return;

  let list = [...adminState.dishes];
  if (adminState.dishFilterCat !== 'all') {
    list = list.filter(d => d.category === adminState.dishFilterCat);
  }
  if (adminState.dishSearchQuery.trim()) {
    const q = adminState.dishSearchQuery.toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(q) || d.chinese.toLowerCase().includes(q));
  }

  // 1. Render Table
  tbody.innerHTML = list.map(dish => {
    const spicyPills = dish.spicy > 0 ? `${'🌶️'.repeat(dish.spicy)}` : '🌱 Thanh';
    const statusText = dish.isAvailable !== false ? 'Còn món' : 'Tạm hết';
    const statusClass = dish.isAvailable !== false ? 'badge-success' : 'badge-danger';
    const isHome = dish.showOnHome !== false;
    const imageSrc = dish.image.startsWith('assets') ? `../${dish.image}` : dish.image;

    return `
      <tr data-id="${dish.id}">
        <td>
          <img src="${imageSrc}" alt="${dish.name}" class="thumb-preview" onerror="this.src='../assets/images/dishes/Bánh bao kim sa.png';">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.98rem;">${dish.name}</div>
          <div style="color: var(--color-brand-red); font-weight: 700; font-size: 0.85rem; letter-spacing: 0.05em;">${dish.chinese}</div>
        </td>
        <td><span class="badge badge-indigo">${dish.categoryName || dish.category}</span></td>
        <td><b style="color: var(--color-brand-red); font-size: 1.05rem;">${formatVND(dish.price)}</b></td>
        <td><span style="font-size: 0.85rem;">${spicyPills}</span></td>
        <td>
          <button class="badge ${isHome ? 'badge-success' : 'badge-warning'}" style="cursor: pointer; border: 1px solid currentColor; font-weight: 700;" onclick="toggleDishHomeDisplay('${dish.id}')" title="Bấm để bật hoặc tắt hiển thị trên Trang Chủ">
            ${isHome ? '☑ Hiện trang chủ' : '☐ Đang ẩn'}
          </button>
        </td>
        <td>
          <button class="badge ${statusClass}" style="cursor: pointer; border: none;" onclick="toggleDishAvailability('${dish.id}')" title="Bấm để đổi trạng thái kho món">
            ${statusText} ⇄
          </button>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="editDish('${dish.id}')" title="Chỉnh sửa">
              ✏️ Sửa
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteDish('${dish.id}')" title="Xóa món">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // 2. Render Grid
  gridWrap.innerHTML = list.map(dish => {
    const imageSrc = dish.image.startsWith('assets') ? `../${dish.image}` : dish.image;
    const isHome = dish.showOnHome !== false;
    return `
      <div class="admin-dish-card">
        <img src="${imageSrc}" alt="${dish.name}" class="admin-dish-img" onerror="this.src='../assets/images/dishes/Bánh bao kim sa.png';">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--color-brand-red);">${dish.chinese}</div>
        <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem; margin-bottom: 0.25rem;">${dish.name}</div>
        <div style="font-weight: 800; color: var(--color-brand-red); margin-bottom: 0.35rem;">${formatVND(dish.price)}</div>
        <button class="badge ${isHome ? 'badge-success' : 'badge-warning'}" style="cursor: pointer; border: 1px solid currentColor; font-weight: 700; width: 100%; justify-content: center; margin-bottom: 0.5rem;" onclick="toggleDishHomeDisplay('${dish.id}')">
          ${isHome ? '☑ Hiện trang chủ' : '☐ Đang ẩn'}
        </button>
        <div style="display: flex; gap: 0.4rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-color);">
          <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="editDish('${dish.id}')">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDish('${dish.id}')">Xóa</button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleDishViewMode() {
  const table = document.getElementById('dishesTableView');
  const grid = document.getElementById('dishesGridView');
  const btn = document.getElementById('btnToggleViewMode');
  if (adminState.dishViewMode === 'table') {
    adminState.dishViewMode = 'grid';
    table.style.display = 'none';
    grid.style.display = 'grid';
    btn.textContent = 'Chuyển xem danh sách 📋';
  } else {
    adminState.dishViewMode = 'table';
    table.style.display = 'block';
    grid.style.display = 'none';
    btn.textContent = 'Chuyển xem lưới ảnh 🔲';
  }
}

function toggleDishAvailability(id) {
  const dish = adminState.dishes.find(d => d.id === id);
  if (!dish) return;
  dish.isAvailable = dish.isAvailable === false ? true : false;
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  renderDishesTable();
  showToast(`Đã đổi trạng thái món <b>${dish.name}</b> thành <b>${dish.isAvailable ? 'Còn món' : 'Tạm hết'}</b>!`);
}

window.toggleDishHomeDisplay = function(id) {
  const dish = adminState.dishes.find(d => d.id === id);
  if (!dish) return;
  dish.showOnHome = dish.showOnHome === false ? true : false;
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  renderDishesTable();
  const label = dish.showOnHome ? 'Hiển thị trên trang chủ' : 'Ẩn khỏi trang chủ';
  showToast(`Món <b>${dish.name}</b> đã được chuyển sang: <b>${label}</b>!`);
};

window.setAllDishesHomeVisibility = function(shouldShow) {
  adminState.dishes.forEach(d => {
    d.showOnHome = shouldShow;
  });
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  renderDishesTable();
  showToast(shouldShow ? 'Đã bật hiển thị tất cả món ăn trên trang chủ!' : 'Đã ẩn toàn bộ món ăn khỏi trang chủ!');
};

function openDishModal(editId = null) {
  const form = document.getElementById('dishForm');
  form.reset();
  const title = document.getElementById('dishModalTitle');
  const idInput = document.getElementById('dishEditId');
  const preview = document.getElementById('dishPreviewImg');
  const homeCheck = document.getElementById('dishShowOnHome');

  if (editId) {
    const dish = adminState.dishes.find(d => d.id === editId);
    if (!dish) return;
    title.textContent = `Chỉnh sửa: ${dish.name}`;
    idInput.value = dish.id;
    document.getElementById('dishName').value = dish.name;
    document.getElementById('dishChinese').value = dish.chinese;
    document.getElementById('dishCategory').value = dish.category;
    document.getElementById('dishPrice').value = dish.price;
    document.getElementById('dishSpicy').value = dish.spicy || 0;
    document.getElementById('dishTags').value = (dish.tags || []).join(', ');
    document.getElementById('dishImage').value = dish.image;
    document.getElementById('dishDesc').value = dish.description;
    if (homeCheck) homeCheck.checked = dish.showOnHome !== false;
    preview.src = dish.image.startsWith('assets') ? `../${dish.image}` : dish.image;
  } else {
    title.textContent = 'Thêm món ăn mới';
    idInput.value = '';
    document.getElementById('dishImage').value = 'assets/images/dishes/Bánh bao kim sa.png';
    if (homeCheck) homeCheck.checked = true;
    preview.src = '../assets/images/dishes/Bánh bao kim sa.png';
  }

  openModal('dishModal');
}

window.editDish = openDishModal;

window.deleteDish = function(id) {
  const dish = adminState.dishes.find(d => d.id === id);
  if (!dish) return;
  if (confirm(`Bạn có chắc chắn muốn xóa món "${dish.name}" khỏi thực đơn TongWei?`)) {
    adminState.dishes = adminState.dishes.filter(d => d.id !== id);
    localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
    refreshDashboardStats();
    renderDishesTable();
    showToast(`Đã xóa món <b>${dish.name}</b> thành công!`, 'danger');
  }
};

// Form submit handler for Dish
document.getElementById('dishForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const editId = document.getElementById('dishEditId').value;
  const name = document.getElementById('dishName').value.trim();
  const chinese = document.getElementById('dishChinese').value.trim();
  const category = document.getElementById('dishCategory').value;
  const price = parseInt(document.getElementById('dishPrice').value, 10);
  const spicy = parseInt(document.getElementById('dishSpicy').value, 10);
  const tagsStr = document.getElementById('dishTags').value;
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const image = document.getElementById('dishImage').value.trim();
  const description = document.getElementById('dishDesc').value.trim();
  const showOnHome = document.getElementById('dishShowOnHome') ? document.getElementById('dishShowOnHome').checked : true;

  const categoryNames = {
    dimsum: 'Điểm Tâm & Dimsum',
    main: 'Món Chính Quảng Đông',
    seafood: 'Hải Sản & Cá Lăng',
    claypot: 'Nồi Đất & Món Xào',
    soup: 'Canh Tiềm Dưỡng Sinh',
    drinks: 'Thức Uống'
  };

  if (editId) {
    const dish = adminState.dishes.find(d => d.id === editId);
    if (dish) {
      dish.name = name;
      dish.chinese = chinese;
      dish.category = category;
      dish.categoryName = categoryNames[category] || category;
      dish.price = price;
      dish.spicy = spicy;
      dish.tags = tags;
      dish.image = image;
      dish.description = description;
      dish.showOnHome = showOnHome;
      showToast(`Đã cập nhật món <b>${name}</b> thành công!`);
    }
  } else {
    const newDish = {
      id: `dish-${Date.now()}`,
      name,
      chinese,
      category,
      categoryName: categoryNames[category] || category,
      price,
      spicy,
      tags,
      image,
      description,
      isSignature: tags.includes('Signature'),
      isAvailable: true,
      showOnHome: showOnHome
    };
    adminState.dishes.unshift(newDish);
    showToast(`Đã thêm món mới <b>${name}</b> vào thực đơn!`);
  }

  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  closeModal('dishModal');
  refreshDashboardStats();
  renderDishesTable();
});

// Update preview image on input
document.getElementById('dishImage')?.addEventListener('input', (e) => {
  const val = e.target.value.trim();
  const preview = document.getElementById('dishPreviewImg');
  if (preview && val) {
    preview.src = val.startsWith('assets') ? `../${val}` : val;
  }
});

// ==================== EVENTS MANAGEMENT ====================
function renderEventsTable() {
  const tbody = document.getElementById('eventsTbody');
  if (!tbody) return;

  const today = new Date().toISOString().split('T')[0];

  tbody.innerHTML = adminState.events.map(ev => {
    const imgSrc = ev.img.startsWith('assets') ? `../${ev.img}` : ev.img;
    const isHidden = ev.status === 'hidden';
    const hasEndDate = ev.end_date && ev.end_date.trim() !== '';
    const isExpired = hasEndDate && (today > ev.end_date.trim());

    let statusHtml = '';
    if (isHidden) {
      statusHtml = '<span class="badge" style="background: #e2e8f0; color: #475569; padding: 0.25rem 0.5rem;">⚪ Đang ẩn</span>';
    } else if (isExpired) {
      statusHtml = `<span class="badge" style="background: #fee2e2; color: #dc2626; padding: 0.25rem 0.5rem;" title="Đã qua ngày kết thúc ${ev.end_date}">⏰ Hết hạn (Tự ẩn)</span>`;
    } else if (hasEndDate) {
      statusHtml = `<span class="badge badge-success" style="padding: 0.25rem 0.5rem;" title="Hiển thị đến hết ngày ${ev.end_date}">🟢 Đang hiện (Đến ${ev.end_date})</span>`;
    } else {
      statusHtml = '<span class="badge badge-success" style="padding: 0.25rem 0.5rem;" title="Luôn hiển thị (Không giới hạn ngày)">🟢 Luôn hiển thị</span>';
    }

    const toggleBtnText = isHidden ? '👁️ Hiện' : '👁️‍🗨️ Ẩn';
    const toggleBtnStyle = isHidden 
      ? 'background: #f1f5f9; color: #0284c7; border: 1px solid #cbd5e1;' 
      : 'background: #fff; color: #64748b; border: 1px solid #e2e8f0;';

    return `
      <tr style="${(isHidden || isExpired) ? 'opacity: 0.75; background: #fafafa;' : ''}">
        <td>
          <img src="${imgSrc}" alt="${ev.title}" style="width: 70px; height: 45px; object-fit: cover; border-radius: var(--radius-sm);">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem;">${ev.title}</div>
          ${hasEndDate ? `<small style="color: #64748b; font-size: 0.78rem;">Hạn đến: <b>${ev.end_date}</b></small>` : '<small style="color: #10b981; font-size: 0.78rem;">Vô thời hạn</small>'}
        </td>
        <td>${ev.date}</td>
        <td><span class="badge badge-success">${ev.badge}</span></td>
        <td>${statusHtml}</td>
        <td style="max-width: 240px; font-size: 0.85rem; color: var(--text-secondary);">${ev.desc}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center;">
            <button class="btn btn-sm" style="${toggleBtnStyle}" onclick="toggleEventStatus(${ev.id})" title="${isHidden ? 'Bấm để Hiện sự kiện' : 'Bấm để Ẩn sự kiện'}">${toggleBtnText}</button>
            <button class="btn btn-outline btn-sm" onclick="editEvent(${ev.id})">✏️ Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${ev.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleEventStatus = async function(id) {
  const ev = adminState.events.find(e => e.id === id);
  if (!ev) return;

  ev.status = (ev.status === 'hidden') ? 'active' : 'hidden';
  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  renderEventsTable();

  const msg = (ev.status === 'active') ? `Đã BẬT hiển thị sự kiện "${ev.title}"!` : `Đã ẨN sự kiện "${ev.title}" khỏi website!`;
  showToast(msg, ev.status === 'active' ? 'success' : 'warning');

  // Cập nhật lên Cloudflare D1
  fetch('/api/events', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: ev.id, status: ev.status })
  }).catch(e => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev)
    }).catch(err => console.warn('Sync status failed:', err));
  });
};

function openEventModal(editId = null) {
  const form = document.getElementById('eventForm');
  form.reset();
  const idInput = document.getElementById('eventEditId');
  const title = document.getElementById('eventModalTitle');
  const endDateInput = document.getElementById('eventEndDate');
  const statusCheckbox = document.getElementById('eventStatusCheckbox');

  if (editId) {
    const ev = adminState.events.find(e => e.id === editId);
    if (!ev) return;
    title.textContent = 'Chỉnh Sửa Sự Kiện';
    idInput.value = ev.id;
    document.getElementById('eventTitle').value = ev.title;
    document.getElementById('eventDate').value = ev.date;
    document.getElementById('eventBadge').value = ev.badge;
    document.getElementById('eventImg').value = ev.img;
    document.getElementById('eventDesc').value = ev.desc;
    document.getElementById('eventDetail').value = ev.detail || '';
    if (endDateInput) endDateInput.value = ev.end_date || ev.endDate || '';
    if (statusCheckbox) statusCheckbox.checked = (ev.status !== 'hidden');
  } else {
    title.textContent = 'Đăng Sự Kiện Mới';
    idInput.value = '';
    document.getElementById('eventImg').value = 'assets/images/concept/concept_10.jpg';
    document.getElementById('eventBadge').value = 'Sự Kiện Mới';
    if (endDateInput) endDateInput.value = '';
    if (statusCheckbox) statusCheckbox.checked = true;
  }

  openModal('eventModal');
}

window.editEvent = openEventModal;

window.deleteEvent = function(id) {
  const ev = adminState.events.find(e => e.id === id);
  if (!ev) return;
  if (confirm(`Bạn có chắc chắn muốn xóa sự kiện "${ev.title}"?`)) {
    adminState.events = adminState.events.filter(e => e.id !== id);
    localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
    renderEventsTable();
    showToast(`Đã xóa sự kiện thành công!`, 'danger');

    // Đồng bộ xóa trên Cloudflare D1
    fetch(`/api/events?id=${id}`, { method: 'DELETE' })
      .catch(e => console.warn('Delete event from D1 failed:', e));
  }
};

document.getElementById('eventForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const editId = document.getElementById('eventEditId').value;
  const title = document.getElementById('eventTitle').value.trim();
  const date = document.getElementById('eventDate').value.trim();
  const badge = document.getElementById('eventBadge').value.trim();
  const img = document.getElementById('eventImg').value.trim();
  const desc = document.getElementById('eventDesc').value.trim();
  const detail = document.getElementById('eventDetail').value.trim();
  const endDate = document.getElementById('eventEndDate') ? document.getElementById('eventEndDate').value.trim() : '';
  const status = (document.getElementById('eventStatusCheckbox') && !document.getElementById('eventStatusCheckbox').checked) ? 'hidden' : 'active';

  let targetEvent = null;
  if (editId) {
    const ev = adminState.events.find(e => e.id == editId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.badge = badge;
      ev.img = img;
      ev.desc = desc;
      ev.detail = detail;
      ev.end_date = endDate;
      ev.status = status;
      targetEvent = ev;
      showToast(`Đã cập nhật sự kiện <b>${title}</b>!`);
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
      end_date: endDate,
      status: status
    };
    adminState.events.unshift(targetEvent);
    showToast(`Đã đăng sự kiện mới <b>${title}</b>!`);
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
  }
});

// ==================== MEDIA & CONCEPT LOOKBOOK ====================
function renderAdminMedia() {
  const grid = document.getElementById('adminMediaGrid');
  if (!grid) return;

  let list = adminState.photos;
  if (adminState.mediaFilterCat !== 'all') {
    list = list.filter(p => p.category === adminState.mediaFilterCat);
  }

  grid.innerHTML = list.map(item => `
    <div class="media-item" onclick="openPhotoModal(${item.id})">
      <img src="../${item.src}" alt="${item.title}" loading="lazy">
      <div class="media-overlay">
        <span class="badge badge-indigo" style="color: #fff; background: var(--color-brand-red); margin-bottom: 4px;">#${item.id} • ${item.categoryName}</span>
        <div class="media-title">${item.title}</div>
      </div>
    </div>
  `).join('');
}

function openPhotoModal(id) {
  const p = adminState.photos.find(item => item.id === id);
  if (!p) return;

  document.getElementById('photoEditId').value = p.id;
  document.getElementById('photoTitle').value = p.title;
  document.getElementById('photoCategory').value = p.category;
  document.getElementById('photoDesc').value = p.desc;
  document.getElementById('photoModalPreview').src = `../${p.src}`;

  openModal('photoModal');
}

window.openPhotoModal = openPhotoModal;

document.getElementById('photoForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById('photoEditId').value, 10);
  const p = adminState.photos.find(item => item.id === id);
  if (!p) return;

  const catNames = {
    banquet: 'Bàn Tiệc Đại Yến',
    dimsum: 'Dimsum Nghệ Nhân',
    bbq: 'Món Quay & Nướng',
    appetizer: 'Khai Vị & Súp',
    drinks: 'Thức Uống'
  };

  p.title = document.getElementById('photoTitle').value.trim();
  p.category = document.getElementById('photoCategory').value;
  p.categoryName = catNames[p.category] || p.category;
  p.desc = document.getElementById('photoDesc').value.trim();

  localStorage.setItem('tongwei_photos', JSON.stringify(adminState.photos));
  closeModal('photoModal');
  renderAdminMedia();
  showToast(`Đã lưu thông tin ảnh <b>${p.title}</b>!`);
});

// Media Picker Modal for selecting concept or dish images
let mediaPickerTargetInput = null;

function openMediaSelectorForDish() {
  mediaPickerTargetInput = document.getElementById('dishImage');
  populateMediaPicker('dishes');
  openModal('mediaPickerModal');
}

function openMediaSelectorForEvent() {
  mediaPickerTargetInput = document.getElementById('eventImg');
  populateMediaPicker('concept');
  openModal('mediaPickerModal');
}

function populateMediaPicker(type = 'concept') {
  const grid = document.getElementById('pickerGrid');
  if (!grid) return;

  if (type === 'concept') {
    grid.innerHTML = adminState.photos.map(p => `
      <div class="media-item" onclick="selectPickerImage('${p.src}')" style="height: 120px;">
        <img src="../${p.src}" alt="${p.title}">
        <div class="media-overlay">
          <div class="media-title" style="font-size: 0.72rem;">${p.title}</div>
        </div>
      </div>
    `).join('');
  } else {
    // Show dishes transparent images
    const dishImages = adminState.dishes.map(d => d.image).filter(Boolean);
    grid.innerHTML = dishImages.map(img => `
      <div class="media-item" onclick="selectPickerImage('${img}')" style="height: 120px; background: #faf7f2; display: flex; align-items: center; justify-content: center;">
        <img src="../${img}" alt="Dish" style="object-fit: contain; max-height: 90px;">
      </div>
    `).join('');
  }
}

function selectPickerImage(path) {
  if (mediaPickerTargetInput) {
    mediaPickerTargetInput.value = path;
    const preview = document.getElementById('dishPreviewImg');
    if (preview) preview.src = `../${path}`;
    showToast(`Đã chọn ảnh: <b>${path}</b>`);
  }
  closeModal('mediaPickerModal');
}

// ==================== BOOKINGS MANAGEMENT ====================
function renderBookingsTable() {
  const tbody = document.getElementById('bookingsTbody');
  if (!tbody) return;

  tbody.innerHTML = adminState.bookings.map(b => {
    const isConf = b.status === 'confirmed';
    const isDone = b.status === 'completed';
    const statusLabel = isConf ? 'Đã xác nhận' : (isDone ? 'Đã đón khách' : 'Chờ phản hồi');
    const badgeClass = isConf ? 'badge-success' : (isDone ? 'badge-indigo' : 'badge-warning');
    const displayName = b.name || b.customer || 'Khách đặt bàn';
    const displayPhone = b.phone || 'Chưa cung cấp';
    const displayTime = b.time ? `${b.time} ${b.date ? `(${b.date})` : ''}` : (b.date || 'Hôm nay');
    const displayBranch = b.branch ? `<div style="font-size: 0.78rem; color: var(--color-indigo); font-weight: 600;">📍 ${b.branch}</div>` : '';

    return `
      <tr>
        <td><b>${b.id}</b></td>
        <td>
          <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem;">${displayName}</div>
          ${displayBranch}
        </td>
        <td><a href="tel:${displayPhone}" style="color: var(--color-brand-red); font-weight: 700;">${displayPhone}</a></td>
        <td><b>${displayTime}</b></td>
        <td>${b.guests || '4 Khách'}</td>
        <td><span class="badge badge-indigo">${b.area || 'Sảnh tiêu chuẩn'}</span></td>
        <td style="max-width: 240px; font-size: 0.85rem; color: var(--text-secondary);">${b.preOrder || 'Không gọi trước'}</td>
        <td>
          <span class="badge ${badgeClass}">${statusLabel}</span>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="cycleBookingStatus('${b.id}')" title="Chuyển trạng thái">
              Đổi trạng thái ⇄
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteBooking('${b.id}')">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function cycleBookingStatus(id) {
  const b = adminState.bookings.find(item => item.id === id);
  if (!b) return;

  if (b.status === 'pending') b.status = 'confirmed';
  else if (b.status === 'confirmed') b.status = 'completed';
  else b.status = 'pending';

  localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
  refreshDashboardStats();
  renderBookingsTable();
  showToast(`Đã cập nhật trạng thái đơn đặt bàn <b>${b.id}</b>!`);
}

function deleteBooking(id) {
  if (confirm(`Hủy lịch đặt bàn ${id}?`)) {
    adminState.bookings = adminState.bookings.filter(b => b.id !== id);
    localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
    refreshDashboardStats();
    renderBookingsTable();
    showToast(`Đã xóa đơn đặt bàn!`);
  }
}

function openNewBookingModal() {
  const name = prompt('Nhập họ tên khách hàng:');
  if (!name) return;
  const phone = prompt('Nhập số điện thoại:');
  const guests = prompt('Số lượng khách (VD: 4 Khách):') || '4 Khách';
  const time = prompt('Giờ đến (VD: 18:30):') || '18:30';

  adminState.bookings.unshift({
    id: `TB-${Math.floor(100 + Math.random() * 900)}`,
    name,
    phone,
    date: new Date().toISOString().split('T')[0],
    time,
    guests,
    area: 'Sảnh Chính',
    preOrder: 'Tiếp nhận trực tiếp qua điện thoại',
    status: 'confirmed'
  });

  localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
  refreshDashboardStats();
  renderBookingsTable();
  showToast(`Đã thêm lịch đặt bàn mới cho <b>${name}</b>!`);
}

// ==================== FRANCHISE VIEW ====================
function renderFranchiseView() {
  const cardsWrap = document.getElementById('franchiseSettingsCards');
  const leadsTbody = document.getElementById('franchiseLeadsTbody');

  if (cardsWrap) {
    cardsWrap.innerHTML = adminState.franchisePackages.map(pkg => {
      const perksArr = Array.isArray(pkg.perks) 
        ? pkg.perks 
        : (typeof pkg.perks === 'string' ? pkg.perks.split('\n').filter(Boolean) : []);

      return `
        <div class="card-container" style="padding: 1.5rem; margin: 0; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-brand-red); text-transform: uppercase; letter-spacing: 0.05em;">Mô hình nhượng quyền</span>
            ${pkg.badge ? `<span class="badge badge-indigo" style="font-size: 0.72rem;">${pkg.badge}</span>` : ''}
          </div>
          <h3 style="font-family: var(--font-heading); color: var(--color-indigo-dark); margin: 0.2rem 0 0.5rem; font-size: 1.35rem;">${pkg.name}</h3>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-brand-red); margin-bottom: 0.5rem;">
            ${pkg.cost} <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">${pkg.costSub || '/ trọn gói'}</span>
          </div>
          <div style="background: rgba(29, 61, 116, 0.04); border-radius: var(--radius-sm); padding: 0.75rem; margin-bottom: 1rem; font-size: 0.85rem; line-height: 1.6;">
            <div>📐 <b>Quy mô:</b> ${pkg.scale || 'Tiêu chuẩn'}</div>
            <div>⏱ <b>Hoàn vốn:</b> <b style="color: var(--color-indigo);">${pkg.payback || 'Dự kiến'}</b></div>
          </div>
          <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 1.25rem; flex: 1;">
            <div style="font-weight: 700; color: var(--color-indigo-dark); margin-bottom: 0.35rem;">Quyền lợi chính:</div>
            <ul style="padding-left: 1.15rem; margin: 0; list-style-type: disc;">
              ${perksArr.slice(0, 3).map(p => `<li>${p}</li>`).join('')}
              ${perksArr.length > 3 ? `<li style="color: var(--color-indigo); font-weight: 600;">+ ${perksArr.length - 3} quyền lợi khác...</li>` : ''}
            </ul>
          </div>
          <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="openFranchiseModal('${pkg.id}')">
            ✏️ Điều chỉnh thông tin gói này
          </button>
        </div>
      `;
    }).join('');
  }

  if (leadsTbody) {
    leadsTbody.innerHTML = adminState.franchiseLeads.map(lead => `
      <tr>
        <td><b>${lead.name}</b></td>
        <td><a href="tel:${lead.phone}" style="color: var(--color-indigo); font-weight: 700;">${lead.phone}</a></td>
        <td><span class="badge badge-indigo">${lead.city}</span></td>
        <td><b>${lead.budget}</b></td>
        <td style="font-size: 0.85rem; color: var(--text-secondary);">${lead.note}</td>
        <td>${lead.date}</td>
        <td style="text-align: right;">
          <span class="badge ${lead.status === 'meeting' ? 'badge-success' : 'badge-warning'}">
            ${lead.status === 'meeting' ? 'Đã hẹn gặp' : (lead.status === 'contacted' ? 'Đã gọi điện' : 'Mới đăng ký')}
          </span>
        </td>
      </tr>
    `).join('');
  }
}

function openFranchiseModal(id) {
  const pkg = adminState.franchisePackages.find(p => p.id === id);
  if (!pkg) return;
  document.getElementById('pkgEditId').value = pkg.id;
  document.getElementById('pkgName').value = pkg.name;
  document.getElementById('pkgBadge').value = pkg.badge || '';
  document.getElementById('pkgCost').value = pkg.cost;
  document.getElementById('pkgCostSub').value = pkg.costSub || '/ trọn gói';
  document.getElementById('pkgScale').value = pkg.scale || '';
  document.getElementById('pkgPayback').value = pkg.payback || '';
  const perksArr = Array.isArray(pkg.perks) 
    ? pkg.perks 
    : (typeof pkg.perks === 'string' ? pkg.perks.split('\n').filter(Boolean) : []);
  document.getElementById('pkgPerks').value = perksArr.join('\n');
  openModal('franchiseModal');
}
window.openFranchiseModal = openFranchiseModal;

// Franchise Package Form Submit Handler
document.getElementById('franchisePackageForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('pkgEditId').value;
  const pkg = adminState.franchisePackages.find(p => p.id === id);
  if (!pkg) return;

  pkg.name = document.getElementById('pkgName').value.trim();
  pkg.badge = document.getElementById('pkgBadge').value.trim();
  pkg.cost = document.getElementById('pkgCost').value.trim();
  pkg.costSub = document.getElementById('pkgCostSub').value.trim();
  pkg.scale = document.getElementById('pkgScale').value.trim();
  pkg.payback = document.getElementById('pkgPayback').value.trim();
  const perksText = document.getElementById('pkgPerks').value.trim();
  pkg.perks = perksText.split('\n').map(p => p.trim()).filter(Boolean);

  localStorage.setItem('tongwei_franchise_packages', JSON.stringify(adminState.franchisePackages));
  renderFranchiseView();
  closeModal('franchiseModal');
  showToast(`Đã lưu thay đổi thông tin gói nhượng quyền <b>${pkg.name}</b> thành công!`);
});

// ==================== CAREERS VIEW ====================
function renderCareersView() {
  const jobsTbody = document.getElementById('jobsTbody');
  const candTbody = document.getElementById('candidatesTbody');

  if (jobsTbody) {
    jobsTbody.innerHTML = adminState.jobs.map(j => `
      <tr>
        <td><b>${j.title}</b></td>
        <td>${j.location}</td>
        <td>${j.type}</td>
        <td><b style="color: var(--color-brand-red);">${j.salary}</b></td>
        <td>${j.exp}</td>
        <td><span class="badge badge-success">Đang tuyển</span></td>
        <td style="text-align: right;">
          <button class="btn btn-outline btn-sm" onclick="editJobSalary('${j.id}')">Sửa lương</button>
        </td>
      </tr>
    `).join('');
  }

  if (candTbody) {
    candTbody.innerHTML = adminState.candidates.map(c => `
      <tr>
        <td><b>${c.name}</b></td>
        <td><a href="tel:${c.phone}" style="color: var(--color-indigo); font-weight: 700;">${c.phone}</a></td>
        <td><span class="badge badge-indigo">${c.job}</span></td>
        <td style="font-size: 0.85rem; color: var(--text-secondary);">${c.exp}</td>
        <td>${c.date}</td>
        <td style="text-align: right;">
          <button class="btn btn-outline btn-sm" onclick="cycleCandidateStatus('${c.name}')">
            ${c.status === 'hired' ? '✔ Đã trúng tuyển' : (c.status === 'interview' ? '📅 Đang phỏng vấn' : '📩 Mới nhận')}
          </button>
        </td>
      </tr>
    `).join('');
  }
}

function editJobSalary(id) {
  const j = adminState.jobs.find(item => item.id === id);
  if (!j) return;
  const newSal = prompt(`Cập nhật mức thu nhập vị trí ${j.title}:`, j.salary);
  if (newSal) {
    j.salary = newSal;
    renderCareersView();
    showToast(`Đã cập nhật lương cho vị trí <b>${j.title}</b>!`);
  }
}

function openJobModal() {
  const title = prompt('Nhập tên vị trí tuyển dụng mới:');
  if (!title) return;
  const salary = prompt('Mức lương (VD: 12.000.000 ₫ - 16.000.000 ₫):') || 'Thỏa thuận';
  adminState.jobs.unshift({
    id: `JOB-${Date.now()}`,
    title,
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary,
    exp: 'Kinh nghiệm tương đương',
    status: 'active'
  });
  renderCareersView();
  showToast(`Đã thêm vị trí tuyển dụng mới <b>${title}</b>!`);
}

function cycleCandidateStatus(name) {
  const c = adminState.candidates.find(item => item.name === name);
  if (!c) return;
  if (c.status === 'new') c.status = 'interview';
  else if (c.status === 'interview') c.status = 'hired';
  else c.status = 'new';
  renderCareersView();
  showToast(`Đã đổi trạng thái ứng viên <b>${name}</b>!`);
}

// ==================== BRANCHES & FACTORY MANAGEMENT ====================
function renderBranchesView() {
  const tbody = document.getElementById('branchesTbody');
  const countBadge = document.getElementById('branchCountBadge');
  if (countBadge) countBadge.textContent = `${adminState.branches.length} Chi nhánh`;

  if (!tbody) return;
  tbody.innerHTML = adminState.branches.map(b => `
    <tr>
      <td><span class="badge badge-indigo">${b.id}</span></td>
      <td>
        <div style="font-weight: 700; color: var(--color-indigo-dark);">${b.name}</div>
        <div style="font-size: 0.8rem; color: var(--color-brand-red); font-weight: 600;">${b.shortName || ''}</div>
      </td>
      <td style="max-width: 280px; font-size: 0.9rem;">${b.address}</td>
      <td><b style="color: var(--color-brand-red);">${b.phone}</b></td>
      <td style="font-size: 0.85rem; color: var(--text-secondary);">${b.hours}</td>
      <td>
        <span class="badge ${b.status === 'upcoming' ? 'badge-warning' : 'badge-success'}">
          ${b.status === 'upcoming' ? '⏳ Sắp khai trương' : '✔ Đang hoạt động'}
        </span>
      </td>
      <td style="text-align: right;">
        <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
          <button class="btn btn-outline btn-sm" onclick="openBranchModal('${b.id}')" title="Sửa thông tin">
            ✏️ Sửa
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteBranch('${b.id}')" title="Xóa cơ sở">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}
window.renderBranchesView = renderBranchesView;

function openBranchModal(editId = null) {
  const form = document.getElementById('branchForm');
  if (form) form.reset();
  const title = document.getElementById('branchModalTitle');
  const idInput = document.getElementById('branchEditId');

  if (editId) {
    const b = adminState.branches.find(item => item.id === editId);
    if (!b) return;
    if (title) title.textContent = `Chỉnh sửa: ${b.shortName || b.name}`;
    if (idInput) idInput.value = b.id;
    document.getElementById('modalBranchName').value = b.name || '';
    document.getElementById('modalBranchShortName').value = b.shortName || '';
    document.getElementById('modalBranchAddress').value = b.address || '';
    document.getElementById('modalBranchPhone').value = b.phone || '';
    document.getElementById('modalBranchHours').value = b.hours || '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)';
    document.getElementById('modalBranchScale').value = b.scale || '';
    document.getElementById('modalBranchStatus').value = b.status || 'active';
  } else {
    if (title) title.textContent = 'Thêm cơ sở chi nhánh mới';
    if (idInput) idInput.value = '';
    document.getElementById('modalBranchHours').value = '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)';
    document.getElementById('modalBranchStatus').value = 'active';
  }

  openModal('branchModal');
}
window.openBranchModal = openBranchModal;

function deleteBranch(id) {
  const b = adminState.branches.find(item => item.id === id);
  if (!b) return;
  if (confirm(`Bạn có chắc chắn muốn xóa chi nhánh "${b.name}" khỏi hệ thống?`)) {
    adminState.branches = adminState.branches.filter(item => item.id !== id);
    localStorage.setItem('tongwei_branches', JSON.stringify(adminState.branches));
    renderBranchesView();
    showToast(`Đã xóa cơ sở <b>${b.name}</b> thành công!`, 'danger');
  }
}
window.deleteBranch = deleteBranch;

// Branch Form Submit Handler
document.getElementById('branchForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const editId = document.getElementById('branchEditId').value;
  const name = document.getElementById('modalBranchName').value.trim();
  const shortName = document.getElementById('modalBranchShortName').value.trim();
  const address = document.getElementById('modalBranchAddress').value.trim();
  const phone = document.getElementById('modalBranchPhone').value.trim();
  const hours = document.getElementById('modalBranchHours').value.trim();
  const scale = document.getElementById('modalBranchScale').value.trim();
  const status = document.getElementById('modalBranchStatus').value;

  if (editId) {
    const b = adminState.branches.find(item => item.id === editId);
    if (b) {
      b.name = name;
      b.shortName = shortName;
      b.address = address;
      b.phone = phone;
      b.hours = hours;
      b.scale = scale;
      b.status = status;
      showToast(`Đã cập nhật thông tin cơ sở <b>${name}</b> thành công!`);
    }
  } else {
    const nextNum = adminState.branches.length + 1;
    const newBranch = {
      id: `CS-${nextNum < 10 ? '0' + nextNum : nextNum}`,
      name,
      shortName,
      address,
      phone,
      hours,
      scale,
      status
    };
    adminState.branches.push(newBranch);
    showToast(`Đã thêm mới cơ sở <b>${name}</b> vào hệ thống!`);
  }

  localStorage.setItem('tongwei_branches', JSON.stringify(adminState.branches));
  renderBranchesView();
  closeModal('branchModal');
});

// Factory Configuration Save
function saveFactorySettings() {
  const name = document.getElementById('factoryName')?.value || '';
  const hotline = document.getElementById('factoryHotline')?.value || '';
  const address = document.getElementById('factoryAddress')?.value || '';
  const capacity = document.getElementById('factoryCapacity')?.value || '';
  const standards = document.getElementById('factoryStandards')?.value || '';

  const settings = { name, hotline, address, capacity, standards };
  localStorage.setItem('tongwei_factory_settings', JSON.stringify(settings));
  showToast(`Đã lưu cấu hình Xưởng Chế Biến Trung Tâm thành công!`);
}
window.saveFactorySettings = saveFactorySettings;

// ==================== AUTHENTICATION & USER MANAGEMENT ====================
function getCurrentAuthUser() {
  const local = localStorage.getItem('tongwei_auth_user');
  const sess = sessionStorage.getItem('tongwei_auth_user');
  const raw = local || sess;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const found = adminState.users.find(u => u.username.toLowerCase() === parsed.username.toLowerCase());
    return found || parsed;
  } catch(e) {
    return null;
  }
}

function checkAuthState() {
  const authUser = getCurrentAuthUser();
  const screen = document.getElementById('loginScreen');
  if (!screen) return;

  if (authUser && authUser.status === 'active') {
    screen.classList.add('hidden');
    // Update sidebar profile
    const nameEl = document.getElementById('sidebarUserName');
    const roleEl = document.getElementById('sidebarUserRole');
    const avatarEl = document.getElementById('sidebarUserAvatar');
    const secUserEl = document.getElementById('securityCurrentUsername');

    if (nameEl) nameEl.textContent = authUser.fullName || authUser.username;
    if (roleEl) roleEl.textContent = authUser.roleName || authUser.role;
    if (avatarEl) avatarEl.textContent = authUser.avatar || authUser.username.substring(0, 2).toUpperCase();
    if (secUserEl) secUserEl.value = `${authUser.username} (${authUser.fullName})`;
  } else {
    screen.classList.remove('hidden');
    const loginUsername = document.getElementById('loginUsername');
    if (loginUsername) loginUsername.focus();
  }
}

function quickFillLogin(username, password) {
  const u = document.getElementById('loginUsername');
  const p = document.getElementById('loginPassword');
  const alertEl = document.getElementById('loginAlert');
  if (u) u.value = username;
  if (p) p.value = password;
  if (alertEl) alertEl.style.display = 'none';
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const u = (document.getElementById('loginUsername')?.value || '').trim().toLowerCase();
  const p = document.getElementById('loginPassword')?.value || '';
  const alertEl = document.getElementById('loginAlert');

  const found = adminState.users.find(x => x.username.toLowerCase() === u);

  if (!found || found.password !== p) {
    if (alertEl) {
      alertEl.innerHTML = '❌ Tên đăng nhập hoặc mật khẩu không chính xác! (Mặc định: <b>admin</b> / <b>123456</b>)';
      alertEl.style.display = 'block';
    }
    return;
  }

  if (found.status === 'disabled') {
    if (alertEl) {
      alertEl.innerHTML = '🔒 Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên cấp cao!';
      alertEl.style.display = 'block';
    }
    return;
  }

  if (alertEl) alertEl.style.display = 'none';

  const remember = document.getElementById('rememberMe')?.checked;
  if (remember) {
    localStorage.setItem('tongwei_auth_user', JSON.stringify(found));
    sessionStorage.removeItem('tongwei_auth_user');
  } else {
    sessionStorage.setItem('tongwei_auth_user', JSON.stringify(found));
    localStorage.removeItem('tongwei_auth_user');
  }

  checkAuthState();
  showToast(`Xin chào ${found.fullName}! Đăng nhập cổng quản trị thành công.`);
}

function handleLogout() {
  localStorage.removeItem('tongwei_auth_user');
  sessionStorage.removeItem('tongwei_auth_user');
  checkAuthState();
  showToast('Đã đăng xuất khỏi phiên làm việc an toàn.', 'info');
}

function renderUsersTable() {
  const tbody = document.getElementById('usersTbody');
  if (!tbody) return;

  const countBadge1 = document.getElementById('userCountBadge');
  const countBadge2 = document.getElementById('usersListCountBadge');
  if (countBadge1) countBadge1.textContent = adminState.users.length;
  if (countBadge2) countBadge2.textContent = `${adminState.users.length} Tài khoản`;

  const currentAuth = getCurrentAuthUser();

  tbody.innerHTML = adminState.users.map(u => {
    const isSelf = currentAuth && currentAuth.username.toLowerCase() === u.username.toLowerCase();
    const isMasterAdmin = u.username.toLowerCase() === 'admin';
    const roleClass = u.role === 'admin' ? 'role-admin' : (u.role === 'kitchen' ? 'role-kitchen' : 'role-cashier');
    const statusHtml = u.status === 'active'
      ? `<span class="badge" style="background: rgba(46, 125, 50, 0.12); color: #2e7d32;">✔ Hoạt động</span>`
      : `<span class="badge" style="background: rgba(198, 40, 40, 0.12); color: #c62828;">🔒 Tạm khóa</span>`;

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="user-avatar-badge">${u.avatar || u.username.substring(0, 2).toUpperCase()}</div>
            <div>
              <div style="font-weight: 700; color: var(--color-indigo-dark);">${u.fullName}</div>
              ${isSelf ? '<span style="font-size: 0.72rem; color: var(--color-brand-red); font-weight: 700;">(Đang đăng nhập)</span>' : ''}
            </div>
          </div>
        </td>
        <td><code>@${u.username}</code></td>
        <td><span class="role-badge ${roleClass}">${u.roleName || u.role}</span></td>
        <td>${statusHtml}</td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">${u.createdAt || '2026-10-21'}</td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.4rem;">
            <button class="btn btn-outline btn-sm" onclick="openResetPassModal('${u.username}')" title="Đặt lại mật khẩu">
              🔑 Đổi pass
            </button>
            <button class="btn btn-outline btn-sm" onclick="toggleUserStatus('${u.id}')" ${isMasterAdmin || isSelf ? 'disabled title="Không thể khóa tài khoản này"' : `title="${u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}"`}>
              ${u.status === 'active' ? '🔒' : '🔓'}
            </button>
            <button class="btn btn-outline btn-sm" onclick="deleteUser('${u.id}')" ${isMasterAdmin || isSelf ? 'disabled title="Không thể xóa tài khoản này"' : 'title="Xóa tài khoản"'} style="color: var(--status-danger);">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddUserModal() {
  document.getElementById('userForm')?.reset();
  const passEl = document.getElementById('newPassword');
  if (passEl) passEl.value = '123456';
  openModal('userModal');
}

function handleCreateUserSubmit(e) {
  e.preventDefault();
  const username = (document.getElementById('newUsername')?.value || '').trim().toLowerCase();
  const fullName = (document.getElementById('newFullName')?.value || '').trim();
  const role = document.getElementById('newRoleSelect')?.value || 'cashier';
  const password = document.getElementById('newPassword')?.value || '123456';

  if (!username || !fullName) return;

  if (adminState.users.some(u => u.username.toLowerCase() === username)) {
    showToast('Tên đăng nhập này đã tồn tại! Vui lòng chọn tên khác.', 'danger');
    return;
  }

  const roleNameMap = {
    admin: 'Quản trị viên cấp cao',
    kitchen: 'Quản lý bếp & thực đơn',
    cashier: 'Vận hành & đặt bàn'
  };

  // Avatar initials from full name
  const nameParts = fullName.split(' ').filter(Boolean);
  const avatar = nameParts.length >= 2
    ? (nameParts[nameParts.length - 2][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : username.substring(0, 2).toUpperCase();

  const newUser = {
    id: `usr_${Date.now()}`,
    username,
    fullName,
    role,
    roleName: roleNameMap[role] || 'Nhân Sự',
    password,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    avatar
  };

  adminState.users.push(newUser);
  localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));
  renderUsersTable();
  closeModal('userModal');
  showToast(`🎉 Đã tạo thành công tài khoản @${username} (${fullName})!`);
}

function openResetPassModal(username) {
  const user = adminState.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return;

  document.getElementById('resetPassForm')?.reset();
  document.getElementById('resetTargetUsername').value = user.username;
  document.getElementById('resetTargetUserTitle').textContent = `${user.fullName} (@${user.username})`;
  openModal('resetPassModal');
}

function handleResetPassSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('resetTargetUsername')?.value;
  const newPass = document.getElementById('adminResetNewPass')?.value;
  const confirmPass = document.getElementById('adminResetConfirmPass')?.value;

  if (!newPass || newPass.length < 6) {
    showToast('Mật khẩu mới phải có tối thiểu 6 ký tự!', 'danger');
    return;
  }

  if (newPass !== confirmPass) {
    showToast('Mật khẩu nhập lại không khớp!', 'danger');
    return;
  }

  const user = adminState.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return;

  user.password = newPass;
  localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));

  // If resetting password for current logged-in user, update session
  const currentAuth = getCurrentAuthUser();
  if (currentAuth && currentAuth.username.toLowerCase() === username.toLowerCase()) {
    currentAuth.password = newPass;
    if (localStorage.getItem('tongwei_auth_user')) {
      localStorage.setItem('tongwei_auth_user', JSON.stringify(currentAuth));
    } else {
      sessionStorage.setItem('tongwei_auth_user', JSON.stringify(currentAuth));
    }
  }

  closeModal('resetPassModal');
  renderUsersTable();
  showToast(`🔑 Đã cập nhật mật khẩu mới cho tài khoản @${username}!`);
}

function toggleUserStatus(userId) {
  const user = adminState.users.find(u => u.id === userId);
  if (!user) return;

  if (user.username.toLowerCase() === 'admin') {
    showToast('Không thể khóa tài khoản quản trị viên tối cao!', 'danger');
    return;
  }

  const currentAuth = getCurrentAuthUser();
  if (currentAuth && currentAuth.id === user.id) {
    showToast('Không thể tự khóa tài khoản bạn đang đăng nhập!', 'danger');
    return;
  }

  user.status = user.status === 'active' ? 'disabled' : 'active';
  localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));
  renderUsersTable();
  showToast(`Đã ${user.status === 'active' ? 'mở khóa' : 'tạm khóa'} tài khoản @${user.username}.`);
}

function deleteUser(userId) {
  const user = adminState.users.find(u => u.id === userId);
  if (!user) return;

  if (user.username.toLowerCase() === 'admin') {
    showToast('Không thể xóa tài khoản quản trị viên tối cao!', 'danger');
    return;
  }

  const currentAuth = getCurrentAuthUser();
  if (currentAuth && currentAuth.id === user.id) {
    showToast('Không thể xóa tài khoản bạn đang đăng nhập!', 'danger');
    return;
  }

  if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản @${user.username} (${user.fullName})?`)) return;

  adminState.users = adminState.users.filter(u => u.id !== userId);
  localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));
  renderUsersTable();
  showToast(`Đã xóa vĩnh viễn tài khoản @${user.username}!`);
}

function handleChangePasswordSubmit(e) {
  e.preventDefault();
  const currentAuth = getCurrentAuthUser();
  if (!currentAuth) {
    showToast('Phiên làm việc hết hạn. Vui lòng đăng nhập lại!', 'danger');
    checkAuthState();
    return;
  }

  const currentPass = document.getElementById('currentPasswordInput')?.value;
  const newPass = document.getElementById('newPasswordInput')?.value;
  const confirmPass = document.getElementById('confirmPasswordInput')?.value;

  // Verify current password
  if (currentPass !== currentAuth.password) {
    showToast('Mật khẩu hiện tại không chính xác! Vui lòng kiểm tra lại.', 'danger');
    return;
  }

  if (!newPass || newPass.length < 6) {
    showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'danger');
    return;
  }

  if (newPass !== confirmPass) {
    showToast('Mật khẩu xác nhận không khớp với mật khẩu mới!', 'danger');
    return;
  }

  // Update in users array
  const userInState = adminState.users.find(u => u.username.toLowerCase() === currentAuth.username.toLowerCase());
  if (userInState) userInState.password = newPass;

  currentAuth.password = newPass;
  localStorage.setItem('tongwei_users', JSON.stringify(adminState.users));

  if (localStorage.getItem('tongwei_auth_user')) {
    localStorage.setItem('tongwei_auth_user', JSON.stringify(currentAuth));
  } else {
    sessionStorage.setItem('tongwei_auth_user', JSON.stringify(currentAuth));
  }

  document.getElementById('changePasswordForm')?.reset();
  document.getElementById('securityCurrentUsername').value = `${currentAuth.username} (${currentAuth.fullName})`;
  renderUsersTable();
  showToast('🎉 Đổi mật khẩu thành công! Mật khẩu mới đã có hiệu lực ngay lập tức.');
}

window.quickFillLogin = quickFillLogin;
window.handleLoginSubmit = handleLoginSubmit;
window.handleLogout = handleLogout;
window.openAddUserModal = openAddUserModal;
window.handleCreateUserSubmit = handleCreateUserSubmit;
window.openResetPassModal = openResetPassModal;
window.handleResetPassSubmit = handleResetPassSubmit;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.handleChangePasswordSubmit = handleChangePasswordSubmit;

// ==================== LOCAL STAGING & GITHUB PUBLISH ENGINE ====================
const publishState = {
  isPublishing: false,
  lastPublished: localStorage.getItem('tongwei_last_published') || null,
  scheduleTime: localStorage.getItem('tongwei_schedule_time') || '16:40',
  autoPublish: localStorage.getItem('tongwei_auto_publish') !== 'false',
  lastAutoFiredKey: localStorage.getItem('tongwei_last_auto_fired_key') || ''
};

function getBackendApiUrl(endpoint) {
  // If running on local server, relative path works
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return endpoint;
  }
  // If accessed online (GitHub Pages), talk to local Node server on port 8088
  return `http://localhost:8088${endpoint}`;
}

function updatePublishUI() {
  const timeDisplay = document.getElementById('scheduleTimeDisplay');
  if (timeDisplay) {
    timeDisplay.textContent = publishState.autoPublish ? publishState.scheduleTime : 'Tắt';
  }

  const modalPreview = document.getElementById('modalSchedulePreview');
  if (modalPreview) {
    modalPreview.textContent = publishState.scheduleTime;
  }

  const timeInput = document.getElementById('scheduleTimeInput');
  if (timeInput) {
    timeInput.value = publishState.scheduleTime;
  }

  const autoToggle = document.getElementById('autoPublishToggle');
  if (autoToggle) {
    autoToggle.checked = publishState.autoPublish;
  }
}

function openScheduleModal() {
  updatePublishUI();
  openModal('scheduleModal');
}
window.openScheduleModal = openScheduleModal;

async function handleScheduleFormSubmit(e) {
  if (e) e.preventDefault();
  const timeInput = document.getElementById('scheduleTimeInput');
  const toggle = document.getElementById('autoPublishToggle');
  if (!timeInput) return;

  publishState.scheduleTime = timeInput.value || '16:40';
  publishState.autoPublish = toggle ? toggle.checked : true;

  localStorage.setItem('tongwei_schedule_time', publishState.scheduleTime);
  localStorage.setItem('tongwei_auto_publish', publishState.autoPublish);

  updatePublishUI();
  closeModal('scheduleModal');

  // Sync schedule config with local server if running
  try {
    const url = getBackendApiUrl('/api/set-schedule');
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledTime: publishState.scheduleTime,
        autoPublishEnabled: publishState.autoPublish
      })
    });
  } catch (err) {
    console.warn('Could not sync schedule with local server:', err);
  }

  showToast(`⏰ Đã lưu lịch hẹn: ${publishState.autoPublish ? `Tự động đẩy lúc ${publishState.scheduleTime}` : 'Đã tắt tự động'}!`);
}
window.handleScheduleFormSubmit = handleScheduleFormSubmit;

async function triggerPublishToGithub(isAuto = false) {
  if (publishState.isPublishing) {
    showToast('⏳ Hệ thống đang tiến hành đẩy lên GitHub, vui lòng đợi trong giây lát...', 'info');
    return;
  }

  const btn = document.getElementById('btnPublishOnline');
  const origBtnContent = btn ? btn.innerHTML : '';

  try {
    publishState.isPublishing = true;
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳ Đang đẩy code lên GitHub...</span>`;
    }

    // Always make sure local client website has latest data
    syncDataToLiveWebsite(false);

    showToast(isAuto ? `⏰ Lịch hẹn ${publishState.scheduleTime}: Đang tự động xuất bản lên GitHub...` : '🚀 Đang bắt đầu đẩy các thay đổi lên GitHub Pages...', 'info');

    const url = getBackendApiUrl('/api/publish-github');
    const payload = {
      dishes: adminState.dishes,
      events: adminState.events,
      branches: adminState.branches,
      franchisePackages: adminState.franchisePackages
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      publishState.lastPublished = nowStr;
      localStorage.setItem('tongwei_last_published', nowStr);
      showToast(`🎉 Xuất bản thành công! Toàn bộ thay đổi đã được đẩy lên GitHub. Website online sẽ cập nhật sau 1-2 phút.`);

      const stagingBadge = document.querySelector('.staging-badge span:last-child');
      if (stagingBadge) {
        stagingBadge.textContent = `Đã online (${nowStr})`;
        setTimeout(() => {
          stagingBadge.textContent = 'Lưu cục bộ (Local)';
        }, 8000);
      }
    } else {
      throw new Error(data.message || data.error || 'Server trả về lỗi không xác định');
    }
  } catch (err) {
    console.error('Publish error:', err);
    showToast(`❌ Không thể xuất bản: ${err.message || 'Lỗi kết nối'}. Vui lòng kiểm tra server local (http://localhost:8088/) có đang chạy không.`, 'danger');
  } finally {
    publishState.isPublishing = false;
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origBtnContent;
    }
  }
}
window.triggerPublishToGithub = triggerPublishToGithub;

// Background Timer for 16:40 or configured time
function checkAutoPublishSchedule() {
  if (!publishState.autoPublish) return;

  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, '0');
  const currentMinute = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;
  const todayStr = now.toISOString().split('T')[0];
  const fireKey = `${todayStr}_${currentTime}`;

  if (currentTime === publishState.scheduleTime && publishState.lastAutoFiredKey !== fireKey) {
    publishState.lastAutoFiredKey = fireKey;
    localStorage.setItem('tongwei_last_auto_fired_key', fireKey);
    console.log(`[TongWei Scheduler] Kích hoạt tự động xuất bản đúng giờ hẹn ${currentTime}`);
    triggerPublishToGithub(true);
  }
}

// ==================== SYNC TO LIVE WEBSITE (LOCAL CLIENT) ====================
function syncDataToLiveWebsite(showFeedback = true) {
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  localStorage.setItem('tongwei_photos', JSON.stringify(adminState.photos));
  localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
  localStorage.setItem('tongwei_branches', JSON.stringify(adminState.branches));
  localStorage.setItem('tongwei_franchise_packages', JSON.stringify(adminState.franchisePackages));
  if (showFeedback) {
    showToast(`🚀 Đã đồng bộ toàn bộ dữ liệu (Món ăn, Cơ sở, Gói nhượng quyền, Đặt bàn) sang Website khách hàng! Bấm "Xem web ↗" để kiểm tra.`);
  }
}
window.syncDataToLiveWebsite = syncDataToLiveWebsite;

// ==================== EVENT LISTENERS & SETUP ====================
document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  updatePublishUI();

  // Run auto-publish timer check every 15 seconds
  setInterval(checkAutoPublishSchedule, 15000);

  // Sidebar Menu Clicks
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // Dish Filter Tabs
  document.getElementById('dishFilterControls')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.table-filter-btn');
    if (!btn) return;
    document.querySelectorAll('#dishFilterControls .table-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    adminState.dishFilterCat = btn.dataset.filter || 'all';
    renderDishesTable();
  });

  // Media Filter Tabs
  document.getElementById('mediaFilterControls')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.table-filter-btn');
    if (!btn) return;
    document.querySelectorAll('#mediaFilterControls .table-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    adminState.mediaFilterCat = btn.dataset.cat || 'all';
    renderAdminMedia();
  });

  // Dish search input
  document.getElementById('dishSearchInput')?.addEventListener('input', (e) => {
    adminState.dishSearchQuery = e.target.value;
    renderDishesTable();
  });

  // Global Omni Search
  document.getElementById('globalSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) return;
    // Switch to dishes tab and filter if matched
    if (adminState.dishes.some(d => d.name.toLowerCase().includes(q))) {
      switchTab('dishes');
      document.getElementById('dishSearchInput').value = q;
      adminState.dishSearchQuery = q;
      renderDishesTable();
    }
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
});
