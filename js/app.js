/**
 * TONGWEI RESTAURANT & FRANCHISE JAVASCRIPT APPLICATION
 * Official Cantonese Flavours - Handcrafted by Antigravity Web Team
 */

// Global State
const state = {
  dishes: [],
  filteredDishes: [],
  currentCategory: 'all',
  searchQuery: '',
  isMenuExpanded: false,
  lookbookCategory: 'all',
  isLookbookExpanded: false,
  currentAlbumIndex: 0,
  cart: [],
  selectedDish: null
};

// Master 25 Concept Photos Data
const masterAlbum = [
  {
    "id": 1,
    "src": "assets/images/concept/concept_1.jpg",
    "title": "Bộ Sưu Tập Thức Uống Nhiệt Đới",
    "category": "drinks",
    "categoryName": "Thức Uống",
    "desc": "Các dòng nước thanh mát kết hợp lá dứa non, dưa lưới mọng nước và chanh vàng thanh nhiệt giải khát trọn vẹn."
  },
  {
    "id": 2,
    "src": "assets/images/concept/concept_2.jpg",
    "title": "Văn Hóa Cố Sự & Bàn Mạt Chược",
    "category": "banquet",
    "categoryName": "Văn Hóa & Không Gian",
    "desc": "Nét sinh hoạt hoài niệm tao nhã, nơi thực khách vừa thưởng vị dimsum nóng vừa thư giãn bên bàn mạt chược truyền thống."
  },
  {
    "id": 3,
    "src": "assets/images/concept/concept_3.jpg",
    "title": "Mâm Cơm Quảng Đông & Trà Đạo",
    "category": "banquet",
    "categoryName": "Bàn Tiệc Đại Yến",
    "desc": "Bàn ăn chuẩn vị gia đình với các món xào lửa lớn, thịt nướng xá xíu thơm ngát và ấm trà thảo mộc ấm lòng."
  },
  {
    "id": 4,
    "src": "assets/images/concept/concept_4.jpg",
    "title": "Đại Tiệc Sum Vầy Gia Tộc",
    "category": "banquet",
    "categoryName": "Bàn Tiệc Đại Yến",
    "desc": "Bố trí bàn tiệc tròn hoành tráng với thịt nướng mật ong, xiên nướng thơm lừng và các món khai vị cung đình."
  },
  {
    "id": 5,
    "src": "assets/images/concept/concept_5.jpg",
    "title": "Thịt Nướng Xá Xíu & Trà Cổ Thụ",
    "category": "bbq",
    "categoryName": "Món Quay & Nướng",
    "desc": "Thịt nướng xém cạnh mật ong rừng chấm cùng tương ngọt đặc chế, nhấp ngụm trà Thiết Quan Âm lưu lại dư vị tao nhã."
  },
  {
    "id": 6,
    "src": "assets/images/concept/concept_6.jpg",
    "title": "Bàn Tiệc Cơm Chiên Hoàng Kim & Canh Tiềm",
    "category": "banquet",
    "categoryName": "Bàn Tiệc Đại Yến",
    "desc": "Thố cơm chiên giòn rụm kết hợp quạt cổ trang trí và nồi súp tiềm dưỡng nhan ninh cách thủy 4 tiếng đồng hồ."
  },
  {
    "id": 7,
    "src": "assets/images/concept/concept_7.jpg",
    "title": "Tháp Xửng Dimsum Trúc Bốc Khói",
    "category": "dimsum",
    "categoryName": "Dimsum Nghệ Nhân",
    "desc": "Há cảo tôm sò điệp trong suốt, xíu mại tôm thịt gạch cua và bánh bao kim sa nóng hổi nghi ngút khói thơm."
  },
  {
    "id": 8,
    "src": "assets/images/concept/concept_8.jpg",
    "title": "Set Điểm Tâm Sáng & Súp Khai Vị",
    "category": "dimsum",
    "categoryName": "Dimsum Nghệ Nhân",
    "desc": "Nét đẹp văn hóa 'ẩm thực thán trà' trứ danh của xứ Cảng Thơm, mở đầu ngày mới ngập tràn năng lượng tích cực."
  },
  {
    "id": 9,
    "src": "assets/images/concept/concept_9.jpg",
    "title": "Bánh Bao Đào Tiên Trường Thọ",
    "category": "dimsum",
    "categoryName": "Dimsum Nghệ Nhân",
    "desc": "Tác phẩm thủ công nặn tay cầu kỳ mang sắc hồng đào tiên, nhân hạt sen ngọt thanh biểu trưng cho phúc lộc dồi dào."
  },
  {
    "id": 10,
    "src": "assets/images/concept/concept_10.jpg",
    "title": "Đại Tiệc Hội Nghị & Tiệc Cưới",
    "category": "banquet",
    "categoryName": "Bàn Tiệc Đại Yến",
    "desc": "Không gian bài trí trang nhã chuẩn mực phục vụ các buổi họp mặt đối tác quan trọng và tiệc mừng gia đình."
  },
  {
    "id": 11,
    "src": "assets/images/concept/concept_11.jpg",
    "title": "Mỹ Vị Nướng Quay & Dimsum Đầy Đủ",
    "category": "bbq",
    "categoryName": "Món Quay & Nướng",
    "desc": "Mâm tiệc đại yến hội tụ tinh hoa: vịt quay da giòn, sườn xá xíu bóng bẩy cùng xửng dimsum tươi ngon mỗi ngày."
  },
  {
    "id": 12,
    "src": "assets/images/concept/concept_12.jpg",
    "title": "Bàn Tiệc Toàn Bích 12 Món Mỹ Vị",
    "category": "banquet",
    "categoryName": "Bàn Tiệc Đại Yến",
    "desc": "Sự cân bằng hoàn hảo giữa âm dương ngũ hành trong ẩm thực Quảng Đông đương đại."
  },
  {
    "id": 13,
    "src": "assets/images/concept/concept_13.jpg",
    "title": "Súp Bí Đỏ Hạt Sen Hoàng Kim",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Chất súp sánh mịn óng ánh vàng, vị ngọt tự nhiên từ bí đỏ hữu cơ kết hợp hạt sen ninh nhừ bổ dưỡng."
  },
  {
    "id": 14,
    "src": "assets/images/concept/concept_14.jpg",
    "title": "Mộc Nhĩ Đen Ngâm Chua Ngọt",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Món khai vị giòn sần sật thanh mát được ngâm cùng giấm đen lâu năm và ớt cay nhẹ kích thích trọn vẹn vị giác."
  },
  {
    "id": 15,
    "src": "assets/images/concept/concept_15.jpg",
    "title": "Cánh Vịt Tiềm Cay Thảo Mộc",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Thấm đẫm 12 vị thảo mộc cùng ớt khô Tứ Xuyên, màu cánh gián hấp dẫn, thơm lừng cay dịu."
  },
  {
    "id": 16,
    "src": "assets/images/concept/concept_16.jpg",
    "title": "Cổ Vịt Rút Xương Sốt Tiềm Đậm Đà",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Món nhắm ẩm thực truyền thống với thớ thịt săn chắc, gia vị ngấm sâu đến từng thớ thịt."
  },
  {
    "id": 17,
    "src": "assets/images/concept/concept_17.jpg",
    "title": "Đậu Hũ Non Trứng Bắc Thảo Sốt Cay",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Sự hòa quyện tuyệt vời giữa đậu hũ non mát lành và trứng bắc thảo bùi béo ngậy sốt ớt gừng thanh vị."
  },
  {
    "id": 18,
    "src": "assets/images/concept/concept_18.jpg",
    "title": "Đặc Sản Trứng Bắc Thảo Ngũ Vị",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Món ăn thanh lọc vị giác kinh điển không thể thiếu trong các bữa tiệc Quảng Đông sang trọng."
  },
  {
    "id": 19,
    "src": "assets/images/concept/concept_19.jpg",
    "title": "Món Tiềm Cay Cổ Truyền",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Nước sốt tương già sánh bóng thơm ngào ngạt, kích thích khứu giác ngay từ cái nhìn đầu tiên."
  },
  {
    "id": 20,
    "src": "assets/images/concept/concept_20.jpg",
    "title": "Bộ Đôi Khai Vị Thanh Nhã",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Bàn tiệc khởi đầu đầy duyên dáng với món nguội truyền thống chuẩn phong vị Quảng Đông."
  },
  {
    "id": 21,
    "src": "assets/images/concept/concept_21.jpg",
    "title": "Súp Dưỡng Nhan Thảo Mộc Cung Đình",
    "category": "appetizer",
    "categoryName": "Khai Vị & Dưỡng Sinh",
    "desc": "Món canh bồi bổ nguyên khí, dưỡng ẩm làn da dành cho cả gia đình sau ngày dài bận rộn."
  },
  {
    "id": 22,
    "src": "assets/images/concept/concept_22.jpg",
    "title": "Đậu Que Xào Thịt Xá Xíu Bóng Bẩy",
    "category": "bbq",
    "categoryName": "Món Quay & Nướng",
    "desc": "Chảo lửa lớn khóa chặt độ giòn ngọt của đậu non, hòa quyện từng lát xá xíu thơm mùi than hồng."
  },
  {
    "id": 23,
    "src": "assets/images/concept/concept_23.jpg",
    "title": "Rau Củ Tươi Xào Tôm Khô Tàu Xì",
    "category": "bbq",
    "categoryName": "Món Quay & Nướng",
    "desc": "Hương vị đậm đà thơm ngát từ đậu tàu xì lên men tự nhiên và tôm khô biển sâu hảo hạng."
  },
  {
    "id": 24,
    "src": "assets/images/concept/concept_24.jpg",
    "title": "Thịt Xá Xíu Nướng Mật Ong Rừng",
    "category": "bbq",
    "categoryName": "Món Quay & Nướng",
    "desc": "Món nướng signature của TongWei: thịt ba chỉ rút sườn ướp mật ong hoa rừng nướng vàng ruộm óng ánh."
  },
  {
    "id": 25,
    "src": "assets/images/concept/concept_25.jpg",
    "title": "Xá Xíu Phủ Ớt Tươi & Hành Hoa",
    "category": "bbq",
    "categoryName": "Món Quay & Nướng",
    "desc": "Màu sắc rực rỡ mang ngụ ý sung túc phát tài, vị ngọt đậm đà khó cưỡng."
  }
];

