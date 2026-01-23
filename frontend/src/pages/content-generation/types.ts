// src/pages/content-generation/types.ts
export type GenMode = "image" | "video";
export type SceneKey = "ai_image" | "img_to_img" | "upscale";
export type ChannelKey = "shopee" | "facebook" | "instagram" | "ads" | "lazada";

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
