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
  lookbookCategory: 'space_hk',
  isLookbookExpanded: false,
  currentAlbumIndex: 0,
  cart: [],
  selectedDish: null
};

// Master Concept & Space Photos Data (35 Curated Photos)
// Master Real Space Photos Data (10 Curated Real Photos from TongWei Facebook)
const REAL_SPACE_PHOTOS = [
  // 1. Cơ Sở 1 • Hoàn Kiếm (6 ảnh thực tế chính xác tại 68A Trần Hưng Đạo)
  {
    id: 106,
    order: 1,
    src: 'assets/images/branches/hoan_kiem_fb_1.jpg',
    title: 'Đại Sảnh & Biển Đèn LED Nhận Diện (68A Trần Hưng Đạo)',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    branchName: 'Cơ Sở 1 - Hoàn Kiếm',
    desc: 'Không gian sảnh đón khách sang trọng với biển LED nhận diện thương hiệu TongWei tại 68A Trần Hưng Đạo.'
  },
  {
    id: 107,
    order: 2,
    src: 'assets/images/branches/hoan_kiem_fb_2.jpg',
    title: 'Quầy Dimsum Mái Ngói Xứ Cảng Thơm & Bếp Mở',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    branchName: 'Cơ Sở 1 - Hoàn Kiếm',
    desc: 'Quầy hấp dimsum kính với hàng trăm xửng trúc bốc khói nghi ngút và mái ngói xanh Cảng Thơm độc bản.'
  },
  {
    id: 108,
    order: 3,
    src: 'assets/images/branches/hoan_kiem_fb_3.jpg',
    title: 'Mặt Tiền & Không Gian Đón Khách 68A Trần Hưng Đạo',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    branchName: 'Cơ Sở 1 - Hoàn Kiếm',
    desc: 'Biển hiệu TongWei phong cách di sản rợp bóng cây xanh ngay tại mặt phố trung tâm quận Hoàn Kiếm.'
  },
  {
    id: 109,
    order: 4,
    src: 'assets/images/branches/hoan_kiem_fb_4.jpg',
    title: 'Góc Bàn Ăn Cửa Sổ View Phố Trần Hưng Đạo',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    branchName: 'Cơ Sở 1 - Hoàn Kiếm',
    desc: 'Không gian bàn ăn đôi và nhóm bạn bên ô cửa sổ vòm Pháp cổ kính nhìn ra đường phố rợp bóng mát.'
  },
  {
    id: 110,
    order: 5,
    src: 'assets/images/branches/hoan_kiem_fb_5.jpg',
    title: 'Bàn Tiệc Giao Hòa & Cuốn Menu Đồng Vị Hoàn Kiếm',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    branchName: 'Cơ Sở 1 - Hoàn Kiếm',
    desc: 'Không gian thưởng vị ấm cúng, bàn gỗ tự nhiên bài trí cuốn Menu Đồng Vị và gia vị truyền thống.'
  },
  {
    id: 111,
    order: 6,
    src: 'assets/images/branches/hoan_kiem_fb_6.jpg',
    title: 'Bếp Lửa Wok Lửa Lớn & Nghệ Thuật Ẩm Thực Quảng Đông',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    branchName: 'Cơ Sở 1 - Hoàn Kiếm',
    desc: 'Không gian khu bếp chuyên nghiệp với nghệ thuật lửa chảo Wok giữ trọn khí chảo tinh túy của món xào.'
  },

  // 2. Cơ Sở 2 • Nguyễn Thị Thập (5 ảnh thực tế tại 5N7A Nguyễn Thị Thập)
  {
    id: 101,
    order: 7,
    src: 'assets/images/branches/nguyen_thi_thap_fb_1.jpg',
    title: 'Mặt Tiền & Đại Sảnh Giao Hòa Mới (5N7A Nguyễn Thị Thập)',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    branchName: 'Cơ Sở 2 - Nguyễn Thị Thập',
    desc: 'Mặt tiền và không gian sảnh đón khách sang trọng, ấm cúng tại 5N7A Nguyễn Thị Thập, P. Yên Hoà, Cầu Giấy.'
  },
  {
    id: 102,
    order: 8,
    src: 'assets/images/branches/nguyen_thi_thap_fb_4.jpg',
    title: 'Phòng Ăn Sang Trọng Tone Gỗ Ấm',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    branchName: 'Cơ Sở 2 - Nguyễn Thị Thập',
    desc: 'Không gian phòng ăn sang trọng với tone gỗ ấm, ánh đèn vàng ấm áp chuẩn phong vị ẩm thực Quảng Đông.'
  },
  {
    id: 103,
    order: 9,
    src: 'assets/images/branches/nguyen_thi_thap_fb_2.jpg',
    title: 'Bàn Tiệc Sum Vầy Gia Đình Giao Hoà',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    branchName: 'Cơ Sở 2 - Nguyễn Thị Thập',
    desc: 'Bàn tiệc đại yến gia đình sum vầy, kết nối cảm xúc trọn vẹn bên các món ăn đậm đà chuẩn vị.'
  },
  {
    id: 104,
    order: 10,
    src: 'assets/images/branches/nguyen_thi_thap_fb_3.jpg',
    title: 'Góc Bàn Đôi Riêng Tư View Kính Phố',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    branchName: 'Cơ Sở 2 - Nguyễn Thị Thập',
    desc: 'Bàn ăn đôi lãng mạn, thoáng đãng với ô cửa kính view phố dành cho cặp đôi và bạn bè.'
  },
  {
    id: 105,
    order: 11,
    src: 'assets/images/branches/nguyen_thi_thap_fb_5.jpg',
    title: 'Góc Decor Mỹ Vị Giao Hoà & Đèn Lồng',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    branchName: 'Cơ Sở 2 - Nguyễn Thị Thập',
    desc: 'Họa tiết đèn lồng nghệ nhân và phong cách kiến trúc đặc trưng của thương hiệu Đồng Vị TongWei.'
  }
];

