/* ============================================================
   कवितामित्र · Kavitamitra — the site's AI guide
   ------------------------------------------------------------
   Loaded after script.js and mounted in the corner of every page.

   It answers locally first: it knows this site's thirty poems, the
   eight themes and the language switch, and it can act on all
   three — "show me a poem about my mother", "make it night", "read
   it in English". That part needs no network, no API key and no
   server, which matters on a static site.

   If an LLM endpoint is configured in ai-config.js, anything the
   local brain does not recognise is forwarded there instead and the
   answer is labelled as an AI answer. With no endpoint it says so
   plainly rather than inventing an answer.

   Replies are written per language, because the site is read in
   Marathi, Hindi and English and a guide that spoke only one of
   them would be a stranger in two thirds of it.

   Everything it needs from script.js comes through window.KESAR,
   which script.js publishes on purpose.
   ============================================================ */

const AGENT_KEY = "kesar_tarang_agent_seen";

/* The site's own state, read through the API script.js publishes.
   Resolved once here so the rest of the file can just use them. */
const KESAR = window.KESAR;
const poems = KESAR.poems;

const AGENT_STRINGS = {
  mr: {
    name: "कवितामित्र",
    status: "तुमचा कविता सहाय्यक",
    greet:
      "नमस्कार! मी कवितामित्र. 🥀\nया संग्रहातील ३० कवितांमध्ये मी तुमची मदत करू शकते — एखादी कविता शोधा, थीम बदला, भाषा बदला, किंवा कवयित्रीचा परिचय जाणून घ्या.",
    placeholder: "कविता विचारा…",
    send: "पाठवा",
    open: "कवितामित्राशी बोला",
    chips: ["एक कविता दाखव", "आईवरील कविता", "थीम बदला", "English मध्ये वाचा", "चैत्राली कोण?"],
    noEndpoint:
      "क्षमस्व, या प्रश्नाचे उत्तर मला माहीत नाही. मी फक्त या संग्रहातील कविता, थीम आणि भाषा यांबद्दल मदत करू शकते.",
    aiLabel: "AI उत्तर",
    found: (n) => `अशा ${n} कविता आढळल्या:`,
    noneFound: "अशी कविता मला सापडली नाही. दुसरा शब्द वापरून पहा.",
    themeList: "आठ थीम आहेत. डॉकमधील रंग बटणावर क्लिक केल्यावर तुम्ही निवडू शकता.",
    themeDone: (t) => `थीम बदलली — ${t}.`,
    langDone: (l) => `भाषा बदलली — ${l}.`,
    about: "चैत्राली पंढरपुरे — आधुनिक मराठी कवयित्री. प्रेम, नाती, स्त्रीमन, वेदना आणि आशेच्या छटांनी सजलेल्या तीस कवितांचा हा संग्रह.",
    aboutMore: "संपूर्ण परिचय वाचण्यासाठी bio.html उघडा.",
    help:
      "मी काय करू शकते:\n• कविता शोधणे — क्रमांक, नाव किंवा शब्द सांगा\n• एखादी कविता दाखवणे\n• थीम बदलणे (८ थीम)\n• भाषा बदलणे — मराठी, हिंदी, English\n• कवयित्रीचा परिचय",
    randomIs: (t) => `ही कविता वाचा: “${t}”`,
    mother: "‘आई’ ही कविता — क्रमांक १४. उघडण्यासाठी ‘आई’ लिहा.",
  },
  hi: {
    name: "कवितामित्र",
    status: "आपका कविता सहायक",
    greet:
      "नमस्ते! मैं कवितामित्र हूँ। 🌸\nइस संग्रह की ३० कविताओं में मैं आपकी मदद कर सकता हूँ — एक कविता खोजें, थीम बदलें, भाषा बदलें, या कवयित्री का परिचय जानें।",
    placeholder: "कविता पूछें…",
    send: "भेजें",
    open: "कवितामित्र से बात करें",
    chips: ["एक कविता दिखाएँ", "माँ पर कविता", "थीम बदलें", "English में पढ़ें", "चैत्राली कौन?"],
    noEndpoint:
      "क्षमा करें, इस प्रश्न का उत्तर मुझे नहीं पता। मैं केवल इस संग्रह की कविताओं, थीम और भाषा में मदत कर सकता हूँ।",
    aiLabel: "AI उत्तर",
    found: (n) => `ऐसी ${n} कविताएँ मिलीं:`,
    noneFound: "ऐसी कोई कविता नहीं मिली। दूसरा शब्द आज़माएँ।",
    themeList: "आठ थीम हैं। डॉक के रंग बटन पर क्लिक करके चुनें।",
    themeDone: (t) => `थीम बदल दी — ${t}।`,
    langDone: (l) => `भाषा बदल दी — ${l}।`,
    about: "चैत्राली पंढरपुरे — आधुनिक मराठी कवयित्री। प्रेम, परिवार, स्त्रीमन, दुख और आशा की छटाओं से सजी तीस कविताओं का यह संग्रह।",
    aboutMore: "पूरा परिचय पढ़ने के लिए bio.html खोलें।",
    help:
      "मैं क्या कर सकता हूँ:\n• कविता खोजना — नंबर, नाम या शब्द बताएँ\n• एक कविता दिखाना\n• थीम बदलना (८ थीम)\n• भाषा बदलना — मराठी, हिंदी, English\n• कवयित्री का परिचय",
    randomIs: (t) => `यह कविता पढ़ें: “${t}”`,
    mother: "‘आई’ कविता — नंबर १४। खोलने के लिए ‘आई’ लिखें।",
  },
  en: {
    name: "Kavitamitra",
    status: "Your poetry guide",
    greet:
      "Hello! I'm Kavitamitra. 🌸\nI can help you around these thirty poems — find one, change the theme, switch language, or tell you about the poet.",
    placeholder: "Ask about a poem…",
    send: "Send",
    open: "Talk to Kavitamitra",
    chips: ["Surprise me", "A poem about my mother", "Change the theme", "Read in English", "Who is Chaitrali?"],
    noEndpoint: "Sorry, I don't know that one. I can help with these poems, the themes and the language switch.",
    aiLabel: "AI answer",
    found: (n) => `Found ${n} poem${n === 1 ? "" : "s"}:`,
    noneFound: "No poem matched that. Try another word.",
    themeList: "There are eight themes — click the colour button in the dock to pick one.",
    themeDone: (t) => `Theme changed to ${t}.`,
    langDone: (l) => `Language changed to ${l}.`,
    about: "Chaitrali Pandharpure — a contemporary Marathi poet. This collection holds thirty poems on love, family, womanhood, loss and hope.",
    aboutMore: "Open bio.html for the full biography.",
    help:
      "I can:\n• Find a poem — give me a number, title or word\n• Open a random poem\n• Change the theme (8 themes)\n• Switch language — Marathi, Hindi, English\n• Tell you about the poet",
    randomIs: (t) => `Read this one: “${t}”`,
    mother: "‘Aai’ is poem 14. Type ‘Aai’ to open it.",
  },
};

