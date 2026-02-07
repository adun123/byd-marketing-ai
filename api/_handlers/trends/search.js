import { getGroundedModel } from "./trendsCore.js";

// body parser aman (Vercel kadang req.body string)
async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
      const body = await readJsonBody(req);
      const {
        query = "trending",
        mode = "discover",
        platform,
        topic = "general",
        language = "id",
        country = "Indonesia",
        days = 1,
      } = body || {};


    if (!String(query).trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const lang = String(language || "id").toLowerCase();
    const langInstruction = lang === "id" ? "Respond in Indonesian" : "Respond in English";

    const plat = String(platform || "").toLowerCase();
    const windowDays = Number.isFinite(Number(days)) ? Math.max(1, Number(days)) : 3;
    const nowIso = new Date().toISOString();

    const safeMode = mode === "platform" ? "platform" : "discover";
    const effectivePlatform = safeMode === "platform" ? (plat || "instagram") : "all";

    // ---------- helpers ----------
    const buildPlatformUrl = (p, keyword) => {
      const kw = String(keyword || "").replace(/^#/, "").trim() || "trending";
      const enc = encodeURIComponent(kw);

      if (p === "instagram") {
        const tag = kw.replace(/\s+/g, "_");
        return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
      }
      if (p === "tiktok") return `https://www.tiktok.com/search?q=${encodeURIComponent("#" + kw)}`;
      if (p === "youtube") return `https://www.youtube.com/results?search_query=${enc}`;
      if (p === "linkedin") return `https://www.linkedin.com/search/results/content/?keywords=${enc}`;
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(kw.replace(/\s+/g, "_"))}/`;
    };

    const normalizeHashtags = (arr) => {
      const raw = Array.isArray(arr) ? arr : [];
      const cleaned = raw
        .map((h) => String(h || "").trim())
        .filter(Boolean)
        .map((h) => h.replace(/^#/, "").trim())
        .filter(Boolean);
      return Array.from(new Set(cleaned)).slice(0, 5);
    };

    const inferSentiment = (t) => {
      const s = t?.sentiment || {};
      const label = String(s.label || "").toLowerCase().trim();
      if (label.includes("neg")) return "negative";
      if (label.includes("neu") || label.includes("mix")) return "neutral";
      if (label.includes("pos")) return "positive";

      const pos = typeof s.positive === "number" ? s.positive : undefined;
      const neg = typeof s.negative === "number" ? s.negative : undefined;
      const neu = typeof s.neutral === "number" ? s.neutral : undefined;
      if (pos != null && neg != null && neu != null) {
        const m = Math.max(pos, neg, neu);
        if (m === neg) return "negative";
        if (m === neu) return "neutral";
        return "positive";
      }
      return "neutral";
    };

    const clamp01 = (n) => {
      const x = Number(n);
      if (!Number.isFinite(x)) return 0.7;
      return Math.max(0, Math.min(1, x));
    };

    const buildPrompt = () => {
      const modeBlock =
        safeMode === "discover"
          ? `
Mode = DISCOVER (viral umum, lintas platform).
Goal: kumpulkan topik yang lagi meledak dibicarakan (news + social buzz), lalu untuk tiap item berikan platformHint (IG/TikTok/YT/LinkedIn) buat step berikutnya.
DO NOT lock to a single platform.
`
          : `
Mode = PLATFORM DRILLDOWN.
Goal: dari topik/query, keluarkan viral items yang relevan khusus platform: ${effectivePlatform}.
Prioritize platform-native surfaces (hashtag/search/audio pages) and recent recaps. Avoid evergreen SEO.
`;

      const platformRules =
        safeMode === "platform"
          ? `
Platform targeting rules:
- instagram: prioritize "instagram.com/explore/tags" and reels trends
- tiktok: prioritize "tiktok.com" hashtag/search/sound and updated charts
- youtube: prioritize Shorts trends / recent topics
- linkedin: prioritize viral discussions/posts
`
          : `
Cross-platform rules:
- combine signals from news + social platforms
- for each item set platformHint.platform = instagram/tiktok/youtube/linkedin (best fit)
`;

      return `
You have access to Google Search tool. You MUST use it.

${modeBlock}

Context:
- now: ${nowIso}
- window: last ${windowDays} days
- region: ${country}
- query: "${query}"
- topic: "${topic}"
- language: ${lang}

Hard rules:
1) Focus on what is CURRENT and VIRAL within the last ${windowDays} days.
2) Provide 7-10 items.
3) Each trend MUST include at least 1 evidence URL. publishedAt is OPTIONAL.
4) Output VALID JSON only. No markdown.