const DEFAULT_MASTER_ALBUM = [
  // 1. Cơ Sở 2 • Nguyễn Thị Thập (5 photos from official Facebook)
  {
    id: 101,
    order: 1,
    src: 'assets/images/branches/nguyen_thi_thap_fb_1.jpg',
    title: 'Không Gian Giao Hoà Mới — TongWei Nguyễn Thị Thập',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    desc: 'Mặt tiền và không gian đón khách trang nhã, ấm cúng tại 5N7A Nguyễn Thị Thập, P. Yên Hoà, Cầu Giấy.'
  },
  {
    id: 102,
    order: 2,
    src: 'assets/images/branches/nguyen_thi_thap_fb_4.jpg',
    title: 'Phòng Ăn Sang Trọng Tone Gỗ Ấm',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    desc: 'Không gian phòng ăn sang trọng với tone gỗ ấm, ánh đèn vàng ấm áp chuẩn phong vị ẩm thực Quảng Đông.'
  },
  {
    id: 103,
    order: 3,
    src: 'assets/images/branches/nguyen_thi_thap_fb_2.jpg',
    title: 'Bàn Tiệc Sum Vầy Giao Hoà',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    desc: 'Bàn tiệc đại yến gia đình sum vầy, kết nối cảm xúc trọn vẹn bên các món ăn đậm đà chuẩn vị.'
  },
  {
    id: 104,
    order: 4,
    src: 'assets/images/branches/nguyen_thi_thap_fb_3.jpg',
    title: 'Góc Bàn Đôi Riêng Tư View Kính',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    desc: 'Bàn ăn đôi lãng mạn, thoáng đãng với ô cửa kính view phố dành cho cặp đôi và bạn bè.'
  },
  {
    id: 105,
    order: 5,
    src: 'assets/images/branches/nguyen_thi_thap_fb_5.jpg',
    title: 'Góc Decor Mỹ Vị Giao Hoà',
    category: 'space_ntt',
    categoryName: '🏮 Cơ Sở Nguyễn Thị Thập',
    desc: 'Họa tiết đèn lồng nghệ nhân và phong cách kiến trúc đặc trưng của thương hiệu Đồng Vị TongWei.'
  },

  // 2. Cơ Sở 1 • Hoàn Kiếm (5 photos Flagship 68A Trần Hưng Đạo)
  {
    id: 106,
    order: 6,
    src: 'assets/images/branches/fb_tongwei_branch_2.png',
    title: 'Mặt Tiền & Đại Sảnh Flagship 68A Trần Hưng Đạo',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    desc: 'Không gian nhà hàng sang trọng, phòng VIP tiếp khách và hội nghị đẳng cấp tại trung tâm Hoàn Kiếm.'
  },
  {
    id: 107,
    order: 7,
    src: 'assets/images/branches/fb_tongwei_branch_1.jpg',
    title: 'Phòng Tiệc VIP Hoàng Kim',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    desc: 'Không gian phòng VIP cách âm riêng biệt với bàn tròn xoay phong cách hoàng gia Quảng Đông.'
  },
  {
    id: 108,
    order: 8,
    src: 'assets/images/branches/fb_tongwei_branch_13.jpg',
    title: 'Khu Bàn Ăn Gia Đình Hoàn Kiếm',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    desc: 'Thiết kế tao nhã mang đậm cảm hứng di sản, ánh đèn ấm áp cho bữa ăn sum vầy gia tộc.'
  },
  {
    id: 109,
    order: 9,
    src: 'assets/images/branches/fb_tongwei_branch_14.jpg',
    title: 'Sảnh Tiếp Đón & Quầy Trà Đạo',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    desc: 'Không gian sảnh tiếp đón trang trọng với nghệ thuật pha trà truyền thống xứ Cảng Thơm.'
  },
  {
    id: 110,
    order: 10,
    src: 'assets/images/branches/fb_tongwei_branch_15.jpg',
    title: 'Góc Thưởng Vị & Đèn Lồng Cổ Điển',
    category: 'space_hk',
    categoryName: '🏛️ Cơ Sở Hoàn Kiếm',
    desc: 'Kiến trúc hoa văn chạm khắc tinh xảo và ánh sáng đèn lồng ấm cúng chuẩn mực di sản Quảng Đông.'
  },

  // 3. Dimsum Nghệ Nhân
  {
    id: 7,
    order: 11,
    src: 'assets/images/concept/concept_7.jpg',
    title: 'Tháp Xửng Dimsum Trúc Bốc Khói',
    category: 'dimsum',
    categoryName: '🥢 Dimsum Nghệ Nhân',
    desc: 'Há cảo tôm sò điệp trong suốt, xíu mại tôm thịt gạch cua và bánh bao kim sa nóng hổi nghi ngút khói thơm.'
  },
  {
    id: 8,
    order: 12,
    src: 'assets/images/concept/concept_8.jpg',
    title: 'Set Điểm Tâm Sáng & Súp Khai Vị',
    category: 'dimsum',
    categoryName: '🥢 Dimsum Nghệ Nhân',
    desc: 'Nét đẹp văn hóa ẩm thực thán trà trứ danh của xứ Cảng Thơm, mở đầu ngày mới ngập tràn năng lượng tích cực.'
  },
  {
    id: 9,
    order: 13,
    src: 'assets/images/concept/concept_9.jpg',
    title: 'Bánh Bao Đào Tiên Trường Thọ',
    category: 'dimsum',
    categoryName: '🥢 Dimsum Nghệ Nhân',
    desc: 'Tác phẩm thủ công nặn tay cầu kỳ mang sắc hồng đào tiên, nhân hạt sen ngọt thanh biểu trưng cho phúc lộc dồi dào.'
  },

  // 4. Bàn Tiệc Đại Yến
  {
    id: 12,
    order: 14,
    src: 'assets/images/concept/concept_12.jpg',
    title: 'Bàn Tiệc Toàn Bích 12 Món Mỹ Vị',
    category: 'banquet',
    categoryName: '👑 Bàn Tiệc Đại Yến',
    desc: 'Sự cân bằng hoàn hảo giữa âm dương ngũ hành trong ẩm thực Quảng Đông đương đại.'
  },
  {
    id: 2,
    order: 15,
    src: 'assets/images/concept/concept_2.jpg',
    title: 'Văn Hóa Cố Sự & Bàn Mạt Chược',
    category: 'banquet',
    categoryName: '👑 Bàn Tiệc Đại Yến',
    desc: 'Nét sinh hoạt hoài niệm tao nhã bên bàn mạt chược truyền thống và trà thơm.'
  },
  {
    id: 3,
    order: 16,
    src: 'assets/images/concept/concept_3.jpg',
    title: 'Mâm Cơm Quảng Đông & Trà Đạo',
    category: 'banquet',
    categoryName: '👑 Bàn Tiệc Đại Yến',
    desc: 'Bàn ăn chuẩn vị gia đình với các món xào lửa lớn, thịt nướng xá xíu thơm ngát và trà thảo mộc ấm lòng.'
  },
  {
    id: 4,
    order: 17,
    src: 'assets/images/concept/concept_4.jpg',
    title: 'Đại Tiệc Sum Vầy Gia Tộc',
    category: 'banquet',
    categoryName: '👑 Bàn Tiệc Đại Yến',
    desc: 'Thịt nướng mật ong, xiên nướng than hoa và các món khai vị cung đình.'
  },
  {
    id: 6,
    order: 18,
    src: 'assets/images/concept/concept_6.jpg',
    title: 'Bàn Tiệc Cơm Chiên Hoàng Kim & Canh Tiềm',
    category: 'banquet',
    categoryName: '👑 Bàn Tiệc Đại Yến',
    desc: 'Thố cơm chiên tôm khô giòn rụm và canh tiềm thảo mộc cách thủy 4 tiếng đồng hồ.'
  },
  {
    id: 10,
    order: 19,
    src: 'assets/images/concept/concept_10.jpg',
    title: 'Đại Tiệc Hội Nghị & Tiệc Cưới',
    category: 'banquet',
    categoryName: '👑 Bàn Tiệc Đại Yến',
    desc: 'Bố trí bàn tiệc tròn hoành tráng phục vụ sự kiện thượng khách và hôn lễ sang trọng.'
  },

  // 5. Món Quay & Nướng
  {
    id: 24,
    order: 20,
    src: 'assets/images/concept/concept_24.jpg',
    title: 'Thịt Xá Xíu Nướng Mật Ong Rừng',
    category: 'bbq',
    categoryName: '🍗 Món Quay & Nướng',
    desc: 'Món signature của TongWei: thịt ba chỉ rút sườn nướng mật ong vàng ruộm óng ánh thơm phức.'
  },
  {
    id: 5,
    order: 21,
    src: 'assets/images/concept/concept_5.jpg',
    title: 'Thịt Nướng Xá Xíu & Trà Cổ Thụ',
    category: 'bbq',
    categoryName: '🍗 Món Quay & Nướng',
    desc: 'Lớp thịt nướng xém cạnh mật ong rừng chấm cùng tương ngọt đặc chế, nhấp ngụm trà Thiết Quan Âm.'
  },
  {
    id: 11,
    order: 22,
    src: 'assets/images/concept/concept_11.jpg',
    title: 'Mỹ Vị Nướng Quay & Dimsum Đầy Đủ',
    category: 'bbq',
    categoryName: '🍗 Món Quay & Nướng',
    desc: 'Vịt quay da giòn, sườn nướng mật ong và dimsum tươi mới đậm đà phong vị xứ Cảng.'
  },
  {
    id: 22,
    order: 23,
    src: 'assets/images/concept/concept_22.jpg',
    title: 'Đậu Que Xào Thịt Xá Xíu Bóng Bẩy',
    category: 'bbq',
    categoryName: '🍗 Món Quay & Nướng',
    desc: 'Chảo lửa lớn giữ trọn sắc xanh và độ giòn ngọt tự nhiên hòa quyện sốt xá xíu.'
  },
  {
    id: 23,
    order: 24,
    src: 'assets/images/concept/concept_23.jpg',
    title: 'Rau Củ Tươi Xào Tôm Khô Tàu Xì',
    category: 'bbq',
    categoryName: '🍗 Món Quay & Nướng',
    desc: 'Hương vị khí chảo đặc trưng thơm lừng từ đậu tàu xì lên men tự nhiên và tôm khô hảo hạng.'
  },
  {
    id: 25,
    order: 25,
    src: 'assets/images/concept/concept_25.jpg',
    title: 'Xá Xíu Phủ Ớt Tươi & Hành Hoa',
    category: 'bbq',
    categoryName: '🍗 Món Quay & Nướng',
    desc: 'Sắc đỏ mang lại may mắn, kích thích trọn vẹn vị giác thực khách với vị ngọt thơm đậm đà.'
  },

  // 6. Thức Uống
  {
    id: 1,
    order: 26,
    src: 'assets/images/concept/concept_1.jpg',
    title: 'Bộ Sưu Tập Thức Uống Nhiệt Đới',
    category: 'drinks',
    categoryName: '🍵 Thức Uống',
    desc: 'Các dòng nước thanh mát kết hợp lá dứa non, dưa lưới mọng nước và chanh vàng thanh nhiệt giải khát trọn vẹn.'
  },

  // 7. Khai Vị & Súp
  {
    id: 13,
    order: 27,
    src: 'assets/images/concept/concept_13.jpg',
    title: 'Súp Bí Đỏ Hạt Sen Hoàng Kim',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Chất súp sánh mịn óng ánh vàng, vị ngọt tự nhiên từ bí đỏ hữu cơ kết hợp hạt sen ninh nhừ bổ dưỡng.'
  },
  {
    id: 14,
    order: 28,
    src: 'assets/images/concept/concept_14.jpg',
    title: 'Mộc Nhĩ Đen Ngâm Chua Ngọt',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Món khai vị giòn sần sật thanh mát được ngâm cùng giấm đen lâu năm và ớt cay nhẹ kích thích trọn vẹn vị giác.'
  },
  {
    id: 15,
    order: 29,
    src: 'assets/images/concept/concept_15.jpg',
    title: 'Cánh Vịt Tiềm Cay Thảo Mộc',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Thấm đẫm 12 vị thảo mộc cùng ớt khô Tứ Xuyên, màu cánh gián hấp dẫn, thơm lừng cay dịu.'
  },
  {
    id: 16,
    order: 30,
    src: 'assets/images/concept/concept_16.jpg',
    title: 'Cổ Vịt Rút Xương Sốt Tiềm Đậm Đà',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Món nhắm ẩm thực truyền thống với thớ thịt săn chắc, gia vị ngấm sâu đến từng thớ thịt.'
  },
  {
    id: 17,
    order: 31,
    src: 'assets/images/concept/concept_17.jpg',
    title: 'Đậu Hũ Non Trứng Bắc Thảo Sốt Cay',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Sự hòa quyện tuyệt vời giữa đậu hũ non mát lành và trứng bắc thảo bùi béo ngậy sốt ớt gừng thanh vị.'
  },
  {
    id: 18,
    order: 32,
    src: 'assets/images/concept/concept_18.jpg',
    title: 'Đặc Sản Trứng Bắc Thảo Ngũ Vị',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Thanh lọc vị giác kinh điển trong bàn tiệc sang trọng chuẩn vị Hồng Kông.'
  },
  {
    id: 19,
    order: 33,
    src: 'assets/images/concept/concept_19.jpg',
    title: 'Món Tiềm Cay Cổ Truyền',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Màu hổ phách óng ánh từ tương già thượng phẩm lên men tự nhiên làm ấm lòng thực khách.'
  },
  {
    id: 20,
    order: 34,
    src: 'assets/images/concept/concept_20.jpg',
    title: 'Bộ Đôi Khai Vị Thanh Nhã',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Khởi đầu bữa tiệc thanh lịch chuẩn phong vị cố sự và trà đạo tao nhã.'
  },
  {
    id: 21,
    order: 35,
    src: 'assets/images/concept/concept_21.jpg',
    title: 'Súp Dưỡng Nhan Thảo Mộc Cung Đình',
    category: 'appetizer',
    categoryName: 'Khai Vị & Súp',
    desc: 'Món canh bồi bổ nguyên khí, dưỡng ẩm làn da dành riêng cho phái đẹp.'
  }
];