/* Keywords are matched across all three languages at once, so a reader
   can type in whichever they are comfortable with. */
const AGENT_INTENTS = [
  { id: "greet", test: /^(नमस्कार|नमस्ते|हॅलो|हेलो|hello|hi|hey|namaste|good (morning|evening|afternoon))/i },
  { id: "help", test: /(मदत|help|माहिती|what can you do|तुम्ही काय)/i },
  { id: "about", test: /(चैत्राली|chaitrali|poet|कवयित्री|परिचय|introduce|who is|कोण)/i },
  { id: "theme", test: /(थीम|theme|रंग बदल|change colou?r|पॅलेट|palette|अंधार|dark mode|light mode)/i },
  { id: "language", test: /(भाषा|language|इंग्रजी|english|हिंदी|हिन्दी|hindi|मराठी|marathi|translate)/i },
  { id: "mother", test: /(आई|aai|माँ|maa|mother|माता)/i },
  { id: "random", test: /(एक कविता|random|कविता दाखव|दाखव|सांग|surprise|any poem|कोणती तरी)/i },
];

/* Poems about a mother, chosen by hand rather than by keyword —
   "आई" is the title of one and the subject of several. */
const MOTHER_POEMS = ["14", "27"];

/* ---------- The cartoon face ---------- */

