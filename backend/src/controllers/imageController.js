import { v4 as uuidv4 } from "uuid";
import { getImageModel, getTextModel, getVisionModel } from "../config/gemini.js";
import {
  prepareImagePart,
  saveBase64Image,
  cleanupFiles,
  upscaleImage,
  getImageInfo,
} from "../utils/imageUtils.js";

import { ai, IMAGE_MODEL } from "../config/getImageClients.js";




export const enhancePrompt = async (req, res) => {
  try {
    const { prompt, style, purpose, language } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const lang = language || "en";
    const langInstructions = {
      en: "Respond in English",
      id: "Respond in Indonesian (Bahasa Indonesia)",
    };
    const langInstruction = langInstructions[lang] || langInstructions.en;

    let enhanceRequest = `You are an expert prompt engineer for AI image generation. 
Enhance this prompt into a detailed, effective prompt for generating marketing images.

Original prompt: "${prompt}"`;

    if (style) enhanceRequest += `\nDesired style: ${style}`;
    if (purpose) enhanceRequest += `\nPurpose: ${purpose}`;

    enhanceRequest += `

${langInstruction}.

Return a JSON object with this exact structure:
{
  "enhanced": "The enhanced detailed prompt ready to use",
  "variations": [
    "Alternative version 1",
    "Alternative version 2"
  ],
  "tips": ["Max 3 tips for better results"]
}

Make the enhanced prompt:
- More descriptive (lighting, composition, mood, colors)
- Professional marketing quality
- Specific about visual elements
- Include style keywords (cinematic, professional, high quality, etc)

Only return valid JSON, no markdown or extra text.`;

    const model = getTextModel();
    const result = await model.generateContent(enhanceRequest);
    const response = await result.response;
    const text = response.text();

    let enhanced;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        enhanced = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      enhanced = {
        enhanced: `Professional marketing image: ${prompt}. High quality, cinematic lighting, vibrant colors, modern aesthetic, suitable for advertising.`,
        variations: [
          `${prompt}, minimalist style, clean background, professional lighting`,
          `${prompt}, dynamic composition, bold colors, eye-catching design`,
          `${prompt}, elegant and sophisticated, premium feel, luxury aesthetic`,
        ],
        tips: ["Add specific colors", "Mention lighting style", "Include composition details"],
      };
    }

    res.json({
      success: true,
      original: prompt,
      ...enhanced,
    });
  } catch (error) {
    console.error("Enhance Prompt Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const { language } = req.body;
    const lang = language || "en";

    const imagePart = prepareImagePart(req.file.path);

    const languageInstructions = {
      en: "Respond in English",
      id: "Respond in Indonesian (Bahasa Indonesia)"
    };

    const langInstruction = languageInstructions[lang] || languageInstructions.en;

    const analyzePrompt = `Analyze this image and provide editing suggestions (max 3 suggestions) for marketing content creation.

${langInstruction}.

Return a JSON object with this exact structure:
{
  "description": "Brief description of what's in the image",
  "detected": {
    "objects": ["list of main objects detected"],
    "people": "description of people if any, or null",
    "background": "description of the background",
    "colors": ["dominant colors"],
    "mood": "overall mood/atmosphere"
  },
  "suggestions": [
    {
      "action": "edit|add|remove|change",
      "prompt": "Ready-to-use prompt for the user",
      "description": "Why this suggestion might be useful"
    }
  ]
}

Provide 5-8 practical suggestions that would improve the image for marketing purposes. Include suggestions for:
- Removing unwanted elements
- Changing backgrounds
- Adding branding elements
- Improving composition
- Style changes

Only return valid JSON, no markdown or extra text.`;

    const model = getVisionModel();
    const result = await model.generateContent([analyzePrompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      analysis = {
        description: "Image analyzed",
        detected: {},
        suggestions: [
          { action: "edit", prompt: "Enhance the colors and contrast", description: "Improve visual appeal" },
          { action: "change", prompt: "Change the background to a studio setting", description: "Professional look" },
          { action: "add", prompt: "Add a subtle logo watermark", description: "Brand recognition" },
        ],
        raw: text,
      };
    }

    cleanupFiles([req.file]);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Analyze Image Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

function normalizeAspectRatio(a) {
  const allowed = new Set([
    "1:1",
    "4:5",
    "9:16",
    "16:9",
    "3:4",
    "4:3",
    "21:9",
  ]);
  return allowed.has(a) ? a : "1:1";
}

export const textToImage = async (req, res) => {
  try {
    const { prompt, style, aspectRatio, brand, numberOfResults } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const numResults = Math.min(Math.max(Number(numberOfResults) || 1, 1), 10);
    const aspect = normalizeAspectRatio(aspectRatio);

    let enhancedPrompt = `Create a professional marketing image: ${prompt}`;
    if (style) enhancedPrompt += `. Style: ${style}`;
    if (brand) enhancedPrompt += `. Brand: ${brand}`;
    enhancedPrompt += `. High quality, professional marketing content, suitable for advertising.`;

    
    const allImages = [];
    let textResponse = "";

    for (let i = 0; i < numResults; i++) {
      const slidePrompt =
        `${enhancedPrompt}\n` +
        `Carousel slide ${i + 1} of ${numResults}. ` +
        `Make it visually distinct while keeping consistent brand style.`;

      const resp = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: slidePrompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: { aspectRatio: aspect },
        },
      });

      const parts = resp?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const filename = `generated_${uuidv4()}.png`;
          saveBase64Image(part.inlineData.data, filename);

          allImages.push({
            filename,
            url: `/outputs/${filename}`,
            base64: part.inlineData.data,
            variant: i + 1,
          });
        } else if (part.text && !textResponse) {
          textResponse = part.text;
        }
      }
    }

    res.json({
      success: true,
      images: allImages,
      prompt: enhancedPrompt,
      requestedCount: numResults,
      generatedCount: allImages.length,
      usedAspectRatio: aspect,
    });
  } catch (err) {
    console.error("TextToImage error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const imageToImage = async (req, res) => {
  try {
    const { prompt, preserveStyle } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const imagePart = prepareImagePart(req.file.path);

    let editPrompt = `Edit this image: ${prompt}`;
    if (preserveStyle === "true") {
      editPrompt += `. Maintain the original style and quality.`;
    }
    editPrompt += `. Produce high fidelity professional result.`;

    const model = getImageModel();
    const result = await model.generateContent([editPrompt, imagePart]);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `edited_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
        });
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    cleanupFiles([req.file]);

    res.json({
      success: true,
      message: textResponse || "Image edited successfully",
      images,
    });
  } catch (error) {
    console.error("Image to Image Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

export const modifyElements = async (req, res) => {
  try {
    const { action, element, position, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!action || !element) {
      return res
        .status(400)
        .json({ error: "Action (add/remove) and element are required" });
    }

    const imagePart = prepareImagePart(req.file.path);

    let modifyPrompt = "";
    if (action === "add") {
      modifyPrompt = `Add ${element} to this image`;
      if (position) modifyPrompt += ` at ${position}`;
      if (description) modifyPrompt += `. ${description}`;
    } else if (action === "remove") {
      modifyPrompt = `Remove ${element} from this image. Fill the area naturally with the surrounding context.`;
    }
    modifyPrompt += `. Maintain high quality and seamless integration.`;

    const model = getImageModel();
    const result = await model.generateContent([modifyPrompt, imagePart]);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `modified_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
        });
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    cleanupFiles([req.file]);

    res.json({
      success: true,
      message: textResponse || `Element ${action}ed successfully`,
      images,
      action,
      element,
    });
  } catch (error) {
    console.error("Modify Elements Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

export const maskEdit = async (req, res) => {
  try {
    const { prompt, maskDescription } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Edit prompt is required" });
    }

    const imagePart = prepareImagePart(req.files.image[0].path);

    let editPrompt = "";
    if (req.files.mask) {
      const maskPart = prepareImagePart(req.files.mask[0].path);
      editPrompt = `Edit only the masked area (white area in mask) of the main image: ${prompt}. Keep the rest of the image unchanged.`;

      const model = getImageModel();
      const result = await model.generateContent([
        editPrompt,
        "Main image:",
        imagePart,
        "Mask (edit only white areas):",
        maskPart,
      ]);
      const response = await result.response;

      const images = [];
      let textResponse = "";

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const filename = `inpainted_${uuidv4()}.png`;
          saveBase64Image(part.inlineData.data, filename);
          images.push({
            filename,
            url: `/outputs/${filename}`,
            base64: part.inlineData.data,
          });
        } else if (part.text) {
          textResponse = part.text;
        }
      }

      cleanupFiles(req.files);

      return res.json({
        success: true,
        message: textResponse || "Mask edit completed successfully",
        images,
      });
    } else if (maskDescription) {
      editPrompt = `In this image, edit only the ${maskDescription}: ${prompt}. Keep all other parts of the image unchanged.`;

      const model = getImageModel();
      const result = await model.generateContent([editPrompt, imagePart]);
      const response = await result.response;

      const images = [];
      let textResponse = "";

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const filename = `inpainted_${uuidv4()}.png`;
          saveBase64Image(part.inlineData.data, filename);
          images.push({
            filename,
            url: `/outputs/${filename}`,
            base64: part.inlineData.data,
          });
        } else if (part.text) {
          textResponse = part.text;
        }
      }

      cleanupFiles(req.files);

      return res.json({
        success: true,
        message: textResponse || "Conversational mask edit completed",
        images,
        editedArea: maskDescription,
      });
    } else {
      cleanupFiles(req.files);
      return res.status(400).json({
        error: "Either mask image or maskDescription is required",
      });
    }
  } catch (error) {
    console.error("Mask Edit Error:", error);
    if (req.files) cleanupFiles(req.files);
    res.status(500).json({ error: error.message });
  }
};

