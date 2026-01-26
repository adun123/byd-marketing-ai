// src/pages/marketing-dashboard/library/types.ts
export type AssetStatus = "draft" | "published" | "archived";
export type AssetType = "image" | "caption" | "video" | "email";
export type AssetPlatform = "Instagram" | "Website" | "Multi-platform" | "Meta" | "TikTok" | "YouTube";

export type AssetItem = {
  id: string;
  title: string;
  platform: AssetPlatform;
  type: AssetType;
  status: AssetStatus;
  updatedAtLabel: string; // biar simpel dulu (nanti ganti Date)
  versions: number;
};
