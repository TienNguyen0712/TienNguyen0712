// Quét content/posts/*.md → ghi content/posts/index.json (không cần cài thư viện nào).
// Chạy:  node scripts/build-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const LANGS = ['en', 'vi'];

/** Đọc front matter dạng YAML đơn giản: `key: value`, `tags: [a, b]`, true/false. */
export function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (!/^["']/.test(v)) v = v.replace(/\s+#.*$/, '');   // bỏ ghi chú cuối dòng: `category: cs  # ghi chú`
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map(s => unquote(s.trim())).filter(Boolean);
    } else if (v === 'true' || v === 'false') {
      v = v === 'true';
    } else {
      v = unquote(v);
    }
    data[kv[1]] = v;
  }
  return { data, body: text.slice(m[0].length) };
}
const unquote = s => s.replace(/^(["'])(.*)\1$/, '$2');

function readingTime(body) {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')   // bỏ code block
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function buildIndex() {
  const posts = [];
  const warnings = [];
  for (const file of fs.readdirSync(POSTS_DIR).sort()) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;   // _template.md bị bỏ qua
    const base = file.slice(0, -3);
    const parts = base.split('.');
    const suffix = parts.length > 1 && LANGS.includes(parts[parts.length - 1]) ? parts.pop() : null;
    const slug = parts.join('.');
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
    if (data.draft === true) continue;

    const lang = suffix || data.lang || 'en';
    const need = ['title', 'date', 'category'].filter(k => !data[k]);
    if (need.length) { warnings.push(`${file}: thiếu ${need.join(', ')} → bỏ qua`); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) { warnings.push(`${file}: date phải là YYYY-MM-DD → bỏ qua`); continue; }

    posts.push({
      slug, lang, file,
      title: data.title,
      date: String(data.date),
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary || '',
      cover: data.cover || '',
      readingTime: readingTime(body),
    });
  }
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return { posts, warnings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { posts, warnings } = buildIndex();
  fs.writeFileSync(path.join(POSTS_DIR, 'index.json'), JSON.stringify(posts, null, 2) + '\n');
  warnings.forEach(w => console.warn('⚠ ' + w));
  console.log(`✓ index.json: ${posts.length} bài (${new Set(posts.map(p => p.slug)).size} slug)`);
}
