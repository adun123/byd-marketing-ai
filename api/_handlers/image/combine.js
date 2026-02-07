// api/_handlers/image/combine.js
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import { storage, fileFilter } from "../../utils/imageUpload.js"; // <- sesuaikan path util kamu
import {
  prepareImagePart,
  saveBase64Image,
  cleanupFiles,
} from "../../utils/imageUtils.js"; // <- sesuaikan
import { getImageModel } from "../../utils/getImageModel.js"; // <- sesuaikan

// Penting untuk multipart/form-data (Vercel / Next API)
export const config = {
  api: { bodyParser: false },
};

const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("images", 5);

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function combine(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, uploadMultiple);

    const { prompt, layout, style } = req.body;

    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "At least 2 images are required" });
    }
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const imageParts = req.files
      .map((file, index) => [`Image ${index + 1}:`, prepareImagePart(file.path)])
      .flat();

    let combinePrompt = `Combine these ${req.files.length} images: ${prompt}`;
    if (layout) combinePrompt += `. Layout: ${layout}`;
    if (style) combinePrompt += `. Style: ${style}`;
    combinePrompt += `. Create a cohesive, professional marketing composite image.`;

    const model = getImageModel();
    const result = await model.generateContent([combinePrompt, ...imageParts]);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    for (const part of response.candidates?.[0]?.content?.parts || []) {
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

    return res.json({
      success: true,
      message: textResponse || "Images combined successfully",
      images,
      sourceCount: req.files.length,
    });
  } catch (error) {
    console.error("Combine Images Error:", error);
    if (req.files) cleanupFiles(req.files);
    return res.status(500).json({ error: error.message });
  }
}
