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
style.css           the whole design system, including 8 themes
script.js           all behaviour + the translation engine
agent.js            कवितामित्र, the guide in the corner
translations.js     the translations you control   <- edit this
ai-config.js        optional AI switches (both off by default)
scripts/            tooling for the poet / maintainer
```

---

## Themes

Eight palettes, chosen from the colour button in the dock (the
three little bars next to the sun/moon). The choice is remembered
per reader, on every page.

| Light | | Dark | |
|---|---|---|---|
| दिवस | **Day** — warm paper, vermilion | रात्र | **Night** — the dark room |
| केसर | **Kesar** — saffron and indigo | इंद्र | **Indra** — violet night |
| हिमाल | **Himalaya** — cold mist | अग्नि | **Agni** — ember and charcoal |
| रंग | **Rang** — garden green | नील | **Neel** — indigo ink |

The sun/moon button still flips straight between plain Day and
plain Night, whichever of the other six you are on.

A theme is only ever a palette. Each one sets the same set of
custom properties, so nothing about the layout changes between
them. Two attributes drive it:

- `data-theme` — which palette
- `data-mode` — `day` or `night`, and this is what every "is it
  dark?" rule reads. A new dark theme therefore needs no new
  night-specific CSS at all.

**Adding a theme**

1. Copy a `html[data-theme="…"]` block in `style.css` and change
   the colours.
2. Add an entry to `THEMES` in `script.js` (`id`, `mode`, `label`,
   `latin`, and the three `chip` colours for the picker swatch).
3. Run `npm run sync` — this regenerates the pre-paint bootstrap in
   all 32 pages so a browser never accepts a theme id that does not
   exist.

`npm run sync:check` reports drift without writing, which is what
CI should run.

---

## The AI agent — कवितामित्र

A guide sits in the bottom-right corner of every page, drawn as a
cartoon of Chaitrali. Click it and ask.

It answers **locally, with no network and no API key**:

- **find a poem** — by number (`14` or `१४`), by title, or by any
  word from it
- **open a poem** — "show me one", or pick from the links it offers
- **about the poet** — with a link to the full biography
- **change the theme** — "night theme", or a bare name like `kesar`
- **change the language** — "read this in English", `हिंदी`, `मराठी`
- **poems about a mother** — it knows which ones these are

Replies are written in whichever of the three languages the reader
is using, and the agent relabels itself when they switch.

If it does not recognise a question, it says so and offers its
suggestions. It never invents an answer.

### Letting a real model answer the rest

Point `agentEndpoint` in `ai-config.js` at a proxy you control:

```js
// ai-config.js
window.KESAR_AI = { agentEndpoint: "https://your-proxy.example.com/agent" };
```

The agent sends `POST { message, lang, theme }` and expects
`{ reply: "…" }`. Those answers are labelled **AI answer** for the
reader, and if the call fails or passes 12 seconds the agent falls
back to its own answer. As with translation, the key stays
server-side — `ai-config.js` is served to every visitor.

Leaving `agentEndpoint` empty keeps the whole site static.

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
vermani (vermilion) accent. All eight themes keep that structure and
change only the palette, so a dark theme reads as a dark room rather
than an inverted screen.

- **Typography** — Tiro Devanagari Marathi for the verse, Cormorant
  Garamond for Latin display and old-style numerals.
- **Texture** — a very fine SVG grain multiplies over the whole page, so
  the surfaces read as paper rather than flat colour. On dark themes it
  screens instead, so the texture survives rather than going flat black.
- **No gradient text.** Gradient-clipped headings are illegible in
  Devanagari and broke in night mode; headings are solid ink instead.
- **Motion** — short reveals on scroll, and everything is disabled under
  `prefers-reduced-motion`, including the agent's halo and typing dots.
- **Accessibility** — skip link, focus-visible rings, `lang` on every
  verse, real landmarks, a dock that works from the keyboard, a theme
  picker with real `radiogroup` semantics, and an agent that closes on
  Escape and keeps its transcript in a polite live region.

Marathi and Hindi share the Devanagari script, so the site never uses
script detection to decide whether a translation is needed — only the
already-English poems are skipped.

---

© Chaitrali Pandharpure
