import { getGroundedModel, getTextModel } from "../config/gemini.js";

const urlCache = new Map();

// ini denny
// async function resolveRedirectUrl(redirectUrl) {
//   if (!redirectUrl || !redirectUrl.includes("vertexaisearch.cloud.google.com")) {
//     return redirectUrl;
//   }

//   if (urlCache.has(redirectUrl)) {
//     return urlCache.get(redirectUrl);
//   }

//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 5000);

//     const response = await fetch(redirectUrl, {
//       method: "HEAD",
//       redirect: "follow",
//       signal: controller.signal,
//     });

//     clearTimeout(timeout);

//     const resolvedUrl = response.url;
//     urlCache.set(redirectUrl, resolvedUrl);
//     return resolvedUrl;
//   } catch (err) {
//     return redirectUrl;
//   }
// }

async function resolveRedirectUrl(inputUrl) {
  if (!inputUrl) return inputUrl;

  if (urlCache.has(inputUrl)) return urlCache.get(inputUrl);

  const controllerFetch = (ms) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ms);
    return { controller, timeout };
  };

  const tryFollow = async (method) => {
    const { controller, timeout } = controllerFetch(8000);
    try {
      const resp = await fetch(inputUrl, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      clearTimeout(timeout);
      return resp?.url || null;
    } catch {
      clearTimeout(timeout);
      return null;
    }
  };

  const tryCanonicalFromHtml = async () => {
    const { controller, timeout } = controllerFetch(9000);
    try {
      const resp = await fetch(inputUrl, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      clearTimeout(timeout);

      const finalUrl = resp?.url || inputUrl;
      const ct = (resp.headers.get("content-type") || "").toLowerCase();
      if (!ct.includes("text/html")) return null;

      const html = await resp.text();

      // 1) canonical
      const canon = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
      if (canon && canon.startsWith("http")) return canon;

      // 2) og:url
      const og = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1];
      if (og && og.startsWith("http")) return og;

      // 3) fallback ke url final hasil GET
      return finalUrl;
    } catch {
      clearTimeout(timeout);
      return null;
    }
  };

  // (A) follow redirect dulu (HEAD lalu GET)
  const headUrl = await tryFollow("HEAD");
  const getUrl = headUrl || (await tryFollow("GET"));
  const followed = getUrl || inputUrl;

  // kalau sudah berubah, cukup
  if (followed !== inputUrl) {
    urlCache.set(inputUrl, followed);
    return followed;
  }

  // (B) kalau tidak berubah, coba canonical HTML (khusus situs yang sering begitu)
  const host = (() => {
    try {
      return new URL(inputUrl).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return "";
    }
  })();

  const needsCanonical =
    host.includes("katadata.co.id") ||
    host.includes("otomotif.katadata.co.id") ||
    host.includes("otosia.com") ||
    host.includes("liputan6.com");

  if (needsCanonical) {
    const canonical = await tryCanonicalFromHtml();
    const resolved = canonical || followed;
    urlCache.set(inputUrl, resolved);
    return resolved;
  }

  urlCache.set(inputUrl, followed);
  return followed;
}


//dibagain biar :
function allowedDomainsForPlatform(platformNorm) {
  const p = (platformNorm || "").toLowerCase();
  if (p.includes("instagram")) return ["instagram.com"];
  if (p.includes("tiktok")) return ["tiktok.com", "vt.tiktok.com", "vm.tiktok.com", "m.tiktok.com"];
  if (p.includes("youtube")) return ["youtube.com", "youtu.be"];
  if (p.includes("linkedin")) return ["linkedin.com"];
  return [];
}



// TikTok "video url" pattern yang kamu mau
function isTikTokVideoUrl(url) {
  if (!url) return false;
  const u = String(url).toLowerCase();
  // contoh: https://www.tiktok.com/@user/video/123
  return u.includes("tiktok.com/@") && u.includes("/video/");
}

function enforcePlatformSources(trendsData, platformNorm) {
  const domains = allowedDomainsForPlatform(platformNorm);
  if (!domains.length) return trendsData;

  const p = (platformNorm || "").toLowerCase();
  const trends = Array.isArray(trendsData?.trends) ? trendsData.trends : [];

  return {
    ...trendsData,
    trends: trends.map((t) => {
      const sources = Array.isArray(t?.sources) ? t.sources : [];

      // 1) filter domain sesuai platform
      let kept = sources.filter((s) => urlMatchesDomains(s?.url, domains));

      // 2) khusus tiktok: prioritas video url format @/video/
      if (p.includes("tiktok")) {
        const videoFirst = kept.filter((s) => isTikTokVideoUrl(s?.url));
        kept = videoFirst.length ? videoFirst : kept;
      }

      return { ...t, sources: kept };
    }),
  };
}

