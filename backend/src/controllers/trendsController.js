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

export const searchTrends = async (req, res) => {
  try {
    const { query, platform, topic, language } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const lang = language || "en";
    const langInstruction = lang === "id" ? "Respond in Indonesian" : "Respond in English";

    const platformFilter = platform ? `Focus on ${platform} platform trends.` : "Include trends from Instagram, TikTok, YouTube, LinkedIn.";
    const topicFilter = topic ? `Focus on ${topic} industry/topic.` : "";

    const searchPrompt = `Search for the latest viral trends and topics related to: "${query}"
${platformFilter}
${topicFilter}

${langInstruction}.

Return a JSON object with this exact structure:
{
  "trends": [
    {
      "topic": "Full topic name/title",
      "keyTopic": "OneWordKeyword",
      "scale": 0.85,
      "sentiment": {
        "positive": 5%,
        "negative": 70%,
        "neutral": 15%,
        "label": "positive"
      },
      "sources": [
        {
          "title": "Source article/post title",
          "url": "https://example.com/article",
          "platform": "instagram"
        }
      ],
      "description": "Brief description of why this is trending",
      "category": "automotive|lifestyle|technology|entertainment|news",
      "engagement": {
        "estimated": "high|medium|low",
        "reason": "Why this has high/medium/low engagement"
      }
    }
  ],
  "summary": "Overall trend summary",
  "searchedAt": "timestamp",
  "totalFound": 5
}

Find 5-10 relevant trending topics. Scale is 0.0-1.0 representing trend strength.
Only return valid JSON, no markdown.`;

    const model = getGroundedModel();
    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    const text = response.text();

    let trendsData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        trendsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      trendsData = {
        trends: [],
        summary: "Unable to parse trends data",
        raw: text,
      };
    }

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    const rawSources = groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri,
    })) || [];

    const resolvedSources = await resolveGroundingSources(rawSources);

    res.json({
      success: true,
      query,
      platform: platform || "all",
      topic: topic || "general",
      ...trendsData,
      grounding: groundingMetadata ? {
        searchQueries: groundingMetadata.webSearchQueries,
        sources: resolvedSources,
      } : null,
    });
  } catch (error) {
    console.error("Search Trends Error:", error);
    res.status(500).json({ error: error.message });
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
