/* ============================================================
   चैत्र तरंग — site behaviour
   ============================================================ */

const poems = [
  { num: "01", file: "poems/poem-01.html", title: "सात रंग प्रेमाचे", excerpt: "सात रंग प्रेमाचे....." },
  { num: "02", file: "poems/poem-02.html", title: "प्रेमाचं दुकान", excerpt: "प्रेमाचं दुकान....." },
  { num: "03", file: "poems/poem-03.html", title: "माझे बाबा!", excerpt: "माझे बाबा म्हणजे एक विनोदी व्यक्तिमत्व" },
  { num: "04", file: "poems/poem-04.html", title: "सखा!", excerpt: "तू माझा सखा माझा जिवलग दोस्त" },
  { num: "05", file: "poems/poem-05.html", title: "ईवलंस रोपट..", excerpt: "ईवलंस रोपट त्याला नर्सरी मध्ये भेटल" },
  { num: "06", file: "poems/poem-06.html", title: "आभासी जगाचा राजा", excerpt: "आभासी जगाचा राजा तू," },
  { num: "07", file: "poems/poem-07.html", title: "तो आणि ती..", excerpt: "संथ नदीचा प्रवाह तो, खळखळता झरा ती" },
  { num: "08", file: "poems/poem-08.html", title: "अत्तराची कुपी", excerpt: "माझ्या कडे होती एक अत्तराची कुपी" },
  { num: "09", file: "poems/poem-09.html", title: "प्रेमाचं तलम वस्त्र..", excerpt: "धागा धागा जोडून विणलेलं आपल्या प्रेमाचं तलम वस्त्र" },
  { num: "10", file: "poems/poem-10.html", title: "प्रेम..", excerpt: "साम, दाम, दंड, भेद वापरून झाले सारे," },
  { num: "11", file: "poems/poem-11.html", title: "तिचा सूर्य", excerpt: "भावनांचा कल्लोळ दाटूनी आला," },
  { num: "12", file: "poems/poem-12.html", title: "अनोळखी माणूस..", excerpt: "माणसांचं हल्ली काही खरं नाही," },
  { num: "13", file: "poems/poem-13.html", title: "पहिली ओझरती भेट", excerpt: "पहिली ओझरती भेट," },
  { num: "14", file: "poems/poem-14.html", title: "आई", excerpt: "देशपांड्यांच्या सप्तकन्यां मधली धाकटी कळी," },
  { num: "15", file: "poems/poem-15.html", title: "सोडली माझी साथ?", excerpt: "रिते रिते दिस माझे... सूनी वाटे रात" },
  { num: "16", file: "poems/poem-16.html", title: "पाहुणा..", excerpt: "चार मासांचा घेऊन पाहुणचार" },
  { num: "17", file: "poems/poem-17.html", title: "एक निर्णय", excerpt: "घेऊ नकोस निर्णय सोसून कुणाचं दडपण," },
  { num: "18", file: "poems/poem-18.html", title: "तू काय गेलास..", excerpt: "झर झर् चालणारी माझी लेखणी थांबली," },
  { num: "19", file: "poems/poem-19.html", title: "जिवाचं रान केलं तुझ्यासाठी", excerpt: "जिवाचं रान केलं तुझ्यासाठी," },
  { num: "20", file: "poems/poem-20.html", title: "शब्द म्हणजे भावना", excerpt: "शब्द म्हणजे भावना," },
  { num: "21", file: "poems/poem-21.html", title: "रावण", excerpt: "सोज्वळ सुंदर राजसावर जीव भाळला होता," },
  { num: "22", file: "poems/poem-22.html", title: "मी दूर दूर जाताना इतकेच मनाशी वाटे", excerpt: "मी दूर दूर जाताना इतकेच मनाशी वाटे," },
  { num: "23", file: "poems/poem-23.html", title: "मी रेती तू लाट", excerpt: "मी रेती तू लाट," },
  { num: "24", file: "poems/poem-24.html", title: "घसरलेला तोल, सावरू कसे", excerpt: "घसरलेला तोल, सावरू कसे?" },
  { num: "25", file: "poems/poem-25.html", title: "मन भाव भोळा", excerpt: "मन भाव भोळा," },
  { num: "26", file: "poems/poem-26.html", title: "प्रेमाचं विडंबन", excerpt: "प्रेमभ्रमराने केले मनी तिच्या गुंजन" },
  { num: "27", file: "poems/poem-27.html", title: "सिया", excerpt: "आज सोनियाचा दिनू झाले सियाची मी आई" },
  { num: "28", file: "poems/poem-28.html", title: "तुझ्या पापाची क्षितिजे असतील अथांग", excerpt: "तुझ्या पापाची क्षितिजे असतील अथांग" },
  { num: "29", file: "poems/poem-29.html", title: "ना तुझं आयुष्य अडलय ना माझं जगणं थांबलंय", excerpt: "ना तुझं आयुष्य अडलय ना माझं जगणं थांबलंय" },
  { num: "30", file: "poems/poem-30.html", title: "My dear Ved", excerpt: "My dear Ved, wish you a very happy birthday!!!" },
];

