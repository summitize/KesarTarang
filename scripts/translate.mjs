/* ============================================================
   Kesar Tarang — agentic pre-translation
   ------------------------------------------------------------
   Reads every poem, asks an LLM for a verse-faithful English and
   Hindi translation, and writes the results into translations.js.

   Existing non-empty entries are NEVER overwritten, so anything
   the poet has already approved is safe to re-run this over.

   Usage:
     OPENAI_API_KEY=sk-...  node scripts/translate.mjs
     node scripts/translate.mjs --lang=en --only=01,07
     node scripts/translate.mjs --dry-run
     node scripts/translate.mjs --check     (report coverage only)

   Supported providers (auto-detected from env):
     OpenAI-compatible  OPENAI_API_KEY + OPENAI_BASE_URL
                        (OpenAI, Azure OpenAI, Groq, OpenRouter,
                         Ollama, LM Studio, ...)
     Anthropic          ANTHROPIC_API_KEY
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POEMS_DIR = path.join(ROOT, "poems");
const STORE = path.join(ROOT, "translations.js");

const LANGS = { en: "English", hi: "Hindi" };

/* ---------------- CLI ---------------- */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name, fallback) => {
  /* supports both --name=value and --name value */
  const inline = argv.find((a) => a.startsWith(name + "="));
  if (inline) return inline.slice(name.length + 1);
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const DRY_RUN = flag("--dry-run");
const CHECK_ONLY = flag("--check");
const ONLY = value("--only", "")
  .split(",")
  .map((s) => s.trim().padStart(2, "0"))
  .filter(Boolean);
const LANGS_TO_DO = value("--lang", "en,hi")
  .split(",")
  .map((s) => s.trim())
  .filter((l) => LANGS[l]);

/* ---------------- Source poems ---------------- */

function readPoems() {
  const poems = [];
  for (const file of fs.readdirSync(POEMS_DIR).filter((f) => /^poem-\d\d\.html$/.test(f)).sort()) {
    const num = file.match(/poem-(\d\d)\.html/)[1];
    const html = fs.readFileSync(path.join(POEMS_DIR, file), "utf8");

    const title = (html.match(/<h1 class="poem-title">([\s\S]*?)<\/h1>/) || [, ""])[1].trim();
    const body = (html.match(/<div class="poem-text"[^>]*>([\s\S]*?)<\/div>/) || [, ""])[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\r\n?/g, "\n")
      .replace(/\s+$/, "");

    poems.push({ num, file, title, text: body });
  }
  return poems;
}

/* ---------------- Existing store ---------------- */

function loadExisting() {
  if (!fs.existsSync(STORE)) return {};
  const source = fs.readFileSync(STORE, "utf8");
  const literal = source.slice(source.indexOf("{"), source.lastIndexOf("}") + 1);
  try {
    return new Function(`return ${literal}`)();
  } catch {
    return {};
  }
}

const isFilled = (v) => Boolean(v && String(v).trim());
const existingText = (entry) => (typeof entry === "string" ? entry : entry && entry.text);
const existingTitle = (entry) => (typeof entry === "string" ? "" : (entry && entry.title) || "");

/* ---------------- LLM providers ---------------- */

const SYSTEM_PROMPT = `You are a literary translator of Marathi poetry.
Translate the poem into the requested language with these rules:
1. PRESERVE THE EXACT LINE STRUCTURE. Your output must have exactly the same number of lines as the input, in the same order. Blank lines stay blank.
2. Keep the rhythm, imagery and emotional register. Prefer natural, literary phrasing over literal word-for-word translation.
3. Keep proper nouns and culturally specific terms recognisable.
4. Do not add commentary, notes, or quotation marks around the poem.
5. Reply with ONLY valid JSON: {"title": "<translated title>", "text": "<translation with \\n line breaks>"}`;

function pickProvider() {
  if (flag("--mock")) return "mock";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

/** Offline stand-in used by --mock to exercise the pipeline without a key. */
function mockTranslation(poem, lang) {
  const tag = lang === "hi" ? "[अनुवाद]" : "[draft]";
  const text = poem.text
    .split("\n")
    .map((line) => (line.trim() ? `${tag} ${line}` : line))
    .join("\n");
  return { title: `${tag} ${poem.title}`, text };
}

async function callOpenAI(userPrompt) {
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callAnthropic(userPrompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 4000,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.content.map((b) => b.text || "").join("");
}

/* ---------------- Translation with structure check ---------------- */

function extractJson(raw) {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object in model output");
  return JSON.parse(cleaned.slice(start, end + 1));
}

const countLines = (s) => s.replace(/\r\n?/g, "\n").split("\n").length;

async function translatePoem(provider, poem, lang) {
  const expected = countLines(poem.text);

  if (provider === "mock") return mockTranslation(poem, lang);

  const prompt =
    `Target language: ${LANGS[lang]} (${lang})\n` +
    `Poem title (Marathi): ${poem.title}\n` +
    `The Marathi poem has ${expected} lines. Your translation must have exactly ${expected} lines.\n\n` +
    `MARATHI POEM:\n${poem.text}`;

  const raw = provider === "anthropic" ? await callAnthropic(prompt) : await callOpenAI(prompt);
  const parsed = extractJson(raw);

  const text = String(parsed.text || "").replace(/\r\n?/g, "\n");
  if (!text.trim()) throw new Error("empty translation");

  /* A line-count mismatch means the verse got mangled — reject it. */
  if (countLines(text) !== expected) {
    throw new Error(`line structure mismatch: got ${countLines(text)}, expected ${expected}`);
  }

  return { title: String(parsed.title || "").trim(), text };
}

/* ---------------- Store writer ---------------- */

const esc = (value) => JSON.stringify(value);

function writeStore(poems, store) {
  const blocks = poems.map((poem) => {
    const entry = store[poem.num] || {};
    const en = entry.en || {};
    const hi = entry.hi || {};
    const line = (value) => {
      const title = existingTitle(value);
      const text = existingText(value) || "";
      if (!text) return `{ title: "", text: "" }`;
      /* Machine output is always flagged `draft: true` so the site labels it
         "AI draft" and the poet knows it still needs their own wording. */
      return `{ title: ${esc(title)}, text: ${esc(text)}, draft: true }`;
    };
    return (
      `  /* ${poem.num} — ${poem.title} */\n` +
      `  "${poem.num}": {\n` +
      `    en: ${line(en)},\n` +
      `    hi: ${line(hi)},\n` +
      `  },`
    );
  });

  const file = `/* ============================================================
   Kesar Tarang — TRANSLATION STORE
   ------------------------------------------------------------
   This is the single source of truth for translated poems.

   Fill in the empty strings with the poet's own approved
   translations. Any non-empty value here is treated as FINAL
   and takes priority over machine/AI translation.

   Rules for text:
     - Keep the EXACT line structure of the Marathi original.
     - Use "\\n" for a new line and "\\n\\n" for a blank line.
     - Leave the title empty to keep the Marathi title.

   Regenerate AI drafts with:  node scripts/translate.mjs
   (existing entries are never overwritten)
   ============================================================ */

window.KESAR_TRANSLATIONS = {
${blocks.join("\n")}
};
`;

  fs.writeFileSync(STORE, file, "utf8");
}

/* ---------------- Report ---------------- */

function report(poems, store) {
  console.log("\n  #   title                          en    hi");
  console.log("  ---------------------------------------------");
  let doneEn = 0;
  let doneHi = 0;
  for (const poem of poems) {
    const entry = store[poem.num] || {};
    const en = isFilled(existingText(entry.en)) ? "yes" : "  —";
    const hi = isFilled(existingText(entry.hi)) ? "yes" : "  —";
    if (en === "yes") doneEn++;
    if (hi === "yes") doneHi++;
    console.log(`  ${poem.num}  ${poem.title.slice(0, 30).padEnd(30)}  ${en}    ${hi}`);
  }
  console.log(
    `\n  Coverage: English ${doneEn}/${poems.length} · Hindi ${doneHi}/${poems.length}\n`
  );
}

/* ---------------- Main ---------------- */

async function main() {
  const poems = readPoems();
  const store = loadExisting();

  if (flag("--reset")) {
    writeStore(
      poems,
      Object.fromEntries(poems.map((p) => [p.num, { en: {}, hi: {} }]))
    );
    console.log(`\n  Reset translations.js to an empty store.\n`);
    return;
  }

  if (CHECK_ONLY) {
    report(poems, store);
    return;
  }

  const targets = ONLY.length ? poems.filter((p) => ONLY.includes(p.num)) : poems;
  const provider = pickProvider();

  if (!provider) {
    console.error(
      "\n  No AI credentials found.\n" +
        "  Set one of:\n" +
        "    OPENAI_API_KEY=sk-...        (optionally OPENAI_BASE_URL, OPENAI_MODEL)\n" +
        "    ANTHROPIC_API_KEY=sk-ant-... (optionally ANTHROPIC_MODEL)\n\n" +
        "  Or fill in translations.js by hand — the site works either way.\n"
    );
    report(poems, store);
    process.exitCode = 1;
    return;
  }

  console.log(`\n  Translating ${targets.length} poem(s) × ${LANGS_TO_DO.join(", ")} via ${provider}\n`);

  for (const poem of targets) {
    store[poem.num] = store[poem.num] || { en: {}, hi: {} };

    for (const lang of LANGS_TO_DO) {
      if (isFilled(existingText(store[poem.num][lang]))) {
        console.log(`  ${poem.num} ${lang}  skipped (already has text)`);
        continue;
      }

      try {
        const result = await translatePoem(provider, poem, lang);
        store[poem.num][lang] = { title: result.title, text: result.text };
        console.log(`  ${poem.num} ${lang}  ok  (${countLines(result.text)} lines)`);
      } catch (error) {
        console.log(`  ${poem.num} ${lang}  FAILED  ${error.message}`);
      }
    }
  }

  if (!DRY_RUN) {
    writeStore(poems, store);
    console.log(`\n  Wrote ${path.relative(ROOT, STORE)}\n`);
  } else {
    console.log("\n  --dry-run: nothing written\n");
  }

  report(poems, store);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

