// src/pages/preview-generation/types.ts
export type PreviewMeta = {
  topic: string;
  targetAudience: string;
  platformLabel: string; // contoh: "Instagram Feed (4:5)"
  formatLabel: string;   // contoh: "Carousel - 5 Slides" / "Infographic"
};

export type ValidationScore = {
  brandAlignment: number; // 0-100
  imageQuality: "LOW" | "MED" | "HIGH";
  visualSafety: "FAILED" | "PASSED";
  contrastRatio: "LOW" | "OK" | "OPTIMAL";
  breakdown: {
    composition: number; // 0-10
    lighting: number;    // 0-10
    toneConsistency: number; // 0-10
  };
};
