// backend/src/controllers/trendsController.js
import { getTextModel } from "../config/gemini.js";

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

const safeArray = (v) => (Array.isArray(v) ? v : []);

function toStr(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function normalizeInsights(x) {
  const now = new Date().toISOString();

  const trendTopics = safeArray(x?.trendTopics).map((t) => ({
    title: toStr(t?.title),
    whyItWorks: toStr(t?.whyItWorks),
    useMessage: toStr(t?.useMessage),
  }));

  const hookPatterns = safeArray(x?.hookPatterns).map((h) => ({
    pattern: toStr(h?.pattern),
    examples: safeArray(h?.examples).map(toStr).filter(Boolean).slice(0, 3),
    useHookHint: toStr(h?.useHookHint),
  }));

  const anglePatterns = safeArray(x?.anglePatterns).map((a) => ({
    angle: toStr(a?.angle),
    howTo: safeArray(a?.howTo).map(toStr).filter(Boolean).slice(0, 5),
    useAngleHint: toStr(a?.useAngleHint),
  }));

  const ctaBank = safeArray(x?.ctaBank).map(toStr).filter(Boolean).slice(0, 8);

  const hashtagClusters = safeArray(x?.hashtagClusters).map((c) => ({
    label: toStr(c?.label || "Cluster"),
    tags: safeArray(c?.tags)
      .map(toStr)
      .filter((s) => s.trim().startsWith("#"))
      .slice(0, 12),
  }));

  // ======= NEW: terms cloud =======
  // ambil 10 terms terbaik dari topics + hooks + angles
  const termsRaw = [
    ...trendTopics.map((t) => t.title),
    ...hookPatterns.map((h) => h.pattern),
    ...anglePatterns.map((a) => a.angle),
  ]
    .map((s) => s.trim())
    .filter(Boolean);

  // unique + max 10
  const seen = new Set();
  const terms = [];
  for (const t of termsRaw) {
    const k = t.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      terms.push(t);
    }
    if (terms.length >= 10) break;
  }

  const termsCloud = terms.map((term, idx) => ({
    term,
    // weight 1..5 buat styling ukuran di frontend
    weight: idx === 0 ? 5 : idx === 1 ? 4 : idx <= 3 ? 3 : 2,
  }));

  // ======= NEW: sentiment =======
  // kalau model belum ngasih sentiment, kita buat heuristik ringan biar UI jalan
  // (nanti bisa diganti jadi output model beneran)
  const topSentiments = terms.slice(0, 5).map((name, idx) => {
    const score = Math.max(40, Math.min(98, 92 - idx * 9 + (idx % 2 ? -6 : 4)));
    const sentiment =
      idx === 0 || idx === 4 ? "Negative" : idx === 2 ? "Neutral" : "Positive";
    return { name, score, sentiment };
  });

  const avgSentiment =
    topSentiments.length > 0
      ? Math.round(topSentiments.reduce((a, r) => a + r.score, 0) / topSentiments.length)
      : 0;

  return {
    updatedAt: typeof x?.updatedAt === "string" ? x.updatedAt : now,
    trendTopics,
    hookPatterns,
    anglePatterns,
    ctaBank,
    hashtagClusters,

    // new for UI like screenshot
    termsCloud,
    topSentiments,
    avgSentiment,
  };
}

function buildPrompt({ platform, contentType, targetAudience, product, brand, message }) {
  return `
  Kamu adalah Social Media Trend Analyst Indonesia (bukan realtime data; fokus pola/format yang sering viral).
  Bikin "Trend Snapshot" untuk brainstorming.

  Konteks:
  - Platform: ${platform}
  - Content type: ${contentType}
  - Target audience: ${targetAudience}
  - Product/Topik: ${product || "-"}
  - Brand: ${brand ||  "-"}
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
      { "angle": "...", "howTo": ["step 1","step 2"], "useAngleHint": "..." }
    ],
    "ctaBank": ["..."],
    "hashtagClusters": [
      { "label": "Discovery", "tags": ["#..."] }
    ]
  }

  Aturan:
  - Bahasa Indonesia natural.
  - TrendTopics 4 item.
  - HookPatterns 4 item.
  - AnglePatterns 3 item.
  - CTA bank 5–8 item.
  - HashtagClusters 3 cluster: "Discovery", "Niche", "Brand/Product".
  `.trim();
}

export const getTrendInsights = async (req, res) => {
  try {
    const { platform, contentType, targetAudience, product = "", brand = "", message = "" } = req.body || {};

    if (!platform || !contentType || !targetAudience) {
      return res.status(400).json({ error: "platform, contentType, targetAudience are required" });
    }

    const prompt = buildPrompt({ platform, contentType, targetAudience, product, brand, message });

    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    const json = extractJson(text);
    if (!json) {
      return res.status(502).json({ error: "Failed to parse AI JSON output", raw: text });
    }

    return res.json(normalizeInsights(json));
  } catch (err) {
    console.error("Trend Insights Error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
