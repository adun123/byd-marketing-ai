// src/pages/marketing-dashboard/playground/types.ts
export type StudioTone = "corporate" | "friendly" | "bold";
export type StudioObjective = "awareness" | "conversion" | "retention";

export type StudioPlatform = "Instagram" | "TikTok" | "YouTube" | "Email" | "X";

export type StudioBrief = {
  campaignName: string;
  objective: StudioObjective;
  product: string;
  offer: string;
  audience: string;
  tone: StudioTone;
  platforms: StudioPlatform[];
  brandNotes: string;
};

export type StudioOutput = {
  hooks: string[];
  angles: string[];
  captions: { short: string; medium: string; long: string };
  ctas: string[];
  hashtags: string[];
};

export type PinnedItem = {
  id: string;
  group: "Hook" | "Angle" | "CTA" | "Hashtag" | "Caption";
  text: string;
};
