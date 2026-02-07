import { getGroundedModel, getTextModel } from "../config/gemini.js";

const urlCache = new Map();

async function resolveRedirectUrl(redirectUrl) {
  if (!redirectUrl || !redirectUrl.includes("vertexaisearch.cloud.google.com")) {
    return redirectUrl;
  }

  if (urlCache.has(redirectUrl)) {
    return urlCache.get(redirectUrl);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(redirectUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const resolvedUrl = response.url;
    urlCache.set(redirectUrl, resolvedUrl);
    return resolvedUrl;
  } catch (err) {
    return redirectUrl;
  }
}

async function resolveGroundingSources(sources) {
  if (!sources || !Array.isArray(sources)) return sources;

  const resolved = await Promise.all(
    sources.map(async (source) => ({
      title: source.title,
      uri: await resolveRedirectUrl(source.uri),
    }))
  );

  return resolved;
}

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

function buildInsightsPrompt({ platform, contentType, targetAudience, product, brand, message }) {
  return `
You are a Social Media Trend Analyst. Generate a "Trend Snapshot" for brainstorming.

Context:
- Platform: ${platform}
- Content type: ${contentType}
- Target audience: ${targetAudience}
- Product/Topic: ${product || "-"}
- Brand: ${brand || "-"}
- Key message: ${message || "-"}

Return VALID JSON only, no markdown:
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

Rules:
- TrendTopics: 4 items
- HookPatterns: 4 items (pattern = format, examples = 2)
- AnglePatterns: 3 items (howTo 3-5 steps)
- CTA bank: 5-8 items (save/share/comment/DM variations)
- HashtagClusters: 3 clusters (Discovery, Niche, Brand/Product)
- No generic hashtags (#love #instagood)
- All text must be actionable and relevant
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

    const prompt = buildInsightsPrompt({
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

//diganti
// controllers/trendsController.js
export const searchTrends = async (req, res) => {
  try {
    const {
      query = "trending",
      mode = "discover", // "discover" | "platform"
      platform, // "instagram" | "tiktok" | "youtube" | "linkedin" | undefined
      topic = "general",
      language = "id",
      country = "Indonesia",
      days = 1,
    } = req.body || {};

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
      if (p === "tiktok") {
        // tiktok search pakai hashtag style biar user bisa klik
        return `https://www.tiktok.com/search?q=${encodeURIComponent("#" + kw)}`;
      }
      if (p === "youtube") return `https://www.youtube.com/results?search_query=${enc}`;
      if (p === "linkedin") return `https://www.linkedin.com/search/results/content/?keywords=${enc}`;
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(kw.replace(/\s+/g, "_"))}/`;
    };

    const normalizeHashtags = (arr) => {
      const raw = Array.isArray(arr) ? arr : [];
      // simpan tanpa '#', karena UI kamu mau “terms tanpa #”
      const cleaned = raw
        .map((h) => String(h || "").trim())
        .filter(Boolean)
        .map((h) => h.replace(/^#/, "").trim())
        .filter(Boolean);
      // dedupe
      return Array.from(new Set(cleaned)).slice(0, 5);
    };

    const inferSentiment = (t) => {
      const s = t?.sentiment || {};
      const label = String(s.label || "").toLowerCase().trim();
      if (label === "negative" || label.includes("neg")) return "negative";
      if (label === "neutral" || label.includes("neu") || label.includes("mix")) return "neutral";
      if (label === "positive" || label.includes("pos")) return "positive";

      const pos = typeof s.positive === "number" ? s.positive : undefined;
      const neg = typeof s.negative === "number" ? s.negative : undefined;
      const neu = typeof s.neutral === "number" ? s.neutral : undefined;
      if (pos != null && neg != null && neu != null) {
        const m = Math.max(pos, neg, neu);
        if (m === neg) return "negative";
        if (m === neu) return "neutral";
        return "positive";
      }
      // default netral biar UI gak bias “positive mulu”
      return "neutral";
    };

    const clamp01 = (n) => {
      const x = Number(n);
      if (!Number.isFinite(x)) return 0.7;
      return Math.max(0, Math.min(1, x));
    };

    const buildPrompt = () => {
      // NOTE: kita sengaja “nggak maksa publishedAt harus ada”,
      // karena halaman platform-native kadang gak punya tanggal jelas.
      // Kita tetap minta evidence URL. Tanggal jadi optional.

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
2) Provide 7-10 items. If uncertain, still return best candidates, but keep them plausible and current.
3) Each trend MUST include at least 1 evidence URL. publishedAt is OPTIONAL because some platform pages don't show it.
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

    // parse JSON
    let data;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      data = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(502).json({ error: "Failed to parse AI JSON output", raw: text });
    }

    const rawTrends = Array.isArray(data?.trends) ? data.trends : [];

    // ---------- normalize output for your frontend ----------
    const normalizedTrends = rawTrends
      .slice(0, 10)
      .map((t, idx) => {
        const hintPlatform = String(t?.platformHint?.platform || "").toLowerCase();
        const chosenPlatform =
          safeMode === "platform"
            ? effectivePlatform
            : (hintPlatform === "instagram" || hintPlatform === "tiktok" || hintPlatform === "youtube" || hintPlatform === "linkedin")
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

        // kalau model ngasih angka, keep, kalau enggak isi default seimbang
        const pos = typeof t?.sentiment?.positive === "number" ? t.sentiment.positive : (sentimentLabel === "positive" ? 70 : 35);
        const neg = typeof t?.sentiment?.negative === "number" ? t.sentiment.negative : (sentimentLabel === "negative" ? 60 : 15);
        const neu = typeof t?.sentiment?.neutral === "number" ? t.sentiment.neutral : 100 - Math.min(100, pos + neg);

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
          hashtags, // tanpa '#'
          engagement: {
            estimated: t?.engagement?.estimated || "medium",
            reason: t?.engagement?.reason || "Based on current buzz and repeat mentions across sources.",
          },
          observedAt: t?.observedAt || nowIso,
          evidence: Array.isArray(t?.evidence)
            ? t.evidence
                .filter((e) => e?.url)
                .slice(0, 2)
                .map((e) => ({
                  title: e?.title || "Evidence",
                  url: e?.url,
                  publishedAt: e?.publishedAt || null,
                }))
            : [],
          platformHint: {
            platform: chosenPlatform,
            query: String(t?.platformHint?.query || kw || query),
          },
          platform: chosenPlatform,
          platformUrl: buildPlatformUrl(chosenPlatform, kw),
        };
      })
      // pastikan minimal ada evidence URL (kalau kosong, buang)
      .filter((t) => Array.isArray(t.evidence) && t.evidence.some((e) => e?.url));

    return res.json({
      success: true,
      query: String(query),
      platform: effectivePlatform,
      topic: String(topic || "general"),
      language: lang,
      searchedAt: nowIso,
      daysUsed: windowDays,
      windowLabel: windowDays === 1 ? "24h" : `${usedDays}d`,
      totalFound: normalizedTrends.length,
      summary: data?.summary || "",
      trends: normalizedTrends,
      // grounding metadata tetap boleh kamu pass-through kalau mau
      grounding: data?.grounding ?? null,
    });
  } catch (error) {
    console.error("Search Trends Error:", error);
    return res.status(500).json({ error: error.message });
  }
};











export const generateTrendContent = async (req, res) => {
  try {
    const {
      topic,
      keyTopic,
      targetAudience,
      toneOfVoice,
      targetKeywords,
      slideCount,
      language,
    } = req.body;

    if (!topic && !keyTopic) {
      return res.status(400).json({ error: "Topic or keyTopic is required" });
    }

    const lang = language || "en";
    const langInstruction = lang === "id" ? "Respond in Indonesian" : "Respond in English";
    const audience = targetAudience || "Gen Z, Car Enthusiasts";
    const tone = toneOfVoice || "Professional & Authoritative";
    const keywords = targetKeywords || "";
    const slides = slideCount || 5;

    const contentPrompt = `Generate viral marketing content for the topic: "${topic || keyTopic}"

