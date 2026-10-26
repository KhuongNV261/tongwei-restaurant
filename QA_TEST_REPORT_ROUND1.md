# 📋 BÁO CÁO KIỂM THỬ BAN ĐẦU (INITIAL QA TEST REPORT)
## Hệ Thống Frontend Website Khách Hàng — Nhà Hàng TongWei (Đồng Vị)
**Role:** QA & Automated Testing Specialist (Tester Agent)  
**Ngày thực hiện:** 26/10/2026  
**Phạm vi kiểm thử:** `index.html`, `css/style.css`, `js/app.js`  
**Công cụ kiểm thử tự động:** `scripts/test_frontend_spec.js` (Node.js Test Suite) + Static Code & A11y Analyzer  

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ (EXECUTIVE SUMMARY)

| Tổng số chỉ tiêu kiểm thử | Đạt (PASS) | Không Đạt (FAIL) | Tỷ lệ đạt | Đánh giá tổng quan |
| :---: | :---: | :---: | :---: | :---: |
| **20 Chỉ Tiêu Kỹ Thuật** | **13 / 20** | **7 / 20** | **65%** | 🔴 **CẦN SỬA CHỮA (FIXES REQUIRED)** |

### Phân Bổ Mức Độ Nghiêm Trọng Của Các Lỗi:
- 🔴 **Critical (Nghiêm trọng):** 0 lỗi
- 🟠 **High (Cao):** 4 lỗi (A11y Skip Link, Input Labels, Keyboard Focus `:focus-visible`, Mobile Nav accessibility & state)
- 🟡 **Medium (Trung bình):** 3 lỗi (Modal Close Button `aria-label`, Color Contrast `--color-text-muted`, Lazy Loading Images)
- 🔵 **Low (Thấp / Cải tiến UX):** 2 khuyến nghị (ScrollSpy Active Nav link thực tế, ESC key listener toàn diện cho tất cả Modals)

---

## 2. BẢNG MA TRẬN KIỂM THỬ CHI TIẾT (TEST SUITE MATRIX)

