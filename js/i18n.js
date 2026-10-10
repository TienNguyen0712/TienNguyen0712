// Song ngữ EN/VI. Chuỗi nằm trong content/i18n/{en,vi}.json; phần tử HTML có data-i="khóa" sẽ tự được thay nội dung.
import { CONFIG } from './config.js';
import { getJSON, store } from './utils.js';

const dict = {};
const listeners = [];
let lang = store.get('lang') || CONFIG.defaultLang;

export const getLang = () => lang;
export const t = key => dict[lang]?.[key] ?? dict.en?.[key] ?? key;
export const onLangChange = fn => listeners.push(fn);

export async function initI18n() {
  await Promise.all(['en', 'vi'].map(async l => { dict[l] = await getJSON(`content/i18n/${l}.json`); }));
  if (!dict[lang]) lang = 'en';
  applyStatic();
}

export function toggleLang() {
  lang = lang === 'en' ? 'vi' : 'en';
  store.set('lang', lang);
  applyStatic();
  listeners.forEach(fn => fn(lang));
}

function applyStatic() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i]').forEach(el => {
    const v = dict[lang][el.dataset.i];
    if (typeof v === 'string') el.innerHTML = v;
  });
  document.getElementById('lang').textContent = lang === 'en' ? 'EN / VI' : 'VI / EN';
}