const THEME_KEY = "kesar_tarang_theme";
const LANG_KEY = "kesar_tarang_language";
const SUPPORTED_LANGS = ["mr", "hi", "en"];
const LANG_LABELS = { mr: "MR", hi: "HI", en: "EN" };
const LANG_NAMES = { mr: "मराठी", hi: "हिंदी", en: "English" };

/* ----------------------------------------------------------------
   Themes
   ----------------------------------------------------------------
   Two plain ones and six that recolour the same paper-and-ink
   system. `mode` decides which half of the night styling applies;
   `chip` is the three colours the picker swatch paints itself with,
   so a reader recognises a theme before they select it.

   Adding a theme: a block in style.css plus an entry here. The
   pre-paint bootstrap in each page validates against THEME_IDS, so
   that list has to stay in step (scripts/sync-shell.mjs does it).
   ---------------------------------------------------------------- */

const THEMES = [
  { id: "day", mode: "day", label: "दिवस", latin: "Day", chip: ["#f6f1e7", "#b23a2a", "#2a2118"] },
  { id: "night", mode: "night", label: "रात्र", latin: "Night", chip: ["#141220", "#e0a458", "#f0e7d8"] },
  { id: "kesar", mode: "day", label: "केसर", latin: "Kesar", chip: ["#fdf3e2", "#cf6a12", "#3b2410"] },
  { id: "himalaya", mode: "day", label: "हिमाल", latin: "Himalaya", chip: ["#eef3f4", "#166b74", "#1c2b31"] },
  { id: "rang", mode: "day", label: "रंग", latin: "Rang", chip: ["#f2f6ea", "#4a7a2e", "#23301b"] },
  { id: "indra", mode: "night", label: "इंद्र", latin: "Indra", chip: ["#171233", "#b58cff", "#ece7ff"] },
  { id: "agni", mode: "night", label: "अग्नि", latin: "Agni", chip: ["#1d1411", "#ff7f42", "#f7e6d8"] },
  { id: "nila", mode: "night", label: "नील", latin: "Neel", chip: ["#0d1b2a", "#4fb0e0", "#dfeaf5"] },
];

const THEME_IDS = THEMES.map((theme) => theme.id);
const DEFAULT_DARK_THEME = "night";
const DEFAULT_LIGHT_THEME = "day";

function getTheme(themeId) {
  return THEMES.find((theme) => theme.id === themeId) || THEMES[0];
}

function resolveTheme(themeId) {
  const found = THEMES.find((theme) => theme.id === themeId);
  if (found) return found;
  const prefersNight = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return getTheme(prefersNight ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME);
}

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentLanguage = readStoredLanguage();

function readStoredLanguage() {
  const url = new URLSearchParams(window.location.search).get("lang");
  if (SUPPORTED_LANGS.includes(url)) return url;
  const saved = localStorage.getItem(LANG_KEY);
  return SUPPORTED_LANGS.includes(saved) ? saved : "mr";
}

/* ----------------------------------------------------------------
   Theme
   ---------------------------------------------------------------- */

const SUN_ICON =
  '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.3M12 19.3v2.3M4.2 12H1.9M22.1 12h-2.3M6.5 6.5 4.8 4.8M19.2 19.2l-1.7-1.7M6.5 17.5l-1.7 1.7M19.2 4.8l-1.7 1.7"/></svg>';
const MOON_ICON =
  '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z"/></svg>';

let themeToggle = document.getElementById("theme-toggle");

/** The toggle is created on demand so a new page only needs the stylesheet. */
function ensureThemeToggle() {
  if (themeToggle) return themeToggle;
  if (!document.body) return null;

  themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  document.body.appendChild(themeToggle);
  return themeToggle;
}

