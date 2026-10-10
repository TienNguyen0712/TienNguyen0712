import { $ } from './utils.js';
import { initTheme } from './theme.js';
import { initI18n, onLangChange, toggleLang } from './i18n.js';
import { initBlogFilters } from './blog.js';
import { initRouter, refresh } from './router.js';

async function boot() {
  initTheme();
  try {
    await initI18n();
  } catch (err) {
    // Thường gặp khi mở index.html bằng file:// — trình duyệt chặn fetch().
    $('#profilePage').insertAdjacentHTML('afterbegin',
      '<div class="empty" style="margin-top:30px">Could not load content. Serve this folder with a local web server: <code>node scripts/dev.mjs</code></div>');
    console.error(err);
    return;
  }
  $('#lang').addEventListener('click', toggleLang);
  onLangChange(refresh);
  initBlogFilters();
  initRouter();
}
boot();
