import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2,SlidersHorizontal  } from "lucide-react";

import TopBarGenerate from "../../components/layout/TopBarGenerate";
import TrendsFilters from "./TrendsFilters";
import TrendsSnapshot from "./TrendsSnapshot";
// import ViralSnippets from "./ViralSnippets";

import {
  clearDraftContext,
  loadDraftContext,
  saveDraftContext,
} from "./utils/draftContextStorage";

import type {
  DraftContextPayload,
  Sentiment,
  SearchTrendsResponse,
  TrendSnapshot,
  TrendsForm,
  ViralSnippetItem,
} from "./types";

/** Clamp number into [a..b] range (default 0..100). */
function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

/** Normalize platform string into strict source key. */
function normalizePlatform(p?: string) {
  const s = (p || "").toLowerCase();
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("instagram")) return "instagram";
  return undefined; // biar backend pakai default multi-platform
}

/** Derive source from platform string / url domain. */
function toSource(p?: string, url?: string): ViralSnippetItem["source"] {
  const s = (p || "").toLowerCase();
  const u = (url || "").toLowerCase();

  // 1) URL-based first (paling akurat)
  if (u.includes("tiktok.com")) return "tiktok";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("linkedin.com")) return "linkedin";
  if (u.includes("instagram.com")) return "instagram";

  // 2) fallback ke platform string dari backend
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("instagram")) return "instagram";

  return "instagram";
}

/** Create fake engagement metrics based on "estimated" level (high/medium/low). */
function seedMetrics(level?: "high" | "medium" | "low") {
  if (level === "high") return { likes: 45000, comments: 9100, shares: 18000 };
  if (level === "medium") return { likes: 8900, comments: 320, shares: 1200 };
  return { likes: 2100, comments: 340, shares: 512 };
}

/** Placeholder thumbnail URL per source, biar kartu variatif. */
function placeholderThumb(src: ViralSnippetItem["source"]) {
  if (src === "tiktok")
    return "https://images.unsplash.com/photo-1520975993491-2f99c0b5f2a0?auto=format&fit=crop&w=1200&q=60";
  if (src === "youtube")
    return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60";
  if (src === "linkedin")
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60";
  return "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=60";
}

/** Build @handle from URL hostname; fallback if invalid. */
function hostHandle(fallback: string, url?: string) {
  if (!url) return fallback;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    const name = host.split(".")[0] || "source";
    return `@${name}`;
  } catch {
    return fallback;
  }
}

/**
 * Map SearchTrendsResponse -> ViralSnippetItem[]
 * - Prefer URL yang sesuai platform pilihan user
 * - Kalau tidak ada link post spesifik, buat fallback link search/tag platform
 */
