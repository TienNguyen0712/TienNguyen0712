// Giao diện sáng/tối. Màu nằm trong css/base.css (light-dark()), ở đây chỉ đổi color-scheme.
import { store } from './utils.js';

const root = document.documentElement;
const btn = document.getElementById('theme');
const systemDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
const current = () => root.dataset.theme || (systemDark() ? 'dark' : 'light');

function set(mode) {
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
  btn.textContent = mode === 'dark' ? '☀' : '☾';
}

export function initTheme() {
  const saved = store.get('theme');
  if (saved) set(saved); else btn.textContent = current() === 'dark' ? '☀' : '☾';
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    set(next);
    store.set('theme', next);
  });
}