function countPlatformUrls(trendsData, platformNorm) {
  const domains = allowedDomainsForPlatform(platformNorm);
  const trends = Array.isArray(trendsData?.trends) ? trendsData.trends : [];
  let c = 0;
  for (const t of trends) {
    const sources = Array.isArray(t?.sources) ? t.sources : [];
    for (const s of sources) {
      if (urlMatchesDomains(s?.url, domains)) c++;
    }
  }
  return c;
}


function urlMatchesDomains(url, domains) {
  if (!url || !domains?.length) return true;
  const u = String(url).toLowerCase();
  return domains.some((d) => u.includes(d));
}




//ini denny
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
async function resolveTrendSourcesUrls(trendsData, platformNorm) {
  if (!trendsData?.trends || !Array.isArray(trendsData.trends)) return trendsData;

  // kumpulkan semua url sources
  const all = [];
  for (const t of trendsData.trends) {
    if (!t?.sources || !Array.isArray(t.sources)) continue;
    for (const s of t.sources) {
      if (s?.url) all.push(s.url);
    }
  }

  // resolve unique untuk hemat call
  const uniq = Array.from(new Set(all));
  const resolvedPairs = await Promise.all(
    uniq.map(async (url) => [url, await resolveRedirectUrl(url)])
  );
  const map = new Map(resolvedPairs);

  // tulis balik ke trendsData
  trendsData.trends = trendsData.trends.map((t) => {
    if (!t?.sources || !Array.isArray(t.sources)) return t;
    return {
      ...t,
      sources: t.sources.map((s) => ({
        ...s,
        url: map.get(s.url) || s.url,
      })),
    };
  });

  return trendsData;
}

// ini maman nyoba meyesuaikan

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


//khusus nyari trends:
function normalizePlatform(p) {
  const s = (p || "").toLowerCase();
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("instagram")) return "instagram";
  // kalau gak jelas, biarkan null supaya prompt multi-platform
  return null;
}

function normalizeTopic(t) {
  const s = (t || "").toLowerCase();
  // ini “contentType” kamu (soft-campaign, hard-sell, edu-ent) bukan industry.
  // untuk konteks BYD, kita fallback automotive/ev.
  if (!s) return "automotive";
  if (s.includes("automotive") || s.includes("ev") || s.includes("vehicle") || s.includes("car")) return s;
  if (s.includes("soft") || s.includes("hard") || s.includes("campaign") || s.includes("edu") || s.includes("ent")) {
    return "automotive";
  }
  return s;
}

function isValidHttpUrl(u) {
  if (!u || typeof u !== "string") return false;
  return u.startsWith("http://") || u.startsWith("https://");
}