function setTheme(themeId, options = {}) {
  const { persist = true } = options;
  const theme = resolveTheme(themeId);

  document.documentElement.dataset.theme = theme.id;
  document.documentElement.dataset.mode = theme.mode;
  if (document.body) {
    document.body.dataset.theme = theme.id;
    document.body.dataset.mode = theme.mode;
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme.id);
    } catch (e) {
      /* Private mode: the theme still applies, it just will not survive. */
    }
  }

  /* The quick button steps between the two plain light/dark themes,
     so a reader on, say, Kesar can still flip the lights in one tap. */
  if (themeToggle) {
    const toLight = theme.mode === "night";
    const label = toLight ? "दिवस थीम" : "रात्री थीम";
    themeToggle.setAttribute("aria-pressed", toLight ? "true" : "false");
    themeToggle.setAttribute("aria-label", label);
    themeToggle.title = label;
  }

  syncThemePicker();
  document.dispatchEvent(
    new CustomEvent("kesar:theme", { detail: { theme: theme.id, mode: theme.mode } })
  );
  return theme;
}

function currentTheme() {
  return resolveTheme(document.documentElement.dataset.theme);
}

function initTheme() {
  ensureThemeToggle();
  if (themeToggle) themeToggle.innerHTML = SUN_ICON + MOON_ICON;

  setTheme(localStorage.getItem(THEME_KEY) || document.documentElement.dataset.theme, {
    persist: false,
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const mode = document.documentElement.dataset.mode;
      setTheme(mode === "night" ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME);
    });
  }
}

/* ----------------------------------------------------------------
   Theme picker
   ---------------------------------------------------------------- */

const SWATCH_ICON = '<span class="swatch" aria-hidden="true"><i></i><i></i><i></i></span>';

let themePicker = document.getElementById("theme-picker");
let themePickerToggle = document.getElementById("theme-picker-toggle");

function ensureThemePicker() {
  if (themePickerToggle) return themePickerToggle;

  themePickerToggle = document.createElement("button");
  themePickerToggle.id = "theme-picker-toggle";
  themePickerToggle.className = "theme-picker-toggle";
  themePickerToggle.type = "button";
  themePickerToggle.innerHTML = SWATCH_ICON;
  themePickerToggle.setAttribute("aria-haspopup", "true");
  themePickerToggle.setAttribute("aria-expanded", "false");
  themePickerToggle.setAttribute("aria-controls", "theme-picker");
  themePickerToggle.setAttribute("aria-label", "थीम निवडा / Choose a theme");
  themePickerToggle.title = "थीम निवडा / Theme";

  themePicker = document.createElement("div");
  themePicker.id = "theme-picker";
  themePicker.className = "theme-picker";
  themePicker.hidden = true;
  themePicker.setAttribute("role", "group");
  themePicker.setAttribute("aria-label", "थीम / Theme");

  const head = document.createElement("div");
  head.className = "theme-picker__head";
  const title = document.createElement("p");
  title.className = "theme-picker__title";
  title.textContent = "थीम निवडा";
  const hint = document.createElement("span");
  hint.className = "theme-picker__hint";
  hint.textContent = `${THEMES.length} Themes`;
  head.append(title, hint);

  const options = document.createElement("div");
  options.className = "theme-options";
  options.setAttribute("role", "radiogroup");

  for (const theme of THEMES) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "theme-option";
    option.dataset.theme = theme.id;
    option.setAttribute("role", "radio");
    option.setAttribute("aria-checked", "false");

    const chip = document.createElement("span");
    chip.className = "theme-chip";
    chip.setAttribute("aria-hidden", "true");
    chip.style.setProperty("--chip-a", theme.chip[0]);
    chip.style.setProperty("--chip-b", theme.chip[1]);
    chip.style.setProperty("--chip-c", theme.chip[2]);

    const name = document.createElement("span");
    name.className = "theme-option__name";
    name.textContent = theme.label;

    option.append(chip, name);
    option.title = `${theme.latin} · ${theme.label}`;
    option.setAttribute("aria-label", `${theme.latin} theme`);
    option.addEventListener("click", () => {
      setTheme(theme.id);
      closeThemePicker();
      themePickerToggle.focus();
    });
    options.appendChild(option);
  }

  themePicker.append(head, options);

  const dock = document.querySelector(".control-dock");
  if (dock) {
    /* Between the light/dark button and the language toggle. */
    const languageToggle = document.getElementById("language-toggle");
    if (languageToggle) dock.insertBefore(themePickerToggle, languageToggle);
    else dock.appendChild(themePickerToggle);
    dock.appendChild(themePicker);
  } else {
    document.body.append(themePickerToggle);
    document.body.appendChild(themePicker);
  }

  themePickerToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    themePicker.hidden ? openThemePicker() : closeThemePicker();
  });

  /* Paint the current selection now that the options exist. */
  syncThemePicker();

  return themePickerToggle;
}

