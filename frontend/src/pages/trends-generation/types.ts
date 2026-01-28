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
  updatedAtLabel: string;
  trendTopics: { title: string }[];
  hookPatterns: { pattern: string }[];
  anglePatterns: { angle: string }[];
  termsCloud?: { term: string; sentiment: Sentiment; weight: number }[];
  topSentiment?: { name: string; sentiment: Sentiment; score: number }[];
};

// export type TrendSnapshot = {
//   updatedAt: string;
//   trendTopics: { title: string; whyItWorks: string; useMessage: string }[];
//   hookPatterns: { pattern: string; examples: string[]; useHookHint: string }[];
//   anglePatterns: { angle: string; howTo: string[]; useAngleHint: string }[];
//   ctaBank: string[];
//   hashtagClusters: { label: string; tags: string[] }[];
// };
// src/pages/trends-generation/types.ts

export type Sentiment = "Positive" | "Negative" | "Neutral";

export type TrendTopic = {
  title: string;
  note?: string;
};

export type HookPattern = {
  pattern: string;
};

export type AnglePattern = {
  angle: string;
};

export type TermsCloudItem = {
  term: string;
  sentiment: Sentiment;
  weight: number; // 1..10
};

export type SentimentRow = {
  name: string;
  sentiment: Sentiment;
  score: number; // 0..100
};

export type TrendSnapshot = {
  updatedAtLabel: string;

  // existing fields (biar kompatibel sama komponen kamu sekarang)
  trendTopics: TrendTopic[];
  hookPatterns: HookPattern[];
  anglePatterns: AnglePattern[];

  // OPTIONAL (kalau mau lebih “niat” mirip screenshot)
  termsCloud?: TermsCloudItem[];
  topSentiment?: SentimentRow[];
};


export type ViralSnippetSource = "tiktok" | "instagram" | "youtube" | "linkedin" | "news";

export type ViralSnippet = {
  id: string;
  source: ViralSnippetSource;
  authorHandle: string;     // @autovibe_id
  authorName?: string;      // optional
  title: string;            // caption / judul
  thumbUrl: string;         // gambar thumbnail
  href?: string;            // link asli (optional)
  likes?: number;
  comments?: number;
  shares?: number;
  publishedAt?: string;
};

export type ViralSnippetsResponse = {
  updatedAt: string;
  items: ViralSnippet[];
};



// src/pages/trends-generation/types.ts
export type DraftContextPayload = {
  form: TrendsForm;

  snapshot?: TrendSnapshot | null;

  viralSnippets?: Array<{
    id: string;
    source: string;
    authorHandle: string;
    title: string;
    thumbUrl?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    href?: string;
  }>;

  derived: {
    terms: string[];
    topSentiment: Array<{ name: string; sentiment: Sentiment; score: number }>;
  };
};
;

