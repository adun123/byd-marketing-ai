import { v4 as uuidv4 } from "uuid";
import { getImageModel } from "../../lib/gemini.js";
import { saveBase64Image } from "../../lib/imageUtils.js";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}