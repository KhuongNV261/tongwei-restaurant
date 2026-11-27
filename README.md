# Tong Wei · Đồng Vị

Thanh điều hướng mở riêng từng tab Giới thiệu, Nhượng quyền, Tin tức, Menu và Liên hệ. Mỗi tab có liên kết trực tiếp, ví dụ `/#nhuong-quyen`. Khách có thể xem ảnh cơ sở, phóng to từng trang trong thực đơn 14 trang và gửi yêu cầu tư vấn. Chuyển tab vẫn giữ trang thực đơn đang xem và lời nhắn đang soạn.

## Quản trị

Vào `/admin/` và dùng mã quản trị để mở một trong ba chuyên mục.

- Trong **Nội dung website**, dùng **Tab cần sửa** để chọn đúng phần trên trang khách. Tại đây có thể đổi tên tab, tiêu đề, chữ trên nút, câu chuyện Đồng Vị, ảnh cơ sở, nội dung nhượng quyền, hotline và thực đơn. Dùng mũi tên cạnh từng mục để đổi thứ tự ảnh cơ sở, các bước hợp tác hoặc trang menu.
- Với mỗi ảnh, chọn **Chọn từ thư viện** để xem hình thu nhỏ, **Tải ảnh từ máy** để thêm JPEG, PNG, WebP hoặc nhập đường dẫn. Sau khi xem ảnh đã chọn, nhấn **Lưu nội dung website** hoặc **Lưu bài viết**. Ảnh tải lên dùng chung trên các thiết bị. Trình duyệt hỗ trợ thu nhỏ ảnh nguồn đến 16 MB để mỗi ảnh lưu trong SQLite/D1 tối đa 1,5 MiB.
- Sau khi lưu, các tab khách trong cùng trình duyệt nhận thông báo để đọc bản mới. Trình duyệt khác đọc lại khi quay về website và kiểm tra mỗi 30 giây trong lúc trang đang hiển thị. Nhân viên sửa các trường khác nhau có thể lưu độc lập.
- **Tin tức & sự kiện** cho phép soạn bài, đặt ngày bắt đầu và ngày kết thúc, công khai hoặc ẩn bài. Website hiển thị sự kiện đã, đang và sắp diễn ra theo ngày tại Việt Nam. Bài đã kết thúc vẫn xuất hiện cho đến khi quản trị viên ẩn hoặc xóa.
- **Hộp thư liên hệ** hiển thị họ tên, điện thoại, email, địa chỉ và nội dung cần tư vấn.

Mục **Vận hành nhà hàng** mở các công cụ nghiệp vụ trước đây tại `/admin/van-hanh.html`, với phiên đăng nhập riêng.

## Chạy API nội dung, sự kiện và liên hệ

### Node trên máy phát triển

Dùng Node.js 24 và chạy từ thư mục gốc của dự án. Ví dụ PowerShell dưới đây tạo token cho phiên phát triển, hiển thị token trong terminal để nhập vào trang quản trị và tắt lịch tự động xuất bản Git.

```powershell
$env:TONGWEI_ADMIN_TOKEN = node -p "require('node:crypto').randomBytes(32).toString('hex')"
$env:TONGWEI_DISABLE_SCHEDULER = "1"
Write-Host $env:TONGWEI_ADMIN_TOKEN
node server.js
```

Mở `http://localhost:8088/` hoặc `http://localhost:8088/admin/`. Với dịch vụ chạy lâu dài, cấp `TONGWEI_ADMIN_TOKEN` qua môi trường của tiến trình. Thiếu token thì các API quản trị nội dung trả về HTTP 401. SQLite tạo `~/.tongwei/cms.sqlite` ở lần chạy đầu, kèm bốn sự kiện mẫu. Có thể đặt `TONGWEI_DATA_DIR` tới một thư mục riêng trên ổ đĩa bền vững bên ngoài thư mục website. Các tiến trình Node trên cùng máy dùng chung thư mục này sẽ đọc cùng dữ liệu. Giữ cả thư mục, gồm các tệp WAL, khi quản lý bản sao lưu.

### Cloudflare Workers và Pages Functions

