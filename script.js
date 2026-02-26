const poems = [
  { num: "01", file: "poems/poem-01.html", title: "सात रंग प्रेमाचे" },
  { num: "02", file: "poems/poem-02.html", title: "प्रेमाचं दुकान" },
  { num: "03", file: "poems/poem-03.html", title: "माझे बाबा!" },
  { num: "04", file: "poems/poem-04.html", title: "सखा!" },
  { num: "05", file: "poems/poem-05.html", title: "ईवलंस रोपट.." },
  { num: "06", file: "poems/poem-06.html", title: "आभासी जगाचा राजा" },
  { num: "07", file: "poems/poem-07.html", title: "तो आणि ती.." },
  { num: "08", file: "poems/poem-08.html", title: "अत्तराची कुपी" },
  { num: "09", file: "poems/poem-09.html", title: "प्रेमाचं तलम वस्त्र.." },
  { num: "10", file: "poems/poem-10.html", title: "प्रेम.." },
  { num: "11", file: "poems/poem-11.html", title: "तिचा सूर्य" },
  { num: "12", file: "poems/poem-12.html", title: "अनोळखी माणूस.." },
  { num: "13", file: "poems/poem-13.html", title: "पहिली ओझरती भेट" },
  { num: "14", file: "poems/poem-14.html", title: "आई" },
  { num: "15", file: "poems/poem-15.html", title: "सोडली माझी साथ?" },
  { num: "16", file: "poems/poem-16.html", title: "पाहुणा.." },
  { num: "17", file: "poems/poem-17.html", title: "एक निर्णय" },
  { num: "18", file: "poems/poem-18.html", title: "तू काय गेलास.." },
  { num: "19", file: "poems/poem-19.html", title: "जिवाचं रान केलं तुझ्यासाठी" },
  { num: "20", file: "poems/poem-20.html", title: "शब्द म्हणजे भावना" },
  { num: "21", file: "poems/poem-21.html", title: "रावण" },
  { num: "22", file: "poems/poem-22.html", title: "मी दूर दूर जाताना इतकेच मनाशी वाटे" },
  { num: "23", file: "poems/poem-23.html", title: "मी रेती तू लाट" },
  { num: "24", file: "poems/poem-24.html", title: "घसरलेला तोल, सावरू कसे" },
  { num: "25", file: "poems/poem-25.html", title: "मन भाव भोळा" },
  { num: "26", file: "poems/poem-26.html", title: "प्रेमाचं विडंबन" },
  { num: "27", file: "poems/poem-27.html", title: "सिया" },
  { num: "28", file: "poems/poem-28.html", title: "तुझ्या पापाची क्षितिजे असतील अथांग" },
  { num: "29", file: "poems/poem-29.html", title: "ना तुझं आयुष्य अडलय ना माझं जगणं थांबलंय" },
  { num: "30", file: "poems/poem-30.html", title: "My dear Ved" },
];

const themeToggle = document.getElementById("theme-toggle");
const themeStorageKey = "kesar_tarang_theme";
const languageStorageKey = "kesar_tarang_language";
const supportedLanguages = ["mr", "hi", "en"];

const languageLabels = {
  mr: "MR",
  hi: "HI",
  en: "EN",
};

const themeToggleLabels = {
  mr: { day: "दिन रंग", night: "रात्र रंग" },
  hi: { day: "दिन मोड", night: "रात मोड" },
  en: { day: "Day mode", night: "Night mode" },
};

const uiTranslations = {
  mr: {
    languageSwitcherLabel: "भाषा",
    poemFallback: "मूळ मराठी कविता दाखवली आहे. हिंदी/इंग्रजी अनुवाद लवकरच जोडला जाईल.",
    footer: {
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp: +91 98812 41620",
      email: "chaitrali.pandharpure@gmail.com",
    },
  },
  hi: {
    languageSwitcherLabel: "भाषा",
    poemFallback: "अभी मूल मराठी कविता दिखाई जा रही है। हिंदी अनुवाद जल्द जोड़ा जाएगा।",
    footer: {
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "व्हाट्सऐप: +91 98812 41620",
      email: "chaitrali.pandharpure@gmail.com",
    },
  },
  en: {
    languageSwitcherLabel: "Language",
    poemFallback: "Showing original Marathi poem. English translation will be added soon.",
    footer: {
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp: +91 98812 41620",
      email: "chaitrali.pandharpure@gmail.com",
    },
  },
};

// Scaffold for future manual poem translations.
const poemTranslationCatalog = {
  hi: {},
  en: {},
};

let currentLanguage = getInitialLanguage();
const poemOriginalContent = captureOriginalPoemContent();

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(languageStorageKey);
  return supportedLanguages.includes(savedLanguage) ? savedLanguage : "mr";
}

function captureOriginalPoemContent() {
  const title = document.querySelector(".poem-title");
  const text = document.querySelector(".poem-text");
  if (!title || !text) {
    return null;
  }
  return {
    title: title.textContent,
    text: text.textContent,
    documentTitle: document.title,
  };
}