// DOM Elements
const elements = {
  navbar: document.querySelector('.navbar'),
  mobileToggle: document.querySelector('.mobile-toggle'),
  navLinks: document.querySelector('.nav-links'),
  dishesGrid: document.getElementById('dishesGrid'),
  menuToggleWrap: document.getElementById('menuToggleWrap'),
  menuToggleBtn: document.getElementById('menuToggleBtn'),
  menuToggleIcon: document.getElementById('menuToggleIcon'),
  menuToggleText: document.getElementById('menuToggleText'),
  categoryTabs: document.getElementById('categoryTabs'),
  searchInput: document.getElementById('menuSearch'),
  lookbookGrid: document.getElementById('lookbookGrid'),
  lookbookTabs: document.getElementById('lookbookTabs'),
  toggleLookbookBtn: document.getElementById('toggleLookbookBtn'),
  cartBtn: document.getElementById('cartBtn'),
  cartBadge: document.getElementById('cartBadge'),
  cartModal: document.getElementById('cartModal'),
  cartItemsList: document.getElementById('cartItemsList'),
  cartTotal: document.getElementById('cartTotal'),
  dishModal: document.getElementById('dishModal'),
  dishModalBody: document.getElementById('dishModalBody'),
  eventModal: document.getElementById('eventModal'),
  eventModalBody: document.getElementById('eventModalBody'),
  bookingForm: document.getElementById('bookingForm'),
  franchiseForm: document.getElementById('franchiseForm'),
  careerModal: document.getElementById('careerModal'),
  careerForm: document.getElementById('careerForm'),
  targetJobInput: document.getElementById('targetJob'),
  toastContainer: document.getElementById('toastContainer'),
  // Lightbox
  lightboxModal: document.getElementById('lightboxModal'),
  lightboxImg: document.getElementById('lightboxImg'),
  lightboxCounter: document.getElementById('lightboxCounter'),
  lightboxCategory: document.getElementById('lightboxCategory'),
  lightboxCaption: document.getElementById('lightboxCaption'),
  lightboxDesc: document.getElementById('lightboxDesc'),
  // ROI Calculator
  seatSlider: document.getElementById('seatSlider'),
  seatVal: document.getElementById('seatVal'),
  spendSlider: document.getElementById('spendSlider'),
  spendVal: document.getElementById('spendVal'),
  turnoverSlider: document.getElementById('turnoverSlider'),
  turnoverVal: document.getElementById('turnoverVal'),
  roiRevenue: document.getElementById('roiRevenue'),
  roiProfit: document.getElementById('roiProfit'),
  roiPayback: document.getElementById('roiPayback')
};

