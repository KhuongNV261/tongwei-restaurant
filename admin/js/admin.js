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
  branches: []
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
  const savedEvents = localStorage.getItem('tongwei_events');
  if (savedEvents) {
    adminState.events = JSON.parse(savedEvents);
  } else {
    adminState.events = [
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

  // Refresh KPIs and Views
  refreshDashboardStats();
  renderDishesTable();
  renderEventsTable();
  renderAdminMedia();
  renderBookingsTable();
  renderFranchiseView();
  renderCareersView();
  renderBranchesView();
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
              ${b.status === 'confirmed' ? 'Đã Xác Nhận' : 'Chờ Phản Hồi'}
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
    const statusText = dish.isAvailable !== false ? 'Còn Món' : 'Tạm Hết';
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
            ${isHome ? '☑ Hiện Trang Chủ' : '☐ Đang Ẩn'}
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
          ${isHome ? '☑ Hiện Trang Chủ' : '☐ Đang Ẩn'}
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
    btn.textContent = 'Chuyển Xem Bảng 📋';
  } else {
    adminState.dishViewMode = 'table';
    table.style.display = 'block';
    grid.style.display = 'none';
    btn.textContent = 'Chuyển Xem Lưới Ảnh 🔲';
  }
}

function toggleDishAvailability(id) {
  const dish = adminState.dishes.find(d => d.id === id);
  if (!dish) return;
  dish.isAvailable = dish.isAvailable === false ? true : false;
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  renderDishesTable();
  showToast(`Đã đổi trạng thái món <b>${dish.name}</b> thành <b>${dish.isAvailable ? 'Còn Món' : 'Tạm Hết'}</b>!`);
}

window.toggleDishHomeDisplay = function(id) {
  const dish = adminState.dishes.find(d => d.id === id);
  if (!dish) return;
  dish.showOnHome = dish.showOnHome === false ? true : false;
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  renderDishesTable();
  const label = dish.showOnHome ? 'HIỂN THỊ trên Trang Chủ' : 'ẨN khỏi Trang Chủ';
  showToast(`Món <b>${dish.name}</b> đã được chuyển sang: <b>${label}</b>!`);
};