// Curated order for 'all' tab: balanced alternation of space and culinary creations
const curatedAllOrder = [
  101, // NTT 1 - Hero NTT
  7,   // Dimsum Tháp Xửng Dimsum Trúc Bốc Khói
  106, // HK 1 - Flagship 68A Trần Hưng Đạo
  12,  // Banquet Bàn Tiệc Toàn Bích 12 Món
  102, // NTT 2 - Phòng Ăn Gỗ Ấm Cúng
  24,  // BBQ Thịt Xá Xíu Nướng Mật Ong Rừng
  107, // HK 2 - Phòng Tiệc VIP Hoàng Kim
  1,   // Drinks Bộ Sưu Tập Thức Uống Nhiệt Đới
  103, // NTT 3 - Bàn Tiệc Sum Vầy
  8,   // Dimsum Điểm Tâm Sáng
  108, // HK 3 - Khu Bàn Ăn Gia Đình
  5,   // BBQ Thịt Nướng & Trà
  104, // NTT 4 - Góc Bàn Đôi View Kính
  9,   // Dimsum Bánh Bao Đào Tiên
  109, // HK 4 - Sảnh Tiếp Đón
  11,  // BBQ Mỹ Vị Nướng Quay
  105, // NTT 5 - Decor Đèn Lồng Mỹ Vị
  110, // HK 5 - Góc Thưởng Vị
  2, 3, 4, 6, 10, 22, 23, 25, 13, 14, 15, 16, 17, 18, 19, 20, 21
];

// Sort DEFAULT_MASTER_ALBUM according to curatedAllOrder
DEFAULT_MASTER_ALBUM.sort((a, b) => {
  const idxA = curatedAllOrder.indexOf(a.id);
  const idxB = curatedAllOrder.indexOf(b.id);
  return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
});

let masterAlbum = [...DEFAULT_MASTER_ALBUM];

// Sync with Admin Media Management (if modified in Admin Portal, sanitize Duy Tan)
try {
  const savedAdminPhotos = localStorage.getItem('tongwei_photos') || localStorage.getItem('tongwei_space_gallery');
  if (savedAdminPhotos) {
    const parsed = JSON.parse(savedAdminPhotos);
    if (Array.isArray(parsed) && parsed.length > 0) {
      masterAlbum = parsed.filter(it => it.category !== 'space_dt' && !(it.title && it.title.includes('Duy Tân')));
    }
  }
} catch (e) {
  console.warn('Fallback to DEFAULT_MASTER_ALBUM:', e);
}

