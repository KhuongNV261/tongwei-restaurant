-- ==========================================
-- TONGWEI RESTAURANT - CLOUDFLARE D1 SCHEMA
-- ==========================================

DROP TABLE IF EXISTS dishes;
CREATE TABLE dishes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  chinese TEXT NOT NULL,
  category TEXT NOT NULL,
  category_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  is_signature INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  show_on_home INTEGER DEFAULT 1,
  spicy INTEGER DEFAULT 0,
  tags TEXT
);

DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests TEXT NOT NULL,
  branch TEXT,
  area TEXT DEFAULT 'Sảnh tiêu chuẩn',
  pre_order TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS branches;
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  scale TEXT,
  status TEXT DEFAULT 'active'
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  role_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  avatar TEXT,
  created_at TEXT
);

-- Seed Default Users
INSERT INTO users (id, username, password, full_name, role, role_name, status, avatar, created_at) VALUES
('usr_admin', 'admin', '123456', 'Khuongnv (Quản trị viên)', 'admin', 'Quản trị viên cấp cao', 'active', 'AD', '2026-10-21'),
('usr_kitchen', 'bep_truong', '123456', 'Lý Quốc Dũng (Bếp trưởng)', 'kitchen', 'Quản lý bếp & thực đơn', 'active', 'QD', '2026-10-22'),
('usr_cashier', 'thu_ngan', '123456', 'Trần Mỹ Linh (Lễ tân / Thu ngân)', 'cashier', 'Vận hành đặt bàn & CSKH', 'active', 'ML', '2026-10-22');

