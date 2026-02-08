// src/pages/content-generation/types.ts
export type GenMode = "image" | "video";
export type SceneKey = "ai_image" | "img_to_img" | "upscale";
export type ChannelKey = "shopee" | "facebook" | "instagram" | "ads" | "lazada";
export type PromptSource = "manual" | "draft"; 
export type SceneItem = {
  key: SceneKey;
  title: string;
  desc: string;
  emoji: string;
};

export type ChannelItem = {
  key: ChannelKey;
  label: string;
};

export type GeneratedOutputKind =
  | "text_to_image"
  | "image_to_image"
  | "upscale"
  | "edit";

export type GeneratedOutput = {
  id: string;
  prompt: string;
  createdAt: number;
  imageUrl?: string;
  base64?: string;
  kind?: GeneratedOutputKind;

   // ✅ baru
  promptSource?: PromptSource;
  manualPrompt?: string; // optional: kalau mau simpan manual terpisah
  draftPrompt?: string;  // optional: kalau mau simpan draft terpisah
};

export type VideoAttachment = {
  id: string;
  file: File;
  preview: string;
};

export type VideoOutput = {
  id: string;
  prompt: string;
  createdAt: number;
  status?: "processing" | "done" | "failed";
  videoUrl?: string;
  posterUrl?: string;
  error?: string;
};


export type FinalizeContentPayload = {
  from: "draft";
  draftId?: string;
  topic?: string;

  imagePrompt: string; // wajib

  //  untuk preview (narasi)
  scriptPreview?: string; // atau scriptHtml?: string

  style?: string;
  aspectRatio?: string;
  brand?: string;
  // ✅ add
  targetAudience?: string;
};

export type ImgAttachment = {
  id: string;
  file: File;
  previewUrl: string;
};