function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const x of arr || []) {
    const k = keyFn(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
}

function scoreTitleMatch(trendTitle, sourceTitle) {
  const a = tokenize(trendTitle);
  const b = tokenize(sourceTitle);
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  let hit = 0;
  for (const w of a) if (setB.has(w)) hit++;
  // skor sederhana: jumlah kata yang match
  return hit;
}

function enrichTrendsSourcesFromGrounding(trendsData, groundingMetadata) {
  const chunks = groundingMetadata?.groundingChunks || [];
  const webSources = chunks
    .map((c) => ({
      title: c.web?.title,
      url: c.web?.uri, // uri ini biasanya URL asli (lebih baik daripada vertex redirect di frontend)
      platform: "news",
    }))
    .filter((s) => s.title && isValidHttpUrl(s.url));

  const pool = uniqBy(webSources, (s) => s.url);

  if (!trendsData?.trends?.length) return trendsData;

  // dedupe URL lintas trend supaya gak sama semua
  const used = new Set();

  trendsData.trends = trendsData.trends.map((t) => {
    const existing = (t.sources || []).filter((s) => isValidHttpUrl(s.url));
    const existingUniq = uniqBy(existing, (s) => s.url).filter((s) => !used.has(s.url));

    // kalau sudah ada sources valid → pakai dulu
    if (existingUniq.length) {
      existingUniq.forEach((s) => used.add(s.url));
      return { ...t, sources: existingUniq.slice(0, 2) };
    }

    // kalau kosong → cari dari grounding pool yang paling match sama topic
    const scored = pool
      .map((s) => ({
        s,
        score: scoreTitleMatch(t.topic || t.keyTopic || "", s.title || ""),
      }))
      .filter((x) => x.score > 0 && !used.has(x.s.url))
      .sort((a, b) => b.score - a.score);

    if (scored.length) {
      const picked = scored.slice(0, 2).map((x) => x.s);
      picked.forEach((s) => used.add(s.url));
      return { ...t, sources: picked };
    }

    // fallback terakhir: ambil source pertama yang belum dipakai
    const fallback = pool.find((s) => !used.has(s.url));
    if (fallback) {
      used.add(fallback.url);
      return { ...t, sources: [fallback] };
    }

    return t;
  });

  return trendsData;
}

// ✅ FIXED (Controller): 
// 1) resolveTrendSourcesUrls dipanggil sekali saja.
// 2) enforcePlatformSources dipanggil PALING TERAKHIR (final guard).
// 3) kalau platform spesifik, grounding DIHILANGKAN (biar frontend tidak fallback ke web/blog).
// 4) (opsional) filter grounding sources by domain kalau kamu tetap mau tampilkan.

export const searchTrends = async (req, res) => {
  try {
    const { query, platform, topic, language } = req.body;

    if (!query) return res.status(400).json({ error: "Query is required" });

    const lang = language || "en";
    const langInstruction = lang === "id" ? "Respond in Indonesian" : "Respond in English";

    const platformNorm = normalizePlatform(platform);
    const topicNorm = normalizeTopic(topic);

    const platformFilter = platformNorm
      ? `Focus on ${platformNorm} platform trends.`
      : "Include trends from Instagram, TikTok, YouTube, LinkedIn.";

    const topicFilter = topicNorm ? `Focus on ${topicNorm} industry/topic.` : "";

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
        "positive": 5,
        "negative": 70,
        "neutral": 15,
        "label": "positive"
      },
      "sources": [
        {
          "title": "Source article/post title",
          "url": "https://example.com/article",
          "platform": "${platformNorm || "instagram|tiktok|youtube|linkedin"}"
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

${platformNorm ? `
IMPORTANT:
- In "sources", return links ONLY from the ${platformNorm} domain:
  - instagram: instagram.com/p/ or instagram.com/reel/
  - tiktok: tiktok.com/ (vt.tiktok.com / vm.tiktok.com allowed)
  - youtube: youtube.com/watch or youtu.be/
  - linkedin: linkedin.com/
- If you cannot find enough ${platformNorm} links, keep "sources" as an empty array for that trend (do NOT fill with news/blog).
- Do NOT substitute web/news/blog/youtube links when platform is provided.
` : ""}

Only return valid JSON, no markdown.`;

    const model = getGroundedModel();
    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    const text = response.text();

    let trendsData;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");

      trendsData = JSON.parse(jsonMatch[0]);

      // ✅ 1) enforce dulu
      trendsData = enforcePlatformSources(trendsData, platformNorm);

      // ✅ 2) retry khusus tiktok jika 0 link tiktok (opsional)
      const isTikTok = (platformNorm || "").toLowerCase() === "tiktok";
      if (isTikTok && countPlatformUrls(trendsData, platformNorm) === 0) {
        const retryPrompt = `Find TikTok viral trends for: "${query}"
Return ONLY valid JSON with the same structure as before.
CRITICAL:
- sources.url MUST be TikTok video links only:
  https://www.tiktok.com/@<username>/video/<id>
  or https://vt.tiktok.com/... / https://vm.tiktok.com/...
- Do NOT include web/news/blog/youtube links.
- If you can't find a TikTok link, set sources to [].
${langInstruction}.
Only return valid JSON, no markdown.`;

        const retryResult = await model.generateContent(retryPrompt);
        const retryResp = await retryResult.response;
        const retryText = retryResp.text();
        const retryMatch = retryText.match(/\{[\s\S]*\}/);
        if (retryMatch) {
          const retryJson = JSON.parse(retryMatch[0]);
          trendsData = enforcePlatformSources(retryJson, platformNorm);
        }
      }

      // ✅ 3) resolve redirect (sekali saja)
      trendsData = await resolveTrendSourcesUrls(trendsData, platformNorm);

      // ✅ 4) final guard: enforce paling terakhir
      trendsData = enforcePlatformSources(trendsData, platformNorm);

    } catch (parseError) {
      trendsData = { trends: [], summary: "Unable to parse trends data", raw: text };
    }

    // ✅ Grounding: jangan kirim kalau platform spesifik (biar frontend gak fallback ke web/blog)
    let grounding = null;
    if (!platformNorm) {
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata) {
        const rawSources =
          groundingMetadata.groundingChunks?.map((chunk) => ({
            title: chunk.web?.title,
            uri: chunk.web?.uri,
          })) || [];

        const resolvedSources = await resolveGroundingSources(rawSources);

        grounding = {
          searchQueries: groundingMetadata.webSearchQueries,
          sources: resolvedSources,
        };
      }
    }

    return res.json({
      success: true,
      query,
      platform: platformNorm || "all",
      topic: topicNorm || "general",
      ...trendsData,
      grounding,
    });

  } catch (error) {
    console.error("Search Trends Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
``


      // const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

      // const rawSources = groundingMetadata?.groundingChunks?.map(chunk => ({
      //   title: chunk.web?.title,
      //   uri: chunk.web?.uri,
      // })) || [];

      // const resolvedSources = await resolveGroundingSources(rawSources);

      // res.json({
      //   success: true,
      //   query,
      //   platform: platform || "all",
      //   topic: topic || "general",
      //   ...trendsData,
      //   grounding: groundingMetadata ? {
      //     searchQueries: groundingMetadata.webSearchQueries,
      //     sources: resolvedSources,
      //   } : null,
      // });
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
