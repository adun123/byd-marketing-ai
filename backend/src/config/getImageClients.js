import { GoogleGenAI } from "@google/genai";

const isProd = process.env.NODE_ENV === "production";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// model image (jangan pakai -preview untuk production)
export const IMAGE_MODEL = isProd
  ? "gemini-3-pro-image"
  : "gemini-2.5-flash-image";
