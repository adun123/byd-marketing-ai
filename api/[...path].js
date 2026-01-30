// api/[...path].js
import health from "./_handlers/health.js";
import healthGemini from "./_handlers/health/gemini.js";

import imageGenerate from "./_handlers/image/generate.js";
import imageEdit from "./_handlers/image/edit.js";
import imageMarketing from "./_handlers/image/marketing.js";
// kalau kamu memang butuh slug handler, nanti kita tambahin di router

import trendsSearch from "./_handlers/trends/search.js";
import trendsInsights from "./_handlers/trends/insights.js";
import trendsOptions from "./_handlers/trends/options.js";
import trendsGenerateContent from "./_handlers/trends/generate-content.js";

import apiIndex from "./_handlers/index.js";
import docs from "./_handlers/docs.js";

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname; // contoh: /api/trends/search

  // helpers kecil
  const is = (p) => path === p;

  try {
    // === BASIC ===
    if (is("/api") && req.method === "GET") return apiIndex(req, res);
    if (is("/api/docs") && req.method === "GET") return docs(req, res);

    if (is("/api/health") && req.method === "GET") return health(req, res);
    if (is("/api/health/gemini")) return healthGemini(req, res);

    // === TRENDS ===
    if (is("/api/trends/search")) return trendsSearch(req, res);
    if (is("/api/trends/insights")) return trendsInsights(req, res);
    if (is("/api/trends/options")) return trendsOptions(req, res);
    if (is("/api/trends/generate-content")) return trendsGenerateContent(req, res);

    // === IMAGE ===
    if (is("/api/image/generate")) return imageGenerate(req, res);
    if (is("/api/image/edit")) return imageEdit(req, res);
    if (is("/api/image/marketing")) return imageMarketing(req, res);

    // TODO: kalau kamu masih butuh route lain (upscale, combine, mask-edit, dll)
    // tinggal tambah mapping di sini ke handler baru.

    return res.status(404).json({ error: "Endpoint not found", path, method: req.method });
  } catch (e) {
    console.error("API Router Error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