// Hero Showcase Gallery Data (4 Masterpiece Photos)
const heroGalleryData = [
  {
    id: 'hero-1',
    src: 'assets/images/home/home_gallery_1.jpg',
    title: 'Xửng Dimsum Nghệ Nhân Bốc Khói',
    categoryName: 'Mỹ Vị Thủ Công',
    desc: 'Xửng dimsum nghệ nhân bốc khói nghi ngút mang dấu ấn thương hiệu TongWei, kết tinh tinh hoa ẩm thực Quảng Đông truyền thống với lớp vỏ mỏng dai và nhân tươi đậm đà.'
  },
  {
    id: 'hero-2',
    src: 'assets/images/home/home_gallery_2.jpg',
    title: 'Bàn Tiệc Đại Yến Toàn Bích 12 Món',
    categoryName: 'Bàn Tiệc Đại Yến',
    desc: 'Bàn tiệc đại yến toàn bích 12 món đặc sắc chuẩn vị Quảng Đông, giao thoa trọn vẹn giữa sắc – hương – vị và cảm xúc sum vầy ấm cúng gia đình.'
  },
  {
    id: 'hero-3',
    src: 'assets/images/home/home_gallery_3.jpg',
    title: 'Ngỗng Quay Triều Châu & Bàn Mạt Chược',
    categoryName: 'Món Quay & Cố Sự',
    desc: 'Ngỗng quay Triều Châu da giòn óng ả, cháo dưỡng sinh ngọt thanh bên bàn mạt chược văn hóa truyền thống tao nhã của người Quảng Đông.'
  },
  {
    id: 'hero-4',
    src: 'assets/images/home/home_gallery_4.jpg',
    title: 'Bộ Sưu Tập Đồ Uống Nhiệt Đới Thượng Phẩm',
    categoryName: 'Thức Uống Thượng Phẩm',
    desc: 'Bộ sưu tập thức uống nhiệt đới thượng phẩm thanh mát kết hợp thảo mộc thiên nhiên, thanh nhiệt và giải ngấy, tròn đầy mỹ vị bữa tiệc.'
  }
];

window.switchHeroImage = function(src, index) {
  state.currentHeroIndex = index;
  const mainImg = document.getElementById('heroMainImage');
  const tag = document.getElementById('heroImageTag');
  const caption = document.getElementById('heroImageCaption');
  const frame = document.getElementById('heroMainFrame');
  const data = heroGalleryData[index];

  if (mainImg && data) {
    mainImg.style.opacity = '0.3';
    setTimeout(() => {
      mainImg.src = data.src;
      mainImg.alt = data.title;
      mainImg.style.opacity = '1';
    }, 120);
  }
  if (tag && data) tag.textContent = data.categoryName;
  if (caption && data) caption.textContent = data.title;
  if (frame && data) frame.title = 'Xem ảnh ' + data.title + ' (Phóng to)';

  document.querySelectorAll('.hero-thumb-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });
};

window.openHeroLightbox = function() {
  const data = heroGalleryData[state.currentHeroIndex || 0];
  if (!data) return;
  state.isViewingMenuInLightbox = false;
  state.isViewingHeroInLightbox = true;
  state.currentHeroLightboxIndex = state.currentHeroIndex || 0;

  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const cat = document.getElementById('lightboxCategory');
  const caption = document.getElementById('lightboxCaption');
  const desc = document.getElementById('lightboxDesc');

  if (img) img.src = data.src;
  if (counter) counter.textContent = 'Hero Showcase ' + (state.currentHeroLightboxIndex + 1) + ' / ' + heroGalleryData.length;
  if (cat) cat.textContent = data.categoryName;
  if (caption) caption.textContent = data.title;
  if (desc) desc.textContent = data.desc;

  if (modal) modal.classList.add('active');
};

window.switchBranchPhoto = function(branchCode, src, caption, idx, btn) {
  const imgEl = document.getElementById('branchMainImg' + branchCode);
  const capEl = document.getElementById('branchCap' + branchCode);
  const mainWrap = imgEl ? imgEl.closest('.branch-gallery-main') : null;

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = src;
      imgEl.alt = caption;
      imgEl.style.opacity = '1';
    }, 120);
  }
  if (capEl) capEl.textContent = caption;
  if (mainWrap) {
    mainWrap.setAttribute('onclick', "openMasterAlbum('" + src + "')");
  }

  // Update active state in parent bar
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.branch-thumb-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
};

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

    <div class="modal-actions-row" style="display: flex; gap: 1rem;">
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

  // Space Gallery Data: Strictly Real Restaurant Spaces (5 for NTT, 5 for HK)
  let spacePhotos = [...REAL_SPACE_PHOTOS];

  // Try sync with admin space gallery if valid
  try {
    const saved = localStorage.getItem('tongwei_space_gallery') || localStorage.getItem('tongwei_photos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const spaceOnly = parsed.filter(it => 
          (it.category === 'space_ntt' || it.category === 'space_hk' || (it.src && (it.src.includes('nguyen_thi_thap') || it.src.includes('branch')))) &&
          it.category !== 'space_dt' && !(it.title && it.title.includes('Duy Tân'))
        );
        // Only use parsed if it has sufficient branch photos
        if (spaceOnly.length >= 8) {
          spacePhotos = spaceOnly;
        }
      }
    }
  } catch (e) {}

  // Update masterAlbum for Lightbox slider to strictly contain space photos
    // Ensure Hoan Kiem uses real photos
  spacePhotos = spacePhotos.map(it => {
    if (it.category === 'space_hk') {
      const match = REAL_SPACE_PHOTOS.find(r => r.id === it.id || r.src === it.src);
      return match || it;
    }
    return it;
  });
  if (!spacePhotos.some(it => it.src && it.src.includes('hoan_kiem_fb_1'))) {
    spacePhotos = REAL_SPACE_PHOTOS;
  }
  masterAlbum = spacePhotos;

  const cat = state.lookbookCategory || 'space_hk';
  let filtered = spacePhotos;

  if (cat === 'space_ntt') {
    filtered = spacePhotos.filter(it => it.category === 'space_ntt' || (it.src && it.src.includes('nguyen_thi_thap')));
    elements.lookbookGrid.className = 'lookbook-grid editorial-mosaic-ntt';
  } else if (cat === 'space_hk') {
    filtered = spacePhotos.filter(it => it.category === 'space_hk' || (it.src && !it.src.includes('nguyen_thi_thap')));
    elements.lookbookGrid.className = 'lookbook-grid editorial-mosaic-hk';
  } else {
    // 'all' - Show both branches in space-all-grid
    filtered = spacePhotos;
    elements.lookbookGrid.className = 'lookbook-grid space-all-grid';
  }

  // Ensure state.currentAlbumList points to filtered
  state.currentAlbumList = filtered;

  elements.lookbookGrid.innerHTML = filtered.map((item, index) => {
    let layoutClass = '';
    if (cat === 'space_ntt') {
      if (index === 0) layoutClass = 'mosaic-item-hero';
      else if (index === 1) layoutClass = 'mosaic-item-side mosaic-item-side-1';
      else if (index === 2) layoutClass = 'mosaic-item-side mosaic-item-side-2';
      else if (index === 3) layoutClass = 'mosaic-item-bottom mosaic-item-bottom-1';
      else if (index === 4) layoutClass = 'mosaic-item-bottom mosaic-item-bottom-2';
    } else if (cat === 'space_hk') {
      if (index === 0) layoutClass = 'mosaic-hk-hero';
      else if (index === 1) layoutClass = 'mosaic-hk-side-1';
      else if (index === 2) layoutClass = 'mosaic-hk-side-2';
      else if (index === 3) layoutClass = 'mosaic-hk-bottom-1';
      else if (index === 4) layoutClass = 'mosaic-hk-bottom-2';
    } else {
      // cat === 'all'
      if (index === 0) layoutClass = 'space-item-ntt-hero';
      else if (index === 1) layoutClass = 'space-item-ntt-side-1';
      else if (index === 2) layoutClass = 'space-item-ntt-side-2';
      else if (index === 3) layoutClass = 'space-item-ntt-bottom-1';
      else if (index === 4) layoutClass = 'space-item-ntt-bottom-2';
      else if (index === 5) layoutClass = 'space-item-hk-hero';
      else if (index === 6) layoutClass = 'space-item-hk-side-1';
      else if (index === 7) layoutClass = 'space-item-hk-side-2';
      else if (index === 8) layoutClass = 'space-item-hk-bottom-1';
      else if (index === 9) layoutClass = 'space-item-hk-bottom-2';
    }

    return `
      <div class="lookbook-item ${layoutClass}" onclick="openMasterAlbum(${index})" title="Xem ảnh phóng to: ${item.title}">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="lookbook-overlay">
          <div class="lookbook-overlay-top">
            <span class="lookbook-tag tag-gold">${item.categoryName}</span>
            <span class="lookbook-zoom-badge" title="Phóng to ảnh">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </span>
          </div>
          <div class="lookbook-overlay-bottom">
            <h4 class="lookbook-title">${item.title}</h4>
            ${item.desc ? `<p class="lookbook-desc-hint">${item.desc}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (elements.toggleLookbookBtn) {
    elements.toggleLookbookBtn.style.display = 'none'; // All 10 space photos always visible in full glory!
  }
}

window.toggleLookbookExpand = function() {
  state.isLookbookExpanded = !state.isLookbookExpanded;
  renderLookbookGrid();
};

// 7. Master Lightbox Modal Slider (Full-Screen Carousel for Gallery)
window.openMasterAlbum = function(target) {
  state.isViewingMenuInLightbox = false;
  state.isViewingHeroInLightbox = false;

  let activeList = masterAlbum;
  const currentCat = state.lookbookCategory || 'all';

  if (currentCat !== 'all') {
    const filtered = masterAlbum.filter(item => {
      if (currentCat === 'space_ntt') return item.category === 'space_ntt' || (item.src && item.src.includes('nguyen_thi_thap'));
      if (currentCat === 'space_hk') return item.category === 'space_hk' || (item.src && (item.src.includes('branch_1') || item.src.includes('branch_2') || item.src.includes('branch_13') || item.src.includes('branch_14') || item.src.includes('branch_15')));
      return item.category === currentCat;
    });
    if (filtered.length > 0) activeList = filtered;
  }
  state.currentAlbumList = activeList;

  let foundIndex = 0;
  if (typeof target === 'string') {
    const idx = activeList.findIndex(it => it.src && it.src.includes(target));
    if (idx !== -1) {
      foundIndex = idx;
    } else {
      const idxAll = masterAlbum.findIndex(it => it.src && it.src.includes(target));
      if (idxAll !== -1) {
        state.currentAlbumList = masterAlbum;
        foundIndex = idxAll;
      }
    }
  } else if (typeof target === 'number') {
    if (target >= 0 && target < activeList.length) {
      foundIndex = target;
    } else if (target >= 0 && target < masterAlbum.length) {
      state.currentAlbumList = masterAlbum;
      foundIndex = target;
    }
  }

  state.currentAlbumIndex = foundIndex;
  updateLightboxContent();
  if (elements.lightboxModal) elements.lightboxModal.classList.add('active');
};

function updateLightboxContent() {
  const list = state.currentAlbumList || masterAlbum;
  const item = list[state.currentAlbumIndex];
  if (!item) return;

  if (elements.lightboxImg) elements.lightboxImg.src = item.src;
  if (elements.lightboxCounter) elements.lightboxCounter.textContent = 'Ảnh ' + (state.currentAlbumIndex + 1) + ' / ' + list.length;
  if (elements.lightboxCategory) elements.lightboxCategory.textContent = item.categoryName;
  if (elements.lightboxCaption) elements.lightboxCaption.textContent = item.title;
  if (elements.lightboxDesc) elements.lightboxDesc.textContent = item.desc;
}

window.prevAlbumPhoto = function() {
  if (state.isViewingMenuInLightbox) {
    state.currentMenuLightboxIndex = (state.currentMenuLightboxIndex - 1 + menuPagesData.length) % menuPagesData.length;
    openMenuLightboxModal(state.currentMenuLightboxIndex);
    return;
  }
  if (state.isViewingHeroInLightbox) {
    state.currentHeroLightboxIndex = (state.currentHeroLightboxIndex - 1 + heroGalleryData.length) % heroGalleryData.length;
    switchHeroImage(heroGalleryData[state.currentHeroLightboxIndex].src, state.currentHeroLightboxIndex);
    openHeroLightbox();
    return;
  }
  const list = state.currentAlbumList || masterAlbum;
  state.currentAlbumIndex = (state.currentAlbumIndex - 1 + list.length) % list.length;
  updateLightboxContent();
};

window.nextAlbumPhoto = function() {
  if (state.isViewingMenuInLightbox) {
    state.currentMenuLightboxIndex = (state.currentMenuLightboxIndex + 1) % menuPagesData.length;
    openMenuLightboxModal(state.currentMenuLightboxIndex);
    return;
  }
  if (state.isViewingHeroInLightbox) {
    state.currentHeroLightboxIndex = (state.currentHeroLightboxIndex + 1) % heroGalleryData.length;
    switchHeroImage(heroGalleryData[state.currentHeroLightboxIndex].src, state.currentHeroLightboxIndex);
    openHeroLightbox();
    return;
  }
  const list = state.currentAlbumList || masterAlbum;
  state.currentAlbumIndex = (state.currentAlbumIndex + 1) % list.length;
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
    <div class="modal-actions-row" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
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

  // Initialize default booking date to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.min = `${yyyy}-${mm}-${dd}`;
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
    if (typeof showToast === 'function') {
      showToast('Vui lòng chọn cơ sở gần nhất và bấm gọi Hotline để đặt bàn ngay trong 1 phút!', 'info');
    }
  }
};