/* A cartoonised Chaitrali: the wavy dark bob, the vermilion bindi,
   the gold jhumkas and the pink-and-gold saree of the photograph,
   redrawn flat so it stays legible at 56px in a circle.

   Inlined rather than fetched: the agent is on every page and an
   extra request for a 2 KB drawing is not worth it. The colours are
   fixed — she is the poet, not a theme token. */
const AGENT_FACE = `
<svg class="agent-face" viewBox="0 0 120 120" role="img" aria-label="कवितामित्र">
  <defs><clipPath id="kt-face"><ellipse cx="60" cy="52" rx="27" ry="31"/></clipPath></defs>
  <circle cx="60" cy="60" r="59" fill="#f6f1e7"/>
  <path d="M60 84c-20 0-36 11-40 30a60 60 0 0 0 80 0c-4-19-20-30-40-30Z" fill="#e8499a"/>
  <path d="M60 84c-20 0-36 11-40 30 4 3 9 5 14 6 3-16 12-26 26-30Z" fill="#d9a441"/>
  <path d="M60 84c20 0 36 11 40 30-4 3-9 5-14 6-3-16-12-26-26-30Z" fill="#d9a441"/>
  <path d="M26 114c4-19 20-30 40-30l-6 8c-14 2-25 10-28 22Z" fill="#241c26"/>
  <path d="M94 114c-4-19-20-30-40-30l6 8c14 2 25 10 28 22Z" fill="#b3306f"/>
  <path d="M52 70h16v13a8 8 0 0 1-16 0Z" fill="#f0c8a4"/>
  <path d="M52 70h16v6a16 9 0 0 1-16 0Z" fill="#000" opacity=".12"/>
  <path d="M31 60c-3-26 10-40 29-40s32 14 29 40c-1 9-3 16-6 21-1-12 0-20-2-27-5 6-13 9-24 8-8-1-14-4-18-9-2 7-2 16-3 27-3-5-4-12-5-20Z" fill="#241c26"/>
  <path d="M31 60c-3 14-2 26 2 34 3 6 7 8 10 7-5-9-6-22-4-33Z" fill="#241c26"/>
  <path d="M89 60c3 14 2 26-2 34-3 6-7 8-10 7 5-9 6-22 4-33Z" fill="#241c26"/>
  <ellipse cx="60" cy="52" rx="27" ry="31" fill="#f0c8a4"/>
  <g clip-path="url(#kt-face)">
    <path d="M33 44c2-16 13-25 27-25s25 9 27 25c-4-11-13-17-22-15-8 2-14 7-17 15-4-1-9 0-15 0Z" fill="#241c26"/>
    <path d="M60 19c-8 0-15 3-19 9 8-3 19-4 30 1-3-6-7-10-11-10Z" fill="#fff" opacity=".1"/>
  </g>
  <g fill="#2a1c22"><ellipse cx="50" cy="53" rx="3.1" ry="3.6"/><ellipse cx="70" cy="53" rx="3.1" ry="3.6"/></g>
  <circle cx="51" cy="51.6" r="1.15" fill="#fff"/><circle cx="71" cy="51.6" r="1.15" fill="#fff"/>
  <g fill="none" stroke="#2a1c22" stroke-width="1.7" stroke-linecap="round">
    <path d="M45 45.5c2-1.7 6-1.9 8.4-.6"/><path d="M66.6 44.9c2.4-1.3 6.4-1.1 8.4.6"/>
  </g>
  <path d="M59 55.5c-.6 2-1 3.4-1 4.2 0 .8.7 1.3 1.8 1.4" fill="none" stroke="#c98f68" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M52.5 66c2.4 2.6 5.2 3.9 7.5 3.9s5.1-1.3 7.5-3.9" fill="none" stroke="#b33a52" stroke-width="2" stroke-linecap="round"/>
  <circle cx="45" cy="61" r="3.4" fill="#e8748c" opacity=".28"/><circle cx="75" cy="61" r="3.4" fill="#e8748c" opacity=".28"/>
  <circle cx="60" cy="43" r="2.5" fill="#b23a2a"/>
  <g fill="#d9a441">
    <circle cx="33.5" cy="62" r="2.4"/><path d="M31 66c2.5 3.5 2.5 6 0 8-2.5-2-2.5-4.5 0-8Z"/>
    <circle cx="86.5" cy="62" r="2.4"/><path d="M84 66c2.5 3.5 2.5 6 0 8-2.5-2-2.5-4.5 0-8Z"/>
  </g>
  <path d="M50 80c3 5 7 7 10 7s7-2 10-7" fill="none" stroke="#d9a441" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="60" cy="88" r="2.6" fill="#d9a441"/>
</svg>`;