${platformRules}

JSON schema (exact):
{
  "success": true,
  "query": "${query}",
  "platform": "${effectivePlatform}",
  "topic": "${topic}",
  "language": "${lang}",
  "searchedAt": "${nowIso}",
  "summary": "...",
  "trends": [
    {
      "topic": "Short title",
      "keyTopic": "CamelCaseKeyword",
      "scale": 0.0,
      "sentiment": { "positive": 0, "negative": 0, "neutral": 0, "label": "positive|neutral|negative" },
      "hashtags": ["tag1","tag2","tag3"],
      "engagement": { "estimated": "high|medium|low", "reason": "..." },
      "observedAt": "${nowIso}",
      "evidence": [
        { "title": "...", "url": "https://...", "publishedAt": "YYYY-MM-DD" }
      ],
      "platformHint": { "platform": "instagram|tiktok|youtube|linkedin", "query": "best keyword/hashtag" }
    }
  ]
}

${langInstruction}
`;
    };

    // ---------- call model ----------
    const model = getGroundedModel();
    const result = await model.generateContent(buildPrompt());
    const response = await result.response;
    const text = response.text();

    // parse JSON (robust)
    let data;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      data = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(502).json({ error: "Failed to parse AI JSON output", raw: text });
    }

    const rawTrends = Array.isArray(data?.trends) ? data.trends : [];

    const normalizedTrends = rawTrends
      .slice(0, 10)
      .map((t, idx) => {
        const hintPlatform = String(t?.platformHint?.platform || "").toLowerCase();
        const chosenPlatform =
          safeMode === "platform"
            ? effectivePlatform
            : (hintPlatform === "instagram" ||
               hintPlatform === "tiktok" ||
               hintPlatform === "youtube" ||
               hintPlatform === "linkedin")
              ? hintPlatform
              : "instagram";

        const hashtags = normalizeHashtags(t?.hashtags);
        const kw =
          String(t?.keyTopic || "").trim() ||
          String(t?.platformHint?.query || "").trim() ||
          (hashtags[0] ? hashtags[0] : "") ||
          String(t?.topic || "").trim() ||
          String(query).trim();

        const sentimentLabel = inferSentiment(t);

        const pos = typeof t?.sentiment?.positive === "number" ? t.sentiment.positive : (sentimentLabel === "positive" ? 70 : 35);
        const neg = typeof t?.sentiment?.negative === "number" ? t.sentiment.negative : (sentimentLabel === "negative" ? 60 : 15);
        const neu = typeof t?.sentiment?.neutral === "number" ? t.sentiment.neutral : Math.max(0, 100 - Math.min(100, pos + neg));

        const evidence = Array.isArray(t?.evidence)
          ? t.evidence.filter((e) => e?.url).slice(0, 2).map((e) => ({
              title: e?.title || "Evidence",
              url: e?.url,
              publishedAt: e?.publishedAt || null,
            }))
          : [];

        return {
          topic: String(t?.topic || kw || `Trend ${idx + 1}`),
          keyTopic: String(t?.keyTopic || kw).replace(/\s+/g, "").trim() || `Trend${idx + 1}`,
          scale: clamp01(t?.scale ?? 0.75),
          sentiment: {
            positive: Math.max(0, Math.min(100, Math.round(pos))),
            negative: Math.max(0, Math.min(100, Math.round(neg))),
            neutral: Math.max(0, Math.min(100, Math.round(neu))),
            label: sentimentLabel,
          },
          hashtags,
          engagement: {
            estimated: t?.engagement?.estimated || "medium",
            reason: t?.engagement?.reason || "Based on current buzz and repeat mentions across sources.",
          },
          observedAt: t?.observedAt || nowIso,
          evidence,
          platformHint: {
            platform: chosenPlatform,
            query: String(t?.platformHint?.query || kw || query),
          },
          platform: chosenPlatform,
          platformUrl: buildPlatformUrl(chosenPlatform, kw),
        };
      })
      // minimal evidence
      .filter((t) => Array.isArray(t.evidence) && t.evidence.some((e) => e?.url));

    return res.status(200).json({
      success: true,
      query: String(query),
      platform: effectivePlatform,
      topic: String(topic || "general"),
      language: lang,
      searchedAt: nowIso,
      daysUsed: windowDays,
      windowLabel: windowDays === 1 ? "24h" : `${windowDays}d`, // ✅ FIX usedDays
      totalFound: normalizedTrends.length,
      summary: data?.summary || "",
      trends: normalizedTrends,
      grounding: data?.grounding ?? null,
    });
  } catch (error) {
    console.error("Search Trends Error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}