// Render Branches dynamically from localStorage (tongwei_branches) with interactive galleries
function renderBranches() {
  const container = document.getElementById('branchesContainer');
  const defaultBranches = [
    {
      id: 'CS-01',
      stt: 1,
      name: 'Nhà Hàng TongWei - Cơ Sở 1: Hoàn Kiếm (Flagship)',
      shortName: 'Cơ Sở 1 (Hoàn Kiếm)',
      address: '68A Trần Hưng Đạo, P. Cửa Nam, Hoàn Kiếm, Hà Nội',
      phone: '039 736 0228 / 0989 123 456',
      hours: '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)',
      scale: '180 Chỗ ngồi • 4 Phòng VIP Hoàng Kim',
      status: 'active'
    },
    {
      id: 'CS-02',
      stt: 2,
      name: 'Nhà Hàng TongWei - Cơ Sở 2: Nguyễn Thị Thập (Cầu Giấy)',
      shortName: 'Cơ Sở 2 (Nguyễn Thị Thập)',
      address: '5N7A Nguyễn Thị Thập, P. Yên Hoà, Cầu Giấy, Hà Nội',
      phone: '032 889 5693 / 0986 688 866',
      hours: '10:00 - 14:00 | 17:30 - 22:30 (Tất cả các ngày)',
      scale: '160 Chỗ ngồi • 3 Phòng VIP Mạt Chược',
      status: 'active'
    }
  ];

  let branches = [];
  const stored = localStorage.getItem('tongwei_branches');
  if (stored) {
    try {
      branches = JSON.parse(stored);
      if (Array.isArray(branches)) {
        // Strictly filter out any CS-03 or Duy Tân
        branches = branches.filter(b => b.id !== 'CS-03' && !b.name?.includes('Duy Tân') && !b.address?.includes('Duy Tân'));
      }
    } catch (e) {
      branches = [];
    }
  }

  if (!branches || branches.length === 0) {
    branches = defaultBranches;
    try {
      localStorage.setItem('tongwei_branches', JSON.stringify(branches));
    } catch (e) {}
  } else {
    // Ensure both CS-01 and CS-02 are present and have correct hotlines
    defaultBranches.forEach(defB => {
      const idx = branches.findIndex(b => b.id === defB.id);
      if (idx === -1) {
        branches.push(defB);
      } else {
        if (!branches[idx].stt) branches[idx].stt = defB.stt;
        if (defB.id === 'CS-01' && (!branches[idx].phone || !branches[idx].phone.includes('039 736 0228'))) {
          branches[idx].phone = defB.phone;
        }
        if (defB.id === 'CS-02' && (!branches[idx].phone || !branches[idx].phone.includes('032 889 5693'))) {
          branches[idx].phone = defB.phone;
        }
      }
    });
    try {
      localStorage.setItem('tongwei_branches', JSON.stringify(branches));
    } catch (e) {}
  }

  // Sort strictly by STT
  branches.sort((a, b) => Number(a.stt || 0) - Number(b.stt || 0));

  // Populate booking form select dropdown if present
  const bookSelect = document.getElementById('bookBranch');
  if (bookSelect) {
    bookSelect.innerHTML = branches.map(b => `<option value="${b.name}">${b.name} (${b.address.split(',')[0]})</option>`).join('');
  }

  // Render cards in container with rich interactive galleries
  if (container) {
    const galleryCS01 = `
      <div class="branch-gallery-widget" id="galleryWidgetCS01">
        <div class="branch-gallery-main" onclick="openMasterAlbum('fb_tongwei_branch_2.png')" title="Bấm để xem ảnh phóng to toàn màn hình">
          <img id="branchMainImgCS01" src="assets/images/branches/fb_tongwei_branch_2.png" alt="Mặt Tiền & Đại Sảnh Flagship 68A Trần Hưng Đạo" class="branch-main-img">
          <div class="branch-gallery-overlay">
            <span class="branch-gallery-pill" id="branchCapCS01">Đại Sảnh Flagship Hoàn Kiếm</span>
            <span class="branch-gallery-zoom">🔍 Phóng to</span>
          </div>
        </div>
        <div class="branch-thumbs-bar" role="tablist" aria-label="Bộ sưu tập ảnh Cơ Sở 1">
          <button type="button" class="branch-thumb-item active" onclick="switchBranchPhoto('CS01', 'assets/images/branches/fb_tongwei_branch_2.png', 'Đại Sảnh Flagship 68A Trần Hưng Đạo', 0, this)" title="Đại Sảnh Flagship">
            <img src="assets/images/branches/fb_tongwei_branch_2.png" alt="Flagship" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS01', 'assets/images/branches/fb_tongwei_branch_1.jpg', 'Phòng Tiệc VIP Hoàng Kim', 1, this)" title="Phòng VIP Hoàng Kim">
            <img src="assets/images/branches/fb_tongwei_branch_1.jpg" alt="Phòng VIP" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS01', 'assets/images/branches/fb_tongwei_branch_13.jpg', 'Khu Bàn Ăn Gia Đình Hoàn Kiếm', 2, this)" title="Khu Bàn Ăn Gia Đình">
            <img src="assets/images/branches/fb_tongwei_branch_13.jpg" alt="Bàn Ăn" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS01', 'assets/images/branches/fb_tongwei_branch_14.jpg', 'Sảnh Tiếp Đón & Quầy Trà Đạo', 3, this)" title="Sảnh Trà Đạo">
            <img src="assets/images/branches/fb_tongwei_branch_14.jpg" alt="Trà Đạo" loading="lazy">
          </button>
        </div>
      </div>
    `;

    const galleryCS02 = `
      <div class="branch-gallery-widget" id="galleryWidgetCS02">
        <div class="branch-gallery-main" onclick="openMasterAlbum('nguyen_thi_thap_fb_1.jpg')" title="Bấm để xem ảnh phóng to toàn màn hình">
          <img id="branchMainImgCS02" src="assets/images/branches/nguyen_thi_thap_fb_1.jpg" alt="Không Gian Giao Hoà Mới — TongWei Nguyễn Thị Thập" class="branch-main-img">
          <div class="branch-gallery-overlay">
            <span class="branch-gallery-pill" id="branchCapCS02">Không Gian Giao Hoà Mới</span>
            <span class="branch-gallery-zoom">🔍 Phóng to</span>
          </div>
        </div>
        <div class="branch-thumbs-bar" role="tablist" aria-label="Bộ sưu tập ảnh Cơ Sở 2">
          <button type="button" class="branch-thumb-item active" onclick="switchBranchPhoto('CS02', 'assets/images/branches/nguyen_thi_thap_fb_1.jpg', 'Không Gian Giao Hoà Mới — Nguyễn Thị Thập', 0, this)" title="Không Gian Giao Hoà Mới">
            <img src="assets/images/branches/nguyen_thi_thap_fb_1.jpg" alt="Không Gian Mới" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS02', 'assets/images/branches/nguyen_thi_thap_fb_4.jpg', 'Phòng Ăn Sang Trọng Tone Gỗ Ấm', 1, this)" title="Phòng Ăn Gỗ Ấm">
            <img src="assets/images/branches/nguyen_thi_thap_fb_4.jpg" alt="Phòng Ăn Gỗ" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS02', 'assets/images/branches/nguyen_thi_thap_fb_2.jpg', 'Bàn Tiệc Sum Vầy Giao Hoà', 2, this)" title="Bàn Tiệc Sum Vầy">
            <img src="assets/images/branches/nguyen_thi_thap_fb_2.jpg" alt="Bàn Tiệc" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS02', 'assets/images/branches/nguyen_thi_thap_fb_3.jpg', 'Góc Bàn Đôi Riêng Tư View Kính', 3, this)" title="Bàn Đôi View Kính">
            <img src="assets/images/branches/nguyen_thi_thap_fb_3.jpg" alt="Bàn Đôi" loading="lazy">
          </button>
          <button type="button" class="branch-thumb-item" onclick="switchBranchPhoto('CS02', 'assets/images/branches/nguyen_thi_thap_fb_5.jpg', 'Góc Decor Mỹ Vị Giao Hoà', 4, this)" title="Decor Mỹ Vị">
            <img src="assets/images/branches/nguyen_thi_thap_fb_5.jpg" alt="Decor" loading="lazy">
          </button>
        </div>
      </div>
    `;

    container.innerHTML = branches.map(b => {
      const mainPhone = (b.phone || '039 736 0228').split('/')[0].trim();
      const rawTel = mainPhone.replace(/\s+/g, '');
      const secondaryPhone = (b.phone || '').split('/')[1] ? (' / ' + (b.phone || '').split('/')[1].trim()) : '';
      const mapQuery = encodeURIComponent(b.address || b.name);
      const isCS01 = b.id === 'CS-01';
      const branchGalleryHtml = isCS01 ? galleryCS01 : galleryCS02;

      return `
        <article class="branch-direct-card" id="branch-card-${b.id}">
          <div class="branch-direct-header">
            <span class="branch-stt-tag">🏮 Cơ Sở ${b.stt || 1}</span>
            <span class="branch-status-tag">${b.status === 'upcoming' ? '⏳ Sắp Khai Trương' : '✔ Đang Hoạt Động'}</span>
          </div>
          <h3 class="branch-direct-name">${b.name}</h3>

          ${branchGalleryHtml}

          <div class="branch-direct-meta">
            <div class="branch-meta-row">
              <span class="branch-meta-icon">📍</span>
              <div class="branch-meta-text">
                <strong>Địa chỉ:</strong>
                <span>${b.address}</span>
              </div>
            </div>
            <div class="branch-meta-row">
              <span class="branch-meta-icon">📞</span>
              <div class="branch-meta-text">
                <strong>Hotline đặt bàn:</strong>
                <span class="branch-hotline-highlight">${mainPhone}</span>
                <span style="font-size: 0.82rem; color: var(--color-text-secondary);">${secondaryPhone}</span>
              </div>
            </div>
            <div class="branch-meta-row">
              <span class="branch-meta-icon">⏰</span>
              <div class="branch-meta-text">
                <strong>Giờ mở cửa:</strong>
                <span>${b.hours || '10:00 - 14:00 | 17:30 - 22:30'}</span>
              </div>
            </div>
            ${b.scale ? `
            <div class="branch-meta-row">
              <span class="branch-meta-icon">🏛️</span>
              <div class="branch-meta-text">
                <strong>Quy mô:</strong>
                <span>${b.scale}</span>
              </div>
            </div>` : ''}
          </div>
          <div class="branch-direct-actions">
            <a href="tel:${rawTel}" class="branch-btn-call-direct" title="Bấm gọi đặt bàn ngay cho ${b.name}">
              <span>📞</span>
              <span>BẤM GỌI ĐẶT BÀN: ${mainPhone}</span>
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener noreferrer" class="branch-btn-map-direct" title="Chỉ đường Google Maps đến ${b.name}">
              <span>🗺️ Chỉ Đường (Google Maps) ↗</span>
            </a>
          </div>
        </article>
      `;
    }).join('');
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


// ==================== 15-PAGE DIGITAL MENU BOOK VIEWER ====================
let menuPagesData = [
  { id: 1, page: 1, title: 'Bìa Menu Tong Wei Cantonese Flavours', category: 'intro', categoryName: 'Giới Thiệu', img: 'assets/images/menu/menu_page_01.jpg', desc: 'Thương hiệu ẩm thực Quảng Đông độc bản tại Hà Nội — 68A Trần Hưng Đạo & 5N7A Nguyễn Thị Thập' },
  { id: 2, page: 2, title: 'Triết Lý Ẩm Thực Đồng Vị (同味)', category: 'intro', categoryName: 'Giới Thiệu', img: 'assets/images/menu/menu_page_02.jpg', desc: 'Sự hòa điệu giữa con người, hương vị và dư vị ngọt ngào sau mỗi bữa tiệc sum vầy' },
  { id: 3, page: 3, title: 'Đại Yến Tinh Hoa Mỹ Vị Quảng Đông', category: 'intro', categoryName: 'Giới Thiệu', img: 'assets/images/menu/menu_page_03.jpg', desc: 'Mâm tiệc đại yến trứ danh với vịt quay, tháp xửng dimsum nghệ nhân và cháo nóng' },
  { id: 4, page: 4, title: 'Khai Vị & Salad Khơi Mở Vị Giác', category: 'starter', categoryName: 'Khai Vị & Súp', img: 'assets/images/menu/menu_page_04.jpg', desc: 'Chân gà ngâm ớt xanh, nấm chiên kim sa, cánh lưỡi vịt cay Hồ Nam, salad rong biển trứng cua' },
  { id: 5, page: 5, title: 'Súp Thượng Canh & Canh Tiềm Dưỡng Sinh', category: 'starter', categoryName: 'Khai Vị & Súp', img: 'assets/images/menu/menu_page_05.jpg', desc: 'Canh lê tiềm tuyết nhĩ, canh gà nấm dưỡng sinh, soup bào ngư kê vàng, soup cua hoàng bào' },
  { id: 6, page: 6, title: 'Dimsum Hấp Nghệ Nhân & Bánh Cuốn', category: 'dimsum', categoryName: 'Dimsum', img: 'assets/images/menu/menu_page_06.jpg', desc: 'Há cảo tôm tươi, há cảo sò điệp, xíu mại tôm thịt gạch cua, sủi cảo Bắc Kinh chuẩn vị' },
  { id: 7, page: 7, title: 'Dimsum Chiên, Áp Chảo & Đại Long Bao', category: 'dimsum', categoryName: 'Dimsum', img: 'assets/images/menu/menu_page_07.jpg', desc: 'Đại long bao truyền thống (Tặng khi khai trương), tiểu long bao, chả giò tôm phô mai, bánh xếp áp chảo' },
  { id: 8, page: 8, title: 'Bánh Bao Thượng Hạng & Món Rau Thanh Vị', category: 'dimsum', categoryName: 'Dimsum', img: 'assets/images/menu/menu_page_08.jpg', desc: 'Bánh bao kim sa tan chảy, matcha, xá xíu & củ sen Triều Châu, cải chíp sốt nấm, đậu Tứ Xuyên' },
  { id: 9, page: 9, title: 'Món Quay Nướng BBQ Quảng Đông', category: 'bbq', categoryName: 'Quay Nướng', img: 'assets/images/menu/menu_page_09.jpg', desc: 'Heo quay Macao da giòn, vịt quay Quảng Đông, thịt xá xíu mật ong rừng, sườn nướng Mai Quế Lộ' },
  { id: 10, page: 10, title: 'Món Thịt Xào Lửa Lớn & Thố Nồi Đất', category: 'bbq', categoryName: 'Quay Nướng', img: 'assets/images/menu/menu_page_10.jpg', desc: 'Bò bằm cà tím thố đất, bò nhúng cay Trùng Khánh, gà xào bào ngư, ba chỉ cuộn sốt ô mai' },
  { id: 11, page: 11, title: 'Hải Sản Tươi Sống & Cá Lăng Sông', category: 'main', categoryName: 'Cơm & Mỳ', img: 'assets/images/menu/menu_page_11.jpg', desc: 'Cá lăng nhúng cay, cá lăng hấp tàu xì, mực tươi ngồng tỏi, tôm chiên trứng mặn, sò điệp măng tây' },
  { id: 12, page: 12, title: 'Cơm Chiên Thượng Hạng, Mỳ Trộn & Cháo Nóng', category: 'main', categoryName: 'Cơm & Mỳ', img: 'assets/images/menu/menu_page_12.jpg', desc: 'Cơm chiên hải sản XO, cơm chiên heo quay Macau, mỳ sườn Quảng Đông, cháo tôm Quảng Châu' },
  { id: 13, page: 13, title: 'Lẩu Trùng Khánh, Lẩu Cà Chua & Đồ Nhúng', category: 'drinks', categoryName: 'Lẩu & Tráng Miệng', img: 'assets/images/menu/menu_page_13.jpg', desc: 'Nồi lẩu 2 ngăn cay nồng, lẩu khô vịt & ba chỉ bò, viên thả lẩu tổng hợp, rau tươi theo mùa' },
  { id: 14, page: 14, title: 'Đồ Uống, Trà Trái Cây & Trà Sữa Dưỡng Nhan', category: 'drinks', categoryName: 'Lẩu & Tráng Miệng', img: 'assets/images/menu/menu_page_14.jpg', desc: 'Trà Olong Bạch Lan, Trà hoa quả TongWei, Trà nho xanh Kale, Long Tỉnh sữa dưa lưới, bia Thanh Đảo' },
  { id: 15, page: 15, title: 'Món Tráng Miệng Thanh Ngọt & Topping', category: 'drinks', categoryName: 'Lẩu & Tráng Miệng', img: 'assets/images/menu/menu_page_15.jpg', desc: 'Tàu hũ non trân châu đường đen, caramen, trân châu kim cương, thạch dừa giòn thanh mát' }
];

let currentMenuPageIndex = 0;
let currentMenuCategory = 'all';
let menuViewMode = 'book';

function initMenuBookViewer() {
  renderMenuThumbsBar();
  renderMenuPagesGrid();
  renderMenuCurrentPage();
  setupMenuSwipeListener();
}

function renderMenuThumbsBar() {
  const container = document.getElementById('menuThumbsBar');
  if (!container) return;

  container.innerHTML = menuPagesData.map((item, index) => `
    <div class="menu-thumb-item ${index === currentMenuPageIndex ? 'active' : ''}" onclick="goToMenuPage(${index})" id="thumb-item-${index}" title="${item.title}">
      <img src="${item.img}" alt="${item.title}" loading="lazy">
      <span>Trang ${item.page < 10 ? '0' + item.page : item.page}</span>
    </div>
  `).join('');
}

function renderMenuPagesGrid() {
  const grid = document.getElementById('menuPagesGrid');
  if (!grid) return;

  grid.innerHTML = menuPagesData.map((item, index) => `
    <div class="menu-grid-card" data-category="${item.category}" onclick="openMenuLightboxModal(${index})">
      <div class="menu-grid-thumb-wrap">
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <span class="menu-grid-badge">Trang ${item.page < 10 ? '0' + item.page : item.page} • ${item.categoryName}</span>
      </div>
      <div class="menu-grid-info">
        <h4 class="menu-grid-title">${item.title}</h4>
        <p class="menu-grid-desc">${item.desc}</p>
        <span class="menu-grid-link">🔍 Bấm để phóng to xem chi tiết ↗</span>
      </div>
    </div>
  `).join('');
}

function renderMenuCurrentPage() {
  const item = menuPagesData[currentMenuPageIndex];
  if (!item) return;

  const imgEl = document.getElementById('menuMainPageImg');
  const catEl = document.getElementById('menuPageCategoryBadge');
  const titleEl = document.getElementById('menuPageTitle');
  const descEl = document.getElementById('menuPageDesc');
  const currNumEl = document.getElementById('menuCurrentPageNum');

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = item.img;
      imgEl.alt = item.title;
      imgEl.style.opacity = '1';
    }, 120);
  }

  if (catEl) catEl.textContent = item.categoryName;
  if (titleEl) titleEl.textContent = `Trang ${item.page < 10 ? '0' + item.page : item.page}: ${item.title}`;
  if (descEl) descEl.textContent = item.desc;
  if (currNumEl) currNumEl.textContent = item.page < 10 ? '0' + item.page : item.page;

  // Highlight active thumb
  document.querySelectorAll('.menu-thumb-item').forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === currentMenuPageIndex);
  });

  // Scroll active thumb horizontally inside its scroll wrapper ONLY - NEVER trigger vertical window scroll
  const activeThumb = document.getElementById(`thumb-item-${currentMenuPageIndex}`);
  const thumbsWrapper = document.querySelector('.menu-thumbs-scroll-wrapper');
  if (activeThumb && thumbsWrapper) {
    const targetLeft = activeThumb.offsetLeft - (thumbsWrapper.clientWidth / 2) + (activeThumb.clientWidth / 2);
    thumbsWrapper.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }
}

