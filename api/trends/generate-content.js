// api/trends/generate-content.js
import { GoogleGenerativeAI } from "@google/generative-ai";

function getTextModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY (set in Vercel env)");

  const genAI = new GoogleGenerativeAI(key);

  // Samain kalau kamu pakai model lain di lokal
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export default async function handler(req, res) {
  // CORS basic
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const {
      topic,
      keyTopic,
      targetAudience,
      toneOfVoice,
      targetKeywords,
      slideCount,
      language,
    } = req.body || {};

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
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON found");
      contentData = JSON.parse(match[0]);
    } catch (e) {
      // tetap return success true biar FE gak “mati”, tapi kasih error + raw
      contentData = { error: "Unable to parse content data", raw: text };
    }

    return res.status(200).json({
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
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
