/* ============================================================
   Kesar Tarang — example live-translation proxy
   ------------------------------------------------------------
   The site calls this server when a poem has no stored
   translation. The server holds the API key so the key is
   never shipped to readers.

     OPENAI_API_KEY=sk-... node scripts/translate-proxy.example.mjs

   Then set window.KESAR_AI.endpoint in ai-config.js to
   http://localhost:8787/translate

   NOTE: this is a convenience for previewing. For a public
   site, prefer the batch route (scripts/translate.mjs), which
   needs no server at all.
   ============================================================ */

import http from "node:http";
import process from "node:process";

const PORT = Number(process.env.PORT || 8787);
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const KEY = process.env.OPENAI_API_KEY;

if (!KEY) {
  console.error("Set OPENAI_API_KEY before starting the proxy.");
  process.exit(1);
}

const SYSTEM_PROMPT = `You are a literary translator of Marathi poetry.
Translate the poem into the requested language with these rules:
1. PRESERVE THE EXACT LINE STRUCTURE. Your output must have exactly the same number of lines as the input, in the same order. Blank lines stay blank.
2. Keep the rhythm, imagery and emotional register. Prefer natural, literary phrasing over literal word-for-word translation.
3. Keep proper nouns and culturally specific terms recognisable.
4. Do not add commentary, notes, or quotation marks around the poem.
5. Reply with ONLY valid JSON: {"title": "<translated title>", "text": "<translation with \\n line breaks>"}`;

const countLines = (s) => s.replace(/\r\n?/g, "\n").split("\n").length;

async function translate({ num, lang, title, text }) {
  const expected = countLines(text);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content:
            `Target language: ${lang === "hi" ? "Hindi" : "English"} (${lang})\n` +
            `Poem title (Marathi): ${title || `poem ${num}`}\n` +
            `The Marathi poem has ${expected} lines. Your translation must have exactly ${expected} lines.\n\n` +
            `MARATHI POEM:\n${text}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`upstream ${res.status}`);
  const data = await res.json();

  const raw = data.choices[0].message.content
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));

  const out = String(parsed.text || "").replace(/\r\n?/g, "\n");
  if (countLines(out) !== expected) throw new Error("line structure mismatch");

  return { text: out, title: String(parsed.title || "").trim() };
}

const server = http.createServer((req, res) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/translate") {
    res.writeHead(404, cors);
    res.end('{"error":"not found"}');
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 200_000) req.destroy();
  });

  req.on("end", async () => {
    try {
      const result = await translate(JSON.parse(body));
      res.writeHead(200, { ...cors, "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
      console.log(`translated poem ${result ? "" : ""}${JSON.parse(body).num} -> ok`);
    } catch (error) {
      res.writeHead(502, { ...cors, "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(error.message || error) }));
      console.log(`error: ${error.message}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`translation proxy listening on http://localhost:${PORT}/translate`);
  console.log(`model: ${MODEL}`);
});