function agentFaceNode() {
  const holder = document.createElement("span");
  holder.innerHTML = AGENT_FACE;
  return holder.firstElementChild;
}

/* ---------- Finding poems ---------- */

/** Devanagari and Latin digits both count, so "१४" and "14" find
 *  the same poem. */
function agentToPoemNumber(token) {
  const digits = { "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9" };
  const normalised = token.replace(/[०-९]/g, (d) => digits[d]).trim();
  const value = Number.parseInt(normalised, 10);
  if (!Number.isFinite(value) || value < 1 || value > poems.length) return null;
  return String(value).padStart(2, "0");
}

function searchPoems(query) {
  const raw = query.toLowerCase();

  /* A bare number is a poem number. */
  const asNumber = agentToPoemNumber(raw);
  if (asNumber) return poems.filter((poem) => poem.num === asNumber);

  const words = raw
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1);

  if (!words.length) return [];

  return poems.filter((poem) => {
    const haystack = `${poem.title} ${poem.excerpt}`.toLowerCase();
    return words.some((word) => haystack.includes(word));
  });
}

/* Poem pages live one directory down, so every link the agent
   offers has to be built relative to the page it is on. */
function agentIsPoemPage() {
  return Boolean(document.querySelector("main.poem-page"));
}

function poemPath(num) {
  return agentIsPoemPage() ? `../poems/poem-${num}.html` : `poems/poem-${num}.html`;
}

function bioPath() {
  return agentIsPoemPage() ? "../bio.html" : "bio.html";
}

/* ---------- Conversation plumbing ---------- */

let agentPanel = null;
let agentFab = null;
let agentLog = null;
let agentChips = null;
let agentInput = null;
let agentBusy = false;
let agentGreeted = false;

function agentStrings() {
  return AGENT_STRINGS[KESAR.language] || AGENT_STRINGS.en;
}

function agentAddMessage(text, role = "bot") {
  const message = document.createElement("p");
  message.className = `agent-msg agent-msg--${role}`;
  message.textContent = text;
  agentLog.appendChild(message);
  agentLog.scrollTop = agentLog.scrollHeight;
  return message;
}

/** A message with a link in it, without ever putting markup into
 *  innerHTML from a string. */
function agentAddRichMessage(text, linkLabel, linkHref) {
  const message = agentAddMessage(text);
  message.textContent = "";
  message.append(document.createTextNode(`${text} `));
  const link = document.createElement("a");
  link.className = "bio-link";
  link.href = linkHref;
  link.textContent = linkLabel;
  message.appendChild(link);
  return message;
}

function agentShowTyping() {
  const holder = document.createElement("p");
  holder.className = "agent-msg agent-msg--bot";
  /* Marked so the placeholder can be found and removed reliably, even
     if an answer arrives out of order. */
  holder.dataset.typing = "true";
  holder.setAttribute("aria-label", "typing");
  holder.innerHTML = '<span class="agent-typing"><i></i><i></i><i></i></span>';
  agentLog.appendChild(holder);
  agentLog.scrollTop = agentLog.scrollHeight;
  return holder;
}

function agentSetChips(labels) {
  agentChips.textContent = "";
  for (const label of labels) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "agent-chip";
    chip.textContent = label;
    chip.addEventListener("click", () => agentAsk(label));
    agentChips.appendChild(chip);
  }
}

/** Replaces the chips with real links to the poems that matched. */
function agentOfferLinks(items) {
  agentChips.textContent = "";
  for (const item of items) {
    const link = document.createElement("a");
    link.className = "agent-chip";
    link.href = item.href;
    link.textContent = item.label;
    agentChips.appendChild(link);
  }
}

function agentOfferPoem(poem) {
  agentOfferLinks([{ href: poemPath(poem.num), label: poem.title }]);
}