function openThemePicker() {
  if (!themePicker) return;
  themePicker.hidden = false;
  themePickerToggle.setAttribute("aria-expanded", "true");
  const active = themePicker.querySelector('.theme-option[aria-checked="true"]');
  (active || themePicker.querySelector(".theme-option"))?.focus();
}

function closeThemePicker() {
  if (!themePicker) return;
  themePicker.hidden = true;
  themePickerToggle?.setAttribute("aria-expanded", "false");
}

function syncThemePicker() {
  if (!themePicker) return;
  const active = document.documentElement.dataset.theme;
  themePicker.querySelectorAll(".theme-option").forEach((option) => {
    option.setAttribute("aria-checked", option.dataset.theme === active ? "true" : "false");
  });
}

/* Dismissal is handled once, on the document, so a click anywhere
   outside the picker — the agent included — closes it. */
document.addEventListener("click", (event) => {
  if (!themePicker || themePicker.hidden) return;
  if (themePicker.contains(event.target) || themePickerToggle?.contains(event.target)) return;
  closeThemePicker();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !themePicker || themePicker.hidden) return;
  closeThemePicker();
  themePickerToggle?.focus();
});

/* ----------------------------------------------------------------
   Control dock — theme + language live together
   ---------------------------------------------------------------- */

function mountControlDock() {
  if (!themeToggle || themeToggle.parentNode.classList.contains("control-dock")) return;
  const dock = document.createElement("div");
  dock.className = "control-dock";
  dock.setAttribute("role", "group");
  dock.setAttribute("aria-label", "Display options");
  themeToggle.parentNode.insertBefore(dock, themeToggle);
  dock.appendChild(themeToggle);
}

function ensureLanguageToggle() {
  let wrapper = document.getElementById("language-toggle");
  if (wrapper) return wrapper;

  wrapper = document.createElement("div");
  wrapper.id = "language-toggle";
  wrapper.className = "language-toggle";
  wrapper.setAttribute("role", "group");
  wrapper.setAttribute("aria-label", "भाषा / Language");

  for (const language of SUPPORTED_LANGS) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "language-option";
    option.dataset.lang = language;
    option.textContent = LANG_LABELS[language];
    option.title = LANG_NAMES[language];
    option.setAttribute("aria-label", LANG_NAMES[language]);
    option.addEventListener("click", () => setLanguage(language));
    wrapper.appendChild(option);
  }

  const dock = document.querySelector(".control-dock");
  if (dock) {
    dock.appendChild(wrapper);
  } else {
    document.body.appendChild(wrapper);
  }
  return wrapper;
}

