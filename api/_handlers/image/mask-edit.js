import { v4 as uuidv4 } from "uuid";
import { getImageModel } from "../../../lib/gemini.js";
import { saveBase64Image, prepareImagePart, cleanupFiles } from "../../../lib/imageUtils.js";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function splitDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return null;
  if (!dataUrl.startsWith("data:image/")) return null;
  const parts = dataUrl.split(",");
  if (parts.length < 2) return null;
  return parts[1];
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let tmpFiles = [];
  try {
    const body = await readJsonBody(req);
    const { prompt, maskDescription } = body || {};
    const imageDataUrl = body?.image;
    const maskDataUrl = body?.mask;

    if (!imageDataUrl) return res.status(400).json({ error: "Image is required" });
    if (!prompt || String(prompt).trim().length < 2) {
      return res.status(400).json({ error: "Edit prompt is required" });
    }

    const imageB64 = splitDataUrl(imageDataUrl);
    if (!imageB64) return res.status(400).json({ error: "Invalid image dataURL" });

    const imageTmp = saveBase64Image(imageB64, `mask_image_${uuidv4()}.png`);
    tmpFiles.push(imageTmp);

    const imagePart = prepareImagePart(imageTmp);

    const model = getImageModel();

    // Case A: mask image provided (preferred)
    if (maskDataUrl) {
      const maskB64 = splitDataUrl(maskDataUrl);
      if (!maskB64) return res.status(400).json({ error: "Invalid mask dataURL" });

      const maskTmp = saveBase64Image(maskB64, `mask_mask_${uuidv4()}.png`);
      tmpFiles.push(maskTmp);

      const maskPart = prepareImagePart(maskTmp);

      const editPrompt =
        `Edit only the masked area (white area in mask) of the main image: ${prompt}. ` +
        `Keep the rest of the image unchanged.`;

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

      const parts = response?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const filename = `inpainted_${uuidv4()}.png`;
          saveBase64Image(part.inlineData.data, filename);
          images.push({ filename, url: `/outputs/${filename}`, base64: part.inlineData.data });
        } else if (part.text) {
          textResponse = part.text;
        }
      }

      cleanupFiles(tmpFiles);

      return res.json({
        success: true,
        message: textResponse || "Mask edit completed successfully",
        images,
      });
    }

    // Case B: conversational mask (maskDescription)
    if (maskDescription) {
      const editPrompt =
        `In this image, edit only the ${maskDescription}: ${prompt}. ` +
        `Keep all other parts of the image unchanged.`;

      const result = await model.generateContent([editPrompt, imagePart]);
      const response = await result.response;

      const images = [];
      let textResponse = "";

      const parts = response?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const filename = `inpainted_${uuidv4()}.png`;
          saveBase64Image(part.inlineData.data, filename);
          images.push({ filename, url: `/outputs/${filename}`, base64: part.inlineData.data });
        } else if (part.text) {
          textResponse = part.text;
        }
      }

      cleanupFiles(tmpFiles);

      return res.json({
        success: true,
        message: textResponse || "Conversational mask edit completed",
        images,
        editedArea: maskDescription,
      });
    }

    cleanupFiles(tmpFiles);
    return res.status(400).json({ error: "Either mask image or maskDescription is required" });
  } catch (error) {
    console.error("Mask Edit Error:", error);
    try { cleanupFiles(tmpFiles); } catch {}
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
