// Trang đọc bài: tiêu đề, nội dung Markdown, mục lục bên phải, bài trước/sau.
import { CONFIG } from './config.js';
import { $, esc, formatDate, getText } from './utils.js';
import { getLang, t } from './i18n.js';
import { listPosts, loadIndex, postAsset } from './posts-data.js';
import { renderMarkdown } from './markdown.js';

let seq = 0;

const stripFrontMatter = s => s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

/** @returns {Promise<string|null>} tiêu đề bài để đặt document.title */
export async function renderPost(slug) {
  const host = $('#postContent');
  const my = ++seq;
  host.innerHTML = '';

  const lang = getLang();
  const variants = (await loadIndex()).filter(p => p.slug === slug);
  if (!variants.length) {
    host.innerHTML = `<div class="empty" style="margin-top:40px"><h3>${esc(t('notFoundTitle'))}</h3><p>${esc(t('notFoundText'))}</p></div>`;
    return null;
  }
  const post = variants.find(v => v.lang === lang) ?? variants[0];
  const fileUrl = new URL(CONFIG.postsDir + post.file, location.href);
  const body = await renderMarkdown(stripFrontMatter(await getText(fileUrl)), fileUrl);
  if (my !== seq) return null;                       // người đọc đã chuyển trang/ngôn ngữ trong lúc tải

  const all = await listPosts(lang);
  const i = all.findIndex(p => p.slug === slug);
  const newer = all[i - 1], older = all[i + 1];
  const heads = [...body.querySelectorAll('h2, h3')];

  host.innerHTML = `
    <header class="post-head">
      <div class="eyebrow">${esc(t('categories')[post.category] ?? post.category)}</div>
      <h1>${esc(post.title)}</h1>
      ${post.summary ? `<p class="post-lead">${esc(post.summary)}</p>` : ''}
      <div class="post-info">
        <span>${esc(formatDate(post.date, lang))}</span>
        <span>${post.readingTime} ${esc(t('minRead'))}</span>
      </div>
      <div class="tagrow">${post.tags.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
    </header>
    ${post.cover ? `<img class="post-cover" src="${esc(postAsset(post.cover))}" alt="">` : ''}
    ${post.lang !== lang ? `<p class="notice">${esc(t('fallbackNotice'))}</p>` : ''}
    <div class="post-layout">
      <article class="prose" id="prose"></article>
      ${heads.length > 1 ? `<aside class="toc" aria-label="${esc(t('onThisPage'))}">
        <div class="toc-title">${esc(t('onThisPage'))}</div>
        ${heads.map(h => `<a href="#/blog/${encodeURIComponent(slug)}" data-target="${h.id}" class="${h.tagName === 'H3' ? 'sub' : ''}">${esc(h.textContent)}</a>`).join('')}
      </aside>` : ''}
    </div>
    <nav class="post-nav">
      ${older ? `<a href="#/blog/${encodeURIComponent(older.slug)}"><small>${esc(t('prevPost'))}</small><span>${esc(older.title)}</span></a>` : '<span></span>'}
      ${newer ? `<a class="next" href="#/blog/${encodeURIComponent(newer.slug)}"><small>${esc(t('nextPost'))}</small><span>${esc(newer.title)}</span></a>` : '<span></span>'}
    </nav>`;
  $('#prose').replaceWith(Object.assign(body, { className: 'prose', id: 'prose' }));
  wireToc(host);
  return post.title;
}

function wireToc(host) {
  const links = [...host.querySelectorAll('.toc a')];
  if (!links.length) return;
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();                               // giữ nguyên hash của router
    document.getElementById(a.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  const byId = new Map(links.map(a => [a.dataset.target, a]));
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) {
      links.forEach(a => a.classList.remove('active'));
      byId.get(en.target.id)?.classList.add('active');
    }
  }, { rootMargin: '0px 0px -70% 0px' });
  byId.forEach((_, id) => io.observe(document.getElementById(id)));
}