Target Audience: ${audience}
Tone of Voice: ${tone}
${keywords ? `Target Keywords: ${keywords}` : ""}
Number of Slides/Sections: ${slides}

${langInstruction}.

Return a JSON object with this exact structure:
{
  "draftId": "unique-id",
  "topic": "${topic || keyTopic}",
  "headlines": [
    {
      "text": "Headline text here",
      "type": "high-clickrate|trendy|direct|emotional|question",
      "hook": "Why this headline works"
    }
  ],
  "storyline": {
    "slides": [
      {
        "slideNumber": 1,
        "title": "HOOK",
        "content": "Detailed script/narration for this slide",
        "duration": "3-5 seconds",
        "visualCue": "What should be shown visually"
      }
    ]
  },
  "visualDescription": {
    "photo": {
      "prompt": "Detailed prompt for AI image generation - professional photography style, specific composition, lighting, mood",
      "style": "cinematic|minimalist|vibrant|professional",
      "aspectRatio": "1:1|16:9|9:16|4:5"
    },
    "video": {
      "prompt": "Detailed prompt for AI video generation - camera movement, scene transitions, atmosphere",
      "style": "dynamic|smooth|fast-paced|elegant",
      "duration": "15-30 seconds",
      "aspectRatio": "9:16|16:9|1:1"
    }
  },
  "hashtags": ["#relevant", "#hashtags"],
  "callToAction": "Suggested CTA text",
  "bestPostingTime": "Suggested posting time based on audience"
}

