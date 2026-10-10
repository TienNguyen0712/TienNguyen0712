const SITE_ROOT = new URL("../", import.meta.url);

export const CONFIG = {
  siteName: "Minh Anh",
  defaultLang: "en",
  postsDir: new URL("content/posts/", SITE_ROOT).href,
  postsIndexURL: new URL(
    "content/posts/index.json",
    SITE_ROOT
  ).href,
  hljsUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
};
