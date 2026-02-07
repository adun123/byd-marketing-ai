import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
// lib/uploadImage.js
import multer from "multer";
import os from "os";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const imageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
};

export const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return mimeTypes[ext] || "image/jpeg";
};

export const saveBase64Image = (base64Data, filename) => {
  // In Vercel serverless functions, we use /tmp for temporary files
  const outputDir = process.env.VERCEL ? "/tmp" : path.join(__dirname, "../outputs");

  if (!process.env.VERCEL && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, filename);
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const prepareImagePart = (filePath) => {
  return {
    inlineData: {
      data: imageToBase64(filePath),
      mimeType: getMimeType(filePath),
    },
  };
};

export const cleanupFiles = (files) => {
  if (!Array.isArray(files)) return;
  files.forEach((f) => {
    const p = typeof f === "string" ? f : (f?.path || f?.filepath);
    if (p) deleteFile(p);
  });
};


export const upscaleImage = async (inputPath, outputPath, scale = 2) => {
  const metadata = await sharp(inputPath).metadata();
  const newWidth = Math.floor(metadata.width * scale);
  const newHeight = Math.floor(metadata.height * scale);

  await sharp(inputPath)
    .resize(newWidth, newHeight, {
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .toFile(outputPath);

  return outputPath;
};

export const getImageInfo = async (filePath) => {
  const metadata = await sharp(filePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: fs.statSync(filePath).size,
  };
};





export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, os.tmpdir()), // ✅ Vercel safe
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

export const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype);
  cb(ok ? null : new Error("Only image files are allowed"), ok);
};
