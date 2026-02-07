export type GenerateContentResponse = {
  success: boolean;

  draftId?: string;
  topic?: string;

  headlines?: Array<{
    text: string;
    type?: "high-clickrate" | "trendy" | "direct" | "emotional" | "question" | string;
    hook?: string;
  }>;

  storyline?: {
    slides?: Array<{
      slideNumber: number;
      title: string;
      content: string;
      duration?: string;
      visualCue?: string;
    }>;
  };

  visualDescription?: {
    photo?: { prompt?: string; style?: string; aspectRatio?: string };
    video?: { prompt?: string; style?: string; duration?: string; onGenerate?: string };
  };

  hashtags?: string[];
  callToAction?: string;
  bestPostingTime?: string;

  config?: {
    targetAudience?: string;
    toneOfVoice?: string;
    targetKeywords?: string;
    slideCount?: number;
  };

  generatedAt?: string;

  // kalau parse gagal dari backend kadang ada ini
  raw?: string;
  error?: string;
};