Generate 3-5 compelling headlines with different approaches.
Create a complete storyline with ${slides} slides.
Make visual prompts detailed and ready-to-use for AI generation.

Only return valid JSON, no markdown.`;

    const model = getTextModel();
    const result = await model.generateContent(contentPrompt);
    const response = await result.response;
    const text = response.text();

    let contentData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      contentData = {
        error: "Unable to parse content data",
        raw: text,
      };
    }

    res.json({
      success: true,
      ...contentData,
      config: {
        targetAudience: audience,
        toneOfVoice: tone,
        targetKeywords: keywords,
        slideCount: slides,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Generate Trend Content Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const regenerateHeadlines = async (req, res) => {
  try {
    const { topic, currentHeadlines, style, language } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const lang = language || "en";
    const langInstruction = lang === "id" ? "Respond in Indonesian" : "Respond in English";

    const prompt = `Generate 5 NEW and DIFFERENT viral headlines for: "${topic}"
${currentHeadlines ? `Avoid these existing headlines: ${JSON.stringify(currentHeadlines)}` : ""}
${style ? `Style preference: ${style}` : "Mix of styles: clickbait, question, emotional, direct, trendy"}

${langInstruction}.

Return JSON:
{
  "headlines": [
    {
      "text": "Headline text",
      "type": "high-clickrate|trendy|direct|emotional|question",
      "hook": "Why this works"
    }
  ]
}

Only return valid JSON.`;

    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let data;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      data = { headlines: [], raw: text };
    }

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("Regenerate Headlines Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const polishContent = async (req, res) => {
  try {
    const { content, instruction, language } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const lang = language || "en";
    const langInstruction = lang === "id" ? "Respond in Indonesian" : "Respond in English";

    const prompt = `Polish and improve this marketing content:

"${content}"

${instruction ? `Specific instruction: ${instruction}` : "Make it more engaging, professional, and viral-worthy."}

${langInstruction}.

Return JSON:
{
  "original": "original content",
  "polished": "improved content",
  "changes": ["list of changes made"]
}

Only return valid JSON.`;

    const model = getTextModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let data;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      data = { polished: content, raw: text };
    }

    res.json({ success: true, ...data });
  } catch (error) {
    console.error("Polish Content Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTrendOptions = (req, res) => {
  res.json({
    platforms: [
      { id: "instagram", name: "Instagram" },
      { id: "tiktok", name: "TikTok" },
      { id: "youtube", name: "YouTube" },
      { id: "linkedin", name: "LinkedIn" },
      { id: "twitter", name: "Twitter/X" },
    ],
    topics: [
      { id: "general", name: "General" },
      { id: "automotive", name: "Automotive" },
      { id: "ev", name: "Electric Vehicles" },
      { id: "technology", name: "Technology" },
      { id: "lifestyle", name: "Lifestyle" },
    ],
    toneOfVoice: [
      { id: "professional", name: "Professional & Authoritative" },
      { id: "casual", name: "Casual & Friendly" },
      { id: "enthusiastic", name: "Enthusiastic & Energetic" },
      { id: "informative", name: "Informative & Educational" },
      { id: "humorous", name: "Humorous & Witty" },
    ],
    audiencePresets: [
      { id: "genz", name: "Gen Z", tags: ["Gen Z", "Young Adults", "Digital Natives"] },
      { id: "millennials", name: "Millennials", tags: ["Millennials", "Young Professionals"] },
      { id: "car-enthusiasts", name: "Car Enthusiasts", tags: ["Car Lovers", "Automotive Fans"] },
      { id: "luxury", name: "Luxury Buyers", tags: ["Premium", "Luxury", "High-end"] },
      { id: "eco-conscious", name: "Eco-Conscious", tags: ["Sustainability", "Green", "Eco-friendly"] },
    ],
  });
};