// Format currency
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Show Toast
function showToast(message, type = 'success') {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="color: var(--color-brand-red); font-size: 1.2rem;">${type === 'success' ? '✔' : 'ℹ'}</span>
    <div>${message}</div>
  `;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// 1. Fetch & Initialize Dishes
async function initDishes() {
  try {
    // Check if manager updated dishes in localStorage via Admin Portal
    const localDishes = localStorage.getItem('tongwei_dishes');
    if (localDishes) {
      try {
        const parsed = JSON.parse(localDishes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.dishes = parsed;
          state.filteredDishes = state.dishes.filter(d => d.showOnHome !== false);
          renderDishes();
          return;
        }
      } catch (e) {
        console.warn('LocalStorage tongwei_dishes parse error, falling back to JSON file', e);
      }
    }
    const res = await fetch('data/dishes.json');
    if (!res.ok) throw new Error('Không thể tải menu');
    state.dishes = await res.json();
    // Cache original dishes in localStorage if not already set
    if (!localStorage.getItem('tongwei_dishes')) {
      localStorage.setItem('tongwei_dishes', JSON.stringify(state.dishes));
    }
    state.filteredDishes = state.dishes.filter(d => d.showOnHome !== false);
    renderDishes();
  } catch (err) {
    console.error('Lỗi nạp thực đơn:', err);
    if (elements.dishesGrid) {
      elements.dishesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <p style="color: var(--color-brand-red);">Đang cập nhật thực đơn tinh hoa...</p>
        </div>
      `;
    }
  }
}

