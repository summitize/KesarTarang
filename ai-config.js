/* ============================================================
   OPTIONAL — live AI translation in the reader's browser
   ------------------------------------------------------------
   You do not need this file. The site already serves:
       1. the poet's own translations from translations.js
       2. Google Translate as a fallback
   Only fill this in if you want translations generated on the
   fly for poems that have neither.

   HOW TO USE
   1. Run a proxy that holds your API key:
          OPENAI_API_KEY=sk-... node scripts/translate-proxy.example.mjs
   2. Point `endpoint` at that server below.

   WHY A PROXY AND NOT A KEY HERE?
   This file is served to every reader. An API key placed here
   would be public. The endpoint must be a server you control
   that keeps the key server-side.

   REQUEST / RESPONSE
      POST  { num, lang, title, text }
      200   { text: "<translation>" }      (optionally { title })

   Each poem is requested once per language, then cached in the
   reader's own localStorage — so this costs one call per poem.

   For a public site you probably want the batch route instead,
   which needs no server at all:
      OPENAI_API_KEY=sk-... node scripts/translate.mjs
   ============================================================ */

window.KESAR_AI = {
  endpoint: "", // e.g. "https://your-proxy.example.com/translate"
};
