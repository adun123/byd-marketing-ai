// api/trends/search.js
import {
  extractJson,
  normalizePlatform,
  normalizeTopic,
  enforcePlatformSources,
  countPlatformUrls,
  resolveTrendSourcesUrls,
  resolveGroundingSources,
  getGroundedModel,
} from "../trends/trendsCore";

export default async function handler(req, res) {
  // CORS basic
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { query, platform, topic, language } = req.body || {};
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

${
  platformNorm
    ? `
IMPORTANT:
- In "sources", return links ONLY from the ${platformNorm} domain:
  - instagram: instagram.com/p/ or instagram.com/reel/
  - tiktok: tiktok.com/ (vt.tiktok.com / vm.tiktok.com allowed)
  - youtube: youtube.com/watch or youtu.be/
  - linkedin: linkedin.com/
- If you cannot find enough ${platformNorm} links, keep "sources" as an empty array for that trend (do NOT fill with news/blog).
- Do NOT substitute web/news/blog/youtube links when platform is provided.
`
    : ""
}

Only return valid JSON, no markdown.`;

    const model = getGroundedModel();

    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    const text = response.text();

    let trendsData = extractJson(text);

    if (!trendsData) {
      trendsData = { trends: [], summary: "Unable to parse trends data", raw: text };
    } else {
      // 1) enforce
      trendsData = enforcePlatformSources(trendsData, platformNorm);

      // 2) retry khusus tiktok jika 0 link tiktok (opsional)
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
        const retryJson = extractJson(retryText);
        if (retryJson) {
          trendsData = enforcePlatformSources(retryJson, platformNorm);
        }
      }

      // 3) resolve redirect (kalau kamu implement di _lib)
      trendsData = await resolveTrendSourcesUrls(trendsData, platformNorm);

      // 4) final enforce
      trendsData = enforcePlatformSources(trendsData, platformNorm);
    }

    // Grounding: jangan kirim kalau platform spesifik
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

    return res.status(200).json({
      success: true,
      query,
      platform: platformNorm || "all",
      topic: topicNorm || "general",
      ...trendsData,
      grounding,
    });
  } catch (error) {
    console.error("Search Trends Error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
