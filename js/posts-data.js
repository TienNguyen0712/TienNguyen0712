import { CONFIG } from "./config.js";
import { getJSON } from "./utils.js";

let cache;

export const loadIndex = () =>
  (cache ??= getJSON(CONFIG.postsIndexURL));

export async function listPosts(lang) {
  const bySlug = new Map();

  for (const p of await loadIndex()) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, []);
    bySlug.get(p.slug).push(p);
  }

  return [...bySlug.values()]
    .map(variants =>
      variants.find(v => v.lang === lang) ?? variants[0]
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const postAsset = path =>
  new URL(path, CONFIG.postsDir).href;
