import { v4 as uuidv4 } from "uuid";
import { getImageModel } from "../../lib/gemini.js";
import { saveBase64Image, prepareImagePart, cleanupFiles } from "../../lib/imageUtils.js";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, preserveStyle } = req.body;

    // In Vercel serverless functions, file uploads are handled differently
    // For now, we'll expect base64 encoded images in the request body
    const imageFile = req.body.image;

    if (!imageFile) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // If image is base64, save it temporarily
    let tempFilePath = null;
    if (imageFile.startsWith('data:image/')) {
      const base64Data = imageFile.split(',')[1];
      const tempFilename = `temp_${uuidv4()}.png`;
      tempFilePath = saveBase64Image(base64Data, tempFilename);
    }

    const imagePart = prepareImagePart(tempFilePath);

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

    // Clean up temp file
    if (tempFilePath) {
      cleanupFiles([tempFilePath]);
    }

    res.json({
      success: true,
      message: textResponse || "Image edited successfully",
      images,
    });
  } catch (error) {
    console.error("Image to Image Error:", error);
    res.status(500).json({ error: error.message });
  }
}