import { v4 as uuidv4 } from "uuid";
import { getTextModel, getImageModel } from "../../lib/gemini.js";
import { saveBase64Image, prepareImagePart, cleanupFiles } from "../../lib/imageUtils.js";

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

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      platform,
      contentType,
      targetAudience,
      product,
      brand,
      message,
      mode
    } = req.body;

    if (!platform || !contentType || !targetAudience) {
      return res.status(400).json({
        error: "Platform, content type, and target audience are required",
      });
    }

    // Handle ideas mode - content strategy generation
    if (mode === "ideas") {
      const prompt = `
      Kamu adalah social media strategist Indonesia.
      Buat ide konten untuk:
      - Platform: ${platform}
      - Content type: ${contentType}
      - Target audience: ${targetAudience}
      - Product/Topik: ${product || "-"}
      - Brand: ${brand || "-"}
      - Key message: ${message || "-"}

      Keluarkan JSON VALID tanpa markdown, tanpa penjelasan, format persis:
      {
        "hooks": ["...", "...", "...", "...", "..."],
         "visualBriefs": ["...", "...", "..."],
        "angles": ["...", "...", "..."],
        "angleHowTos": [
          ["step 1", "step 2", "step 3"],
          ["step 1", "step 2", "step 3"]
        ],
        "captions": ["...", "..."],
        "ctas": ["...", "...", "...", "..."],
        "hashtags": ["#...", "#...", "#...", "#...", "#...", "#...", "#...", "#...", "#...", "#..."]
      }

      Aturan angleHowTos:
      - angleHowTos[i] HARUS sesuai dengan angles[i]
      - Tulis langkah konkret, bukan teori
      - Maksimal 3–5 langkah
      - Bahasa Indonesia, gaya creator

      Aturan:
      - visualBriefs[i] HARUS cocok untuk hooks[i]
      - Bahasa Indonesia natural.
      - Hashtags harus relevan: gabungan brand/product + niche + discovery + platform.
      - Struktur 3–5 baris bullet singkat, contoh:
        "- 0–1s: ...\n- 1–2s: ...\n- 2–3s: ...\n- Overlay text: ...\n- Notes: ..."
      - Hindari hashtag generik seperti #love #instagood.
      - Maks 10 hashtag.
      `.trim();

      const textModel = getTextModel();
      const result = await textModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const ideas = extractJson(text);
      if (!ideas) {
        return res.status(502).json({ error: "Failed to parse AI JSON output", raw: text });
      }

      return res.json(ideas);
    }

    // Handle image generation mode
    const imageFile = req.body.image;

    // Platform-specific specifications
    const platformSpecs = {
      "tiktok-reels": {
        name: "TikTok / Instagram Reels",
        aspectRatio: "9:16",
        resolution: "1080x1920",
        style: "Vertical format, trendy, dynamic, fast-paced visual appeal",
      },
      "instagram-post": {
        name: "Instagram Post",
        aspectRatio: "1:1",
        resolution: "1080x1080",
        style: "Square format, clean, professional, engaging visuals",
      },
      "instagram-story": {
        name: "Instagram Story",
        aspectRatio: "9:16",
        resolution: "1080x1920",
        style: "Vertical format, bold, eye-catching, temporary appeal",
      },
      "facebook-post": {
        name: "Facebook Post",
        aspectRatio: "1.91:1",
        resolution: "1200x630",
        style: "Horizontal format, shareable, community-focused",
      },
      "linkedin-post": {
        name: "LinkedIn Post",
        aspectRatio: "1.91:1",
        resolution: "1200x627",
        style: "Professional, business-oriented, trustworthy",
      }
    };

    const spec = platformSpecs[platform] || platformSpecs["instagram-post"];

    let enhancedPrompt = `Create a ${spec.name} marketing image for ${contentType} content targeting ${targetAudience}.`;

    if (product) enhancedPrompt += ` Product: ${product}.`;
    if (brand) enhancedPrompt += ` Brand: ${brand}.`;
    if (message) enhancedPrompt += ` Key message: ${message}.`;

    enhancedPrompt += ` Style specifications: ${spec.style}. Aspect ratio: ${spec.aspectRatio}. High quality, professional marketing content.`;

    let tempFilePath = null;
    let imagePart = null;

    // If image is provided, use it as reference
    if (imageFile && imageFile.startsWith('data:image/')) {
      const base64Data = imageFile.split(',')[1];
      const tempFilename = `temp_${uuidv4()}.png`;
      tempFilePath = saveBase64Image(base64Data, tempFilename);
      imagePart = prepareImagePart(tempFilePath);
      enhancedPrompt = `Edit this image for ${spec.name} marketing content: ${enhancedPrompt}`;
    }

    const model = getImageModel();
    const content = imagePart ? [enhancedPrompt, imagePart] : [enhancedPrompt];
    const result = await model.generateContent(content);
    const response = await result.response;

    const images = [];
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `marketing_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
          platform,
          aspectRatio: spec.aspectRatio,
          resolution: spec.resolution,
        });
      }
    }

    // Clean up temp file
    if (tempFilePath) {
      cleanupFiles([tempFilePath]);
    }

    res.json({
      success: true,
      message: `Generated ${images.length} marketing image(s) for ${spec.name}`,
      images,
      platform: spec,
    });
  } catch (error) {
    console.error("Marketing Content Error:", error);
    res.status(500).json({ error: error.message });
  }
}