// 2. Render Dishes Grid (Compact default: 8 dishes, Expand on click)
function renderDishes() {
  if (!elements.dishesGrid) return;
  const items = state.filteredDishes;

  if (items.length === 0) {
    elements.dishesGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🍽️</div>
        <h3 style="font-family: var(--font-heading); color: var(--color-indigo-dark); margin-bottom: 0.5rem;">Không tìm thấy món ăn phù hợp</h3>
        <p style="color: var(--color-text-secondary); font-size: 0.95rem;">Quý khách vui lòng thử tìm kiếm từ khóa khác hoặc chọn danh mục khác.</p>
      </div>
    `;
    if (elements.menuToggleWrap) elements.menuToggleWrap.style.display = 'none';
    return;
  }

  // Determine whether to limit to 8 items
  const shouldLimit = !state.isMenuExpanded && state.currentCategory === 'all' && !state.searchQuery.trim();
  const displayItems = shouldLimit ? items.slice(0, 8) : items;

  // Toggle button visibility & label
  if (elements.menuToggleWrap) {
    if (state.currentCategory === 'all' && !state.searchQuery.trim() && items.length > 8) {
      elements.menuToggleWrap.style.display = 'flex';
      if (elements.menuToggleText) {
        elements.menuToggleText.textContent = state.isMenuExpanded 
          ? 'Thu Gọn Thực Đơn (Hiện 8 Món Tiêu Biểu)' 
          : `Xem Toàn Bộ Thực Đơn (Còn ${items.length - 8} Món)`;
      }
      if (elements.menuToggleIcon) {
        elements.menuToggleIcon.textContent = state.isMenuExpanded ? '▴' : '▾';
      }
    } else {
      elements.menuToggleWrap.style.display = 'none';
    }
  }

  elements.dishesGrid.innerHTML = displayItems.map(dish => {
    const tagsHtml = (dish.tags || []).slice(0, 2).map((t, idx) => `
      <span class="dish-badge ${idx === 0 && dish.isSignature ? 'gold' : ''}">${t}</span>
    `).join('');

    return `
      <div class="dish-card" data-id="${dish.id}">
        <div class="dish-badge-wrap">
          ${tagsHtml}
        </div>
        <div class="dish-img-wrap" onclick="openDishDetail('${dish.id}')" style="cursor: pointer;">
          <img src="${dish.image}" alt="${dish.name}" class="dish-img" loading="lazy" onerror="this.onerror=null; this.src='assets/images/dishes/Bánh bao kim sa.png';">
        </div>
        <div class="dish-info">
          <div class="dish-chinese">${dish.chinese}</div>
          <h3 class="dish-name" onclick="openDishDetail('${dish.id}')" style="cursor: pointer;">${dish.name}</h3>
          <p class="dish-desc">${dish.description}</p>
          <div class="dish-footer">
            <div class="dish-price">${formatVND(dish.price)}</div>
            <div class="dish-actions">
              <button class="btn-detail" onclick="openDishDetail('${dish.id}')" title="Xem chi tiết">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button class="btn-add" onclick="addToCart('${dish.id}')">
                + Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Toggle Menu Expand/Collapse
window.toggleMenuExpand = function() {
  state.isMenuExpanded = !state.isMenuExpanded;
  renderDishes();
  if (!state.isMenuExpanded) {
    document.getElementById('thuc-don')?.scrollIntoView({ behavior: 'smooth' });
  }
};

// 3. Filter & Search Handlers
function filterDishes() {
  let result = state.dishes.filter(d => d.showOnHome !== false);

  if (state.currentCategory !== 'all') {
    result = result.filter(d => d.category === state.currentCategory);
  }

  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.chinese.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  state.filteredDishes = result;
  renderDishes();
}

// 4. Dish Detail Modal
window.openDishDetail = function(id) {
  const dish = state.dishes.find(d => d.id === id);
  if (!dish || !elements.dishModal || !elements.dishModalBody) return;

  const spicyIcon = dish.spicy > 0 
    ? `<span style="color: var(--color-brand-red); font-size: 0.9rem; font-weight: 700;">${'🌶️'.repeat(dish.spicy)} (Độ cay: ${dish.spicy}/3)</span>` 
    : `<span style="color: var(--color-indigo); font-size: 0.9rem; font-weight: 600;">🌱 Thanh đạm, chuẩn vị dưỡng sinh</span>`;

  elements.dishModalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <div style="background: radial-gradient(circle, rgba(29,61,116,0.06) 0%, transparent 70%); padding: 1.25rem; border-radius: var(--radius-xl);">
        <img src="${dish.image}" alt="${dish.name}" style="max-width: 220px; max-height: 200px; margin: 0 auto; filter: drop-shadow(0 15px 25px rgba(29,61,116,0.15));">
      </div>
    </div>
    <div style="color: var(--color-brand-red); font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; letter-spacing: 0.1em;">${dish.chinese}</div>
    <h2 style="font-family: var(--font-heading); font-size: 1.7rem; color: var(--color-indigo-dark); margin-bottom: 0.4rem;">${dish.name}</h2>
    <div style="display: flex; gap: 0.85rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap;">
      <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-brand-red);">${formatVND(dish.price)}</span>
      <span style="background: var(--color-bg-body); border: 1px solid var(--color-border); padding: 0.3rem 0.85rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; color: var(--color-indigo);">${dish.categoryName}</span>
      ${spicyIcon}
    </div>
    <p style="color: var(--color-text-secondary); line-height: 1.75; margin-bottom: 1.5rem; font-size: 0.95rem;">${dish.description}</p>
    
    <div style="background: var(--color-bg-body); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 1.75rem;">
      <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--color-indigo); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">Đặc sắc nghệ nhân TongWei</h4>
      <ul style="color: var(--color-text-secondary); font-size: 0.86rem; line-height: 1.65; list-style-type: disc; padding-left: 1.25rem;">
        <li>Nguyên liệu tuyển chọn tươi sống trực tiếp từ xưởng trung tâm đạt chuẩn HACCP & ISO 22000.</li>
        <li>Chế biến thủ công bởi đầu bếp dimsum kinh nghiệm trên 10 năm tại Hồng Kông & Quảng Đông.</li>
        <li>Phục vụ nóng hổi ngay khi ra lò, giữ trọn hương vị và dưỡng chất tự nhiên.</li>
      </ul>
    </div>

    <div style="display: flex; gap: 1rem;">
      <button class="btn btn-primary" style="flex: 1;" onclick="addToCart('${dish.id}'); closeModal('dishModal');">
        + Thêm vào thực đơn đặt bàn
      </button>
      <button class="btn btn-outline" onclick="closeModal('dishModal')">Đóng</button>
    </div>
  `;

  elements.dishModal.classList.add('active');
};

// 5. Cart Management
window.addToCart = function(id) {
  const dish = state.dishes.find(d => d.id === id);
  if (!dish) return;

  const existing = state.cart.find(item => item.dish.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ dish, quantity: 1 });
  }

  updateCartUI();
  showToast(`Đã thêm <b>${dish.name}</b> vào thực đơn chọn trước!`);
};

window.updateQuantity = function(id, delta) {
  const item = state.cart.find(it => it.dish.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(it => it.dish.id !== id);
    showToast(`Đã xóa món khỏi thực đơn.`);
  }

  updateCartUI();
};

function updateCartUI() {
  const totalCount = state.cart.reduce((sum, it) => sum + it.quantity, 0);
  const totalPrice = state.cart.reduce((sum, it) => sum + (it.dish.price * it.quantity), 0);

  if (elements.cartBadge) {
    elements.cartBadge.textContent = totalCount;
    elements.cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  if (elements.cartTotal) {
    elements.cartTotal.textContent = formatVND(totalPrice);
  }

  if (elements.cartItemsList) {
    if (state.cart.length === 0) {
      elements.cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🥢</div>
          <p>Thực đơn đặt trước hiện đang trống.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--color-brand-red);">Quý khách hãy thêm các món yêu thích vào đây!</p>
        </div>
      `;
    } else {
      elements.cartItemsList.innerHTML = state.cart.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--color-border-subtle); gap: 0.85rem;">
          <img src="${item.dish.image}" alt="${item.dish.name}" style="width: 46px; height: 46px; object-fit: contain; flex-shrink: 0;">
          <div style="flex: 1;">
            <div style="font-weight: 700; color: var(--color-indigo-dark); font-size: 0.92rem;">${item.dish.name}</div>
            <div style="color: var(--color-brand-red); font-weight: 700; font-size: 0.85rem;">${formatVND(item.dish.price)}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--color-bg-body); border: 1px solid var(--color-border); padding: 0.2rem 0.55rem; border-radius: var(--radius-full);">
            <button onclick="updateQuantity('${item.dish.id}', -1)" style="color: var(--color-brand-red); width: 22px; font-weight: 800; cursor: pointer;">-</button>
            <span style="font-size: 0.88rem; font-weight: 700; color: var(--color-indigo); min-width: 16px; text-align: center;">${item.quantity}</span>
            <button onclick="updateQuantity('${item.dish.id}', 1)" style="color: var(--color-indigo); width: 22px; font-weight: 800; cursor: pointer;">+</button>
          </div>
        </div>
      `).join('');
    }
  }
}

// 6. Lookbook Grid & Master Album
function renderLookbookGrid() {
  if (!elements.lookbookGrid) return;

  let filtered = masterAlbum;
  if (state.lookbookCategory !== 'all') {
    filtered = masterAlbum.filter(item => item.category === state.lookbookCategory);
  }

  // Limit to 8 items unless expanded
  const displayCount = state.isLookbookExpanded ? filtered.length : Math.min(8, filtered.length);
  const itemsToShow = filtered.slice(0, displayCount);

  elements.lookbookGrid.innerHTML = itemsToShow.map(item => {
    const originalIndex = masterAlbum.findIndex(it => it.id === item.id);
    return `
      <div class="lookbook-item" onclick="openMasterAlbum(${originalIndex})">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="lookbook-overlay">
          <span class="lookbook-tag">${item.categoryName}</span>
          <h4 class="lookbook-title">${item.title}</h4>
        </div>
      </div>
    `;
  }).join('');

  if (elements.toggleLookbookBtn) {
    const remaining = filtered.length - displayCount;
    if (filtered.length <= 8) {
      elements.toggleLookbookBtn.style.display = 'none';
    } else {
      elements.toggleLookbookBtn.style.display = 'inline-flex';
      const icon = document.getElementById('lbToggleIcon');
      const text = document.getElementById('lbToggleText');
      if (text) text.textContent = state.isLookbookExpanded ? 'Thu Gọn Ảnh Trên Trang' : `Xem Thêm ${remaining} Ảnh`;
      if (icon) icon.textContent = state.isLookbookExpanded ? '▴' : '▾';
    }
  }
}

window.toggleLookbookExpand = function() {
  state.isLookbookExpanded = !state.isLookbookExpanded;
  renderLookbookGrid();
};

// 7. Master Lightbox Modal Slider (Full-Screen Carousel for all 25 images)
window.openMasterAlbum = function(index) {
  state.currentAlbumIndex = (index >= 0 && index < masterAlbum.length) ? index : 0;
  updateLightboxContent();
  if (elements.lightboxModal) elements.lightboxModal.classList.add('active');
};

function updateLightboxContent() {
  const item = masterAlbum[state.currentAlbumIndex];
  if (!item) return;

  if (elements.lightboxImg) elements.lightboxImg.src = item.src;
  if (elements.lightboxCounter) elements.lightboxCounter.textContent = `Ảnh ${state.currentAlbumIndex + 1} / ${masterAlbum.length}`;
  if (elements.lightboxCategory) elements.lightboxCategory.textContent = item.categoryName;
  if (elements.lightboxCaption) elements.lightboxCaption.textContent = item.title;
  if (elements.lightboxDesc) elements.lightboxDesc.textContent = item.desc;
}

window.prevAlbumPhoto = function() {
  state.currentAlbumIndex = (state.currentAlbumIndex - 1 + masterAlbum.length) % masterAlbum.length;
  updateLightboxContent();
};

window.nextAlbumPhoto = function() {
  state.currentAlbumIndex = (state.currentAlbumIndex + 1) % masterAlbum.length;
  updateLightboxContent();
};

window.closeLightbox = function(e) {
  if (e.target.id === 'lightboxModal') {
    elements.lightboxModal?.classList.remove('active');
  }
};

window.closeLightboxDirect = function() {
  elements.lightboxModal?.classList.remove('active');
};

// 8. Event Detail Modal
window.openEventDetail = function(eventId) {
  if (!elements.eventModal || !elements.eventModalBody) return;

  const eventData = {
    4: {
      title: 'Soft Opening TongWei Nguyễn Thị Thập — Tặng 01 Xửng Đại Long Bao Cho Mỗi Khách Hàng',
      date: '📅 15.10 – 30.10.2026 • 5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy, Hà Nội',
      img: 'assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg',
      content: `
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
      `
    },
    1: {
      title: 'Đại Tiệc Khai Trương TongWei Hà Nội — Mỹ Vị Quảng Đông Giao Hòa',
      date: '📅 15 Tháng 06, 2026 • Chi Nhánh Hà Nội',
      img: 'assets/images/concept/concept_12.jpg',
      content: `
        <p style="margin-bottom: 1rem; line-height: 1.7; color: var(--color-text-secondary);">
          TongWei hân hạnh chào đón quý thực khách đến với không gian ẩm thực Quảng Đông đương đại tại 68A Trần Hưng Đạo. Nhân dịp khai trương, toàn bộ chi nhánh áp dụng chương trình đặc biệt:
        </p>
        <ul style="margin-bottom: 1.5rem; line-height: 1.8; color: var(--color-indigo); padding-left: 1.25rem; font-weight: 600;">
          <li>🎁 Ưu đãi 20% trên tổng hóa đơn thực đơn dimsum và cá lăng.</li>
          <li>🥟 Tặng ngay 01 xửng Bánh Bao Kim Sa hoàng kim cho bàn đặt trước từ 4 khách.</li>
          <li>🍵 Thưởng trà Thiết Quan Âm hảo hạng hoàn toàn miễn phí suốt bữa tiệc.</li>
        </ul>
        <p style="font-size: 0.9rem; color: var(--color-text-muted);">
          * Chương trình áp dụng cho khách hàng đặt bàn online hoặc qua hotline trước 18h hàng ngày.
        </p>
      `
    },
    2: {
      title: 'Ra Mắt Bộ Sưu Tập Thức Uống Mùa Hè: Thanh Mát Dưỡng Nhan',
      date: '📅 01 Tháng 07, 2026 • Toàn Hệ Thống',
      img: 'assets/images/concept/concept_1.jpg',
      content: `
        <p style="margin-bottom: 1rem; line-height: 1.7; color: var(--color-text-secondary);">
          Đánh tan nắng hạ với dòng thức uống sáng tạo từ TongWei Bar. Sự hòa quyện của thảo mộc tự nhiên, dưa lưới và lá dứa non giúp cân bằng nhiệt độ cơ thể hoàn hảo sau khi thưởng thức các món xào lửa lớn hay thịt nướng.
        </p>
        <ul style="margin-bottom: 1.5rem; line-height: 1.8; color: var(--color-indigo); padding-left: 1.25rem; font-weight: 600;">
          <li>🍃 Trà Dưa Lưới Sương Sáo Lá Dứa: Ngọt dịu, thanh lọc cơ thể.</li>
          <li>🍋 Nước Chanh Vàng Mật Ong Dưỡng Nhan: Dồi dào vitamin C tự nhiên.</li>
          <li>🍹 Đồng Vị Trái Cây Nhiệt Đới: Tươi mát, tràn đầy sảng khoái.</li>
        </ul>
      `
    },
    3: {
      title: 'Đêm Tiệc Thưởng Vị & Giao Lưu Mạt Chược Truyền Thống',
      date: '📅 Thứ 6 & Thứ 7 Hàng Tuần • Phòng VIP Cố Sự',
      img: 'assets/images/concept/concept_2.jpg',
      content: `
        <p style="margin-bottom: 1rem; line-height: 1.7; color: var(--color-text-secondary);">
          Tái hiện không gian tụ hội phong lưu của các danh gia Quảng Đông xưa. Thưởng thức các món dimsum nóng sốt tại bàn, nhấp chén trà ấm và cùng bạn bè, đối tác so tài trên bàn mạt chược gỗ quý.
        </p>
        <ul style="margin-bottom: 1.5rem; line-height: 1.8; color: var(--color-indigo); padding-left: 1.25rem; font-weight: 600;">
          <li>🀄 Bàn mạt chược tiêu chuẩn được trang bị miễn phí trong phòng VIP.</li>
          <li>🥢 Set ẩm thực 'Cố Sự Thượng Phẩm' phục vụ riêng từng hiệp đấu.</li>
          <li>🔒 Không gian riêng tư cách âm tuyệt đối cho 8 - 14 khách.</li>
        </ul>
      `
    }
  };

  const evt = eventData[eventId];
  if (!evt) return;

  elements.eventModalBody.innerHTML = `
    <div style="border-radius: var(--radius-lg); overflow: hidden; height: 200px; margin-bottom: 1.25rem;">
      <img src="${evt.img}" alt="${evt.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div style="font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600; margin-bottom: 0.5rem;">${evt.date}</div>
    <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-indigo-dark); margin-bottom: 1rem;">${evt.title}</h2>
    ${evt.content}
    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
      <a href="#dat-ban" class="btn btn-primary" style="flex: 1; text-align: center;" onclick="closeModal('eventModal')">
        Đăng Ký Đặt Bàn Ngay
      </a>
      <button class="btn btn-outline" onclick="closeModal('eventModal')">Đóng</button>
    </div>
  `;

  elements.eventModal.classList.add('active');
};

// 9. Franchise Model Switching Tabs
window.switchFranchiseModel = function(modelId) {
  const grid = document.getElementById('franchiseModelsGrid');
  if (!grid) return;

  grid.className = `franchise-models-grid filter-${modelId}`;

  document.querySelectorAll('.fr-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick')?.includes(modelId)) {
      btn.classList.add('active');
    }
  });
};

// 10. Interactive ROI Calculator for Franchise
function calculateROI() {
  if (!elements.seatSlider || !elements.spendSlider || !elements.turnoverSlider) return;

  const seats = parseInt(elements.seatSlider.value, 10);
  const avgSpend = parseInt(elements.spendSlider.value, 10);
  const turnover = parseFloat(elements.turnoverSlider.value);

  // Update labels
  if (elements.seatVal) elements.seatVal.textContent = `${seats} Chỗ ngồi`;
  if (elements.spendVal) elements.spendVal.textContent = formatVND(avgSpend) + " / Khách";
  if (elements.turnoverVal) elements.turnoverVal.textContent = `${turnover.toFixed(1)} Lượt / Ngày`;

  // Daily revenue = seats * avgSpend * turnover
  const dailyRev = seats * avgSpend * turnover;
  const monthlyRev = dailyRev * 30;

  // Approx profit margin: ~24%
  const netMargin = 0.24;
  const monthlyProfit = monthlyRev * netMargin;

  const estInvestment = seats * 22000000;
  const paybackMonths = Math.max(7, Math.round(estInvestment / monthlyProfit));

  if (elements.roiRevenue) elements.roiRevenue.textContent = formatVND(monthlyRev);
  if (elements.roiProfit) elements.roiProfit.textContent = formatVND(monthlyProfit);
  if (elements.roiPayback) elements.roiPayback.textContent = `${paybackMonths} Tháng`;
}

// 11. Modal Helpers
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

// 12. Event Listeners Setup
function setupEventListeners() {
  // Category tabs for Menu
  if (elements.categoryTabs) {
    elements.categoryTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.dataset.category || 'all';
      filterDishes();
    });
  }

  // Lookbook tabs
  if (elements.lookbookTabs) {
    elements.lookbookTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.lb-tab');
      if (!btn) return;
      document.querySelectorAll('.lb-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lookbookCategory = btn.dataset.cat || 'all';
      state.isLookbookExpanded = false;
      renderLookbookGrid();
    });
  }

  // Search input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      filterDishes();
    });
  }

  // Cart modal trigger
  if (elements.cartBtn) {
    elements.cartBtn.addEventListener('click', () => {
      updateCartUI();
      openModal('cartModal');
    });
  }

  // Close modals on clicking overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Mobile menu toggle with aria-expanded and body scroll lock (RESP-02)
  if (elements.mobileToggle && elements.navLinks) {
    elements.mobileToggle.addEventListener('click', () => {
      const isOpened = elements.navLinks.classList.toggle('mobile-open');
      elements.mobileToggle.setAttribute('aria-expanded', isOpened ? 'true' : 'false');
      elements.mobileToggle.setAttribute('aria-label', isOpened ? 'Đóng menu' : 'Mở menu');
      document.body.style.overflow = isOpened ? 'hidden' : '';
    });
    // Close mobile menu when clicking a link
    elements.navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        elements.navLinks.classList.remove('mobile-open');
        elements.mobileToggle.setAttribute('aria-expanded', 'false');
        elements.mobileToggle.setAttribute('aria-label', 'Mở menu');
        document.body.style.overflow = '';
      });
    });
  }

  // Navbar scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      elements.navbar?.classList.add('scrolled');
    } else {
      elements.navbar?.classList.remove('scrolled');
    }
  });

  // Keyboard navigation & Global ESC Listener (UX-05, UX-06)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && elements.lightboxModal?.classList.contains('active')) {
      prevAlbumPhoto();
    }
    if (e.key === 'ArrowRight' && elements.lightboxModal?.classList.contains('active')) {
      nextAlbumPhoto();
    }
    if (e.key === 'Escape') {
      // Close lightbox
      if (elements.lightboxModal?.classList.contains('active')) {
        closeLightboxDirect();
      }
      // Close all modals
      closeModal('dishModal');
      closeModal('cartModal');
      closeModal('careerModal');
      closeModal('eventModal');
      // Close mobile menu if opened
      if (elements.navLinks?.classList.contains('mobile-open')) {
        elements.navLinks.classList.remove('mobile-open');
        elements.mobileToggle?.setAttribute('aria-expanded', 'false');
        elements.mobileToggle?.setAttribute('aria-label', 'Mở menu');
        document.body.style.overflow = '';
      }
    }
  });

  // ROI Calculator sliders
  if (elements.seatSlider) elements.seatSlider.addEventListener('input', calculateROI);
  if (elements.spendSlider) elements.spendSlider.addEventListener('input', calculateROI);
  if (elements.turnoverSlider) elements.turnoverSlider.addEventListener('input', calculateROI);

  // Booking Form Submission
  if (elements.bookingForm) {
    elements.bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName')?.value?.trim() || 'Khách đặt bàn';
      const phone = document.getElementById('bookPhone')?.value?.trim() || '';
      const guests = document.getElementById('bookGuests')?.value || '4 Khách';
      const date = document.getElementById('bookDate')?.value || '';
      const time = document.getElementById('bookTime')?.value || '';
      const branchVal = document.getElementById('bookBranch')?.value || 'Nhà Hàng TongWei - Cơ Sở Hoàn Kiếm';
      const areaVal = document.getElementById('bookArea')?.value || 'Sảnh Chính Nhà Hàng';

      // Persist to Admin Booking inbox in localStorage
      try {
        const bookings = JSON.parse(localStorage.getItem('tongwei_bookings') || '[]');
        const preOrderText = state.cart.length > 0 
          ? state.cart.map(i => `${i.dish.name} (x${i.quantity})`).join(', ') 
          : 'Gọi món trực tiếp tại bàn';
        bookings.unshift({
          id: 'BK-' + Date.now().toString().slice(-4),
          name: name,
          customer: name,
          phone: phone,
          date: date,
          time: time,
          guests: guests,
          branch: branchVal,
          area: areaVal,
          preOrder: preOrderText,
          status: 'pending'
        });
        localStorage.setItem('tongwei_bookings', JSON.stringify(bookings));
      } catch (err) {
        console.warn('Cannot persist booking to localStorage', err);
      }

      showToast(`Kính chào Quý khách <b>${name}</b>, TongWei đã tiếp nhận yêu cầu đặt bàn lúc ${time} ngày ${date} cho ${guests} tại ${branchVal.split(':')[0]}! Hotline cơ sở sẽ gọi xác nhận trong 5 phút.`, 'success');
      elements.bookingForm.reset();
      
      if (state.cart.length > 0) {
        showToast(`Đã đồng bộ ${state.cart.length} món ăn yêu thích vào hồ sơ đặt bàn của Quý khách!`, 'success');
      }
    });
  }

  // Franchise Form Submission
  if (elements.franchiseForm) {
    elements.franchiseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const partnerName = document.getElementById('franchiseName')?.value || '';
      const partnerPhone = document.getElementById('franchisePhone')?.value || '';
      const partnerCity = document.getElementById('franchiseCity')?.value || '';
      const budget = document.getElementById('franchiseBudget')?.value || '';
      const note = document.getElementById('franchiseNote')?.value || '';

      // Persist to Admin Franchise Leads in localStorage
      try {
        const leads = JSON.parse(localStorage.getItem('tongwei_franchise_leads') || '[]');
        leads.unshift({
          id: 'FR-' + Date.now().toString().slice(-4),
          partner: partnerName,
          phone: partnerPhone,
          city: partnerCity,
          budget: budget,
          note: note,
          date: new Date().toLocaleDateString('vi-VN'),
          status: 'new'
        });
        localStorage.setItem('tongwei_franchise_leads', JSON.stringify(leads));
      } catch (err) {
        console.warn('Cannot persist franchise lead to localStorage', err);
      }

      showToast(`Cảm ơn Quý đối tác <b>${partnerName}</b>! Chuyên gia phát triển nhượng quyền TongWei sẽ liên hệ số ${partnerPhone} và gửi Bộ Hồ Sơ Pháp Lý & Thẩm Định Thị Trường tại ${partnerCity} ngay hôm nay.`, 'success');
      elements.franchiseForm.reset();
    });
  }

  // Career Modal & Form
  window.openCareerApply = function(jobTitle) {
    if (elements.targetJobInput) elements.targetJobInput.value = jobTitle;
    openModal('careerModal');
  };

  if (elements.careerForm) {
    elements.careerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const candidateName = document.getElementById('candidateName')?.value || '';
      const candidatePhone = document.getElementById('candidatePhone')?.value || '';
      const candidateJob = elements.targetJobInput?.value || 'Nhân sự';
      const exp = document.getElementById('candidateExp')?.value || '';

      // Persist to Admin Candidate Inbox in localStorage
      try {
        const candidates = JSON.parse(localStorage.getItem('tongwei_candidates') || '[]');
        candidates.unshift({
          id: 'CD-' + Date.now().toString().slice(-4),
          name: candidateName,
          phone: candidatePhone,
          job: candidateJob,
          exp: exp,
          date: new Date().toLocaleDateString('vi-VN'),
          status: 'new'
        });
        localStorage.setItem('tongwei_candidates', JSON.stringify(candidates));
      } catch (err) {
        console.warn('Cannot persist candidate to localStorage', err);
      }

      showToast(`TongWei đã nhận được hồ sơ ứng tuyển vị trí <b>${candidateJob}</b> của <b>${candidateName}</b>. Phòng Nhân sự sẽ phản hồi lịch phỏng vấn qua số điện thoại của bạn!`, 'success');
      closeModal('careerModal');
      elements.careerForm.reset();
    });
  }
}

// Pass pre-ordered dishes to table booking
window.proceedToBookingWithCart = function() {
  closeModal('cartModal');
  const targetSection = document.getElementById('dat-ban');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
    const notesInput = document.getElementById('bookNotes');
    if (notesInput && state.cart.length > 0) {
      const itemsSummary = state.cart.map(it => `${it.dish.name} (x${it.quantity})`).join(', ');
      notesInput.value = `[Thực đơn gọi trước]: ${itemsSummary}`;
    }
  }
};

// Render Branches dynamically from localStorage (tongwei_branches)
function renderBranches() {
  const container = document.getElementById('branchesContainer');
  const select = document.getElementById('bookBranch');
  const stored = localStorage.getItem('tongwei_branches');
  let branches = [];
  if (stored) {
    try {
      branches = JSON.parse(stored);
    } catch (e) {}
  }
  if (!branches || branches.length === 0) {
    branches = [
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
    ];
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
  }

  // Populate Select Dropdown in Booking Form
  if (select) {
    select.innerHTML = branches.map(b => `
      <option value="${b.name}">
        ${b.name} (${b.address.split(',')[0]}) ${b.status === 'upcoming' ? ' - [Sắp khai trương]' : ''}
      </option>
    `).join('');
  }

  // Populate Branches Cards on main website
  if (container) {
    container.innerHTML = `
      ${branches.map(b => `
        <div class="branch-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h4 style="margin: 0; color: var(--color-indigo-dark);">${b.name}</h4>
            <span style="background: ${b.status === 'upcoming' ? 'rgba(217,119,6,0.1)' : 'rgba(22,163,74,0.1)'}; color: ${b.status === 'upcoming' ? '#d97706' : '#16a34a'}; border: 1px solid currentColor; font-size: 0.72rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: var(--radius-full); white-space: nowrap;">
              ${b.status === 'upcoming' ? '⏳ Sắp Khai Trương' : '✔ Đang Hoạt Động'}
            </span>
          </div>
          <div class="branch-detail">
            <span>📍</span>
            <span>${b.address}</span>
          </div>
          <div class="branch-detail">
            <span>📞</span>
            <span>Hotline Đặt Bàn: <b style="color: var(--color-brand-red);">${b.phone}</b></span>
          </div>
          <div class="branch-detail">
            <span>⏰</span>
            <span>Giờ phục vụ: ${b.hours}</span>
          </div>
          ${b.scale ? `<div class="branch-detail" style="font-size: 0.85rem; color: var(--color-text-secondary);"><span>🏛️</span><span>${b.scale}</span></div>` : ''}
        </div>
      `).join('')}

      <div class="branch-card" style="background: rgba(29, 61, 116, 0.03); border: 1.5px dashed var(--color-indigo);">
        <h4>Xưởng Chế Biến Trung Tâm HACCP & ISO 22000</h4>
        <div class="branch-detail">
          <span>🏭</span>
          <span>Cụm Công Nghiệp Thực Phẩm Sạch Hà Nội</span>
        </div>
        <div class="branch-detail">
          <span>📦</span>
          <span>Cung ứng 28+ sản phẩm cấp đông IQF -40°C cho toàn hệ thống</span>
        </div>
        <div class="branch-detail">
          <span>🤝</span>
          <span>Phòng Cung Ứng & Hợp Tác Sỉ: <b style="color: var(--color-indigo);">0912 888 999</b></span>
        </div>
      </div>

      <div style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--color-border);">
        <img src="assets/images/branding/fb_cover_banner.png" alt="TongWei Brand Cover" style="width: 100%; height: 160px; object-fit: cover;">
      </div>
    `;
  }
}

// Render Franchise Packages dynamically from localStorage (tongwei_franchise_packages)
function renderFranchisePackages() {
  const grid = document.getElementById('franchiseModelsGrid');
  if (!grid) return;
  const stored = localStorage.getItem('tongwei_franchise_packages');
  if (!stored) return;
  try {
    const packages = JSON.parse(stored);
    if (!Array.isArray(packages) || packages.length === 0) return;
    grid.innerHTML = packages.map(pkg => {
      const isStandard = pkg.id === 'standard';
      const perksArr = Array.isArray(pkg.perks) 
        ? pkg.perks 
        : (typeof pkg.perks === 'string' ? pkg.perks.split('\n').filter(Boolean) : []);

      return `
        <div class="model-card ${isStandard ? 'featured' : ''}" id="modelCard${pkg.id.charAt(0).toUpperCase() + pkg.id.slice(1)}">
          ${pkg.badge ? `<div class="model-ribbon">${pkg.badge}</div>` : ''}
          <div class="model-header">
            <h3 class="model-name">${pkg.name}</h3>
            <div class="model-scale">${pkg.scale || ''}</div>
            <div class="model-investment">${pkg.cost} <span>${pkg.costSub || '/ trọn gói'}</span></div>
          </div>
          <div class="model-perks">
            ${perksArr.map(p => `
              <div class="perk-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>
          <a href="#franchiseForm" class="btn ${isStandard ? 'btn-primary' : 'btn-outline'}" style="width: 100%;">
            Đăng Ký Gói ${pkg.name.replace('TongWei ', '')}
          </a>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.error(e);
  }
}

// Cross-tab real-time sync with Admin CMS
window.addEventListener('storage', (e) => {
  if (e.key === 'tongwei_dishes' && e.newValue) {
    try {
      state.dishes = JSON.parse(e.newValue);
      filterDishes();
      showToast('Thực đơn vừa được cập nhật từ hệ thống Quản Trị Viên TongWei!', 'success');
    } catch (err) {
      console.error(err);
    }
  }
  if (e.key === 'tongwei_branches' && e.newValue) {
    renderBranches();
    showToast('Danh sách chi nhánh vừa được cập nhật từ hệ thống Quản Trị!', 'info');
  }
  if (e.key === 'tongwei_franchise_packages' && e.newValue) {
    renderFranchisePackages();
    showToast('Chính sách nhượng quyền vừa được cập nhật từ hệ thống Quản Trị!', 'info');
  }
});

// ScrollSpy: Automatically highlight active navbar link on scroll
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinksList = document.querySelectorAll('.nav-links .nav-link');
  if (!sections.length || !navLinksList.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}
// Initialize everything on DOMContentLoaded

// ==================== LOAD LIVE EVENTS FROM D1 / LOCAL ====================
async function loadLiveEvents() {
  const eventsGrid = document.querySelector('#tin-tuc .events-grid');
  if (!eventsGrid) return;

  let events = [];
  try {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        events = data;
      }
    }
  } catch (e) {
    console.warn('API events fallback to local:', e);
  }

  if (!events || events.length === 0) {
    const local = localStorage.getItem('tongwei_events');
    if (local) {
      try { events = JSON.parse(local); } catch (e) {}
    }
  }

  if (events && events.length > 0) {
    const today = new Date().toISOString().split('T')[0];

    // Lọc sự kiện:
    // 1. Loại bỏ các sự kiện bị Admin ẩn thủ công (status === 'hidden')
    // 2. Nếu có ngày kết thúc (end_date) và hôm nay đã vượt quá ngày kết thúc -> Tự động ẩn!
    // 3. Nếu KHÔNG nhập ngày kết thúc (end_date để trống) -> LUÔN HIỂN THỊ!
    const visibleEvents = events.filter(ev => {
      if (ev.status === 'hidden') return false;
      if (ev.end_date && ev.end_date.trim() !== '') {
        if (today > ev.end_date.trim()) return false;
      }
      return true;
    });

    // Populate eventData object for modal
    visibleEvents.forEach(ev => {
      eventData[ev.id] = {
        title: ev.title,
        date: ev.date,
        img: ev.img,
        content: `
          <div style="background: rgba(226, 35, 41, 0.06); border-left: 4px solid var(--color-brand-red); padding: 0.85rem 1rem; border-radius: 4px; margin-bottom: 1.25rem;">
            <b style="color: var(--color-brand-red); font-size: 1.05rem;">🎉 ${ev.title}</b>
            <p style="margin-top: 0.25rem; font-size: 0.9rem; color: var(--color-text-secondary);">${ev.date}</p>
          </div>
          <p style="margin-bottom: 1rem; line-height: 1.7; color: var(--color-text-secondary);">
            ${ev.desc}
          </p>
          ${ev.detail ? `
            <div style="background: #fafafa; border: 1px solid var(--color-border); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-brand-red); margin-bottom: 0.6rem;">✨ CHI TIẾT CHƯƠNG TRÌNH & ĐÃI NGỘ:</h4>
              <div style="line-height: 1.8; font-size: 0.9rem; color: var(--color-text-primary); white-space: pre-line;">
                ${ev.detail}
              </div>
            </div>
          ` : ''}
          <div style="text-align: center; margin-top: 1.5rem;">
            <a href="#dat-ban" onclick="closeEventModal()" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 2rem; font-weight: 700;">
              <span>🏮</span> Đặt Bàn Ngay Để Nhận Ưu Đãi
            </a>
          </div>
        `
      };
    });

    // Render cards
    if (visibleEvents.length > 0) {
      eventsGrid.innerHTML = visibleEvents.map(ev => {
        const isFeatured = ev.id === 4 || (ev.badge && ev.badge.includes('Soft Opening'));
        const badgeStyle = isFeatured ? 'background: var(--color-brand-red); color: #fff;' : '';
        const cardStyle = isFeatured ? 'border: 2px solid var(--color-brand-red); box-shadow: var(--shadow-md);' : '';
        const titleStyle = isFeatured ? 'color: var(--color-brand-red);' : '';

        return `
          <div class="event-card ${isFeatured ? 'featured-event-card' : ''}" onclick="openEventDetail(${ev.id})" style="${cardStyle}">
            <div class="event-img-wrap" style="position: relative;">
              <img src="${ev.img}" alt="${ev.title}" class="event-img" loading="lazy">
              <span class="event-badge" style="${badgeStyle}">${ev.badge || 'Sự Kiện'}</span>
            </div>
            <div class="event-content">
              <div class="event-date">📅 ${ev.date}</div>
              <h3 class="event-title" style="${titleStyle}">${ev.title}</h3>
              <p class="event-desc">${ev.desc}</p>
              <span class="event-link" style="${titleStyle} font-weight: 700;">Xem Chi Tiết & Đặt Bàn Nhận Ưu Đãi ↗</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDishes();
  loadLiveEvents();
  renderLookbookGrid();
  renderBranches();
  renderFranchisePackages();
  setupEventListeners();
  setupScrollSpy();
  calculateROI();
});
