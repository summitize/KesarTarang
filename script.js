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

function setTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.textContent = theme === "night" ? "☀" : "🌙";
    themeToggle.setAttribute("aria-pressed", theme === "night" ? "true" : "false");
    themeToggle.setAttribute("aria-label", theme === "night" ? "दिन रंग" : "रात्र रंग");
    themeToggle.title = theme === "night" ? "दिन रंग" : "रात्र रंग";
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

function ensureFooterLinks() {
  const footer = document.querySelector("footer");
  if (!footer || footer.querySelector(".footer-links")) {
    return;
  }

  const links = document.createElement("p");
  links.className = "footer-links";
  links.innerHTML = [
    '<a href="#" aria-label="Facebook placeholder">Facebook</a>',
    '<a href="#" aria-label="Instagram placeholder">Instagram</a>',
    '<a href="https://wa.me/919881241620" target="_blank" rel="noopener noreferrer">WhatsApp: +91 98812 41620</a>',
    '<a href="mailto:chaitrali.pandharpure@gmail.com">chaitrali.pandharpure@gmail.com</a>',
  ].join(" • ");

  const copyright = footer.querySelector(".copyright");
  if (copyright) {
    footer.insertBefore(links, copyright);
  } else {
    footer.appendChild(links);
  }
}

ensureFooterLinks();
