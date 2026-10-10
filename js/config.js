// Cấu hình chung của site. Sửa tại đây thay vì rải trong code.
export const CONFIG = {
  siteName: 'Minh Anh',
  defaultLang: 'en',                 // ngôn ngữ khi người đọc chưa chọn: 'en' | 'vi'
  postsDir: 'content/posts/',        // nơi chứa file .md và index.json
  // highlight.js tải từ CDN khi bài có code block. Nếu offline/bị chặn, code vẫn hiển thị (chỉ không tô màu).
  hljsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
};
