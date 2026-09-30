/* One-off migration: bring all poem pages up to the new template. */
import fs from "node:fs";
import path from "node:path";

const root = "C:/GitHubWS/KesarTarang";
const dir = path.join(root, "poems");

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Tiro+Devanagari+Marathi:ital@0;1&display=swap';

const BOOTSTRAP = `  <script>
    (function () {
      try {
        var t = localStorage.getItem("kesar_tarang_theme");
        if (!t) t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
        document.documentElement.dataset.theme = t;
        var l = localStorage.getItem("kesar_tarang_language");
        if (l === "hi" || l === "en" || l === "mr") document.documentElement.dataset.lang = l;
      } catch (e) {}
    })();
  </script>
</head>`;

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

let changed = 0;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html")).sort()) {
  const full = path.join(dir, file);
  let html = fs.readFileSync(full, "utf8");
  const before = html;

  // 1. html tag carries the language hook
  html = html.replace('<html lang="mr">', '<html lang="mr" data-lang="mr">');

  // 2. font family — add the Latin display serif
  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" rel="stylesheet" \/>/,
    `<link href="${FONTS}" rel="stylesheet" />`
  );

  // 3. description + author meta
  const titleMatch = html.match(/<h1 class="poem-title">([\s\S]*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : "";
  if (title && !/<meta name="description"/.test(html)) {
    html = html.replace(
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      `  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n` +
        `  <meta name="description" content="${escapeAttr(title)} — कवयित्री चैत्राली पंढरपुरे यांच्या कविता संग्रहातील कविता. English & Hindi translation available." />\n` +
        `  <meta name="author" content="Chaitrali Pandharpure" />`
    );
  }

  // 4. pre-paint theme bootstrap
  if (!/kesar_tarang_theme/.test(html)) {
    html = html.replace("</head>", BOOTSTRAP);
  }

  // 5. skip link
  if (!/class="skip-link"/.test(html)) {
    html = html.replace(
      '  <div class="backdrop" aria-hidden="true"></div>',
      '  <a class="skip-link" href="#main">मजकुराकडे जा</a>\n  <div class="backdrop" aria-hidden="true"></div>'
    );
  }

  // 6. landmarks + reveal
  html = html.replace('<main class="poem-page">', '<main class="poem-page" id="main">');
  html = html.replace('<article class="card">', '<article class="card reveal">');

  // 7. mark the original language on the poem body
  html = html.replace('<div class="poem-text">', '<div class="poem-text" lang="mr">');

  // 8. load the optional AI config, then the translation store
  if (!/ai-config\.js/.test(html)) {
    html = html.replace(
      '  <script src="../translations.js"></script>',
      '  <script src="../ai-config.js"></script>\n  <script src="../translations.js"></script>'
    );
  }
  if (!/translations\.js/.test(html)) {
    html = html.replace('  <script src="../script.js"></script>', '  <script src="../translations.js"></script>\n  <script src="../script.js"></script>');
  }

  // 9. ornamental rule between the byline and the verse
  if (!/poem-rule/.test(html)) {
    html = html.replace(
      /(<\/p>\s*\n)(\s*<div class="poem-text")/,
      '$1      <div class="ornament poem-rule"><span class="ornament__mark"></span></div>\n$2'
    );
  }

  // 10. drop the old trailing blank lines
  html = html.replace(/\s+$/, "\n");

  if (html !== before) {
    fs.writeFileSync(full, html, "utf8");
    changed++;
  }
}

console.log(`poem pages updated: ${changed}`);
