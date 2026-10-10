// Markdown → DOM. Dùng marked (js/vendor/marked.umd.js, nạp bằng <script> trong index.html).
// Sau khi render: gắn id cho heading, mở link ngoài ở tab mới, sửa đường dẫn ảnh, bọc bảng, tô màu + nút copy cho code.
import { CONFIG } from './config.js';
import { slugify } from './utils.js';
import { t } from './i18n.js';

let hljsLoading;
function loadHighlighter() {
  if (window.hljs) return Promise.resolve(window.hljs);
  return (hljsLoading ??= new Promise(resolve => {
    const s = document.createElement('script');
    s.src = CONFIG.hljsUrl;
    s.onload = () => resolve(window.hljs);
    s.onerror = () => resolve(null);                 // offline: bỏ qua, code vẫn đọc được
    document.head.appendChild(s);
  }));
}

/** @param {string} md  nội dung đã bỏ front matter  @param {URL} fileUrl  URL của file .md (để sửa đường dẫn ảnh) */
export async function renderMarkdown(md, fileUrl) {
  const box = document.createElement('div');
  box.innerHTML = window.marked.parse(md, { gfm: true });

  const used = new Set();
  box.querySelectorAll('h2, h3, h4').forEach(h => {
    let id = slugify(h.textContent) || 'section', n = 2;
    while (used.has(id)) id = `${slugify(h.textContent)}-${n++}`;
    used.add(id); h.id = id;
  });

  box.querySelectorAll('a[href]').forEach(a => {
    if (/^https?:\/\//i.test(a.getAttribute('href'))) { a.target = '_blank'; a.rel = 'noreferrer'; }
  });

  box.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|data:|\/)/i.test(src)) img.src = new URL(src, fileUrl).href;
    img.loading = 'lazy';
  });

  box.querySelectorAll('table').forEach(tb => {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    tb.replaceWith(wrap); wrap.appendChild(tb);
  });

  const blocks = [...box.querySelectorAll('pre > code')];
  const hljs = blocks.length ? await loadHighlighter() : null;
  for (const code of blocks) {
    const pre = code.parentElement;
    const lang = (code.className.match(/language-([\w+-]+)/) || [])[1];
    if (hljs && lang && hljs.getLanguage(lang)) hljs.highlightElement(code);

    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'copy-btn'; btn.textContent = t('copy');
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code.textContent); btn.textContent = t('copied'); }
      catch { btn.textContent = '!'; }
      setTimeout(() => (btn.textContent = t('copy')), 1400);
    });
    pre.replaceWith(wrap); wrap.append(btn, pre);
  }
  return box;
}