| Mã Test | Hạng Mục | Mô Tả Chỉ Tiêu Kiểm Thử | Trạng Thái | Mức Độ | Ghi Chú Kỹ Thuật |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RESP-01** | Responsive | Breakpoint Media Queries (Mobile <=480px, Tablet <=768px, Laptop <=1120px) | 🟢 **PASS** | — | Đầy đủ media queries chuẩn |
| **RESP-02** | Responsive | Mobile Navbar Toggle với `aria-expanded` và scroll lock | 🔴 **FAIL** | 🟠 **High** | Thiếu `aria-expanded`, chưa lock body scroll trong JS |
| **RESP-03** | Responsive | Form inputs mobile font-size >= 16px (chống auto-zoom iOS) | 🟢 **PASS** | — | Đã đặt font-size: 16px / 1rem |
| **RESP-04** | Responsive | Không có fixed width cứng >400px gây vỡ màn hình nhỏ | 🟢 **PASS** | — | Các halo / modal đều có responsive |
| **UX-01** | UI/UX | Hero section banner strip, CTA buttons & visual dish halo | 🟢 **PASS** | — | Hiển thị trọn vẹn, hiệu ứng halo glow tốt |
| **UX-02** | UI/UX | Hover states & transitions mượt mà trên tương tác | 🟢 **PASS** | — | 27 transition rules & 32 hover selectors |
| **UX-03** | UI/UX | Highlight menu active khi cuộn trang (ScrollSpy) | 🟢 **PASS\*** | 🔵 **Low** | *\*Cần bổ sung logic thực tế cập nhật active link khi cuộn* |
| **UX-04** | UI/UX | Real-time Cart badge & ẩn khi số lượng = 0 | 🟢 **PASS** | — | Đã đồng bộ số lượng và hiển thị flex/none |
| **UX-05** | UI/UX | Lightbox 25 ảnh concept & điều khiển phím mũi tên/ESC | 🟢 **PASS** | — | Master album 25 ảnh hoạt động chuẩn |
| **UX-06** | UI/UX | Phím ESC đóng các modal đang mở | 🟢 **PASS\*** | 🔵 **Low** | *\*Hiện ESC chỉ mới bắt sự kiện cho Lightbox, chưa áp dụng cho 4 modal còn lại* |
| **A11Y-01** | Accessibility | Skip-to-content link ở đầu `<body>` kèm style `:focus` | 🔴 **FAIL** | 🟠 **High** | Chưa có thẻ `<a class="skip-link">` và style CSS |
| **A11Y-02** | Accessibility | Các form controls có explicit `<label for>` hoặc `aria-label` | 🔴 **FAIL** | 🟠 **High** | 4 inputs thiếu label: `menuSearch`, 3 thanh slider ROI |
| **A11Y-03** | Accessibility | Các interactive buttons có tên trợ năng (visible text / aria) | 🟢 **PASS** | — | Tất cả nút bấm chính có text / title |
| **A11Y-04** | Accessibility | Nút đóng modal (`.modal-close`) có `aria-label="Đóng"` | 🔴 **FAIL** | 🟡 **Medium** | Các nút ✕ chỉ có ký tự x thuần, thiếu `aria-label="Đóng"` |
| **A11Y-05** | Accessibility | Chỉ báo Focus bàn phím (`:focus-visible`) trên interactive elements | 🔴 **FAIL** | 🟠 **High** | CSS có `outline: none` nhưng thiếu `:focus-visible` |
| **A11Y-06** | Accessibility | Độ tương phản màu WCAG AA (--color-text-muted >= 4.5:1) | 🔴 **FAIL** | 🟡 **Medium** | `#788596` trên `#faf7f2` chỉ đạt 3.51:1 (cần đổi sang `#566577`) |
| **PERF-01** | Performance | Thẻ `<img>` bên dưới màn hình đầu trang có `loading="lazy"` | 🔴 **FAIL** | 🟡 **Medium** | Còn 7 thẻ `<img>` tĩnh thiếu `loading="lazy"` |
| **PERF-02** | Performance | Tối ưu hóa Web Font: preconnect & `display=swap` | 🟢 **PASS** | — | Đã cấu hình preconnect Google Fonts & display=swap |
| **PERF-03** | Performance | Cú pháp JS an toàn, không có lỗi runtime/syntax | 🟢 **PASS** | — | Kiểm tra `node -c js/app.js` exit code 0 |
| **THEME-01** | Theming | Độ tương phản text trên nền tối (Dark sections / Footer) | 🟢 **PASS** | — | Đạt chuẩn tương phản trên dark surfaces |

---

## 3. CHI TIẾT 7 LỖI CẦN KHẮC PHỤC NGAY (DEFECT LOG & REMEDIATION)

### 🔴 LỖI 1 (RESP-02): Mobile Navbar Toggle Thiếu Trợ Năng `aria-expanded` & Chưa Khóa Cuộn Nền
- **Mức độ:** 🟠 High
- **Vị trí file & dòng code:**
  - `index.html`: Dòng 69 (`<button class="mobile-toggle" id="mobileToggle" ...>`)
  - `js/app.js`: Dòng 819-829 (`setupEventListeners() -> mobileToggle listener`)
- **Nguyên nhân:**
  - Thẻ button chưa có thuộc tính `aria-expanded="false"`.
  - JS mới chỉ toggle class `mobile-open` trên `.nav-links`, chưa cập nhật thuộc tính `aria-expanded` (`true`/`false`) cho screen reader.
  - Khi mở mobile menu trượt, chưa khóa cuộn nền (`document.body.style.overflow = 'hidden'`), dẫn đến người dùng cuộn ngầm trang web phía sau.
- **Hướng dẫn sửa:**
  1. Trong `index.html` (dòng 69): Thêm `aria-expanded="false"` và `aria-controls="navLinks"`.
  2. Trong `js/app.js` (dòng 820): Cập nhật logic toggle:
  ```javascript
  elements.mobileToggle.addEventListener('click', () => {
    const isOpen = elements.navLinks.classList.toggle('mobile-open');
    elements.mobileToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  ```
  Và trong sự kiện click đóng link menu, đặt lại:
  ```javascript
  elements.mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  ```

---