function syncLanguageToggleState() {
  const wrapper = ensureLanguageToggle();
  wrapper.querySelectorAll(".language-option").forEach((button) => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

/* ----------------------------------------------------------------
   Poem text helpers
   ---------------------------------------------------------------- */

const DEVANAGARI_DATE = /[०-९]{1,4}\s*[\/.-]\s*[०-९]{1,2}\s*[\/.-]\s*[०-९]{2,4}/;
const LATIN_DATE = /(\b(19|20)\d{2}\b)|(\b\d{1,2}\s*[\/.-]\s*\d{1,2}\b)/;

function looksLikeDate(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return DEVANAGARI_DATE.test(trimmed) || LATIN_DATE.test(trimmed);
}

/** Render text into an element as one block-level span per line,
 *  so the original verse structure survives translation. */
function renderLines(element, text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  let lastContentIndex = -1;
  lines.forEach((line, i) => {
    if (line.trim()) lastContentIndex = i;
  });

  element.textContent = "";
  lines.forEach((line, i) => {
    const span = document.createElement("span");
    span.className = "poem-line";
    if (line.length === 0) {
      span.classList.add("poem-line-empty");
      span.innerHTML = "&nbsp;";
      span.setAttribute("aria-hidden", "true");
    } else {
      span.textContent = line;
      if (i === lastContentIndex && looksLikeDate(line)) {
        span.classList.add("poem-line--date");
      }
    }
    element.appendChild(span);
  });
}

function preparePoemText() {
  const poemText = document.querySelector(".poem-text");
  if (!poemText || poemText.dataset.linesPrepared === "true") return poemText;
  renderLines(poemText, poemText.textContent);
  poemText.dataset.linesPrepared = "true";
  return poemText;
}

/* ----------------------------------------------------------------
   Poem index
   ---------------------------------------------------------------- */

function hasTranslation(num, lang) {
  const store = window.KESAR_TRANSLATIONS || {};
  const entry = store[num];
  if (!entry || !entry[lang]) return false;
  const value = entry[lang];
  const text = typeof value === "string" ? value : value.text;
  return Boolean(text && text.trim());
}

function renderPoemList() {
  const list = document.getElementById("poem-list");
  if (!list) return;

  const fragment = document.createDocumentFragment();

  poems.forEach((poem, index) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = poem.file;
    link.setAttribute(
      "aria-label",
      `${poem.title}${hasTranslation(poem.num, currentLanguage) ? " — translation available" : ""}`
    );

    const head = document.createElement("span");
    head.className = "poem-card__head";

    const num = document.createElement("span");
    num.className = "poem-num";
    num.textContent = poem.num;
    num.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "poem-name";
    name.textContent = poem.title;

    const arrow = document.createElement("span");
    arrow.className = "poem-arrow";
    arrow.textContent = "→";
    arrow.setAttribute("aria-hidden", "true");

    head.append(num, name, arrow);

    link.appendChild(head);

    /* Opening line — gives the index actual poetry instead of empty rows.
       Note: this must be appended after `head` is in the tree, otherwise
       Element.after() has no parent to insert against and silently no-ops. */
    if (poem.excerpt) {
      const excerpt = document.createElement("span");
      excerpt.className = "poem-excerpt";
      const opener = document.createElement("q");
      opener.textContent = poem.excerpt;
      excerpt.appendChild(opener);
      link.appendChild(excerpt);
    }

    /* Show which languages are ready for this poem */
    const badges = document.createElement("span");
    badges.className = "poem-badges";
    ["hi", "en"].forEach((lang) => {
      if (!hasTranslation(poem.num, lang)) return;
      const badge = document.createElement("span");
      badge.className = "poem-badge";
      badge.textContent = LANG_LABELS[lang];
      badges.appendChild(badge);
    });
    if (badges.childElementCount) link.appendChild(badges);

    item.className = "reveal";
    item.style.setProperty("--delay", `${Math.min(index * 26, 400)}ms`);
    item.appendChild(link);
    fragment.appendChild(item);
  });

  list.textContent = "";
  list.appendChild(fragment);
  observeReveals();
}

/* ----------------------------------------------------------------
   Previous / next poem
   ---------------------------------------------------------------- */

function currentPoemNumber() {
  const match = window.location.pathname.match(/poem-(\d+)\.html/);
  return match ? match[1] : null;
}

function buildNavLink(poem, href, label, arrow, isNext) {
  if (!poem) {
    const empty = document.createElement("span");
    empty.className = (isNext ? "is-next " : "") + "is-empty";
    empty.setAttribute("aria-hidden", "true");
    empty.innerHTML = `<span class="nav-label">${label}</span><span class="nav-title">—</span>`;
    return empty;
  }

  const link = document.createElement("a");
  link.href = href;
  if (isNext) link.className = "is-next";
  link.innerHTML =
    `<span class="nav-label">${label}</span>` +
    `<span class="nav-title">${isNext ? poem.title + " " + arrow : arrow + " " + poem.title}</span>`;
  return link;
}

function renderPoemNav() {
  const num = currentPoemNumber();
  if (!num) return;

  const index = poems.findIndex((poem) => poem.num === num);
  if (index === -1) return;

  const card = document.querySelector(".poem-page .card");
  if (!card) return;

  const prev = poems[index - 1];
  const next = poems[index + 1];
  const depth = window.location.pathname.includes("/poems/") ? "../" : "";

  const nav = document.createElement("nav");
  nav.className = "poem-nav";
  nav.setAttribute("aria-label", "Poem navigation");
  nav.append(
    buildNavLink(prev, prev && depth + prev.file, "मागील कविता", "←", false),
    buildNavLink(next, next && depth + next.file, "पुढील कविता", "→", true)
  );

  card.appendChild(nav);
}

/* ----------------------------------------------------------------
   Scroll reveal
   ---------------------------------------------------------------- */

let revealObserver = null;

function observeReveals() {
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!items.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    /* Failsafe: never leave poetry stuck at opacity 0 if the observer
       never fires (headless capture, odd viewports, blocked script). */
    window.setTimeout(() => {
      document
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((item) => item.classList.add("is-visible"));
    }, 2500);
  }

  items.forEach((item) => revealObserver.observe(item));
}