function agentListPoems(matches, strings) {
  agentAddMessage(strings.found(matches.length));
  agentOfferLinks(
    matches.slice(0, 6).map((poem) => ({
      href: poemPath(poem.num),
      label: `${poem.num} · ${poem.title}`,
    }))
  );
}

/* ---------- Answering ---------- */

/** Forward an unrecognised question to the poet's own LLM proxy, if
 *  one is configured. Never called with a key — that stays server-side,
 *  which is why this file is safe to serve to every reader. */
async function agentAskEndpoint(message) {
  const config = window.KESAR_AI || {};
  if (!config.agentEndpoint) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(config.agentEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang: KESAR.language, theme: KESAR.currentTheme().id }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.reply === "string" && data.reply.trim() ? data.reply.trim() : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function agentThemeFrom(text) {
  return KESAR.themes.find((theme) =>
    new RegExp(`\\b${theme.id}\\b|${theme.latin}|${theme.label}`, "i").test(text)
  );
}

function agentLanguageFrom(text) {
  if (/english|इंग्रजी|अंग्रेजी/i.test(text)) return "en";
  if (/hindi|हिंदी|हिन्दी/i.test(text)) return "hi";
  if (/marathi|मराठी/i.test(text)) return "mr";
  return null;
}

async function agentRespond(text) {
  const strings = agentStrings();

  /* A bare theme name ("kesar", "night") is a command, not a
     question — it is checked before the intents so that naming a
     theme never has to also contain the word "theme". */
  const named = agentThemeFrom(text.trim());
  if (named && !AGENT_INTENTS.some((i) => i.test.test(text))) {
    KESAR.setTheme(named.id);
    agentAddMessage(agentStrings().themeDone(named.latin));
    agentSetChips(agentStrings().chips);
    return;
  }

  const intent = AGENT_INTENTS.find((candidate) => candidate.test.test(text.trim()));

  switch (intent?.id) {
    case "greet":
      agentAddMessage(strings.greet);
      agentSetChips(strings.chips);
      return;

    case "help":
      agentAddMessage(strings.help);
      agentSetChips(strings.chips);
      return;

    case "about":
      agentAddRichMessage(strings.about, strings.aboutMore, bioPath());
      agentSetChips(strings.chips);
      return;

    case "theme": {
      /* A named theme is applied at once; anything else is better
         answered by pointing at the picker than by guessing. */
      const named = agentThemeFrom(text);
      if (named) {
        KESAR.setTheme(named.id);
        agentAddMessage(agentStrings().themeDone(named.latin));
        agentSetChips(agentStrings().chips);
      } else {
        agentAddMessage(strings.themeList);
        KESAR.openThemePicker();
      }
      return;
    }

    case "language": {
      const wanted = agentLanguageFrom(text);
      if (wanted) {
        KESAR.setLanguage(wanted);
        agentAddMessage(agentStrings().langDone(KESAR.langNames[wanted]));
        agentSetChips(agentStrings().chips);
      } else {
        agentAddMessage(strings.help);
        agentSetChips(strings.chips);
      }
      return;
    }

    case "mother": {
      agentAddMessage(strings.mother);
      const matches = MOTHER_POEMS.map((num) => poems.find((poem) => poem.num === num)).filter(
        Boolean
      );
      if (matches.length) agentListPoems(matches, agentStrings());
      else agentSetChips(agentStrings().chips);
      return;
    }

    case "random": {
      const poem = poems[Math.floor(Math.random() * poems.length)];
      agentAddMessage(strings.randomIs(poem.title));
      agentOfferPoem(poem);
      return;
    }
  }

  /* No intent matched: search the poems by their own words. */
  const matches = searchPoems(text);
  if (matches.length) {
    agentListPoems(matches, strings);
    return;
  }

  /* Still nothing — this is where a real model earns its place. */
  const reply = await agentAskEndpoint(text);
  if (reply) {
    agentAddMessage(`${agentStrings().aiLabel}: ${reply}`);
    agentSetChips(agentStrings().chips);
    return;
  }

  agentAddMessage(agentStrings().noEndpoint);
  agentSetChips(agentStrings().chips);
}

async function agentAsk(text) {
  const message = (text || "").trim();
  if (!message || agentBusy || !agentPanel) return;

  agentAddMessage(message, "user");
  agentBusy = true;
  agentInput.value = "";
  agentSetChips([]);

  const typing = agentShowTyping();
  try {
    await agentRespond(message);
  } catch (e) {
    agentAddMessage(agentStrings().noEndpoint);
  } finally {
    /* The typing dots must never outlive the answer, whatever happened. */
    typing.remove();
    agentBusy = false;
  }
}


/* ---------- Mounting ---------- */

function agentOpen() {
  if (!agentPanel || !agentFab) return;
  /* The agent and the theme picker share this corner — only one of
     them should ever be open at a time. */
  KESAR.closeThemePicker();
  agentPanel.hidden = false;
  agentFab.hidden = true;
  if (!agentGreeted) {
    agentGreeted = true;
    agentAddMessage(agentStrings().greet);
    agentSetChips(agentStrings().chips);
  }
  agentInput.focus();
  try {
    localStorage.setItem(AGENT_KEY, "1");
  } catch (e) {
    /* Not being able to remember the greeting is harmless. */
  }
}

function agentClose() {
  if (!agentPanel || !agentFab) return;
  agentPanel.hidden = true;
  agentFab.hidden = false;
  agentFab.focus();
}

function ensureAgent() {
  if (agentPanel) return agentPanel;
  if (!document.body) return null;

  const strings = agentStrings();

  agentFab = document.createElement("button");
  agentFab.id = "agent-fab";
  agentFab.className = "agent-fab";
  agentFab.type = "button";
  agentFab.appendChild(agentFaceNode());
  agentFab.setAttribute("aria-label", strings.open);
  agentFab.title = strings.open;
  agentFab.addEventListener("click", agentOpen);

  agentPanel = document.createElement("section");
  agentPanel.id = "agent-panel";
  agentPanel.className = "agent-panel";
  agentPanel.hidden = true;
  agentPanel.setAttribute("aria-label", strings.name);

  const head = document.createElement("div");
  head.className = "agent-head";
  head.appendChild(agentFaceNode());

  const id = document.createElement("div");
  id.className = "agent-id";
  const name = document.createElement("strong");
  name.className = "agent-name";
  name.textContent = strings.name;
  const status = document.createElement("span");
  status.className = "agent-status";
  status.textContent = strings.status;
  id.append(name, status);

  const close = document.createElement("button");
  close.className = "agent-close";
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "बंद करा / Close");
  close.addEventListener("click", agentClose);

  head.append(id, close);

  agentLog = document.createElement("div");
  agentLog.className = "agent-log";
  agentLog.setAttribute("role", "log");
  agentLog.setAttribute("aria-live", "polite");

  agentChips = document.createElement("div");
  agentChips.className = "agent-chips";

  const form = document.createElement("form");
  form.className = "agent-form";
  agentInput = document.createElement("input");
  agentInput.className = "agent-input";
  agentInput.type = "text";
  agentInput.placeholder = strings.placeholder;
  agentInput.setAttribute("aria-label", strings.placeholder);
  agentInput.autocomplete = "off";

  const send = document.createElement("button");
  send.className = "agent-send";
  send.type = "submit";
  send.textContent = "→";
  send.setAttribute("aria-label", strings.send);

  form.append(agentInput, send);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    agentAsk(agentInput.value);
  });

  agentPanel.append(head, agentLog, agentChips, form);

  /* Escape closes the agent whenever it is open, wherever focus
     happens to be — a chat panel that traps Escape is a trap. */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || agentPanel.hidden) return;
    agentClose();
  });

  document.body.append(agentFab);
  document.body.append(agentPanel);

  /* A reader who switches language gets the agent's labels switched
     too, rather than being left with a Marathi input box on an
     English page. */
  document.addEventListener("kesar:language", () => {
    const next = agentStrings();
    name.textContent = next.name;
    status.textContent = next.status;
    agentInput.placeholder = next.placeholder;
    agentPanel.setAttribute("aria-label", next.name);
    agentFab.setAttribute("aria-label", next.open);
    agentFab.title = next.open;
    send.setAttribute("aria-label", next.send);
  });

  return agentPanel;
}