window.nextMenuPage = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  currentMenuPageIndex = (currentMenuPageIndex + 1) % menuPagesData.length;
  renderMenuCurrentPage();
};

window.prevMenuPage = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  currentMenuPageIndex = (currentMenuPageIndex - 1 + menuPagesData.length) % menuPagesData.length;
  renderMenuCurrentPage();
};

window.goToMenuPage = function(index, e) {
  if (e && e.preventDefault) e.preventDefault();
  if (index >= 0 && index < menuPagesData.length) {
    currentMenuPageIndex = index;
    renderMenuCurrentPage();
  }
};

window.switchMenuViewMode = function(mode) {
  menuViewMode = mode;
  const bookView = document.getElementById('menuBookViewer');
  const gridView = document.getElementById('menuGridContainer');
  const btnBook = document.getElementById('btnModeBook');
  const btnGrid = document.getElementById('btnModeGrid');

  if (mode === 'grid') {
    if (bookView) bookView.style.display = 'none';
    if (gridView) gridView.style.display = 'block';
    if (btnBook) btnBook.classList.remove('active');
    if (btnGrid) btnGrid.classList.add('active');
  } else {
    if (bookView) bookView.style.display = 'flex';
    if (gridView) gridView.style.display = 'none';
    if (btnBook) btnBook.classList.add('active');
    if (btnGrid) btnGrid.classList.remove('active');
    renderMenuCurrentPage();
  }
};

