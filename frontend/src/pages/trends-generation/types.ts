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
  
  platform: string;
  contentType: string;
  targetAudience: string;
  product: string;
  brand: string;
  message: string;

  // NEW (optional biar gak ngerusak flow lama)
  query?: string;
  topic?: "general" | "automotive" | "ev" | "technology" | "lifestyle";
  language?: "en" | "id";
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

  derived: {
    terms: string[];
    topSentiment: Array<{ name: string; sentiment: Sentiment; score: number }>;
  };

  selectedTerms: string[]; // yang dipilih user
};


export type GroundingSource = { title?: string; uri?: string };

// trends-generation/types.ts
export type SearchTrendsResponse = {
  success: boolean;
  query: string;

  // ✅ tambah ini (sesuai response backend kamu)
  grounding?: {
    searchQueries?: string[];
    sources?: Array<{ title?: string; uri?: string }>;
  } | null;

  trends: Array<{
    topic: string;
    keyTopic?: string;
    scale?: number;
    description?: string;
    category?: string;
    sentiment?: {
      positive?: number;
      negative?: number;
      neutral?: number;
      label?: "positive" | "negative" | "neutral";
    };
    sources?: Array<{ title: string; url: string; platform?: string }>;
    engagement?: { estimated?: "high" | "medium" | "low"; reason?: string };
  }>;
};



export type SearchTrendSource = {
  title: string;
  url: string;
  platform: "instagram" | "tiktok" | "youtube" | "linkedin" | string;
};

export type SearchTrend = {
  topic: string;
  keyTopic?: string;
  description?: string;
  sentiment?: { label?: string };
  sources?: SearchTrendSource[];
  engagement?: { estimated?: "high" | "medium" | "low" };
};



export type ViralSnippetItem = {
  id: string;
  source: "instagram" | "tiktok" | "youtube" | "linkedin";
  authorHandle: string;
  title: string;
  thumbUrl: string;
  href?: string;
  
  likes: number;
  comments: number;
  shares: number;
};



