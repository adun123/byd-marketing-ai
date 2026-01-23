// backend/src/controllers/trendsController.js
import { getTextModel } from "../config/gemini.js";

/**
 * Extract first valid JSON object from model output.
 * Model kadang nambah teks pembuka — ini bikin parsing aman.
 */
function extractJson(text = "") {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeInsights(x) {
  const now = new Date().toISOString();

  return {
    updatedAt: typeof x?.updatedAt === "string" ? x.updatedAt : now,

    trendTopics: safeArray(x?.trendTopics).map((t) => ({
      title: String(t?.title ?? ""),
      whyItWorks: String(t?.whyItWorks ?? ""),
      useMessage: String(t?.useMessage ?? ""),
    })),

    hookPatterns: safeArray(x?.hookPatterns).map((h) => ({
      pattern: String(h?.pattern ?? ""),
      examples: safeArray(h?.examples).map(String).filter(Boolean).slice(0, 3),
      useHookHint: String(h?.useHookHint ?? ""),
    })),

    anglePatterns: safeArray(x?.anglePatterns).map((a) => ({
      angle: String(a?.angle ?? ""),
      howTo: safeArray(a?.howTo).map(String).filter(Boolean).slice(0, 5),
      useAngleHint: String(a?.useAngleHint ?? ""),
    })),

    ctaBank: safeArray(x?.ctaBank).map(String).filter(Boolean).slice(0, 8),

    hashtagClusters: safeArray(x?.hashtagClusters).map((c) => ({
      label: String(c?.label ?? "Cluster"),
      tags: safeArray(c?.tags)
        .map(String)
        .filter((s) => typeof s === "string" && s.trim().startsWith("#"))
        .slice(0, 12),
    })),
  };
}

function buildPrompt({ platform, contentType, targetAudience, product, brand, message }) {
  return `
Kamu adalah Social Media Trend Analyst Indonesia (bukan mengklaim realtime data, tapi menyarankan pola/format yang sering viral).
Bikin "Trend Snapshot" untuk membantu user brainstorming.

Konteks:
- Platform: ${platform}
- Content type: ${contentType}
- Target audience: ${targetAudience}
- Product/Topik: ${product || "-"}
- Brand: ${brand || "-"}
- Key message: ${message || "-"}

Keluarkan JSON VALID tanpa markdown, tanpa penjelasan tambahan, format persis:
{
  "updatedAt": "${new Date().toISOString()}",
  "trendTopics": [
    { "title": "...", "whyItWorks": "...", "useMessage": "..." }
  ],
  "hookPatterns": [
    { "pattern": "...", "examples": ["...","..."], "useHookHint": "..." }
  ],
  "anglePatterns": [
    { "angle": "...", "howTo": ["step 1","step 2","step 3"], "useAngleHint": "..." }
  ],
  "ctaBank": ["...","...","..."],
  "hashtagClusters": [
    { "label": "Discovery", "tags": ["#...","#..."] }
  ]
}

Aturan:
- Bahasa Indonesia natural.
- TrendTopics 4 item.
- HookPatterns 4 item (pattern = format, examples = 2 contoh).
- AnglePatterns 3 item (howTo 3–5 langkah, konkret).
- CTA bank 5–8 item (variasi: save/share/comment/DM).
- HashtagClusters 3 cluster: "Discovery", "Niche", "Brand/Product".
- Jangan pakai hashtag super generik (#love #instagood).
- Semua teks harus actionable dan relevan dengan platform + audience.
`.trim();
}

export const getTrendInsights = async (req, res) => {
  try {
    const {
      platform,
      contentType,
      targetAudience,
      product = "",
      brand = "",
      message = "",
    } = req.body || {};

    if (!platform || !contentType || !targetAudience) {
      return res.status(400).json({
        error: "platform, contentType, targetAudience are required",
      });
    }

    const prompt = buildPrompt({
      platform,
      contentType,
      targetAudience,
      product,
      brand,
      message,
    });

    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const json = extractJson(text);

    if (!json) {
      // fallback: minimal snapshot (biar UI tetap jalan)
      return res.status(502).json({
        error: "Failed to parse AI JSON output",
        raw: text,
      });
    }

    return res.json(normalizeInsights(json));
  } catch (err) {
    console.error("Trend Insights Error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
