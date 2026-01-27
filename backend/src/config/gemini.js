import { GoogleGenerativeAI } from "@google/generative-ai";
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION || "us-central1", 
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const isProd = process.env.NODE_ENV === "production";

export const getImageModel = () => {
  return genAI.getGenerativeModel({
    model: isProd ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    },
  });
};

export const getVisionModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
  });
};

export const getVideoModel = () => {
  return vertexAI.preview.getGenerativeModel({
    model: "veo-3.1-generate-preview",
  });
};

export const getTextModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
};

export const getGroundedModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  });
};

export const checkGeminiHealth = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: isProd ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image" });
    const result = await model.generateContent("Say OK");
    const response = await result.response;
    return {
      status: "ok",
      model: isProd ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image",
      apiKeySet: !!process.env.GEMINI_API_KEY,
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
      apiKeySet: !!process.env.GEMINI_API_KEY,
    };
  }
};

export default genAI;
