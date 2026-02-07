import { v4 as uuidv4 } from "uuid";
import { getImageModel } from "../../../lib/gemini.js";
import { saveBase64Image, prepareImagePart, cleanupFiles } from "../../../lib/imageUtils.js";

async function readJsonBody(req) {
  // 1) already parsed object
  if (req.body && typeof req.body === "object") return req.body;

  // 2) string body
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  // 3) stream fallback
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  // CORS (penting untuk browser POST)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = await readJsonBody(req);

    const prompt = body?.prompt;
    const preserveStyle = body?.preserveStyle;
    const imageFile = body?.image; // base64 data URL expected

    if (!imageFile) return res.status(400).json({ error: "Image is required" });
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Save base64 temporarily (expect "data:image/...")
    let tempFilePath = null;
    if (typeof imageFile === "string" && imageFile.startsWith("data:image/")) {
      const base64Data = imageFile.split(",")[1] || "";
      if (!base64Data) return res.status(400).json({ error: "Invalid base64 image" });

      const tempFilename = `temp_${uuidv4()}.png`;
      tempFilePath = saveBase64Image(base64Data, tempFilename);
    } else {
      return res.status(400).json({
        error: "Invalid image format. Expected base64 data URL like data:image/png;base64,...",
      });
    }

    const imagePart = prepareImagePart(tempFilePath);

    let editPrompt = `Edit this image: ${prompt}`;
    if (String(preserveStyle) === "true") {
      editPrompt += `. Maintain the original style and quality.`;
    }
    editPrompt += `. Produce high fidelity professional result.`;

    const model = getImageModel();
    const result = await model.generateContent([editPrompt, imagePart]);
    const response = await result.response;

    const images = [];
    let textResponse = "";

    const parts = response?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
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

    if (tempFilePath) cleanupFiles([tempFilePath]);

    return res.json({
      success: true,
      message: textResponse || "Image edited successfully",
      images,
    });
  } catch (error) {
    console.error("Image to Image Error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
