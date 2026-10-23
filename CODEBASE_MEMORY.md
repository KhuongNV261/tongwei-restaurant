# 🧠 BỘ NHỚ DỰ ÁN (CODEBASE MEMORY)
## Hệ Thống Nhà Hàng Quảng Đông TongWei (TongWei Restaurant & CMS Portal)

> **Ngày tạo:** 22/10/2026  
> **Trạng thái:** Sẵn sàng cho phiên làm việc tiếp theo

---

## 1. Thông Tin Phiên Làm Việc (Conversation Metadata)
- **Tên dự án:** Nhà hàng Quảng Đông TongWei (同味 — Mỹ vị Quảng Đông)
- **Conversation ID:** `d8a4f214-f42f-4a91-8804-ecf576f342d2`
- **Đường dẫn thư mục dự án (Workspace):**  
  `C:\Users\Khuongnv\.gemini\antigravity-ide\scratch\tongwei-restaurant`
- **Đường dẫn file bộ nhớ Transcript đầy đủ:**  
  `C:\Users\Khuongnv\.gemini\antigravity-ide\brain\d8a4f214-f42f-4a91-8804-ecf576f342d2\.system_generated\logs\transcript.jsonl`

---

## 2. Đường Dẫn & Tài Khoản Truy Cập
- **Mã nguồn GitHub:** [https://github.com/KhuongNV261/tongwei-restaurant](https://github.com/KhuongNV261/tongwei-restaurant) (Branch: `main`)
- **Website khách hàng (Online):** [https://khuongnv261.github.io/tongwei-restaurant/](https://khuongnv261.github.io/tongwei-restaurant/)
- **Cổng Quản trị Admin (Online):** [https://khuongnv261.github.io/tongwei-restaurant/admin/](https://khuongnv261.github.io/tongwei-restaurant/admin/)
- **Máy chủ Local:** `http://localhost:8088/` (Website) và `http://localhost:8088/admin/` (Admin)
- **Tài khoản đăng nhập quản trị:**
  - `admin` / `123456` *(Quản trị viên cấp cao)*
  - `bep_truong` / `123456` *(Quản lý bếp & thực đơn)*
  - `thu_ngan` / `123456` *(Vận hành đặt bàn & CSKH)*

---

## 3. Tổng Hợp Các Tính Năng Đã Hoàn Thành (Hôm Nay)
1. **Chế độ lưu trữ Cục bộ (Local Staging) & Nút Xuất bản Online:**
   - Mọi thay đổi về món ăn, giá, ảnh, sự kiện được lưu nháp tại `localStorage`.
   - Nút **`🚀 Xuất bản lên online`** trên Header giúp đồng bộ dữ liệu vào `data/dishes.json`, tự động chạy `git commit` & `git push origin main`.
2. **Hẹn giờ tự động xuất bản (16:40 / 4h40 chiều):**
   - Đã tích hợp huy hiệu **`⏰ Tự động: 16:40`** trên Header.
   - Máy chủ `server.js` chạy ngầm kiểm tra mỗi 30 giây để tự động đẩy lên GitHub đúng 16:40 mỗi ngày.
   - Có popup điều chỉnh giờ hẹn hoặc bật/tắt tự động.
3. **Chuẩn hóa Typography & Loại bỏ viết hoa từng chữ (Sentence Case):**
   - Đổi toàn bộ menu sidebar, table headers, status badges sang chữ thường tự nhiên chuẩn Tiếng Việt (*Bảng điều khiển*, *Quản lý món ăn*, *Đã xác nhận*, *Còn món*...).
   - Đổi thanh điều hướng website khách hàng (*Trang chủ*, *Giới thiệu*, *Thực đơn*, *Không gian*, *Đặt bàn ngay*...).
4. **Sẵn sàng tích hợp Cloudflare Pages & D1 Database:**
   - File cấu hình: `wrangler.toml`
   - File khởi tạo bảng và 26 món ăn: `schema.sql`
   - Các API Serverless Edge Functions: `functions/api/dishes.js`, `functions/api/bookings.js`, `functions/api/branches.js`.
5. **Khắc phục triệt để tràn viền nút "Đặt bàn ngay" (Responsive Navbar):**
   - Đã tối ưu padding/gap/font-size của 8 mục menu để thanh header không bị vượt quá 1060px trên laptop (1366px, 1280px).
   - Thêm `flex-shrink: 0` cho cụm `.nav-actions` đảm bảo nút CTA không bao giờ bị bóp méo hoặc đẩy ra mép màn hình.
   - Điều chỉnh breakpoint hamburger menu sang `<= 1120px` (chuẩn iPad / Tablet).
   - Trên mobile (`<= 480px`): giữ nút "Đặt bàn" nhỏ gọn trên header và bổ sung nút CTA nổi bật trong menu trượt (`🏮 Đặt bàn ngay`).


---

## 4. Kế Hoạch Tiếp Theo Cho Phiên Tới (Ngày Mai)
1. **Triển khai Cloudflare D1 Database:**
   - Tạo DB `tongwei-db` trên Cloudflare Dashboard.
   - Nạp file `schema.sql` để có ngay 4 bảng: `dishes`, `bookings`, `branches`, `users`.
2. **Kết nối Cloudflare Pages:**
   - Liên kết repo `KhuongNV261/tongwei-restaurant` với Cloudflare Pages.
   - Gắn biến `DB` tới `tongwei-db`.
3. **Kiểm thử đặt bàn thời gian thực (Real-time Booking):**
   - Khách đặt bàn trên điện thoại -> Dữ liệu lưu tức thì vào D1 mà không cần bật máy tính cá nhân.

---

## 5. Câu Lệnh Mẫu Cho Phiên AI Mới (Dành Cho Ngày Mai)
> *"Bạn hãy đọc file bộ nhớ `CODEBASE_MEMORY.md` tại thư mục dự án `C:\Users\Khuongnv\.gemini\antigravity-ide\scratch\tongwei-restaurant\CODEBASE_MEMORY.md` hoặc tham khảo Conversation ID `d8a4f214-f42f-4a91-8804-ecf576f342d2` để tiếp tục dự án Nhà hàng TongWei giúp tôi."*
