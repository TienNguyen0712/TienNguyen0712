// Trang danh sách blog: bộ lọc chuyên mục + lưới thẻ bài viết.
import { $, esc, formatDate } from './utils.js';
import { getLang, t } from './i18n.js';
import { listPosts, postAsset } from './posts-data.js';

let filter = 'all';

export async function renderBlog() {
  const lang = getLang();
  const cats = t('categories');                       // { cs: '...', build: '...', notes: '...' }
  $('#filters').innerHTML =
    [['all', t('allPosts')], ...Object.entries(cats)]
      .map(([key, label]) => `<button data-filter="${esc(key)}" class="${key === filter ? 'active' : ''}">${esc(label)}</button>`)
      .join('');

  const posts = (await listPosts(lang)).filter(p => filter === 'all' || p.category === filter);
  $('#blogGrid').innerHTML = posts.map(p => card(p, lang)).join('') ||
    `<div class="empty">${esc(t('noPosts'))}</div>`;
}

function card(p, lang) {
  const cover = p.cover
    ? `<div class="cover has-image"><img src="${esc(postAsset(p.cover))}" alt="" loading="lazy"></div>`
    : `<div class="cover">${esc(t('picture'))}</div>`;
  const langTag = p.lang !== lang ? `<span class="tag">${esc(p.lang.toUpperCase())}</span>` : '';
  return `
    <article class="card">
      <a class="card-link" href="#/blog/${encodeURIComponent(p.slug)}">
        ${cover}
        <div class="card-body">
          <div class="post-meta"><span>${esc(formatDate(p.date, lang))}</span><span>${esc(p.category.toUpperCase())}</span></div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <div class="tagrow" style="margin-bottom:16px">${langTag}${p.tags.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
          <span class="read">${esc(t('read'))}</span>
        </div>
      </a>
    </article>`;
}

export function initBlogFilters() {
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    renderBlog();
  });
}
