// src/pages/trends-generation/types.ts
export type Platform =
  | "tiktok-reels"
  | "youtube-shorts"
  | "instagram-post"
  | "linkedin";

export type ContentType = "edu-ent" | "soft-campaign";

export type TargetAudience =
  | "genz-balanced"
  | "genz-emotional"
  | "genalpha-balanced"
  | "genalpha-emotional";

export type TrendsForm = {
  platform: Platform;
  contentType: ContentType;
  targetAudience: TargetAudience;
  product?: string;
  brand?: string;
  message?: string;
};

export type TrendsIdeas = {
  hooks: string[];
  visualBriefs?: string[];
  angles: string[];
  angleHowTos?: string[][];
  captions: string[];
  ctas: string[];
  hashtags: string[];
};

export type TrendSnapshot = {
  updatedAt: string;
  trendTopics: { title: string; whyItWorks: string; useMessage: string }[];
  hookPatterns: { pattern: string; examples: string[]; useHookHint: string }[];
  anglePatterns: { angle: string; howTo: string[]; useAngleHint: string }[];
  ctaBank: string[];
  hashtagClusters: { label: string; tags: string[] }[];
};
