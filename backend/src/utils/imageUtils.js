import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

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
  const outputDir = path.join(__dirname, "../../outputs");
  if (!fs.existsSync(outputDir)) {
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
  if (Array.isArray(files)) {
    files.forEach((file) => deleteFile(file.path));
  } else if (files) {
    Object.values(files).forEach((fileArray) => {
      fileArray.forEach((file) => deleteFile(file.path));
    });
  }
};

export const upscaleImage = async (inputPath, targetWidth, targetHeight, quality = 90) => {
  const outputDir = path.join(__dirname, "../../outputs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `upscaled_${Date.now()}.png`;
  const outputPath = path.join(outputDir, filename);

  await sharp(inputPath)
    .resize(targetWidth, targetHeight, {
      kernel: sharp.kernel.lanczos3,
      fit: "fill",
    })
    .sharpen()
    .png({ quality })
    .toFile(outputPath);

  const base64 = fs.readFileSync(outputPath).toString("base64");

  return {
    filename,
    path: outputPath,
    url: `/outputs/${filename}`,
    base64,
  };
};

export const getImageInfo = async (filePath) => {
  const metadata = await sharp(filePath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
  };
};