function getPoemPageId() {
  const path = window.location.pathname || "";
  const match = path.match(/poem-\d+\.html$/);
  return match ? match[0] : null;
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeToggle) {
    const labels = themeToggleLabels[currentLanguage] || themeToggleLabels.mr;
    themeToggle.textContent = theme === "night" ? "☀" : "🌙";
    themeToggle.setAttribute("aria-pressed", theme === "night" ? "true" : "false");
    themeToggle.setAttribute("aria-label", theme === "night" ? labels.day : labels.night);
    themeToggle.title = theme === "night" ? labels.day : labels.night;
  }
}

if (themeToggle) {
  const savedTheme = localStorage.getItem(themeStorageKey);
  const prefersNight = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersNight ? "night" : "day");
  setTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "night" ? "day" : "night";
    setTheme(nextTheme);
    localStorage.setItem(themeStorageKey, nextTheme);
  });
}

const poemList = document.getElementById("poem-list");

if (poemList) {
  for (const poem of poems) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = poem.file;
    link.textContent = poem.title;
    li.appendChild(link);
    poemList.appendChild(li);
  }
}

function ensureFooterLinks(language) {
  const footer = document.querySelector("footer");
  if (!footer) {
    return;
  }

  let links = footer.querySelector(".footer-links");
  if (!links) {
    links = document.createElement("p");
    links.className = "footer-links";
    const copyright = footer.querySelector(".copyright");
    if (copyright) {
      footer.insertBefore(links, copyright);
    } else {
      footer.appendChild(links);
    }
  }

  const copy = (uiTranslations[language] || uiTranslations.mr).footer;
  links.innerHTML = [
    `<a href="#" aria-label="${copy.facebook} placeholder">${copy.facebook}</a>`,
    `<a href="#" aria-label="${copy.instagram} placeholder">${copy.instagram}</a>`,
    `<a href="https://wa.me/919881241620" target="_blank" rel="noopener noreferrer">${copy.whatsapp}</a>`,
    `<a href="mailto:chaitrali.pandharpure@gmail.com">${copy.email}</a>`,
  ].join(" • ");
}

function ensureLanguageToggle() {
  let wrapper = document.getElementById("language-toggle");
  if (wrapper) {
    return wrapper;
  }

  wrapper = document.createElement("div");
  wrapper.id = "language-toggle";
  wrapper.className = "language-toggle";
  wrapper.setAttribute("role", "group");
  wrapper.setAttribute("aria-label", uiTranslations[currentLanguage].languageSwitcherLabel);

  for (const language of supportedLanguages) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "language-option";
    option.dataset.lang = language;
    option.textContent = languageLabels[language];
    option.addEventListener("click", () => {
      setLanguage(language);
    });
    wrapper.appendChild(option);
  }

  document.body.appendChild(wrapper);
  return wrapper;
}

function syncLanguageToggleState() {
  const wrapper = ensureLanguageToggle();
  const copy = uiTranslations[currentLanguage] || uiTranslations.mr;
  wrapper.setAttribute("aria-label", copy.languageSwitcherLabel);

  wrapper.querySelectorAll(".language-option").forEach((button) => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function ensurePoemFallbackNote(language) {
  if (!poemOriginalContent) {
    return;
  }

  const poemTitle = document.querySelector(".poem-title");
  const poemText = document.querySelector(".poem-text");
  if (!poemTitle || !poemText) {
    return;
  }

  const poemId = getPoemPageId();
  const translatedPoem = poemId ? poemTranslationCatalog[language]?.[poemId] : null;
  const noteText = (uiTranslations[language] || uiTranslations.mr).poemFallback;

  if (translatedPoem && translatedPoem.title && translatedPoem.text) {
    poemTitle.textContent = translatedPoem.title;
    poemText.textContent = translatedPoem.text;
    document.title = translatedPoem.title;
    const existing = document.querySelector(".translation-note");
    if (existing) {
      existing.remove();
    }
    return;
  }

  poemTitle.textContent = poemOriginalContent.title;
  poemText.textContent = poemOriginalContent.text;
  document.title = poemOriginalContent.documentTitle;

  if (language === "mr") {
    const existing = document.querySelector(".translation-note");
    if (existing) {
      existing.remove();
    }
    return;
  }

  let note = document.querySelector(".translation-note");
  if (!note) {
    note = document.createElement("p");
    note.className = "translation-note";
    const poemMeta = document.querySelector(".poem-meta");
    if (poemMeta) {
      poemMeta.insertAdjacentElement("afterend", note);
    } else {
      poemTitle.insertAdjacentElement("afterend", note);
    }
  }
  note.textContent = noteText;
}

function setLanguage(language) {
  const nextLanguage = supportedLanguages.includes(language) ? language : "mr";
  currentLanguage = nextLanguage;
  document.documentElement.lang = nextLanguage;
  localStorage.setItem(languageStorageKey, nextLanguage);
  syncLanguageToggleState();
  ensureFooterLinks(nextLanguage);
  ensurePoemFallbackNote(nextLanguage);
  setTheme(document.body.dataset.theme || "day");
}

ensureLanguageToggle();
setLanguage(currentLanguage);