window.filterMenuByCat = function(category, e) {
  if (e && e.preventDefault) e.preventDefault();
  currentMenuCategory = category;

  // Active tab button
  document.querySelectorAll('#menuBookCategoryTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
  });

  if (menuViewMode === 'book') {
    // Jump to the first page of selected category
    if (category === 'all') {
      goToMenuPage(0);
    } else {
      const targetIdx = menuPagesData.findIndex(item => item.category === category);
      if (targetIdx !== -1) {
        goToMenuPage(targetIdx);
      }
    }
  } else {
    // Filter grid cards
    document.querySelectorAll('.menu-grid-card').forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
};

window.zoomCurrentMenuPage = function() {
  openMenuLightboxModal(currentMenuPageIndex);
};

window.openMenuLightboxModal = function(index) {
  const item = menuPagesData[index];
  if (!item) return;

  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const cat = document.getElementById('lightboxCategory');
  const caption = document.getElementById('lightboxCaption');
  const desc = document.getElementById('lightboxDesc');

  if (img) img.src = item.img;
  if (counter) counter.textContent = `Trang Menu ${item.page} / ${menuPagesData.length}`;
  if (cat) cat.textContent = item.categoryName;
  if (caption) caption.textContent = item.title;
  if (desc) desc.textContent = item.desc;

  // Save current menu index in state for lightbox navigation
  state.isViewingMenuInLightbox = true;
  state.currentMenuLightboxIndex = index;

  if (modal) modal.classList.add('active');
};