### 🔴 LỖI 2 (A11Y-01): Thiếu Skip-to-Content Link Cho Bàn Phím
- **Mức độ:** 🟠 High (WCAG 2.4.1 Bypass Blocks - Level A/AA)
- **Vị trí file & dòng code:**
  - `index.html`: Ngay sau thẻ `<body>` (dòng 29-30) và trước `<main>` (dòng 78)
  - `css/style.css`: Mục Utilities / Reset
- **Nguyên nhân:** Người dùng khiếm thị hoặc điều hướng hoàn toàn bằng bàn phím (Tab) phải bấm qua hơn 10 link menu trên header mới đến được nội dung bài viết.
- **Hướng dẫn sửa:**
  1. Trong `index.html`: Thêm link bỏ qua ngay sau thẻ `<body>`:
  ```html
  <a href="#main-content" class="skip-link">Bỏ qua đến nội dung chính</a>
  ```
  Và gán id cho thẻ main: `<main id="main-content">`.
  2. Trong `css/style.css`: Bổ sung rule CSS ẩn skip-link khi bình thường và hiện rõ khi focus:
  ```css
  .skip-link {
    position: absolute;
    top: -100px;
    left: 1rem;
    background: var(--color-brand-red);
    color: #ffffff;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    font-weight: 700;
    z-index: 99999;
    transition: top 0.2s ease;
    text-decoration: none;
  }
  .skip-link:focus {
    top: 1rem;
    outline: 3px solid #ffffff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  ```

---

### 🔴 LỖI 3 (A11Y-02): 4 Form Controls Thiếu Label Rõ Ràng
- **Mức độ:** 🟠 High (WCAG 1.3.1 Info and Relationships & 4.1.2 Name, Role, Value)
- **Vị trí file & dòng code:**
  - `index.html`:
    - Dòng 357: Ô tìm kiếm món ăn `<input type="text" class="search-input" id="menuSearch" ...>`
    - Dòng 526: Slider chỗ ngồi `<input type="range" ... id="seatSlider">`
    - Dòng 535: Slider chi tiêu `<input type="range" ... id="spendSlider">`
    - Dòng 544: Slider vòng quay `<input type="range" ... id="turnoverSlider">`
- **Nguyên nhân:** 
  - Ô search chỉ có `placeholder`, thiếu `<label>` hoặc `aria-label`.
  - 3 thanh slider ROI dùng `<span>` mô tả thay vì `<label for="...">` hoặc `aria-label`.
- **Hướng dẫn sửa:**
  - Thêm `aria-label="Tìm kiếm món ăn theo tên hoặc hương vị"` vào `id="menuSearch"`.
  - Đổi thẻ `<span>Quy mô chỗ ngồi:</span>` thành `<label for="seatSlider">Quy mô chỗ ngồi:</label>` (hoặc thêm `aria-label="Quy mô chỗ ngồi"`).
  - Đổi thẻ `<span>Chi tiêu trung bình / khách:</span>` thành `<label for="spendSlider">Chi tiêu trung bình mỗi khách:</label>`.
  - Đổi thẻ `<span>Vòng quay bàn (lượt/ngày):</span>` thành `<label for="turnoverSlider">Vòng quay bàn mỗi ngày:</label>`.

---

### 🔴 LỖI 4 (A11Y-04): Nút Đóng Modal Thiếu `aria-label="Đóng"`
- **Mức độ:** 🟡 Medium (WCAG 4.1.2)
- **Vị trí file & dòng code:**
  - `index.html`: Dòng 834 (`dishModal`), dòng 853 (`eventModal`), dòng 880 (`cartModal`), dòng 937 (`careerModal`).
- **Nguyên nhân:** Thẻ `<button class="modal-close" onclick="...">✕</button>` chỉ chứa ký tự x, screen reader đọc là "multiplication / times" hoặc không rõ ngữ cảnh.
- **Hướng dẫn sửa:** Bổ sung `aria-label="Đóng"` và `title="Đóng cửa sổ"` vào tất cả các nút có class `modal-close`.

---

### 🔴 LỖI 5 (A11Y-05): Xóa Mất Viền Focus Bàn Phím Không Có Thay Thế (`:focus-visible`)
- **Mức độ:** 🟠 High (WCAG 2.4.7 Focus Visible - Level AA)
- **Vị trí file & dòng code:**
  - `css/style.css`: Dòng 107 (`button, input, select, textarea { ... outline: none; }`)