Website chính thức dùng Worker `tongwei-restaurant` tại [tongweivn.com](https://tongweivn.com/). Quản trị viên nhập mã production tại [trang biên tập](https://tongweivn.com/admin/). Các liên kết trang chủ và quản trị trên GitHub Pages chuyển đến cùng trang trên tên miền chính thức.

`wrangler.toml` khai báo tài khoản production và binding `DB` cho D1 hiện có `tongwei-db`. Wrangler 4 dùng D1 giả lập khi chạy với `--local`. Cấu hình cơ sở dữ liệu và secret riêng cho các môi trường khác. Secret `TONGWEI_ADMIN_TOKEN` có thể đặt qua dấu nhắc của `wrangler secret put`.

Với Pages, chọn thư mục gốc của repo làm project root để Pages biên dịch `functions/api/`. Đặt build command là `node functions/lib/prepare-assets.cjs` và build output directory là `node_modules/.cache/tongwei-public`. Trong **Settings → Bindings**, thêm binding D1 tên `DB` tới cùng database nếu muốn chia sẻ nội dung với Worker. Đặt secret bằng `wrangler pages secret put TONGWEI_ADMIN_TOKEN --project-name <ten-du-an>` hoặc qua **Settings → Variables and Secrets**. Cấu hình binding và secret riêng cho Preview khi dùng môi trường đó.

**D1 mới** — khởi tạo schema và dữ liệu mẫu một lần. Các lệnh sau thao tác với D1 giả lập trên máy phát triển.

```sh
wrangler d1 execute DB --local --file schema.sql
wrangler d1 migrations apply DB --local
wrangler dev --local
```

Để thử quản trị trong Wrangler local, đặt `TONGWEI_ADMIN_TOKEN=<token-chi-dung-local>` trong tệp `.env.local` ở thư mục gốc và chạy `wrangler dev --local --env-file .env.local`. Tệp này đã được Git bỏ qua và nằm ngoài thư mục build tĩnh. Với D1 từ xa, dùng `--remote` thay cho `--local` trong hai lệnh D1 sau khi chọn đúng database.

**D1 hiện có từ phiên bản trước** — dùng quy trình nâng cấp sau để giữ nguyên sự kiện đã sửa hoặc đã xóa và các bảng nghiệp vụ.

1. Chạy `wrangler d1 execute DB --local --command "PRAGMA table_info(events)"`.
2. Nếu bảng `events` thiếu cột `end_date`, chạy `wrangler d1 execute DB --local --command "ALTER TABLE events ADD COLUMN end_date TEXT"`. Một số bản cũ đã tự thêm cột này. Giữ nguyên cột hiện có cùng các giá trị đã lưu.
3. Chạy `wrangler d1 migrations apply DB --local` để thêm bảng nội dung và liên hệ (`0001_site_and_contacts.sql`) cùng kho ảnh (`0002_cms_media.sql`). Khi nâng cấp database từ xa, dùng `--remote` cho cả ba bước.

**Hợp đồng dữ liệu** — `GET /api/site` ban đầu trả về `{}`. Trang công khai và quản trị tải `/data/site.json` rồi ghi đè bằng các trường trả về từ API. `PUT /api/site` thay thế toàn bộ đối tượng đã lưu. Trang biên tập dùng `PATCH /api/site` để lưu riêng các trường đã sửa. `POST /api/media` và danh sách `GET /api/media` dành cho quản trị viên. Khách đọc ảnh qua `GET /api/media/<sha256>`. API sự kiện giữ nguyên chuỗi ngày hiển thị cũ. Ngày kết thúc dạng ISO dùng để phân loại lịch sự kiện theo giờ Việt Nam. `GET /api/events?admin=1`, các thao tác ghi sự kiện, lưu nội dung và `GET /api/contacts` dùng header `Authorization: Bearer <TONGWEI_ADMIN_TOKEN>`. Form liên hệ gửi JSON tới `POST /api/contacts`, gồm tên, điện thoại, lời nhắn và hai trường tùy chọn email, địa chỉ. Các chuỗi trong JSON là văn bản thuần. Khi hiển thị, gán vào `textContent` hoặc thuộc tính DOM phù hợp.

**Kiểm thử** — `node --test tests/cms-api.test.cjs` dùng database tạm và tắt lịch Git. Để chạy thêm kiểm thử Worker và Pages trên D1 local, cài Wrangler 4 và đảm bảo Node có thể tìm thấy gói `wrangler`. Với Wrangler cài toàn cục, chạy `$env:NODE_PATH = (npm root -g)` trong PowerShell trước khi chạy kiểm thử.

---
© 2026 TongWei Cantonese Flavours. All rights reserved.
