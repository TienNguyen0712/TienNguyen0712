// Đọc content/posts/index.json và chọn đúng phiên bản ngôn ngữ cho mỗi bài.
import { CONFIG } from './config.js';
import { getJSON } from './utils.js';

let cache;
export const loadIndex = () => (cache ??= getJSON(CONFIG.postsDir + 'index.json'));

/** Mỗi slug một bài: ưu tiên đúng ngôn ngữ, không có thì lấy bản còn lại. Mới nhất trước. */
export async function listPosts(lang) {
  const bySlug = new Map();
  for (const p of await loadIndex()) (bySlug.get(p.slug) ?? bySlug.set(p.slug, []).get(p.slug)).push(p);
  return [...bySlug.values()]
    .map(variants => variants.find(v => v.lang === lang) ?? variants[0])
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Đường dẫn tương đối trong front matter (vd ../images/a.png) → URL tuyệt đối. */
export const postAsset = path => new URL(path, new URL(CONFIG.postsDir, location.href)).href;
