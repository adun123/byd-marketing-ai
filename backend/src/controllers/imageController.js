import { v4 as uuidv4 } from "uuid";
import { getImageModel, getVisionModel } from "../config/gemini.js";
import {
  prepareImagePart,
  saveBase64Image,
  cleanupFiles,
  upscaleImage,
  getImageInfo,
} from "../utils/imageUtils.js";

export const textToImage = async (req, res) => {
  try {
    const { prompt, style, aspectRatio, brand, numberOfResults } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const numResults = Math.min(Math.max(parseInt(numberOfResults) || 1, 1), 4);

    let enhancedPrompt = `Create a professional marketing image: ${prompt}`;
    if (style) enhancedPrompt += `. Style: ${style}`;
    if (brand) enhancedPrompt += `. Brand: ${brand}`;
    if (aspectRatio) enhancedPrompt += `. Aspect ratio: ${aspectRatio}`;
    enhancedPrompt += `. High quality, professional marketing content, suitable for advertising.`;

    const model = getImageModel();
    const allImages = [];
    let textResponse = "";

    const generatePromises = Array.from({ length: numResults }, async (_, index) => {
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;

      const images = [];
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const filename = `generated_${uuidv4()}.png`;
          saveBase64Image(part.inlineData.data, filename);
          images.push({
            filename,
            url: `/outputs/${filename}`,
            base64: part.inlineData.data,
            variant: index + 1,
          });
        } else if (part.text && !textResponse) {
          textResponse = part.text;
        }
      }
      return images;
    });

    const results = await Promise.all(generatePromises);
    results.forEach((images) => allImages.push(...images));

    res.json({
      success: true,
      message: textResponse || `Generated ${allImages.length} image(s) successfully`,
      images: allImages,
      prompt: enhancedPrompt,
      requestedCount: numResults,
      generatedCount: allImages.length,
    });
  } catch (error) {
    console.error("Text to Image Error:", error);
    res.status(500).json({ error: error.message });
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

    const imagePart = req.file ? prepareImagePart(req.file.path) : null;

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

