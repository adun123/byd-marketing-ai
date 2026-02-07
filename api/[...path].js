// api/[...path].js
import apiIndex from "./_handlers/index.js";
import docs from "./_handlers/docs.js";
import health from "./_handlers/health.js";
import healthGemini from "./_handlers/health/gemini.js";

import trendsSearch from "./_handlers/trends/search.js";
import trendsInsights from "./_handlers/trends/insights.js";
import trendsOptions from "./_handlers/trends/options.js";
import trendsGenerateContent from "./_handlers/trends/generate-content.js";

import imageGenerate from "./_handlers/image/generate.js";
import imageEdit from "./_handlers/image/edit.js";
import imageMarketing from "./_handlers/image/marketing.js";

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  // Router
  if (path === "/api" && req.method === "GET") return apiIndex(req, res);
  if (path === "/api/docs" && req.method === "GET") return docs(req, res);
  if (path === "/api/health" && req.method === "GET") return health(req, res);
  if (path === "/api/health/gemini") return healthGemini(req, res);

  // ✅ FIX: trends/search must be routed
  if (path === "/api/trends/search") return trendsSearch(req, res);

  if (path.startsWith("/api/trends/insights")) return trendsInsights(req, res);
  if (path.startsWith("/api/trends/options")) return trendsOptions(req, res);
  if (path.startsWith("/api/trends/generate-content")) return trendsGenerateContent(req, res);

  if (path.startsWith("/api/image/generate")) return imageGenerate(req, res);
  if (path.startsWith("/api/image/edit")) return imageEdit(req, res);
  if (path.startsWith("/api/image/marketing")) return imageMarketing(req, res);

  return res.status(404).json({ error: "Endpoint not found", path, method: req.method });
}