export const combineImages = async (req, res) => {
  try {
    const { prompt, layout, style } = req.body;

    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .json({ error: "At least 2 images are required" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const imageParts = req.files.map((file, index) => [
      `Image ${index + 1}:`,
      prepareImagePart(file.path),
    ]).flat();

    let combinePrompt = `Combine these ${req.files.length} images: ${prompt}`;
    if (layout) combinePrompt += `. Layout: ${layout}`;
    if (style) combinePrompt += `. Style: ${style}`;
    combinePrompt += `. Create a cohesive, professional marketing composite image.`;

    const model = getImageModel();
    const result = await model.generateContent([combinePrompt, ...imageParts]);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `combined_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
        });
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    cleanupFiles(req.files);

    res.json({
      success: true,
      message: textResponse || "Images combined successfully",
      images,
      sourceCount: req.files.length,
    });
  } catch (error) {
    console.error("Combine Images Error:", error);
    if (req.files) cleanupFiles(req.files);
    res.status(500).json({ error: error.message });
  }
};

export const generate360View = async (req, res) => {
  try {
    const { prompt, angles, characterDescription } = req.body;

    let viewAngles = ["front", "side", "back", "3/4 view"];
    if (angles) {
      viewAngles = typeof angles === "string" ? angles.split(",").map(a => a.trim()) : angles;
    }

    let basePrompt = "";
    const imagePart = req.file ? prepareImagePart(req.file.path) : null;

    if (imagePart) {
      basePrompt = `Based on this reference image, generate consistent views from different angles: ${viewAngles.join(", ")}. ${prompt || ""}`;
    } else if (characterDescription) {
      basePrompt = `Create a character: ${characterDescription}. Generate consistent views from these angles: ${viewAngles.join(", ")}. ${prompt || ""}`;
    } else {
      return res.status(400).json({
        error: "Either an image or characterDescription is required",
      });
    }

    basePrompt += `. Maintain exact character consistency across all views. Professional quality, suitable for marketing.`;

    const model = getImageModel();
    const content = imagePart ? [basePrompt, imagePart] : [basePrompt];
    const result = await model.generateContent(content);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `360view_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
        });
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    if (req.file) cleanupFiles([req.file]);

    res.json({
      success: true,
      message: textResponse || "360 views generated successfully",
      images,
      angles: viewAngles,
    });
  } catch (error) {
    console.error("360 View Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

export const imageChat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const imagePart = req.file ? prepareImagePart(req.file.path) : null;

    let contextPrompt = `You are a professional image editing assistant for marketing content creation. `;

    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt += `Previous conversation:\n`;
      conversationHistory.forEach((msg) => {
        contextPrompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    contextPrompt += `\nUser: ${message}\n`;
    contextPrompt += `\nRespond helpfully and if the user asks for image modifications, describe what changes you would make or generate the modified image.`;

    const model = getImageModel();
    const content = imagePart
      ? [contextPrompt, "Current image:", imagePart]
      : [contextPrompt];
    const result = await model.generateContent(content);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `chat_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
        });
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    if (req.file) cleanupFiles([req.file]);

    res.json({
      success: true,
      message: textResponse,
      images,
      hasImage: images.length > 0,
    });
  } catch (error) {
    console.error("Image Chat Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

export const generateMarketingContent = async (req, res) => {
  try {
    const {
      platform,
      contentType,
      targetAudience,
      product,
      brand,
      message,
      customAspectRatio,
      customWidth,
      customHeight,
    } = req.body;

    if (!platform || !contentType || !targetAudience) {
      return res.status(400).json({
        error: "Platform, content type, and target audience are required",
      });
    }

    const { mode } = req.body;
    if (mode === "ideas") {
        try {
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
        } catch (err) {
          console.error("Ideas mode error:", err);
          return res.status(500).json({ error: err.message });
        }
      }

    const imagePart = req.file ? prepareImagePart(req.file.path) : null;
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

    const platformSpecs = {
      "tiktok-reels": {
        name: "TikTok / Instagram Reels",
        aspectRatio: "9:16",
        resolution: "1080x1920",
        style: "Vertical format, trendy, dynamic, fast-paced visual appeal",
      },
      "youtube-shorts": {
        name: "YouTube Shorts",
        aspectRatio: "9:16",
        resolution: "1080x1920",
        style: "Vertical format, eye-catching thumbnail style, bold colors",
      },
      "instagram-post": {
        name: "Instagram Post",
        aspectRatio: "1:1",
        resolution: "1080x1080",
        style: "Square format, vibrant colors, modern aesthetic, clean design",
      },
      "linkedin": {
        name: "LinkedIn",
        aspectRatio: "1.91:1",
        resolution: "1200x628",
        style: "Professional, clean, corporate aesthetic, business-oriented",
      },
    };

    const contentTypes = {
      "edu-ent": {
        name: "Pure Edu/Ent",
        description: "Educational and entertaining content, neutral tone, informative",
        approach: "Focus on delivering value through education or entertainment without direct selling",
      },
      "soft-campaign": {
        name: "Soft Campaign",
        description: "Subtle promotional content with positive messaging",
        approach: "Softly integrate brand/product with positive, relatable messaging",
      },
    };

    const audienceSpecs = {
      "genz-balanced": {
        name: "Gen Z - Balanced",
        interests: "Career, Skills, Education, Tech",
        tone: "Informative yet relatable, professional but not boring",
        style: "Clean, modern, tech-savvy aesthetic",
      },
      "genz-emotional": {
        name: "Gen Z - Emotional",
        interests: "Trends, Pop Culture, Gaming, Hype",
        tone: "Exciting, trendy, FOMO-inducing, emotionally engaging",
        style: "Bold colors, dynamic, meme-culture influenced",
      },
      "genalpha-balanced": {
        name: "Gen Alpha - Balanced",
        interests: "Career, Skills, Education, Tech",
        tone: "Fun yet educational, colorful but informative",
        style: "Bright, playful, futuristic elements",
      },
      "genalpha-emotional": {
        name: "Gen Alpha - Emotional",
        interests: "Trends, Pop Culture, Gaming, Hype",
        tone: "Super fun, gaming-inspired, highly visual",
        style: "Vibrant, animated feel, game-like aesthetics",
      },
    };

    const selectedPlatform = platformSpecs[platform] || platformSpecs["instagram-post"];
    const selectedContent = contentTypes[contentType] || contentTypes["edu-ent"];
    const selectedAudience = audienceSpecs[targetAudience] || audienceSpecs["genz-balanced"];

    let aspectRatio = customAspectRatio || selectedPlatform.aspectRatio;
    let resolution = selectedPlatform.resolution;
    if (customWidth && customHeight) {
      resolution = `${customWidth}x${customHeight}`;
    }

    let marketingPrompt = `Create a professional marketing image with these specifications:\n`;
    marketingPrompt += `Platform: ${selectedPlatform.name} (${selectedPlatform.style})\n`;
    marketingPrompt += `Aspect Ratio: ${aspectRatio}\n`;
    marketingPrompt += `Resolution: ${resolution}\n`;
    marketingPrompt += `Content Type: ${selectedContent.name} - ${selectedContent.approach}\n`;
    marketingPrompt += `Target Audience: ${selectedAudience.name} (${selectedAudience.interests})\n`;
    marketingPrompt += `Visual Tone: ${selectedAudience.tone}\n`;
    marketingPrompt += `Visual Style: ${selectedAudience.style}\n`;

    if (product) marketingPrompt += `Product/Topic: ${product}\n`;
    if (brand) marketingPrompt += `Brand: ${brand}\n`;
    if (message) marketingPrompt += `Key Message: ${message}\n`;

    marketingPrompt += `\nGenerate a high-quality, professional marketing image that perfectly fits the specified platform dimensions and appeals to the target audience. The image should be visually striking and suitable for commercial use.`;

    const model = getImageModel();
    const content = imagePart
      ? [marketingPrompt, "Reference image:", imagePart]
      : [marketingPrompt];
    const result = await model.generateContent(content);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const filename = `marketing_${platform}_${uuidv4()}.png`;
        saveBase64Image(part.inlineData.data, filename);
        images.push({
          filename,
          url: `/outputs/${filename}`,
          base64: part.inlineData.data,
        });
      } else if (part.text) {
        textResponse = part.text;
      }
    }

    if (req.file) cleanupFiles([req.file]);

    res.json({
      success: true,
      message: textResponse || "Marketing content generated successfully",
      images,
      settings: {
        platform: selectedPlatform.name,
        contentType: selectedContent.name,
        targetAudience: selectedAudience.name,
        aspectRatio,
        resolution,
      },
    });
  } catch (error) {
    console.error("Marketing Content Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

export const getMarketingOptions = (req, res) => {
  res.json({
    platforms: [
      { id: "tiktok-reels", name: "TikTok / Instagram Reels", aspectRatio: "9:16", resolution: "1080x1920" },
      { id: "youtube-shorts", name: "YouTube Shorts", aspectRatio: "9:16", resolution: "1080x1920" },
      { id: "instagram-post", name: "Instagram Post", aspectRatio: "1:1", resolution: "1080x1080" },
      { id: "linkedin", name: "LinkedIn", aspectRatio: "1.91:1", resolution: "1200x628" },
    ],
    contentTypes: [
      { id: "edu-ent", name: "Pure Edu/Ent", description: "Neutral & Educational" },
      { id: "soft-campaign", name: "Soft Campaign", description: "Subtle Positive Messaging" },
    ],
    targetAudiences: [
      { id: "genz-balanced", name: "Gen Z - Balanced", description: "Career, Skills, Education, Tech" },
      { id: "genz-emotional", name: "Gen Z - Emotional", description: "Trends, Pop Culture, Gaming, Hype" },
      { id: "genalpha-balanced", name: "Gen Alpha - Balanced", description: "Career, Skills, Education, Tech" },
      { id: "genalpha-emotional", name: "Gen Alpha - Emotional", description: "Trends, Pop Culture, Gaming, Hype" },
    ],
  });
};

export const upscaleImageEndpoint = async (req, res) => {
  try {
    const { preset, customWidth, customHeight, quality } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const presets = {
      "hd": { width: 1280, height: 720 },
      "fullhd": { width: 1920, height: 1080 },
      "2k": { width: 2560, height: 1440 },
      "4k": { width: 3840, height: 2160 },
    };

    let targetWidth, targetHeight;

    if (preset && presets[preset.toLowerCase()]) {
      const originalInfo = await getImageInfo(req.file.path);
      const aspectRatio = originalInfo.width / originalInfo.height;

      if (aspectRatio > 1) {
        targetWidth = presets[preset.toLowerCase()].width;
        targetHeight = Math.round(targetWidth / aspectRatio);
      } else {
        targetHeight = presets[preset.toLowerCase()].height;
        targetWidth = Math.round(targetHeight * aspectRatio);
      }
    } else if (customWidth && customHeight) {
      targetWidth = parseInt(customWidth);
      targetHeight = parseInt(customHeight);
    } else {
      const originalInfo = await getImageInfo(req.file.path);
      targetWidth = originalInfo.width * 2;
      targetHeight = originalInfo.height * 2;
    }

    const result = await upscaleImage(
      req.file.path,
      targetWidth,
      targetHeight,
      parseInt(quality) || 90
    );

    const originalInfo = await getImageInfo(req.file.path);

    cleanupFiles([req.file]);

    res.json({
      success: true,
      message: "Image upscaled successfully",
      image: {
        filename: result.filename,
        url: result.url,
        base64: result.base64,
      },
      original: {
        width: originalInfo.width,
        height: originalInfo.height,
      },
      upscaled: {
        width: targetWidth,
        height: targetHeight,
      },
    });
  } catch (error) {
    console.error("Upscale Error:", error);
    if (req.file) cleanupFiles([req.file]);
    res.status(500).json({ error: error.message });
  }
};