function mapSearchTrendsToViralItems(
  api: SearchTrendsResponse,
  preferredPlatform?: string
): ViralSnippetItem[] {
  const list = api?.trends || [];

  const prefNorm =
    normalizePlatform(preferredPlatform) ?? normalizePlatform(api?.platform);

  const hasPref = !!normalizePlatform(preferredPlatform); 
  // NOTE: hasPref = true hanya kalau user bener2 memilih platform di UI,
  // bukan karena api.platform kebetulan ada.

  const buildPlatformHref = (
    src: ViralSnippetItem["source"],
    keyword: string
  ) => {
    const kw = String(keyword || "").replace(/^#/, "").trim() || "trending";
    const enc = encodeURIComponent(kw);

    if (src === "instagram") {
      const tag = kw.replace(/\s+/g, "_");
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
    }
    if (src === "tiktok") {
      // tiktok lebih aman pakai hashtag query
      return `https://www.tiktok.com/search?q=${encodeURIComponent("#" + kw)}`;
    }
    if (src === "youtube") return `https://www.youtube.com/results?search_query=${enc}`;
    if (src === "linkedin")
      return `https://www.linkedin.com/search/results/content/?keywords=${enc}`;

    return undefined;
  };

  // ✅ Keyword: utamakan keyTopic (tanpa #), baru fallback lainnya
  const keywordFromTrend = (t: any) => {
    const raw =
      t?.keyTopic ||
      t?.platformHint?.query ||
      (Array.isArray(t?.hashtags) && t.hashtags[0]) ||
      t?.topic ||
      api?.query ||
      "trending";

    return String(raw)
      .replace(/[^\p{L}\p{N}\s#_-]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ✅ check domain match (biar kalau user pilih platform, linknya juga sesuai)
  const matchesPlatform = (href: string | undefined, p: string | undefined) => {
    if (!href || !p) return false;
    const u = href.toLowerCase();
    if (p === "instagram") return u.includes("instagram.com");
    if (p === "tiktok") return u.includes("tiktok.com");
    if (p === "youtube") return u.includes("youtube.com") || u.includes("youtu.be");
    if (p === "linkedin") return u.includes("linkedin.com");
    return false;
  };

  return list.slice(0, 8).map((t, idx) => {
    const kw = keywordFromTrend(t);

    // 1) ✅ prioritas: platformUrl backend kalau ada
    let href: string | undefined = t.platformUrl || undefined;

    // 2) kalau user pilih platform spesifik, kita "force" hanya jika:
    //    - href kosong, ATAU
    //    - href tidak match domain platform pilihan
    if (hasPref && prefNorm) {
      if (!href || !matchesPlatform(href, prefNorm)) {
        href = buildPlatformHref(prefNorm as ViralSnippetItem["source"], kw);
      }
    }

    // 3) fallback terakhir kalau masih kosong
    if (!href) {
      const src =
        (t.platformHint?.platform as ViralSnippetItem["source"]) ||
        (normalizePlatform(api?.platform) as ViralSnippetItem["source"]) ||
        "instagram";

      href = buildPlatformHref(src, kw);
    }

    const source = toSource(undefined, href);
    const metrics = seedMetrics(t.engagement?.estimated);

    // Title: pakai topic panjang, fallback keyTopic
    const title = String(t.topic || t.keyTopic || "Viral snippet").trim();

    return {
      id: `${t.keyTopic || "trend"}_${idx}`,
      source,
      authorHandle: hostHandle(
        source === "linkedin" ? "Tech Today" : "@daily_driver",
        href
      ),
      title,
      thumbUrl: placeholderThumb(source),
      href,
      ...metrics,
    };
  });
}




/** Parse JSON safely from fetch response, with better error messages. */
async function parseJsonSafe(res: Response) {
  const url = res.url;
  const status = res.status;
  const ct = res.headers.get("content-type") || "";

  const text = await res.text();
  if (!text) {
    const err = new Error(`Empty response body (${status}) ${url}`);
    (err as any).meta = { status, url, ct, textLen: 0 };
    throw err;
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    const err = new Error(`Non-JSON response (${status}) ${url} :: ${text.slice(0, 200)}`);
    (err as any).meta = { status, url, ct, textLen: text.length };
    throw err;
  }

  if (!res.ok) {
    const err = new Error(
      `HTTP ${status} ${url} :: ${JSON.stringify(data).slice(0, 300)}`
    );
    (err as any).meta = { status, url, ct, data };
    throw err;
  }

  return data;
}

/** Simple skeleton UI for ViralSnippets section while loading. */
// function ViralSnippetsSkeleton() {
//   return (
//     <div className="rounded-3xl border border-slate-200 bg-white p-5">
//       <div className="mb-4 h-4 w-40 rounded bg-slate-100" />
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i} className="h-48 rounded-2xl bg-slate-100" />
//         ))}
//       </div>
//     </div>
//   );
// }

export default function TrendsGeneration() {
  const navigate = useNavigate();

  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE?.trim() || "/api") as string,
    []
  );

  const [form, setForm] = useState<TrendsForm>({
    platform: "instagram-post",
    contentType: "edu-ent",
    targetAudience: "genz-balanced",
    product: "",
    brand: "",
    message: "",
    query: "",
    topic: "",
    language: "id",
  });

  const [filtersOpen, setFiltersOpen] = useState(false);


  const [snapshot, setSnapshot] = useState<TrendSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [searchTrends, setSearchTrends] = useState<SearchTrendsResponse | null>(null);

  const [viral, setViral] = useState<ViralSnippetItem[]>([]);
  const [viralLoading, setViralLoading] = useState(false);





  /** Update message field from snapshot selection. */
  function onUseMessage(msg: string) {
    setForm((prev) => ({ ...prev, message: msg }));
  }

  /** Append snapshot hint to message (with newline if existing). */
  function onAppendHint(hint: string) {
    setForm((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${hint}` : hint,
    }));
  }

  /** Build DraftContextPayload to pass into Draft Generator (route). */
  function buildDraftContext(): DraftContextPayload {
    const snap = snapshot;

    const baseTerms = snap
      ? [
          ...snap.trendTopics.map((t) => t.title),
          ...snap.hookPatterns.map((h) => h.pattern),
          ...snap.anglePatterns.map((a) => a.angle),
        ]
          .filter(Boolean)
          .slice(0, 10)
      : [];

    const fallbackSentiment = baseTerms.slice(0, 5).map((name, idx) => {
      const score = clamp(92 - idx * 9 + (idx % 2 ? -6 : 4));
      const sentiment: Sentiment =
        idx === 0 || idx === 4 ? "Negative" : idx === 2 ? "Neutral" : "Positive";
      return { name, score, sentiment };
    });

    return {
      form,
      snapshot: snap,
      derived: {
        terms: baseTerms,
        topSentiment: snap?.topSentiment?.length ? snap.topSentiment : fallbackSentiment,
      },
      selectedTerms: selectedTerms.length ? selectedTerms : baseTerms.slice(0, 5),
    };
  }

  /** Persist draft context to localStorage when meaningful state changes. */
  useEffect(() => {
    // jangan simpan kosong
    if (!snapshot && (!searchTrends || !viral || viral.length === 0)) return;


    const ctx = buildDraftContext();
    saveDraftContext(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, snapshot, viral, selectedTerms]);

  /* Fetch insights snapshot + trends search in parallel (settled). */
async function onFetchSnapshot(formOverride?: typeof form) {
  const f = formOverride ?? form;

  setSnapshotLoading(true);
  setViralLoading(true);

  try {
    const q =
      (f.query && f.query.trim()) ||
      (f.product && f.product.trim()) ||
      (f.brand && f.brand.trim()) ||
      "trending";

    const platformNorm = normalizePlatform(f.platform);

    const insightsReq = fetch(`${API_BASE}/trends/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...f,
        platform: platformNorm ?? f.platform,
      }),
    });

    const searchReq = fetch(`${API_BASE}/trends/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        platform: platformNorm,
        topic: f.topic?.trim() || undefined,
        language: f.language || "id",
      }),
    });

    const [snapSettled, searchSettled] = await Promise.allSettled([insightsReq, searchReq]);

    if (snapSettled.status === "fulfilled") {
      try {
        const snapJson = (await parseJsonSafe(snapSettled.value)) as TrendSnapshot;
        setSnapshot(snapJson);
      } catch (err) {
        console.error("INSIGHTS parse/error:", err);
      }
    } else {
      console.error("INSIGHTS fetch failed:", snapSettled.reason);
    }

    if (searchSettled.status === "fulfilled") {
      try {
        const searchJson = (await parseJsonSafe(searchSettled.value)) as SearchTrendsResponse;
        setSearchTrends(searchJson);
        setViral(mapSearchTrendsToViralItems(searchJson, f.platform)); // ✅ pakai f
      } catch (err) {
        console.error("SEARCH parse/error:", err);
      }
    } else {
      console.error("SEARCH fetch failed:", searchSettled.reason);
    }
  } catch (e) {
    console.error("onFetchSnapshot unexpected error:", e);
  } finally {
    setSnapshotLoading(false);
    setViralLoading(false);
  }
}



  /** Navigate to Draft Generator with context payload. */
  function onGoDraft() {
    const ctx = buildDraftContext();
    saveDraftContext(ctx);
    navigate("/draft-generator", { state: ctx });
  }

  /** animasi loading */
const [progress, setProgress] = useState(0);

useEffect(() => {
  if (!snapshotLoading) {
    setProgress(0);
    return;
  }

  setProgress(10);

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return prev; // stop di 90%, nunggu data asli
      return prev + Math.random() * 10;
    });
  }, 400);

  return () => clearInterval(interval);
}, [snapshotLoading]);

  /** Restore draft context (form + snapshot) from localStorage once. */
useEffect(() => {
  const saved = loadDraftContext();
  if (!saved) return;

  if (saved.form) setForm(saved.form);
  if (saved.snapshot) setSnapshot(saved.snapshot);

  // ✅ rebuild search/viral immediately with restored form
  if (saved.form) {
    onFetchSnapshot(saved.form);
  } else {
    onFetchSnapshot();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

return (
  <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
    <TopBarGenerate active="trend" />
    {/* Page container */}
    <div className="mx-auto w-full max-w-7xl px-4 pb-10">
      {/* Content grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* LEFT FILTER */}
       {/* DESKTOP FILTER */}
        <aside className="hidden lg:block lg:sticky lg:top-[72px] lg:self-start">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <TrendsFilters
              value={form}
              onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
              onBrainstorm={onFetchSnapshot}
              isLoading={snapshotLoading || viralLoading}
            />
          </div>
        </aside>

        {/* MOBILE FILTER DRAWER */}
        <div className={`lg:hidden fixed inset-0 z-50 ${filtersOpen ? "" : "pointer-events-none"}`}>
          {/* backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity ${
              filtersOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setFiltersOpen(false)}
          />

          {/* drawer */}
          <aside
            className={`absolute left-0 top-0 h-full w-[85%] max-w-sm
              bg-white dark:bg-slate-900
              shadow-xl transition-transform duration-300
              ${filtersOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/70 p-4">
              <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                Filters
              </div>

              <button
                onClick={() => setFiltersOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* content */}
            <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
              <TrendsFilters
                value={form}
                onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                onBrainstorm={() => {
                  onFetchSnapshot();
                  setFiltersOpen(false); // auto close after refresh
                }}
                isLoading={snapshotLoading || viralLoading}
              />
            </div>
          </aside>
        </div>

        


        {/* RIGHT RESULT */}
        <section className="min-w-0 space-y-4">
          {/* Header row */}
          <div className="pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Trend Generation
                </div>
                <div className="mt-1 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
                  Pilih konteks yang diinginkan, perbarui snapshot, tentukan term yang relevan, lalu lanjutkan ke Draft Generator.
                </div>

              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearDraftContext();
                    setSnapshot(null);
                    setViral([]);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  title="Hapus data draft context"
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 rounded-xl
                    border border-slate-200/80 dark:border-slate-800/80
                    bg-white dark:bg-slate-900
                    px-3 py-2 text-[12px] font-semibold
                    text-slate-700 dark:text-slate-200
                    hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

              </div>
            </div>
          </div>
          {/* Top note / status */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 14l4-4 4 3 5-6" />
                </svg>
              </div>

              {/* Content */}
              <div className="min-w-0 max-w-xl">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Insight Workspace
                </div>

                <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  
                  <span className="block mt-1">
                    Seluruh konteks yang dipilih akan disimpan dan diteruskan ke Draft Generator.
                  </span>
                </div>
              </div>

            </div>
          </div>


         {snapshotLoading ? (
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm">
    
            {/* PROGRESS BAR */}
            <div className="mb-5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#068773] to-[#0fb9a8] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Generating snapshot… {Math.floor(progress)}%
              </div>
            </div>

            {/* SKELETON CONTENT */}
            <div className="mb-4 flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 animate-pulse">
              <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ) : snapshot ? (

            /* REAL SNAPSHOT */
            <div className="space-y-4">
              <TrendsSnapshot
                data={snapshot}
                searchTrends={searchTrends} // tambah ini
                selectedTerms={selectedTerms}
                onSelectedTermsChange={setSelectedTerms}
                onUseMessage={onUseMessage}
                onAppendHint={onAppendHint}
              />


              {/* {viralLoading ? (
                <ViralSnippetsSkeleton />
              ) : (
                <ViralSnippets items={viral} onViewAll={() => console.log("view all")} />
              )} */}

              {/* sticky-ish CTA card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[12px] text-slate-600 dark:text-slate-300">
                    Generate draft dari <b>Terms</b>, <b>Sentiment</b>, dan <b>Viral Snippets</b>.
                  </div>

                  <button
                    type="button"
                    onClick={onGoDraft}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-4 py-2 text-[12px] font-semibold text-white shadow-sm ring-1 ring-[#068773]/25 hover:brightness-105 active:brightness-95"
                  >
                    Generate Draft
                    <span className="text-base">→</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY STATE */
            
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M21 15a4 4 0 0 1-4 4H7a4 4 0 0 1 0-8h1" />
                  <path d="M16 8a4 4 0 0 0-8 0" />
                </svg>
              </div>

              {/* Header */}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Ringkasan Tren
                </div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Pilih konteks dari panel kiri, lalu klik {" "}
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                     Perbarui Tren
                  </span>{" "}
                   untuk memuat insight terbaru.
                </div>
              </div>
            </div>

            {/* Placeholders */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
               Data tren, kata kunci, dan analisis sentimen akan ditampilkan di sini.
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
                Ringkasan insight dan pola konten yang sedang berkembang akan dihasilkan di sini.
              </div>
            </div>
          </div>

          )}
        </section>
      </div>
    </div>
  </div>
);
}
