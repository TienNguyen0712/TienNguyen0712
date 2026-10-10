// Vẽ lưới dự án từ content/projects.json (mỗi dự án có desc.en / desc.vi).
import { $, esc, getJSON } from './utils.js';
import { getLang, t } from './i18n.js';

let data;
export async function renderProjects() {
  data ??= await getJSON('content/projects.json');
  const lang = getLang();
  $('#projectGrid').innerHTML = data.map(p => `
    <article class="card">
      <div class="cover">${esc(t('picture'))}</div>
      <div class="card-body">
        <div class="card-type">${esc(p.type)}</div>
        <h3>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.title)} ↗</a>` : esc(p.title)}</h3>
        <p>${esc(p.desc[lang] ?? p.desc.en)}</p>
        <div class="tagrow">${p.tags.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
      </div>
    </article>`).join('');
}