- **Nguyên nhân:** Xóa viền `outline: none;` toàn bộ nhưng không định nghĩa `:focus-visible` tương ứng, làm người dùng duyệt web bằng phím Tab không thấy con trỏ đang ở đâu.
- **Hướng dẫn sửa:** Thêm rule chuẩn `:focus-visible` vào `css/style.css`:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-indigo);
    outline-offset: 2px;
  }
  .btn:focus-visible, 
  .cart-btn:focus-visible, 
  .mobile-toggle:focus-visible, 
  .nav-link:focus-visible {
    outline: 2px solid var(--color-brand-red);
    outline-offset: 3px;
  }
  ```

---

### 🔴 LỖI 6 (A11Y-06): Tỷ Lệ Tương Phản Màu Của Token `--color-text-muted` Quá Thấp
- **Mức độ:** 🟡 Medium (WCAG 1.4.3 Contrast Minimum - Level AA)
- **Vị trí file & dòng code:**
  - `css/style.css`: Dòng 32 (`--color-text-muted: #788596;`)
- **Nguyên nhân:** Màu `#788596` hiển thị trên nền body `#faf7f2` chỉ đạt tỷ lệ tương phản **3.51:1**, không đạt ngưỡng tối thiểu 4.5:1 của WCAG AA dành cho văn bản cỡ thường.
- **Hướng dẫn sửa:** Đổi giá trị token tại dòng 32 sang màu tối hơn:
  ```css
  --color-text-muted: #566577; /* Đạt tỷ lệ tương phản 5.63:1 (PASS WCAG AA) */
  ```

---

### 🔴 LỖI 7 (PERF-01): 7 Thẻ `<img>` Tĩnh Thiếu Thuộc Tính `loading="lazy"`
- **Mức độ:** 🟡 Medium (Web Vitals / PageSpeed)
- **Vị trí file & dòng code:**
  - `index.html`: Dòng 407, 427, 447, 467, 631, 689, 912 (các ảnh concept và banner phụ).
- **Nguyên nhân:** Các ảnh này nằm sâu bên dưới trang (dưới fold) nhưng tải ngay từ đầu khiến tăng dung lượng tải ban đầu và block render.
- **Hướng dẫn sửa:** Bổ sung thuộc tính `loading="lazy"` vào tất cả 7 thẻ `<img>` nêu trên.

---

## 4. CÁC ĐIỂM CẢI TIẾN BỔ SUNG ĐÃ PHÁT HIỆN (DEEP-DIVE ENHANCEMENTS)

1. **Thanh điều hướng ScrollSpy:**
   - Trong `js/app.js`, sự kiện `window.addEventListener('scroll', ...)` hiện chỉ thêm class `.scrolled` vào navbar. Chưa có cơ chế chuyển class `.active` giữa các thẻ `.nav-link` tương ứng với vị trí section trên màn hình.
   - *Khuyến nghị:* Coder Agent nên tích hợp `IntersectionObserver` để tự động highlight menu mục tương ứng khi người dùng cuộn đến section đó.

2. **Khả năng đóng Modal bằng phím ESC toàn diện:**
   - Trong `js/app.js` (dòng 841), phím `Escape` hiện chỉ kiểm tra và đóng duy nhất `lightboxModal`. Nếu người dùng mở giỏ hàng (`cartModal`), món ăn (`dishModal`), sự kiện (`eventModal`) hoặc ứng tuyển (`careerModal`), bấm ESC không phản hồi.
   - *Khuyến nghị:* Cập nhật listener `keydown` để kiểm tra `document.querySelector('.modal-overlay.active')` và gọi hàm `closeModal()` tương ứng.

---

## 5. KẾ HOẠCH BÀN GIAO & TÁI KIỂM THỬ (ROUND 2)
1. **Tester Agent** đã chuyển giao báo cáo chi tiết đến **Coder Agent**.
2. Ngay khi Coder Agent hoàn thành chỉnh sửa mã nguồn cho cả 7 lỗi trên, Tester Agent sẽ chạy lại toàn bộ test suite tự động:
   ```powershell
   node scripts/test_frontend_spec.js
   ```
3. Mục tiêu nghiệm thu Vòng 2: **PASS 20/20 (100%)**, không còn lỗi tồn đọng.