-- Seed Default Branches
INSERT INTO branches (id, name, short_name, address, phone, hours, scale, status) VALUES
('CS-01', 'Nhà Hàng TongWei - Cơ Sở Hoàn Kiếm', 'Cơ sở 1 (Hoàn Kiếm)', '68A Trần Hưng Đạo, P. Cửa Nam, Hoàn Kiếm, Hà Nội', '0912 345 678 / 024 3999 8888', '10:00 - 14:00 | 17:30 - 22:30', '180 Chỗ ngồi • 4 Phòng VIP', 'active'),
('CS-02', 'Nhà Hàng TongWei - Cơ Sở Cầu Giấy', 'Cơ sở 2 (Cầu Giấy)', '12 Duy Tân, P. Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '0988 567 890 / 024 3888 9999', '10:00 - 14:00 | 17:30 - 22:30', '140 Chỗ ngồi • 3 Phòng VIP', 'active'),
('CS-03', 'Nhà Hàng TongWei - Cơ Sở Nguyễn Thị Thập', 'Cơ sở 3 (Nguyễn Thị Thập)', '5N7A Nguyễn Thị Thập, P. Yên Hòa, Cầu Giấy, Hà Nội', '0986 688 866 / 024 3999 8888', '10:00 - 14:00 | 17:30 - 22:30', '160 Chỗ ngồi • 3 Phòng VIP • Tặng 01 Xửng Đại Long Bao', 'active');

-- Seed Dishes
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-1', 'Bánh bao kim sa', '黄金流沙包', 'dimsum', 'Điểm Tâm & Dimsum', 68000, 'assets/images/dishes/Bánh bao kim sa.png', 'Vỏ bánh mềm xốp như mây, bọc trọn nhân trứng muối vàng óng tan chảy béo ngậy ngọt dịu chuẩn vị Quảng Đông.', 1, 1, 1, 0, 'Bán chạy,Nghệ nhân,Signature');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-2', 'Bánh bao xá xíu', '蜜汁叉烧包', 'dimsum', 'Điểm Tâm & Dimsum', 65000, 'assets/images/dishes/Bánh bao xá xíu.png', 'Nhân thịt xá xíu nướng mật ong thơm lừng xắt hạt lựu, quyện sốt tương truyền thống ngọt mặn hài hòa.', 1, 1, 1, 0, 'Yêu thích,Truyền thống');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-3', 'Bánh bao trường thọ', '长寿寿桃包', 'dimsum', 'Điểm Tâm & Dimsum', 72000, 'assets/images/dishes/Bánh bao trường thọ.png', 'Tạo hình quả đào tiên phong thủy thanh tao, nhân đậu đỏ sen nhuyễn thanh ngọt mang ý nghĩa cát tường chúc thọ.', 0, 1, 1, 0, 'Ý nghĩa,Thanh đạm');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-4', 'Bánh bao matcha', '抹茶流心包', 'dimsum', 'Điểm Tâm & Dimsum', 68000, 'assets/images/dishes/Bánh bao matcha.png', 'Vỏ bánh xanh ngọc từ bột trà xanh cao cấp, hòa quyện sốt kem matcha béo thơm đượm vị thanh dịu.', 0, 1, 1, 0, 'Mới,Trà xanh');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-5', 'Bánh cuốn tôm tươi', '鲜虾肠粉', 'dimsum', 'Điểm Tâm & Dimsum', 88000, 'assets/images/dishes/Bánh cuốn tôm.png', 'Lớp bánh tráng mỏng tang mướt mát cuốn trọn tôm sú tươi giòn sần sật, chan nước tương ngọt thơm gia truyền.', 1, 1, 1, 0, 'Best Seller,Tươi sống');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-6', 'Bánh cuốn phỉ thúy', '翡翠鲜虾肠粉', 'dimsum', 'Điểm Tâm & Dimsum', 85000, 'assets/images/dishes/Bánh cuốn phỉ thúy.png', 'Sắc xanh ngọc bích từ nước ép rau tần ô tự nhiên, thanh mát, bổ dưỡng, kết hợp nấm tươi và hải sản.', 0, 1, 1, 0, 'Thanh mát,Nghệ thuật');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('dimsum-7', 'Bánh xếp áp chảo', '香煎生煎饺', 'dimsum', 'Điểm Tâm & Dimsum', 75000, 'assets/images/dishes/Bánh xếp áp chảo.png', 'Đáy bánh vàng ruộm giòn tan rụm, phần trên dẻo mềm mọng nước dùng ngọt đậm đà từ thịt băm và hành hoa.', 1, 1, 1, 0, 'Giòn rụm,Mọng nước');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('main-1', 'Ba chỉ chiên cơm giòn', '脆米香酥五花肉', 'main', 'Món Chính Quảng Đông', 168000, 'assets/images/dishes/Ba chỉ chiên cơm giòn.png', 'Thịt ba chỉ thượng hạng quay giòn bì tẩm lớp cốm giòn thơm lừng, thịt mềm mọng nước chấm cùng sốt mận chua ngọt.', 1, 1, 1, 0, 'Đặc sản,Bán chạy');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('main-2', 'Ba chỉ cuộn gulu sốt ô mai', '乌梅咕噜肉卷', 'main', 'Món Chính Quảng Đông', 178000, 'assets/images/dishes/Ba chỉ cuộn gulu sốt ô mai.png', 'Sự sáng tạo đột phá từ thịt ba chỉ cuộn mỏng giòn rụm quyện đẫm sốt ô mai chua ngọt đậm vị cung đình khai vị xuất sắc.', 1, 1, 1, 0, 'Món mới,Sáng tạo');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('main-3', 'Ba chỉ xào cay', '湘辣回锅肉', 'main', 'Món Chính Quảng Đông', 158000, 'assets/images/dishes/Ba chỉ xào cay.png', 'Thịt ba chỉ thái lát mỏng xào lửa lớn cùng ớt chuông, ớt khô Tứ Xuyên và tỏi tây, cay nồng đậm đà bắt cơm.', 0, 1, 1, 2, 'Cay nồng,Đậm đà');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('main-4', 'Cánh lưỡi vịt cay Hồ Nam', '湖南麻辣鸭舌鸭翅', 'main', 'Món Chính Quảng Đông', 195000, 'assets/images/dishes/Cánh lưỡi vịt cay hồ nam.png', 'Lưỡi vịt và cánh vịt tiềm thảo mộc cổ truyền rồi xào sả ớt Hồ Nam the cay thấm sâu vào từng thớ thịt giòn sần sật.', 1, 1, 1, 3, 'Đặc sản Hồ Nam,Cay tê');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('main-5', 'Bò nhúng cay Trùng Khánh', '重庆水煮麻辣牛肉', 'main', 'Món Chính Quảng Đông', 235000, 'assets/images/dishes/Bò nhúng cay Trùng Khánh.png', 'Bò phi lê mềm như lụa nhúng nước sốt dầu ớt tiêu hoa thảo mộc đỏ rực, tê cay bùng nổ mọi giác quan.', 1, 1, 1, 3, 'Trùng Khánh,Thách thức cay');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('claypot-1', 'Bò bằm cà tím nồi đất', '砂锅肉末茄子煲', 'claypot', 'Nồi Đất & Món Xào', 145000, 'assets/images/dishes/Bò bằm cà tím nồi đất.png', 'Cà tím mềm ngọt om chậm trong nồi đất cùng bò bằm sốt tương đậu thơm phức, giữ nhiệt sôi xèo xèo hấp dẫn.', 1, 1, 1, 1, 'Cơm niêu,Đậm đà');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('claypot-2', 'Bò xào mướp đắng tàu xì', '豉汁苦瓜炒牛肉', 'claypot', 'Nồi Đất & Món Xào', 165000, 'assets/images/dishes/Bò xào mướp đắng tàu xì.png', 'Mướp đắng xanh giòn thanh nhiệt kết hợp thịt bò tươi mềm và sốt đậu đen lên men tàu xì thơm nồng đặc trưng.', 0, 1, 1, 0, 'Thanh nhiệt,Quảng Đông');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('claypot-3', 'Bò xào song nấm sốt tôm khô', '双菇虾米炒牛肉', 'claypot', 'Nồi Đất & Món Xào', 175000, 'assets/images/dishes/Bò xào song nấm sốt tôm khô.png', 'Sự kết hợp thượng hạng của nấm đông cô, nấm mỡ tươi ngọt quyện hương tôm khô đại dương và thịt bò áp chảo.', 0, 1, 1, 0, 'Bổ dưỡng,Thơm ngậy');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('veggie-1', 'Cải Hongkong sốt bào ngư', '鲍汁香港菜心', 'claypot', 'Nồi Đất & Món Xào', 125000, 'assets/images/dishes/Cải Hongkong sốt bào ngư.png', 'Ngồng cải non tươi ngọt nhập khẩu chần chuẩn độ giòn, rưới sốt bào ngư vàng nâu sánh mịn quý phái.', 1, 1, 1, 0, 'Cao cấp,Sốt bào ngư');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('veggie-2', 'Cải chíp sốt nấm đông cô', '香菇扒上海青', 'claypot', 'Nồi Đất & Món Xào', 115000, 'assets/images/dishes/Cải chíp sốt nấm đông cô.png', 'Cải thìa xanh mướt xếp cánh hoa nghệ thuật, quyện nấm đông cô thượng phẩm hầm mềm đậm đà vị ngọt tự nhiên.', 0, 1, 1, 0, 'Thanh tịnh,Bổ dưỡng');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('veggie-3', 'Bông cải sốt dầu hào', '蚝油西蓝花', 'claypot', 'Nồi Đất & Món Xào', 95000, 'assets/images/dishes/Bông cải sốt dầu hào.png', 'Bông cải xanh mướt giòn ngọt tự nhiên, hòa quyện sốt dầu hào thượng hạng dậy mùi tỏi phi vàng óng.', 0, 1, 1, 0, 'Dễ ăn,Gia đình');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('seafood-1', 'Cá lăng hấp tàu xì', '豉汁蒸长吻鮠', 'seafood', 'Hải Sản & Cá Lăng', 285000, 'assets/images/dishes/Cá lăng hấp tàu xì.png', 'Thịt cá lăng sông béo ngậy ngọt đượm thịt, hấp chín tới cùng tàu xì Quảng Đông, gừng sợi và hành hoa thơm nức.', 1, 1, 1, 0, 'Tuyệt phẩm,Best Seller');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('seafood-2', 'Cá lăng hấp tỏi ớt', '剁椒蒜蓉蒸鱼', 'seafood', 'Hải Sản & Cá Lăng', 285000, 'assets/images/dishes/Cá lăng hấp tỏi ớt.png', 'Cá lăng tươi sống phủ đẫm tỏi băm thơm nồng và ớt đỏ lên men chua thanh cay dịu, giữ trọn vị ngọt tự nhiên.', 0, 1, 1, 1, 'Cay dịu,Đậm vị');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('seafood-3', 'Cá lăng nấu cải chua', '酸菜长吻鮠汤锅', 'seafood', 'Hải Sản & Cá Lăng', 295000, 'assets/images/dishes/Cá lăng nấu cải chua.png', 'Nước dùng cá hầm trắng đục sánh ngọt, điểm xuyết cải chua Tứ Xuyên và hạt tiêu Tứ Xuyên thơm lừng giải ngấy đỉnh cao.', 1, 1, 1, 1, 'Chua thanh,Dễ ăn');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('seafood-4', 'Cá lăng nhúng cay Trùng Khánh', '川味麻辣水煮鱼', 'seafood', 'Hải Sản & Cá Lăng', 295000, 'assets/images/dishes/Cá lăng nhúng cay.png', 'Phi lê cá lăng mềm tan trần trong nồi dầu thơm ớt khô và hoa hồi thảo quả đỏ rực, tê cay khó cưỡng.', 1, 1, 1, 3, 'Cay tê,Trùng Khánh');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('soup-1', 'Canh gà nấm dưỡng sinh', '养生野菌土鸡盅', 'soup', 'Canh Tiềm Dưỡng Sinh', 145000, 'assets/images/dishes/Canh gà nấm dưỡng sinh.png', 'Tiềm chậm 4 giờ bằng phương pháp cách thủy truyền thống với gà ta thả đồi, nấm quý, câu kỷ tử và sâm bổ lượng.', 1, 1, 1, 0, 'Dưỡng sinh,Bổ khí huyết');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('soup-2', 'Canh lê tiềm tuyết nhĩ', '雪耳炖雪梨盅', 'soup', 'Canh Tiềm Dưỡng Sinh', 115000, 'assets/images/dishes/Canh lê tiềm tuyết nhĩ.png', 'Món canh dưỡng nhan thanh mát cho phái đẹp từ lê tuyết giòn ngọt, tuyết nhĩ nở hoa và táo đỏ Tân Cương bổ phổi nhuận tràng.', 0, 1, 1, 0, 'Dưỡng nhan,Thanh mát');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('soup-3', 'Canh rau trứng tam sắc', '上汤三色蛋时蔬', 'soup', 'Canh Tiềm Dưỡng Sinh', 105000, 'assets/images/dishes/Canh rau trứng tam sắc.png', 'Hòa quyện nước dùng thượng canh ninh xương gà với trứng muối, trứng bắc thảo và trứng tươi béo ngậy ngọt hậu.', 0, 1, 1, 0, 'Thanh vị,Độc đáo');
INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags) VALUES ('drink-1', 'Cam ép TongWei thượng phẩm', '同味鲜榨甜橙汁', 'drinks', 'Thức Uống Thanh Vị', 55000, 'assets/images/dishes/Cam ép Tongwei.png', '100% cam tươi mọng nước nguyên chất ép tươi tại quầy, cung cấp vitamin C dồi dào giải nhiệt hoàn hảo.', 1, 1, 1, 0, 'Tươi mát,Nguyên chất');