window.setAllDishesHomeVisibility = function(shouldShow) {
  adminState.dishes.forEach(d => {
    d.showOnHome = shouldShow;
  });
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  renderDishesTable();
  showToast(shouldShow ? 'Đã BẬT hiển thị TẤT CẢ món ăn trên Trang Chủ!' : 'Đã ẨN toàn bộ món ăn khỏi Trang Chủ!');
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
    title.textContent = `Chỉnh Sửa: ${dish.name}`;
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
    title.textContent = 'Thêm Món Ăn Mới';
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

  tbody.innerHTML = adminState.events.map(ev => {
    const imgSrc = ev.img.startsWith('assets') ? `../${ev.img}` : ev.img;
    return `
      <tr>
        <td>
          <img src="${imgSrc}" alt="${ev.title}" style="width: 70px; height: 45px; object-fit: cover; border-radius: var(--radius-sm);">
        </td>
        <td>
          <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.95rem;">${ev.title}</div>
        </td>
        <td>${ev.date}</td>
        <td><span class="badge badge-success">${ev.badge}</span></td>
        <td style="max-width: 280px; font-size: 0.85rem; color: var(--text-secondary);">${ev.desc}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="editEvent(${ev.id})">✏️ Sửa</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEvent(${ev.id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openEventModal(editId = null) {
  const form = document.getElementById('eventForm');
  form.reset();
  const idInput = document.getElementById('eventEditId');
  const title = document.getElementById('eventModalTitle');

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
  } else {
    title.textContent = 'Đăng Sự Kiện Mới';
    idInput.value = '';
    document.getElementById('eventImg').value = 'assets/images/concept/concept_10.jpg';
    document.getElementById('eventBadge').value = 'Sự Kiện Mới';
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

  if (editId) {
    const ev = adminState.events.find(e => e.id == editId);
    if (ev) {
      ev.title = title;
      ev.date = date;
      ev.badge = badge;
      ev.img = img;
      ev.desc = desc;
      ev.detail = detail;
      showToast(`Đã cập nhật sự kiện <b>${title}</b>!`);
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
    showToast(`Đã đăng sự kiện mới <b>${title}</b>!`);
  }

  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  closeModal('eventModal');
  renderEventsTable();
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
    const statusLabel = isConf ? 'Đã Xác Nhận' : (isDone ? 'Đã Tiếp Đón' : 'Chờ Phản Hồi');
    const badgeClass = isConf ? 'badge-success' : (isDone ? 'badge-indigo' : 'badge-warning');
    const displayName = b.name || b.customer || 'Khách Đặt Bàn';
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
        <td><span class="badge badge-indigo">${b.area || 'Sảnh Tiêu Chuẩn'}</span></td>
        <td style="max-width: 240px; font-size: 0.85rem; color: var(--text-secondary);">${b.preOrder || 'Không gọi trước'}</td>
        <td>
          <span class="badge ${badgeClass}">${statusLabel}</span>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="cycleBookingStatus('${b.id}')" title="Chuyển trạng thái">
              Đổi Trạng Thái ⇄
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
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-brand-red); text-transform: uppercase; letter-spacing: 0.05em;">MÔ HÌNH NHƯỢNG QUYỀN</span>
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
            ✏️ Điều Chỉnh Thông Tin Gói Này
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
            ${lead.status === 'meeting' ? 'Đã Hẹn Gặp' : (lead.status === 'contacted' ? 'Đã Gọi Điện' : 'Mới Đăng Ký')}
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
        <td><span class="badge badge-success">Đang Tuyển</span></td>
        <td style="text-align: right;">
          <button class="btn btn-outline btn-sm" onclick="editJobSalary('${j.id}')">Sửa Lương</button>
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
            ${c.status === 'hired' ? '✔ Đã Trúng Tuyển' : (c.status === 'interview' ? '📅 Đang Phỏng Vấn' : '📩 Mới Nhận')}
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
          ${b.status === 'upcoming' ? '⏳ Sắp Khai Trương' : '✔ Đang Hoạt Động'}
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
    if (title) title.textContent = `Chỉnh Sửa: ${b.shortName || b.name}`;
    if (idInput) idInput.value = b.id;
    document.getElementById('modalBranchName').value = b.name || '';
    document.getElementById('modalBranchShortName').value = b.shortName || '';
    document.getElementById('modalBranchAddress').value = b.address || '';
    document.getElementById('modalBranchPhone').value = b.phone || '';
    document.getElementById('modalBranchHours').value = b.hours || '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)';
    document.getElementById('modalBranchScale').value = b.scale || '';
    document.getElementById('modalBranchStatus').value = b.status || 'active';
  } else {
    if (title) title.textContent = 'Thêm Cơ Sở Chi Nhánh Mới';
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

// ==================== SYNC TO LIVE WEBSITE ====================
function syncDataToLiveWebsite() {
  localStorage.setItem('tongwei_dishes', JSON.stringify(adminState.dishes));
  localStorage.setItem('tongwei_events', JSON.stringify(adminState.events));
  localStorage.setItem('tongwei_photos', JSON.stringify(adminState.photos));
  localStorage.setItem('tongwei_bookings', JSON.stringify(adminState.bookings));
  localStorage.setItem('tongwei_branches', JSON.stringify(adminState.branches));
  localStorage.setItem('tongwei_franchise_packages', JSON.stringify(adminState.franchisePackages));
  showToast(`🚀 Đã đồng bộ toàn bộ dữ liệu (Món ăn, Cơ sở, Gói nhượng quyền, Đặt bàn) sang Website khách hàng! Bấm "Xem Trang Chủ" để kiểm tra.`);
}

window.syncDataToLiveWebsite = syncDataToLiveWebsite;

// ==================== EVENT LISTENERS & SETUP ====================
document.addEventListener('DOMContentLoaded', () => {
  initializeData();

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
