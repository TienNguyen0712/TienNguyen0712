// Router theo hash, chạy được trên mọi hosting tĩnh (không cần cấu hình rewrite):
//   #/            → hồ sơ        #/blog → danh sách       #/blog/<slug> → đọc bài
// Hash kiểu #contact, #projects (không có "/") vẫn là neo cuộn trang trong hồ sơ.
import { CONFIG } from './config.js';
import { $ } from './utils.js';
import { t } from './i18n.js';
import { renderProjects } from './projects.js';
import { renderBlog } from './blog.js';
import { renderPost } from './post.js';

const pages = { profile: $('#profilePage'), blog: $('#blogPage'), post: $('#postPage') };
let route = { page: 'profile' };

function parse(hash) {
  if (hash === '' || hash === '#') return { page: 'profile' };
  if (!hash.startsWith('#/')) return null;
  const [a, b] = hash.slice(2).split('/').filter(Boolean).map(decodeURIComponent);
  if (a === 'blog') return b ? { page: 'post', slug: b } : { page: 'blog' };
  return { page: 'profile' };
}

async function show(r, scrollTop) {
  route = r;
  for (const [name, el] of Object.entries(pages)) el.classList.toggle('hidden', name !== r.page);
  document.querySelectorAll('[data-route]').forEach(b => {
    const on = (b.dataset.route === '#/') === (r.page === 'profile');
    b.classList.toggle('active', on);
  });
  if (scrollTop) window.scrollTo({ top: 0, behavior: 'instant' });

  const site = CONFIG.siteName;
  if (r.page === 'profile') { await renderProjects(); document.title = `${t('navProfile')} — ${site}`; }
  if (r.page === 'blog')    { await renderBlog();     document.title = `${t('navBlog')} — ${site}`; }
  if (r.page === 'post')    { const title = await renderPost(r.slug); document.title = title ? `${title} — ${site}` : site; }
}

export const refresh = () => show(route, false);

export function go(hash) {
  if (location.hash === hash || (hash === '#/' && location.hash === '')) show(parse(hash), true);
  else location.hash = hash;
}

export function initRouter() {
  document.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => go(b.dataset.route)));
  addEventListener('hashchange', () => {
    const r = parse(location.hash);
    if (r) show(r, true);
    else if (route.page !== 'profile') show({ page: 'profile' }, false).then(() => document.querySelector(location.hash)?.scrollIntoView());
  });
  show(parse(location.hash) ?? { page: 'profile' }, false);
}
