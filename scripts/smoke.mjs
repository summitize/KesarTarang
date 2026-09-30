/* ============================================================
   Kesar Tarang — render smoke test
   ------------------------------------------------------------
   Loads the real pages in jsdom, runs the real scripts, and
   asserts the things that matter: the poem index, the control
   dock, prev/next navigation, and all three translation paths
   (final text, stored draft, live AI proxy).

     node scripts/smoke.mjs
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
let checks = 0;

function check(label, condition, detail = "") {
  checks++;
  if (condition) console.log(`  ✓ ${label}`);
  else {
    failures++;
    console.log(`  ✗ ${label}${detail ? `  — ${detail}` : ""}`);
  }
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 120));

/**
 * Boot a real page with the real scripts.
 * @param {string} relativePath  e.g. "poems/poem-01.html"
 * @param {string|null} lang     "mr" | "en" | "hi", or null for the stored default
 * @param {object} options       { store, ai, fetchImpl }
 */
function boot(relativePath, lang, options = {}) {
  const html = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  const url =
    "https://example.test/" + relativePath.replace(/\\/g, "/") + (lang ? `?lang=${lang}` : "");

  const dom = new JSDOM(html, { url, runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;

  /* Stand in for the Google widget so its retry loop resolves at once. */
  if (lang && lang !== "mr") {
    const combo = window.document.createElement("select");
    combo.className = "goog-te-combo";
    window.document.body.appendChild(combo);
  }

  window.eval(fs.readFileSync(path.join(ROOT, "translations.js"), "utf8"));

  if (options.store) {
    window.eval(`Object.assign(window.KESAR_TRANSLATIONS, ${JSON.stringify(options.store)});`);
  }
  if (options.ai) window.eval(`window.KESAR_AI = ${JSON.stringify(options.ai)};`);
  if (options.fetchImpl) {
    window.AbortController = globalThis.AbortController;
    window.fetch = options.fetchImpl;
  }

  window.eval(fs.readFileSync(path.join(ROOT, "script.js"), "utf8"));
  window.eval(fs.readFileSync(path.join(ROOT, "agent.js"), "utf8"));
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

  return dom;
}

const MARATHI_01 = "पहिली ओळ\n\nदुसरी ओळ\nतिसरी ओळ";
const EN_01 = "First line\n\nSecond line\nThird line";
const HI_01 = "पहली पंक्ति\n\nदूसरी पंक्ति\nतीसरी पंक्ति";

/* ---------------- Stylesheet ---------------- */

console.log("\n  style.css");
{
  const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head><style>${css}</style></head><body></body></html>`,
    { url: "https://example.test/", runScripts: "outside-only" }
  );
  const sheet = dom.window.document.styleSheets[0];
  const rules = sheet ? sheet.cssRules.length : 0;

  /* Top-level rules only: each @media / @keyframes block counts as one. */
  check("stylesheet parses", rules > 120, `${rules} top-level rules`);
  check("no build markers left behind", !/\/\*__\w+__\*\//.test(css));
  check("braces balanced", (css.match(/{/g) || []).length === (css.match(/}/g) || []).length);

  const selectors = [...(sheet ? [...sheet.cssRules] : [])].map((r) => r.selectorText || "");
  for (const required of [".poem-grid a", ".translation-panel", ".control-dock", ".poem-nav"]) {
    check(`defines ${required}`, selectors.includes(required));
  }
  check("night theme is driven from <html>",
    selectors.some((s) => s.includes('[data-theme="night"]')));

  /* Every theme the JS advertises must actually have a palette block,
     or selecting it would silently fall back to the previous theme. */
  for (const id of ["day", "night", "kesar", "himalaya", "rang", "indra", "agni", "nila"]) {
    check(`palette defined for ${id}`,
      selectors.includes(`html[data-theme="${id}"]`));
  }
  check("dark rules key off data-mode, not the theme name",
    selectors.some((s) => s.includes('[data-mode="night"]')));

  /* The dark and light branches of the paper texture must both exist. */
  check("grain adapts to dark themes",
    css.includes('html[data-mode="night"] body::after'));
  check("agent and theme-picker styles defined",
    css.includes(".agent-panel") && css.includes(".theme-picker"));
  await settle();
}

/* ---------------- Home page ---------------- */

console.log("\n  index.html");
{
  const dom = boot("index.html", "mr");
  const doc = dom.window.document;
  const links = doc.querySelectorAll("#poem-list a");

  check("renders all 30 poems", links.length === 30, `got ${links.length}`);
  check("first poem links to poem-01", links[0]?.getAttribute("href") === "poems/poem-01.html");
  check("poem numerals rendered", doc.querySelectorAll(".poem-num"). length === 30);

  /* Regression: excerpts were inserted with Element.after() on a parentless
     node, so they silently vanished and every card rendered as an empty row. */
  const excerpts = doc.querySelectorAll("#poem-list .poem-excerpt");
  check("every card shows its opening line", excerpts.length === 30, `got ${excerpts.length}`);
  check("first excerpt is poem 01's", excerpts[0]?.textContent.trim() === "सात रंग प्रेमाचे.....");
  check("excerpt sits inside the link", links[0]?.querySelector(".poem-excerpt") !== null);
  check("excerpt is not empty", (excerpts[0]?.textContent || "").length > 3);
  check("control dock mounted", Boolean(doc.querySelector(".control-dock")));
  check("theme toggle inside dock", Boolean(doc.querySelector(".control-dock #theme-toggle")));
  check("language toggle inside dock", Boolean(doc.querySelector(".control-dock #language-toggle")));
  check("3 language options", doc.querySelectorAll(".language-option").length === 3);
  check("footer links injected", Boolean(doc.querySelector(".footer-links a")));
  check("skip link present", Boolean(doc.querySelector(".skip-link")));
  check("no translation panel on home", !doc.getElementById("translation-panel"));

  /* Scroll-reveal must be armed by JS, not baked into the stylesheet —
     otherwise a JS failure hides all 30 poems at opacity 0. */
  check("js-reveal armed after init", doc.documentElement.classList.contains("js-reveal"));
  await settle();
}

/* ---------------- Poem page, original language ---------------- */

console.log("\n  poems/poem-01.html  (lang=mr)");
{
  const dom = boot("poems/poem-01.html", "mr");
  const doc = dom.window.document;

  check("poem rendered as line spans", doc.querySelectorAll(".poem-text .poem-line").length > 0);
  check("blank lines preserved", doc.querySelectorAll(".poem-line-empty").length > 0);
  check("trailing date styled", Boolean(doc.querySelector(".poem-line--date")));
  check("no translation panel in Marathi mode", !doc.getElementById("translation-panel"));
  check("prev/next nav injected", Boolean(doc.querySelector(".poem-nav")));
  check("nav has 2 slots", doc.querySelectorAll(".poem-nav > *").length === 2);
  check("next link points to poem-02",
    doc.querySelector(".poem-nav a.is-next")?.getAttribute("href") === "../poems/poem-02.html");
  check("theme applied to <html>", Boolean(doc.documentElement.dataset.theme));
  await settle();
}

/* ---------------- Path 1: the poet's own final translation ---------------- */

console.log("\n  poems/poem-01.html  (lang=en, final translation)");
{
  const dom = boot("poems/poem-01.html", "en", {
    store: { "01": { en: { title: "Seven Colours of Love", text: EN_01 } } },
  });
  await settle();
  const doc = dom.window.document;
  const panel = doc.getElementById("translation-panel");

  check("panel visible", Boolean(panel) && !panel.hidden);
  check("badge marked final", Boolean(panel?.querySelector(".badge--final")));
  check("no AI badge", !panel?.querySelector(".badge--ai"));
  check("line structure preserved",
    panel?.querySelectorAll(".poem-line").length === 4,
    `got ${panel?.querySelectorAll(".poem-line").length}`);
  check("blank line preserved in translation", Boolean(panel?.querySelector(".poem-line-empty")));
  check("original excluded from Google",
    doc.querySelector(".poem-text").classList.contains("notranslate"));
  check("translated title shown",
    doc.getElementById("poem-title-translated")?.textContent === "Seven Colours of Love");
  check("html lang switched to en", doc.documentElement.lang === "en");
  await settle();
}

/* ---------------- Path 2: machine draft already in the store ---------------- */

console.log("\n  poems/poem-01.html  (lang=en, stored AI draft)");
{
  const dom = boot("poems/poem-01.html", "en", {
    store: { "01": { en: { title: "Draft", text: EN_01, draft: true } } },
  });
  await settle();
  const panel = dom.window.document.getElementById("translation-panel");

  check("panel visible", Boolean(panel) && !panel.hidden);
  check("draft is NOT labelled final", !panel?.querySelector(".badge--final"));
  check("draft is labelled AI draft", Boolean(panel?.querySelector(".badge--ai")));
  await settle();
}

/* ---------------- Path 3: live translation through the poet's proxy ---------------- */

console.log("\n  poems/poem-01.html  (lang=en, live AI proxy)");
{
  const calls = [];
  const dom = boot("poems/poem-01.html", "en", {
    ai: { endpoint: "https://proxy.example.test/translate" },
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, json: async () => ({ text: MARATHI_01, title: "Live Draft" }) };
    },
  });
  await settle();
  const doc = dom.window.document;
  const panel = doc.getElementById("translation-panel");

  check("proxy called exactly once", calls.length === 1, `got ${calls.length}`);
  check("proxy received the poem number", calls[0]?.body.num === "01");
  check("proxy received target language", calls[0]?.body.lang === "en");
  check("proxy received the source text", Boolean(calls[0]?.body.text.includes("सात रंग प्रेमाचे")));
  check("panel rendered from proxy", Boolean(panel) && !panel.hidden);
  check("proxy result labelled as AI draft", Boolean(panel?.querySelector(".badge--ai")));
  check("result cached in localStorage",
    Boolean(dom.window.localStorage.getItem("kesar_ai_tr_01_en")));
  await settle();
}

/* ---------------- Fallback: nothing stored, nothing to ask ---------------- */

console.log("\n  poems/poem-02.html  (lang=en, no stored or live translation)");
{
  const dom = boot("poems/poem-02.html", "en");
  await settle();
  const doc = dom.window.document;
  const panel = doc.getElementById("translation-panel");
  check("no half-built panel left behind", !panel || panel.hidden);
  check("original still translatable by Google",
    !doc.querySelector(".poem-text").classList.contains("notranslate"));
  await settle();
}

/* ---------------- English-source poem ---------------- */

console.log("\n  poems/poem-30.html  (lang=en, source is already English)");
{
  const dom = boot("poems/poem-30.html", "en");
  await settle();
  const panel = dom.window.document.getElementById("translation-panel");
  check("no pointless English-to-English panel", !panel || panel.hidden);
  await settle();
}

/* ---------------- Hindi ---------------- */

console.log("\n  poems/poem-01.html  (lang=hi)");
{
  const dom = boot("poems/poem-01.html", "hi", {
    store: { "01": { hi: { title: "प्रेमाचे सात रंग", text: HI_01 } } },
  });
  await settle();
  const panel = dom.window.document.getElementById("translation-panel");
  check("Hindi panel shown", Boolean(panel) && !panel.hidden);
  check("Hindi panel marked final", Boolean(panel?.querySelector(".badge--final")));
  check("panel lang attribute set to hi", panel?.querySelector(".poem-text")?.lang === "hi");
  await settle();
}

/* ---------------- Last poem navigation ---------------- */

console.log("\n  poems/poem-30.html  (nav bounds)");
{
  const dom = boot("poems/poem-30.html", "mr");
  const doc = dom.window.document;
  check("last poem has no next link", !doc.querySelector(".poem-nav a.is-next"));
  check("last poem has a previous link", Boolean(doc.querySelector(".poem-nav a[href*='poem-29']")));
  await settle();
}

/* ---------------- Themes ---------------- */

console.log("\n  themes  (picker, switching, persistence)");
{
  const dom = boot("index.html", "mr");
  const doc = dom.window.document;
  const html = doc.documentElement;
  const click = (node) => node.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));

  check("theme picker mounted in the dock",
    Boolean(doc.querySelector(".control-dock #theme-picker-toggle")));
  check("picker is closed to begin with", doc.getElementById("theme-picker").hidden === true);
  check("all 8 themes offered", doc.querySelectorAll(".theme-option").length === 8,
    `got ${doc.querySelectorAll(".theme-option").length}`);
  check("current theme is marked checked",
    doc.querySelectorAll('.theme-option[aria-checked="true"]').length === 1);
  check("every option carries a colour chip",
    [...doc.querySelectorAll(".theme-option")].every((o) => {
      const chip = o.querySelector(".theme-chip");
      return chip && chip.style.getPropertyValue("--chip-a");
    }));

  click(doc.getElementById("theme-picker-toggle"));
  check("picker opens on click", doc.getElementById("theme-picker").hidden === false);
  check("toggle reports expanded state",
    doc.getElementById("theme-picker-toggle").getAttribute("aria-expanded") === "true");

  click(doc.querySelector('.theme-option[data-theme="kesar"]'));
  check("theme applied to <html>", html.dataset.theme === "kesar");
  check("light theme sets data-mode=day", html.dataset.mode === "day");
  check("theme applied to <body> too", doc.body.dataset.theme === "kesar");
  check("theme persisted", dom.window.localStorage.getItem("kesar_tarang_theme") === "kesar");
  check("picker closes after choosing", doc.getElementById("theme-picker").hidden === true);
  check("selection is now the checked one",
    doc.querySelector('.theme-option[data-theme="kesar"]').getAttribute("aria-checked") === "true");

  /* A dark theme must set the mode, which is what the night rules read. */
  click(doc.querySelector('.theme-option[data-theme="nila"]'));
  check("dark theme sets data-mode=night", html.dataset.mode === "night");
  check("dark theme persisted", dom.window.localStorage.getItem("kesar_tarang_theme") === "nila");

  /* The quick button steps between the two plain light/dark themes. */
  click(doc.getElementById("theme-toggle"));
  check("quick toggle leaves a dark theme for day", html.dataset.theme === "day",
    `now ${html.dataset.theme}`);
  click(doc.getElementById("theme-toggle"));
  check("quick toggle returns to night", html.dataset.theme === "night");

  click(doc.getElementById("theme-picker-toggle"));
  doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  check("Escape closes the picker", doc.getElementById("theme-picker").hidden === true);
  await settle();
}

console.log("\n  themes  (the picker and the agent share the corner)");
{
  const dom = boot("index.html", "mr");
  const doc = dom.window.document;

  /* Both live above the dock in the same corner, so the picker has to
     be layered over the agent, not behind it. */
  const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
  const pickerLayer = Number(css.match(/\.theme-picker \{[^}]*z-index:\s*(\d+)/s)?.[1]);
  const agentLayer = Number(css.match(/\.agent-panel \{[^}]*z-index:\s*(\d+)/s)?.[1]);
  check("theme picker layers above the agent panel", pickerLayer > agentLayer,
    `picker ${pickerLayer}, agent ${agentLayer}`);

  /* Opening the agent must not leave the picker hanging open. */
  doc.getElementById("theme-picker-toggle").dispatchEvent(
    new dom.window.MouseEvent("click", { bubbles: true })
  );
  check("picker is open", doc.getElementById("theme-picker").hidden === false);
  doc.getElementById("agent-fab").dispatchEvent(
    new dom.window.MouseEvent("click", { bubbles: true })
  );
  check("opening the agent closes the picker",
    doc.getElementById("theme-picker").hidden === true);
  check("agent is now open", doc.getElementById("agent-panel").hidden === false);

  /* Escape from inside the agent closes it and restores the button. */
  doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  check("Escape closes the agent", doc.getElementById("agent-panel").hidden === true);
  check("agent button comes back", doc.getElementById("agent-fab").hidden === false);
  await settle();
}

console.log("\n  themes  (an unknown stored value must not stick)");
{
  const dom = boot("index.html", "mr");
  dom.window.localStorage.setItem("kesar_tarang_theme", "not-a-theme");
  const doc = dom.window.document;
  /* Resolve an unknown id exactly as the page does on load. */
  dom.window.eval('window.KESAR.setTheme(localStorage.getItem("kesar_tarang_theme"));');
  check("unrecognised theme falls back to a real one",
    ["day", "night", "kesar", "himalaya", "rang", "indra", "agni", "nila"]
      .includes(doc.documentElement.dataset.theme),
    `got ${doc.documentElement.dataset.theme}`);
  await settle();
}

/* ---------------- AI agent ---------------- */

console.log("\n  agent  (mount, language, local answers)");
{
  const dom = boot("index.html", "mr");
  const doc = dom.window.document;
  const click = (node) => node.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));

  check("agent button mounted", Boolean(doc.getElementById("agent-fab")));
  check("agent panel mounted", Boolean(doc.getElementById("agent-panel")));
  check("agent starts closed", doc.getElementById("agent-panel").hidden === true);
  check("agent wears the cartoon portrait", Boolean(doc.querySelector("#agent-fab svg.agent-face")));
  check("agent panel is labelled",
    Boolean(doc.getElementById("agent-panel").getAttribute("aria-label")));
  check("agent log is a polite live region",
    doc.querySelector(".agent-log").getAttribute("aria-live") === "polite");
  check("agent is named in Marathi by default",
    doc.querySelector(".agent-name").textContent === "कवितामित्र");

  click(doc.getElementById("agent-fab"));
  check("agent opens on click", doc.getElementById("agent-panel").hidden === false);
  check("agent greets the reader", doc.querySelectorAll(".agent-msg--bot").length === 1);
  check("greeting offers suggestion chips", doc.querySelectorAll(".agent-chip").length > 0);

  /* A poem number is answered from the local index, with no network. */
  doc.querySelector(".agent-input").value = "14";
  doc.querySelector(".agent-form").dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true })
  );
  await settle();

  const log = doc.querySelector(".agent-log").textContent;
  check("number query echoes the user", log.includes("14"));
  check("number query counts the match", log.includes("अशा 1 कविता"));
  check("answer links to the poem", doc.querySelector('.agent-chips a[href*="poem-14"]') !== null);
  check("the linked poem is the one asked for",
    doc.querySelector('.agent-chips a[href*="poem-14"]').textContent.includes("आई"));
  check("typing indicator cleaned up", doc.querySelector("[data-typing]") === null);
  await settle();
}

console.log("\n  agent  (acts on the site: theme and language)");
{
  const dom = boot("index.html", "mr");
  const doc = dom.window.document;

  const ask = async (text) => {
    doc.querySelector(".agent-input").value = text;
    doc.querySelector(".agent-form").dispatchEvent(
      new dom.window.Event("submit", { bubbles: true, cancelable: true })
    );
    await settle();
  };

  await ask("night theme");
  check("agent applies a named theme", doc.documentElement.dataset.theme === "night",
    `got ${doc.documentElement.dataset.theme}`);

  await ask("kesar");
  check("agent applies a theme by id", doc.documentElement.dataset.theme === "kesar");

  await ask("read this in english");
  check("agent switches the site language", doc.documentElement.lang === "en");
  check("agent relabels itself in the new language",
    doc.querySelector(".agent-name").textContent === "Kavitamitra");
  check("agent input placeholder follows the language",
    doc.querySelector(".agent-input").placeholder === "Ask about a poem…");
  check("agent answers in the new language too",
    doc.querySelector(".agent-log").textContent.includes("Language changed to English"),
    doc.querySelector(".agent-log").textContent.slice(-90));
  await settle();
}

console.log("\n  agent  (a question it cannot answer)");
{
  const dom = boot("index.html", "en");
  const doc = dom.window.document;

  doc.querySelector(".agent-input").value = "who composed the score for the 1998 film";
  doc.querySelector(".agent-form").dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true })
  );
  await settle();

  check("unknown question is not answered with a poem",
    !doc.querySelector('.agent-chips a[href*="poem-"]'));
  check("agent admits it does not know",
    doc.querySelector(".agent-log").textContent.includes("don't know"));
  check("agent still offers a way forward", doc.querySelectorAll(".agent-chip").length > 0);
  await settle();
}

console.log("\n  agent  (optional LLM endpoint)");
{
  const calls = [];
  const dom = boot("index.html", "en", {
    ai: { agentEndpoint: "https://proxy.example.test/agent" },
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return { ok: true, json: async () => ({ reply: "A translated, AI-written answer." }) };
    },
  });
  const doc = dom.window.document;

  doc.querySelector(".agent-input").value = "summarise her view of longing";
  doc.querySelector(".agent-form").dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true })
  );
  await settle();

  check("agent called the configured endpoint once", calls.length === 1, `got ${calls.length}`);
  check("agent sent the reader's question",
    calls[0]?.body.message === "summarise her view of longing");
  check("agent sent the current language", calls[0]?.body.lang === "en");
  check("agent sent the current theme", calls[0]?.body.theme === "day");
  check("endpoint answer shown", doc.querySelector(".agent-log").textContent.includes("A translated"));
  check("AI answer is labelled as such",
    doc.querySelector(".agent-log").textContent.includes("AI answer"));
  await settle();
}

console.log("\n  agent  (links are correct from a poem page)");
{
  const dom = boot("poems/poem-01.html", "mr");
  const doc = dom.window.document;

  doc.querySelector(".agent-input").value = "14";
  doc.querySelector(".agent-form").dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true })
  );
  await settle();

  const link = doc.querySelector('.agent-chips a[href*="poem-14"]');
  check("poem link is relative to the poems folder",
    link?.getAttribute("href") === "../poems/poem-14.html", `got ${link?.getAttribute("href")}`);
  await settle();
}


console.log(`\n  ${checks - failures}/${checks} checks passed\n`);


/* jsdom keeps timers alive; exit explicitly once we are done. */
process.exit(failures ? 1 : 0);