/* ----------------------------------------------------------------
   Reading progress (poem pages only)
   ---------------------------------------------------------------- */

function initReadingProgress() {
  if (!currentPoemNumber() || prefersReducedMotion) return;

  const bar = document.createElement("div");
  bar.className = "read-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
    bar.style.width = `${ratio * 100}%`;
    bar.classList.toggle("is-active", ratio > 0.005);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* ============================================================
   TRANSLATION SERVICE
   ------------------------------------------------------------
   Resolution order for every poem:
     1. FINAL   — the poet's own text in translations.js
     2. AI      — live machine translation via the poet's own
                  proxy endpoint (window.KESAR_AI), cached
     3. GOOGLE  — the existing Google Translate fallback
   ============================================================ */

const AI_CACHE_PREFIX = "kesar_ai_tr_";

/** Rough script detection so we never "translate" English into English. */
function detectScript(text) {
  const devanagari = (text.match(/[ऀ-ॿ]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  const total = devanagari + latin;
  if (total === 0) return "unknown";
  return devanagari / total > 0.25 ? "devanagari" : "latin";
}

function getCuratedTranslation(num, lang) {
  const store = window.KESAR_TRANSLATIONS || {};
  const entry = store[num] && store[num][lang];
  if (!entry) return null;

  const text = typeof entry === "string" ? entry : entry.text;
  const title = typeof entry === "string" ? "" : entry.title;
  if (!text || !text.trim()) return null;

  /* A `draft: true` entry is machine output awaiting the poet's approval,
     so it must be presented as a draft even though it lives in the store. */
  const isDraft = typeof entry !== "string" && entry.draft === true;

  return {
    text: text.replace(/\r\n?/g, "\n"),
    title: title || "",
    origin: isDraft ? "ai" : "curated",
  };
}

function getCachedAiTranslation(num, lang) {
  try {
    const cached = localStorage.getItem(AI_CACHE_PREFIX + num + "_" + lang);
    return cached ? { text: cached, title: "", origin: "ai" } : null;
  } catch (e) {
    return null;
  }
}

/** Ask the configured proxy for a fresh translation. */
async function requestAiTranslation(num, lang, sourceText, title) {
  const config = window.KESAR_AI;
  if (!config || !config.endpoint) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ num, lang, title, text: sourceText }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data && typeof data.text === "string" ? data.text : "";
    if (!text.trim()) return null;

    try {
      localStorage.setItem(AI_CACHE_PREFIX + num + "_" + lang, text);
    } catch (e) {
      /* storage full or blocked — still show the translation */
    }
    return { text: text.replace(/\r\n?/g, "\n"), title: "", origin: "ai" };
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveTranslation(num, lang, sourceText, title) {
  const curated = getCuratedTranslation(num, lang);
  if (curated) return curated;

  const cached = getCachedAiTranslation(num, lang);
  if (cached) return cached;

  return requestAiTranslation(num, lang, sourceText, title);
}

/* ----------------------------------------------------------------
   Translation panel
   ---------------------------------------------------------------- */

const ORIGIN_META = {
  curated: { badge: "Translation", className: "badge--final", note: "कवयित्रीचा स्वतःचा अनुवाद" },
  ai: { badge: "AI draft", className: "badge--ai", note: "Machine draft — the poet’s own wording will replace this." },
};

function ensureTranslationPanel() {
  let panel = document.getElementById("translation-panel");
  if (panel) return panel;

  const original = document.querySelector(".poem-text");
  if (!original) return null;

  panel = document.createElement("section");
  panel.id = "translation-panel";
  panel.className = "translation-panel";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");

  const status = document.createElement("p");
  status.className = "translation-status";
  status.id = "translation-status";
  status.hidden = true;

  const text = document.createElement("div");
  text.className = "poem-text";
  text.lang = currentLanguage;

  const heading = document.createElement("p");
  heading.className = "eyebrow";
  heading.id = "translation-heading";

  panel.append(heading, status, text);
  original.parentNode.insertBefore(panel, original.nextSibling);
  return panel;
}

function clearTranslationPanel() {
  const panel = document.getElementById("translation-panel");
  if (panel) panel.hidden = true;
  const original = document.querySelector(".poem-text");
  if (original) {
    original.classList.remove("notranslate");
    original.removeAttribute("translate");
  }
}

async function renderTranslation() {
  const original = document.querySelector(".poem-text");
  if (!original) return;

  const num = currentPoemNumber();
  const lang = currentLanguage;

  if (!num || lang === "mr") {
    clearTranslationPanel();
    return;
  }

  const sourceText = original.dataset.sourceText || original.textContent;
  const titleEl = document.querySelector(".poem-title");
  const title = titleEl ? titleEl.textContent.trim() : "";

  /* Only skip when the poem is already in English. Marathi and Hindi share
     the Devanagari script, so script alone must not decide that case. */
  if (lang === "en" && detectScript(sourceText) === "latin") {
    clearTranslationPanel();
    return;
  }

  const panel = ensureTranslationPanel();
  if (!panel) return;

  const heading = panel.querySelector("#translation-heading");
  const status = panel.querySelector("#translation-status");
  const body = panel.querySelector(".poem-text");
  body.lang = lang;

  panel.hidden = false;
  heading.textContent = LANG_NAMES[lang] + " translation";

  const result = await resolveTranslation(num, lang, sourceText, title);

  /* The reader may have navigated away or switched language while the
     translation was in flight. */
  if (!panel.isConnected || currentLanguage !== lang) return;

  if (!result) {
    /* No curated or AI text — let Google Translate handle the page. */
    clearTranslationPanel();
    applyGoogleLanguage();
    return;
  }

  const meta = ORIGIN_META[result.origin] || ORIGIN_META.ai;
  renderLines(body, result.text);
  body.classList.add("notranslate");
  body.setAttribute("translate", "no");

  if (result.title && titleEl) {
    let sub = document.getElementById("poem-title-translated");
    if (!sub) {
      sub = document.createElement("p");
      sub.id = "poem-title-translated";
      sub.className = "poem-meta";
      sub.style.marginTop = "0.35rem";
      titleEl.parentNode.insertBefore(sub, titleEl.nextSibling);
    }
    sub.textContent = result.title;
  }

  status.hidden = false;
  status.innerHTML =
    `<span class="badge ${meta.className}">${meta.badge}</span> ${meta.note}`;

  /* We are showing our own translation, so keep the Marathi original
     out of Google's way to avoid a duplicate rendering. */
  original.classList.add("notranslate");
  original.setAttribute("translate", "no");
}

/* ----------------------------------------------------------------
   Google Translate (fallback + page chrome)
   ---------------------------------------------------------------- */

function setGoogleTranslateCookie(language) {
  const value = language === "mr" ? "/mr/mr" : `/mr/${language}`;
  document.cookie = `googtrans=${value};path=/`;

  const host = window.location.hostname;
  if (host && host.includes(".")) {
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  }
}

function ensureGoogleTranslateHost() {
  if (!document.getElementById("google_translate_element")) {
    const host = document.createElement("div");
    host.id = "google_translate_element";
    host.style.display = "none";
    document.body.appendChild(host);
  }
}

function applyLanguageToGoogleWidget() {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return false;

  const target = currentLanguage === "mr" ? "" : currentLanguage;
  if (select.value !== target) {
    select.value = target;
    select.dispatchEvent(new Event("change"));
  }
  return true;
}

function initGoogleTranslateElement() {
  if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
    return;
  }

  if (!window.__kesarTranslateInitialized) {
    window.__kesarTranslateInitialized = true;
    window.__kesarTranslateInstance = new window.google.translate.TranslateElement(
      { pageLanguage: "mr", includedLanguages: "mr,hi,en", autoDisplay: false },
      "google_translate_element"
    );
  }

  setTimeout(applyLanguageToGoogleWidget, 300);
}

window.googleTranslateElementInit = initGoogleTranslateElement;

function loadGoogleTranslateScript() {
  ensureGoogleTranslateHost();

  if (window.google && window.google.translate && window.google.translate.TranslateElement) {
    initGoogleTranslateElement();
    return;
  }

  if (document.getElementById("google-translate-script")) return;

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

/** Retries while the Google widget finishes booting (about 4 seconds). */
function applyGoogleLanguage(attempt = 0) {
  if (currentLanguage === "mr") return;
  if (applyLanguageToGoogleWidget()) return;
  if (attempt > 16) return;
  setTimeout(() => applyGoogleLanguage(attempt + 1), 250);
}

/* ----------------------------------------------------------------
   Language switching (no page reload)
   ---------------------------------------------------------------- */

function setLanguage(language) {
  const next = SUPPORTED_LANGS.includes(language) ? language : "mr";
  if (next === currentLanguage) return;

  currentLanguage = next;
  document.documentElement.lang = next;
  document.documentElement.dataset.lang = next;
  localStorage.setItem(LANG_KEY, next);
  setGoogleTranslateCookie(next);
  syncLanguageToggleState();
  document.dispatchEvent(new CustomEvent("kesar:language", { detail: { language: next } }));

  if (next === "mr") {
    clearTranslationPanel();
    const sub = document.getElementById("poem-title-translated");
    if (sub) sub.remove();
    if (window.google && window.google.translate) {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = "";
        select.dispatchEvent(new Event("change"));
      }
    }
    return;
  }

  if (document.getElementById("poem-list")) renderPoemList();
  renderTranslation();
  loadGoogleTranslateScript();
  applyGoogleLanguage();
}

/* ----------------------------------------------------------------
   Public API
   ----------------------------------------------------------------
   agent.js needs these, and so does anything else added later. They
   are published on window rather than left as bare globals: `let`
   and `const` at the top level of a classic script are shared
   between scripts in a browser, but not across separate eval scopes,
   so relying on them makes the code harder to test and to reuse.
   ---------------------------------------------------------------- */

window.KESAR = {
  poems,
  themes: THEMES,
  themeIds: THEME_IDS,
  getTheme,
  currentTheme,
  setTheme,
  openThemePicker,
  closeThemePicker,
  themesAre: () => THEMES.length,
  get language() {
    return currentLanguage;
  },
  setLanguage,
  langNames: LANG_NAMES,
  hasTranslation,
};

/* ----------------------------------------------------------------
   Footer links
   ---------------------------------------------------------------- */

function ensureFooterLinks() {
  const footer = document.querySelector("footer");
  if (!footer || footer.querySelector(".footer-links")) return;

  const links = document.createElement("p");
  links.className = "footer-links";

  const items = [
    { href: "https://wa.me/919881241620", label: "WhatsApp", external: true },
    { href: "mailto:chaitrali.pandharpure@gmail.com", label: "chaitrali.pandharpure@gmail.com" },
  ];

  for (const item of items) {
    const anchor = document.createElement("a");
    anchor.href = item.href;
    anchor.textContent = item.label;
    if (item.external) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    links.appendChild(anchor);
  }

  const copyright = footer.querySelector(".copyright");
  if (copyright) {
    footer.insertBefore(links, copyright);
  } else {
    footer.appendChild(links);
  }
}

/* ----------------------------------------------------------------
   Boot
   ---------------------------------------------------------------- */

let initialised = false;

function init() {
  if (initialised) return;
  initialised = true;

  /* Arm the scroll-reveal only now that we know JS is running. */
  document.documentElement.classList.add("js-reveal");

  /* Order matters: the dock and the language toggle must exist before
     the theme picker, which slots itself between them. */
  initTheme();
  mountControlDock();
  syncLanguageToggleState();
  ensureThemePicker();
  ensureFooterLinks();

  const poemText = preparePoemText();
  if (poemText) poemText.dataset.sourceText = poemText.textContent;

  renderPoemList();
  renderPoemNav();
  initReadingProgress();
  observeReveals();
  setTheme(document.documentElement.dataset.theme || "day");

  document.documentElement.lang = currentLanguage;
  document.documentElement.dataset.lang = currentLanguage;
  renderTranslation();

  if (currentLanguage !== "mr") {
    loadGoogleTranslateScript();
    applyGoogleLanguage();
  }

  /* The agent mounts last, once every language and theme is settled. */
  if (typeof ensureAgent === "function") ensureAgent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}





