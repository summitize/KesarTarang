# चैत्र तरंग · Kesar Tarang

A small, fast, static poetry site for **Chaitrali Pandharpure** — thirty
Marathi poems on love, family, womanhood, loss and hope, readable in
Marathi, English and Hindi.

No build step, no framework, no dependencies at runtime. It is plain
HTML, CSS and JavaScript, so it can be hosted on GitHub Pages or any
static host.

```
index.html          home
bio.html            the poet
poems/poem-01..30   one page per poem
style.css           the whole design system
script.js           all behaviour + the translation engine
translations.js     the translations you control   <- edit this
ai-config.js        optional live-translation switch (off by default)
scripts/            tooling for the poet / maintainer
```

---

## How translation works

When a reader switches to **EN** or **हि**, the site looks for that
language in this order and stops at the first hit:

| # | Source | What the reader sees |
|---|--------|----------------------|
| 1 | **`translations.js`** — the poet's own text | the poem, badged **Translation** |
| 2 | **`ai-config.js`** — live machine translation, cached per reader | the poem, badged **AI draft** |
| 3 | **Google Translate** — the page itself | the page, translated in place |

The Marathi original is always kept on the page, above the translation,
so a reader can compare. Poems that are already in English (poem 30) are
not "translated" into English.

Entries you write yourself are never overwritten by any tooling.

---

## Adding the real translations later

Open **`translations.js`** and fill in the strings:

```js
"01": {
  en: {
    title: "Seven Colours of Love",
    text:  "Seven colours love wears.....\n\nThe orange of passion,\n...",
  },
  hi: { title: "", text: "" },
},
```

Two rules:

1. **Keep the exact line structure of the original.** One translated
   line per Marathi line, blank lines included. Use `\n` and `\n\n`.
2. Anything you fill in is treated as **final** and outranks everything
   else. Leave a field empty to fall back to AI/Google for it.

Machine-generated entries carry `draft: true` and are always labelled
**AI draft**, so readers are never shown a draft as if it were your own
wording. Delete the `draft: true` flag once you have approved the text.

Check your coverage any time:

```bash
npm run translate:check
```

```
  #   title                          en    hi
  ---------------------------------------------
  01  सात रंग प्रेमाचे                 yes    —
  02  प्रेमाचं दुकान                   —      —
  ...
  Coverage: English 1/30 · Hindi 0/30
```

---

## Generating AI drafts in bulk

Useful for filling in a first pass that you then edit by hand.

```bash
OPENAI_API_KEY=sk-... npm run translate
```

- Works with any OpenAI-compatible endpoint (OpenAI, Azure OpenAI, Groq,
  OpenRouter, Ollama, LM Studio) — set `OPENAI_BASE_URL` and
  `OPENAI_MODEL`.
- Or with Anthropic: `ANTHROPIC_API_KEY=sk-ant-...`.
- **Only fills empty fields.** Re-running never overwrites your own words.
- Rejects any translation whose line count does not match the original,
  so the verse structure cannot silently break.

```bash
node scripts/translate.mjs --lang=en            # English only
node scripts/translate.mjs --only=01,07,22      # just these poems
node scripts/translate.mjs --dry-run            # no file writes
node scripts/translate.mjs --reset              # empty the store
```

## Translating on the fly instead

If you would rather not pre-generate anything, run the example proxy
and point `ai-config.js` at it:

```bash
OPENAI_API_KEY=sk-... node scripts/translate-proxy.example.mjs
```

```js
// ai-config.js
window.KESAR_AI = { endpoint: "http://localhost:8787/translate" };
```

Each poem is then fetched once per reader and cached in their browser.
Never put an API key in `ai-config.js` — it is served to every visitor.

---

## Working on the site

```bash
npm install        # only needed for the tests (jsdom)
npm test           # renders the real pages and asserts the behaviour
```

`npm test` boots the actual HTML in jsdom and checks the poem index, the
control dock, previous/next navigation, the stylesheet, and all three
translation paths.

Preview locally (the site is fully static, so any server works):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

`scripts/update-poems.mjs` re-applies the shared template to all thirty
poem pages after a structural change.

---

## Design notes

The visual language is a printed page: warm paper, sepia ink, a single
vermani (vermilion) accent — a day/night pair, so night mode is a dark
room rather than an inverted screen.

- **Typography** — Tiro Devanagari Marathi for the verse, Cormorant
  Garamond for Latin display and old-style numerals.
- **Texture** — a very fine SVG grain multiplies over the whole page, so
  the surfaces read as paper rather than flat colour.
- **No gradient text.** Gradient-clipped headings are illegible in
  Devanagari and broke in night mode; headings are solid ink instead.
- **Motion** — short reveals on scroll, and everything is disabled under
  `prefers-reduced-motion`.
- **Accessibility** — skip link, focus-visible rings, `lang` on every
  verse, real landmarks, and a dock that works from the keyboard.

Marathi and Hindi share the Devanagari script, so the site never uses
script detection to decide whether a translation is needed — only the
already-English poems are skipped.

---

© Chaitrali Pandharpure
