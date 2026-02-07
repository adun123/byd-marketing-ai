// src/pages/trends-generation/types.ts

/** ---------- Form / Filters ---------- */

export type Platform =
  | "tiktok"
  | "youtube"
  | "instagram"
  | "linkedin";

export type ContentType = "edu-ent" | "soft-campaign";

export type TargetAudience =
  | "genz-balanced"
  | "genz-emotional"
  | "genalpha-balanced"
  | "genalpha-emotional";

export type TopicPreset =
  | "General"
  | "Automotive"
  | "Ev"
  | "Technology"
  | "Lifestyle";

export const TOPIC_PRESETS: TopicPreset[] = [
  "General",
  "Automotive",
  "Ev",
  "Technology",
  "Lifestyle",
];

/**
 * topic: string supaya user bisa pilih preset atau ketik custom.
 * Saran: kalau mau "wajib user pilih", defaultkan topic: "" di state.
 */
export type TrendsForm = {
  platform: Platform | string;     // string supaya fleksibel (kalau masih pakai -reels/-shorts)
  contentType: ContentType | string;
  targetAudience: TargetAudience | string;

  product: string;
  brand: string;
  message: string;

  query?: string;
  topic?: string;                  // preset/custom
  language?: "en" | "id";
};

/** ---------- Snapshot (insights) ---------- */

export type Sentiment = "Positive" | "Negative" | "Neutral";

export type TrendTopic = { title: string; note?: string };
export type HookPattern = { pattern: string };
export type AnglePattern = { angle: string };

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
  trendTopics: TrendTopic[];
  hookPatterns: HookPattern[];
  anglePatterns: AnglePattern[];
  termsCloud?: TermsCloudItem[];
  topSentiment?: SentimentRow[];
};

/** ---------- Trends Search (backend result) ---------- */

export type GroundingSource = {
  title?: string;
  uri?: string;
  url?: string;
  href?: string;
};

export type EvidenceItem = {
  title?: string;
  url?: string;
  publishedAt?: string | null; // kadang null
};

export type SearchTrend = {
  topic: string;
  keyTopic: string;
  scale?: number;

  hashtags?: string[]; // (tanpa #) boleh kosong

  sentiment?: {
    positive?: number;
    negative?: number;
    neutral?: number;
    label?: string; // "positive"|"neutral"|"negative"
  };

  engagement?: {
    estimated?: "high" | "medium" | "low";
    reason?: string;
  };

  // NEW: backend terbaru
  platform?: "instagram" | "tiktok" | "youtube" | "linkedin" | "all";
  observedAt?: string;

  evidence?: EvidenceItem[]; // ✅ penting buat “beneran viral” (ada URL bukti)

  // legacy sources (kalau masih ada)
  sources?: Array<{
    title?: string;
    url?: string;
    platform?: string;
  }>;

  platformHint?: {
    platform?: "instagram" | "tiktok" | "youtube" | "linkedin";
    query?: string;
  };

  platformUrl?: string;

  description?: string;
  category?: string;
};


export type SearchTrendsResponse = {
  success: boolean;
  query: string;
  platform?: string;
  topic?: string;
  language?: string;

  searchedAt?: string;
  summary?: string;
  totalFound?: number;

  grounding?:
    | {
        searchQueries?: string[];
        sources?: GroundingSource[];
      }
    | null;

  trends: SearchTrend[];
};


/** ---------- Viral items (untuk UI card) ---------- */

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

/** ---------- Draft handoff ---------- */

export type DraftContextPayload = {
  form: TrendsForm;
  snapshot?: TrendSnapshot | null;

  // ✅ add
  searchTrends?: SearchTrendsResponse | null;
  viral?: ViralSnippetItem[]; // sesuaikan tipe kamu (yang dipakai UI)

  derived: {
    terms: string[];
    topSentiment: Array<{ name: string; sentiment: Sentiment; score: number }>;
  };
  selectedTerms: string[];
};


/** ---------- Output ideas (kalau masih dipakai) ---------- */

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