function setupMenuSwipeListener() {
  const wrapper = document.getElementById('menuMainPageWrapper');
  if (!wrapper) return;

  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextMenuPage(); // Vuốt sang trái -> Trang sau
      } else {
        prevMenuPage(); // Vuốt sang phải -> Trang trước
      }
    }
  }, { passive: true });
}

// 13. Apply Website Menu Display Mode (Digital Book vs Dish Grid)
function applyWebsiteMenuMode() {
  const mode = localStorage.getItem('tongwei_menu_display_mode') || 'book';
  const dishesWrap = document.getElementById('dishesListContainer');
  const bookWrap = document.getElementById('menuBookViewerContainer');
  const subtitle = document.getElementById('menuSectionSubtitle');
  const title = document.getElementById('menuSectionTitle');
  const desc = document.getElementById('menuSectionDesc');

  if (mode === 'dishes') {
    if (dishesWrap) dishesWrap.style.display = 'block';
    if (bookWrap) bookWrap.style.display = 'none';
    if (subtitle) subtitle.textContent = 'Mỹ Vị Tinh Hoa';
    if (title) title.textContent = 'Thực Đơn Món Ăn Quảng Đông';
    if (desc) desc.textContent = 'Khám phá 28+ mỹ vị đỉnh cao chế biến tươi ngon mỗi ngày theo công thức nghệ nhân Quảng Đông.';
  } else {
    if (dishesWrap) dishesWrap.style.display = 'none';
    if (bookWrap) bookWrap.style.display = 'block';
    if (subtitle) subtitle.textContent = 'Độc Bản Mỹ Vị Quảng Đông';
    if (title) title.textContent = 'Quyển Thực Đơn Tinh Hoa TongWei';
    if (desc) desc.textContent = 'Ấn phẩm thực đơn thiết kế nghệ nhân trọn vẹn — Kết tinh mỹ vị truyền thống Quảng Đông từ Dimsum, Món quay nướng tới Hải sản & Lẩu dưỡng sinh.';
  }
}
window.applyWebsiteMenuMode = applyWebsiteMenuMode;

document.addEventListener('DOMContentLoaded', () => {
  applyWebsiteMenuMode();
  initMenuBookViewer();
  initDishes();
  loadLiveEvents();
  renderLookbookGrid();
  renderBranches();
  renderFranchisePackages();
  setupEventListeners();
  setupScrollSpy();
  calculateROI();
});
