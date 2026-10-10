# Personal blog — Minh Anh

Site tĩnh (HTML/CSS/JS thuần, không framework). Viết bài bằng **Markdown**, push lên GitHub là tự đăng.
Trang đọc bài dùng chung biến màu, font, thẻ, nút với trang hồ sơ nên luôn đồng bộ giao diện (kể cả sáng/tối và EN/VI).

## Cấu trúc

```
index.html              Khung trang: header, trang Hồ sơ, Blog, Đọc bài, footer
css/
  base.css              Biến màu (sáng/tối), reset
  layout.css            Topbar, section, footer
  components.css        Nút, thẻ, tag, ảnh bìa
  profile.css           Hero, thống kê, timeline
  blog.css              Trang danh sách blog, bộ lọc
  article.css           Trang đọc bài: chữ, code, bảng, mục lục
js/
  config.js             Tên site, ngôn ngữ mặc định, thư mục bài viết
  main.js               Khởi động
  router.js             #/  #/blog  #/blog/<slug>
  i18n.js  theme.js     Song ngữ, sáng/tối
  blog.js  post.js      Danh sách bài, trang đọc bài
  markdown.js           Markdown → HTML (+ copy code, tô màu)
  projects.js           Lưới dự án
  vendor/marked.umd.js  Thư viện Markdown (đã kèm sẵn)
content/
  posts/*.md            ← BÀI VIẾT CỦA BẠN
  posts/index.json      Danh mục bài (tự sinh, đừng sửa tay)
  images/               Ảnh dùng trong bài
  i18n/en.json vi.json  Mọi chữ trên trang hồ sơ + giao diện
  projects.json         Danh sách dự án
scripts/
  dev.mjs               Server xem thử khi viết
  build-index.mjs       Quét .md → index.json
.github/workflows/deploy.yml   Tự deploy lên GitHub Pages
```

## Chạy thử trên máy

Cần Node.js 18+. **Không mở `index.html` bằng cách bấm đúp** (trình duyệt chặn đọc file JSON/MD khi dùng `file://`).

```bash
node scripts/dev.mjs        # hoặc: npm run dev
# mở http://localhost:8080
```

Sửa/lưu file `.md` rồi F5 là thấy ngay, không cần build lại.

## Viết một bài mới

1. Copy `content/posts/_template.md` thành `content/posts/ten-bai.vi.md` (hoặc `.en.md`).
2. Sửa phần đầu (front matter) và viết nội dung bên dưới:

```markdown
---
title: Tiêu đề bài viết
date: 2026-06-01
category: cs
tags: [Python, Thuật toán]
summary: Một hai câu mô tả hiện trên thẻ bài.
---

Nội dung Markdown...
```

| Trường | Bắt buộc | Ghi chú |
| --- | --- | --- |
| `title` | có | |
| `date` | có | Dạng `YYYY-MM-DD`; bài mới nhất hiện đầu |
| `category` | có | `cs`, `build` hoặc `notes` (xem mục thêm chuyên mục) |
| `tags` | không | `[a, b, c]` |
| `summary` | không | Hiện trên thẻ và dưới tiêu đề |
| `cover` | không | Ảnh bìa, vd `../images/bia.png` |
| `draft` | không | `true` = chưa công khai |

**Song ngữ:** đuôi tên file quyết định ngôn ngữ. `ten-bai.vi.md` và `ten-bai.en.md` là *một bài* hai ngôn ngữ (cùng slug `ten-bai`, nút EN/VI chuyển qua lại).
Chỉ viết một ngôn ngữ cũng được: người đọc ở ngôn ngữ còn lại vẫn thấy bài, kèm ghi chú "chưa có bản dịch".

**Ảnh:** bỏ vào `content/images/`, chèn bằng `![mô tả](../images/ten-anh.png)`.

**Code:** dùng khối ``` có tên ngôn ngữ (```python) để được tô màu và nút Copy.

Mục lục bên phải tự tạo từ các tiêu đề `##` và `###`.

## Sửa nội dung trang hồ sơ

- Chữ (tên, giới thiệu, GPA, trường…): `content/i18n/en.json` và `vi.json`. Khóa trùng với `data-i="..."` trong `index.html`.
- Dự án: `content/projects.json` (thêm `"url"` để tên dự án thành link).
- Email / GitHub / LinkedIn: phần `#contact` trong `index.html`.
- CV: đặt file `cv.pdf` cạnh `index.html`.
- Tên hiển thị trên tab trình duyệt: `js/config.js`.
- Màu sắc: các biến ở đầu `css/base.css`.

## Thêm chuyên mục

Thêm một dòng vào `"categories"` ở **cả** `content/i18n/en.json` và `vi.json`, ví dụ `"research": "Research"`.
Dùng `category: research` trong bài; nút lọc tự xuất hiện.

## Đưa lên mạng (GitHub Pages)

1. Tạo repo trên GitHub, push toàn bộ thư mục này lên nhánh `main`.
2. Vào **Settings → Pages → Build and deployment → Source** chọn **GitHub Actions**.
3. Mỗi lần push, workflow `deploy.yml` sinh `index.json` rồi đăng site. Địa chỉ dạng `https://<user>.github.io/<repo>/`.

Tên miền riêng: **Settings → Pages → Custom domain**.

Hosting khác (Netlify, Cloudflare Pages, Vercel): Build command `node scripts/build-index.mjs`, thư mục xuất bản là thư mục gốc `.`.
Nếu tự upload lên hosting thường, chạy `npm run build` trước để `content/posts/index.json` được cập nhật.

## Lưu ý

- **Tô màu code** tải highlight.js từ cdnjs khi bài có code. Offline hoặc bị chặn thì code vẫn hiển thị, chỉ không có màu. Muốn không phụ thuộc mạng: tải file đó về `js/vendor/` và đổi `hljsUrl` trong `js/config.js`.
- Markdown được render nguyên văn, không lọc HTML. Ổn vì chỉ mình bạn viết; đừng nhận nội dung từ người lạ.
- Địa chỉ bài có dạng `#/blog/<slug>` (router theo hash) nên chạy được trên mọi hosting tĩnh, nhưng công cụ tìm kiếm và bản xem trước khi chia sẻ link sẽ không thấy tiêu đề riêng từng bài. Nếu SEO quan trọng, bước nâng cấp hợp lý là sinh sẵn một file HTML cho mỗi bài trong `build-index.mjs`.
