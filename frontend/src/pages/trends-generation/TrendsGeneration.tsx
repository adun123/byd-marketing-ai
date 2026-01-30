import { useEffect, useState } from "react";
import TrendsFilters from "./TrendsFilters";
import TrendsSnapshot from "./TrendsSnapshot";
import { useNavigate } from "react-router-dom";
import TopBarGenerate from "../../components/layout/TopBarGenerate";
import type { TrendsForm,TrendSnapshot ,DraftContextPayload, Sentiment, SearchTrendsResponse  } from "./types";
import ViralSnippets from "./ViralSnippets";
import { saveDraftContext, loadDraftContext, clearDraftContext } from "./utils/draftContextStorage";
import { Trash2 } from "lucide-react";
import type {  ViralSnippetItem } from "./types";



function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

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

  // default
  return "instagram";
}



function seedMetrics(level?: "high" | "medium" | "low") {
  if (level === "high") return { likes: 45000, comments: 9100, shares: 18000 };
  if (level === "medium") return { likes: 8900, comments: 320, shares: 1200 };
  return { likes: 2100, comments: 340, shares: 512 };
}

function placeholderThumb(src: ViralSnippetItem["source"]) {
  // placeholder beda biar kartu variatif
  if (src === "tiktok")
    return "https://images.unsplash.com/photo-1520975993491-2f99c0b5f2a0?auto=format&fit=crop&w=1200&q=60";
  if (src === "youtube")
    return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60";
  if (src === "linkedin")
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60";
  return "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=60";
}

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

//lama
// function mapSearchTrendsToViralItems(api: SearchTrendsResponse): ViralSnippetItem[] {
//   const list = api?.trends || [];
//   const fallbackUri = api?.grounding?.sources?.[0]?.uri; // ✅ fallback global

//   return list.slice(0, 8).map((t, idx) => {
//     const src0 = t.sources?.[0];


//     // fallback per item berdasarkan index
//     const gi = api?.grounding?.sources?.[idx]?.uri;
//     const g0 = api?.grounding?.sources?.[0]?.uri;
//     // ✅ pilih URL: prefer sources.url, fallback grounding.uri
//     const href = src0?.url || gi || g0;

//     // ✅ sumber platform: prefer src0.platform, tapi boleh deteksi dari url
//     const source = toSource(src0?.platform, href);

//     const metrics = seedMetrics(t.engagement?.estimated);

//     // ✅ judul sebaiknya topic (lebih “judul”), description bisa jadi isi kecil
//     const title =
//       t.topic?.trim() ||
//       src0?.title ||
//       "Viral snippet";

//     return {
//       id: `${t.keyTopic || "trend"}_${idx}`,
//       source,

//       // ✅ authorHandle berdasarkan host URL biar tidak hardcode
//       authorHandle: hostHandle(
//         source === "linkedin" ? "Tech Today" : "@daily_driver",
//         href
//       ),

//       title,
//       thumbUrl: placeholderThumb(source),
//       href, // ✅ sekarang hampir pasti ada (kalau grounding ada)

//       ...metrics,
//     };
//   });
// }

// ✅ OPSI 2: kalau sources kosong, fallback ke "platform search URL"
// - tetap strict (tidak pakai blog/web)
// - tetap clickable walau tidak ada post spesifik

function mapSearchTrendsToViralItems(
  api: SearchTrendsResponse,
  preferredPlatform?: string
): ViralSnippetItem[] {
  const list = api?.trends || [];

  const prefNorm =
    normalizePlatform(preferredPlatform) ??
    normalizePlatform((api as any)?.platform) ??
    "instagram";
  // "instagram-post" -> "instagram" | undefined
  const hasPref = !!prefNorm;

  const want: ViralSnippetItem["source"] | "any" = prefNorm
    ? (prefNorm as ViralSnippetItem["source"])
    : "any";

  const domainFor = (src: ViralSnippetItem["source"]) => {
    if (src === "instagram") return ["instagram.com"];
    if (src === "tiktok") return ["tiktok.com", "vt.tiktok.com", "vm.tiktok.com"];
    if (src === "youtube") return ["youtube.com", "youtu.be"];
    if (src === "linkedin") return ["linkedin.com"];
    return [];
  };

  const matchesWanted = (url?: string) => {
    if (!url) return false;
    const u = url.toLowerCase();

    if (want === "any") {
      return (
        u.includes("instagram.com") ||
        u.includes("tiktok.com") ||
        u.includes("vt.tiktok.com") ||
        u.includes("vm.tiktok.com") ||
        u.includes("youtube.com") ||
        u.includes("youtu.be") ||
        u.includes("linkedin.com")
      );
    }

    return domainFor(want).some((d) => u.includes(d));
  };

  // ✅ bikin query keyword untuk fallback search
  const keywordFromTrend = (t: any) => {
    const raw = (t?.keyTopic || t?.topic || "").toString().trim();
    // sederhana: hilangkan karakter aneh, spasi jadi +
    const cleaned = raw
      .replace(/[^\p{L}\p{N}\s_-]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || "automotive";
  };

  const buildPlatformFallbackHref = (src: ViralSnippetItem["source"], keyword: string) => {
    const q = encodeURIComponent(keyword);

    // NOTE: IG search web agak terbatas, paling masuk akal pakai hashtag/explore
    if (src === "instagram") {
      // kalau keyword ada spasi, IG hashtag tidak suka spasi → jadikan underscore
      const tag = encodeURIComponent(keyword.replace(/\s+/g, "_"));
      return `https://www.instagram.com/explore/tags/${tag}/`;
    }

    if (src === "tiktok") {
      return `https://www.tiktok.com/search?q=${q}`;
    }

    if (src === "youtube") {
      return `https://www.youtube.com/results?search_query=${q}`;
    }

    if (src === "linkedin") {
      return `https://www.linkedin.com/search/results/content/?keywords=${q}`;
    }

    return undefined;
  };

  // grounding hanya dipakai kalau multi-platform (optional)
  const fallbackUri0 = !hasPref ? (api as any)?.grounding?.sources?.[0]?.uri : undefined;

  return list.slice(0, 8).map((t, idx) => {
    const sources = Array.isArray(t.sources) ? t.sources : [];

    // ✅ pilih source URL yang match platform dulu
    const best =
      sources.find((s) => matchesWanted(s?.url)) ||
      (want === "any" ? sources[0] : undefined);

    // ✅ Jangan fallback grounding kalau user memilih platform spesifik
    const gi = !hasPref ? (api as any)?.grounding?.sources?.[idx]?.uri : undefined;

    let href = best?.url || gi || fallbackUri0;

    // ✅ kalau platform dipilih & href tidak match domain, anggap invalid
    if (!href) {
      const kw = keywordFromTrend(t);
      const fallbackSrc = (prefNorm ?? "instagram") as ViralSnippetItem["source"];
      href = buildPlatformFallbackHref(fallbackSrc, kw);
    }


    // ✅ OPSI 2: kalau tidak ada href (karena sources kosong), fallback ke platform search URL
    if (!href && prefNorm) {
      const kw = keywordFromTrend(t);
      href = buildPlatformFallbackHref(prefNorm as ViralSnippetItem["source"], kw);
    }

    // badge/icon: URL-first (lebih akurat)
   // badge/icon
    const source = toSource(undefined, href);
    const metrics = seedMetrics(t.engagement?.estimated);
    const title = t.topic?.trim() || best?.title || "Viral snippet";

    return {
      id: `${t.keyTopic || "trend"}_${idx}`,
      source,
      authorHandle: hostHandle(source === "linkedin" ? "Tech Today" : "@daily_driver", href),
      title,
      thumbUrl: placeholderThumb(source),
      href,
      ...metrics,
    };
  });
}






function normalizePlatform(p?: string) {
  const s = (p || "").toLowerCase();
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("instagram")) return "instagram";
  return undefined; // biar backend pakai default multi-platform
}


export default function TrendsGeneration( ) {
  const [form, setForm] = useState<TrendsForm>({
    platform: "instagram-post",
    contentType: "edu-ent",
    targetAudience: "genz-balanced",
    product: "",
    brand: "",
    message: "",
    query: "",
    topic: "automotive",
    language: "en",
  });


 const navigate = useNavigate();

  // snapshot state
  const [snapshot, setSnapshot] = useState<TrendSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const API_BASE = (import.meta.env.VITE_API_BASE?.trim() || "/api") as string;
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);

  const [searchTrends, setSearchTrends] = useState<SearchTrendsResponse | null>(null);

  const [viral, setViral] = useState<ViralSnippetItem[]>([]);

  const [viralLoading, setViralLoading] = useState(false);
  




  useEffect(() => {
    const saved = loadDraftContext();
    if (!saved) return;

    // restore minimal yang kamu butuhkan
    if (saved.form) setForm(saved.form);
    if (saved.snapshot) setSnapshot(saved.snapshot);
    
    // kalau kamu punya state derived, gak perlu simpan terpisah—bisa dibangun ulang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // === HANDLERS ===
async function onFetchSnapshot() {
  setSnapshotLoading(true);
  setViralLoading(true);

  try {
    const q =
      (form.product && form.product.trim()) ||
      (form.brand && form.brand.trim()) ||
      "automotive";

    const [snapRes, searchRes] = await Promise.all([
      fetch(`${API_BASE}/trends/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      fetch(`${API_BASE}/trends/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          platform: normalizePlatform(form.platform), // ✅
          topic: "automotive", // ✅ atau mapping khusus (jangan soft-campaign)
          language: "id",
        }),
      }),

    ]);

    const snapJson = await snapRes.json();
    const searchJson: SearchTrendsResponse = await searchRes.json();

    setSnapshot(snapJson);
    setSearchTrends(searchJson); // ✅ tambah ini
    setViral(mapSearchTrendsToViralItems(searchJson, form.platform));

  } catch (e) {
    console.error(e);
  } finally {
    setSnapshotLoading(false);
    setViralLoading(false);
  }
}


//loading trend
function ViralSnippetsSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 h-4 w-40 rounded bg-slate-100" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

function onUseMessage(msg: string) {
    setForm((prev) => ({ ...prev, message: msg }));
  }

function onAppendHint(hint: string) {
    setForm((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${hint}` : hint,
    }));
  }

 function buildDraftContext(): DraftContextPayload {
  const snap = snapshot;

  const baseTerms = snap
    ? [
        ...snap.trendTopics.map((t) => t.title),
        ...snap.hookPatterns.map((h) => h.pattern),
        ...snap.anglePatterns.map((a) => a.angle),
      ].filter(Boolean).slice(0, 10)
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
  selectedTerms: selectedTerms.length ? selectedTerms : baseTerms.slice(0, 5), // ✅ fallback kalau belum pilih
};

}
  useEffect(() => {
    // simpan kalau sudah ada sesuatu (biar gak nyimpen kosong)
    if (!snapshot && (!viral || viral.length === 0)) return;

    const ctx = buildDraftContext();
    saveDraftContext(ctx);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, snapshot, viral]);
  
    function onGoDraft() {
    const ctx = buildDraftContext();
    saveDraftContext(ctx); //  persist
    navigate("/draft-generator", { state: ctx }); //  route sesuai TopBar
  }


return (
  <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
    <TopBarGenerate active="trend" />

    {/* Page container */}
    <div className="mx-auto w-full max-w-7xl px-4 pb-10">
      

      {/* Content grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* LEFT FILTER */}
        <aside className="lg:sticky lg:top-[72px] lg:self-start">
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <TrendsFilters
              value={form}
              onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
              onBrainstorm={onFetchSnapshot}
              isLoading={snapshotLoading}
            />
          </div>

          {/* small helper on mobile */}
          <div className="mt-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-3 text-[11px] text-slate-600 dark:text-slate-300 lg:hidden">
            Tips: pilih platform + keywords, lalu klik <b>Refresh Trends</b>.
          </div>
        </aside>

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
                  Pilih konteks, refresh snapshot, pilih terms, lalu lanjut ke draft generator.
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
              </div>
            </div>
          </div>
          {/* Top note / status */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
                ✨
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Insight Workspace
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Snapshot → Terms → Viral → Draft. Semua context akan ikut kebawa ke Draft Generator.
                </div>
              </div>
            </div>
          </div>

          {snapshotLoading ? (
            /* LOADING SKELETON */
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ) : snapshot ? (
            /* REAL SNAPSHOT */
            <div className="space-y-4">
              <TrendsSnapshot
                data={snapshot}
                searchTrends={searchTrends} // ✅ tambah ini
                selectedTerms={selectedTerms}
                onSelectedTermsChange={setSelectedTerms}
                onUseMessage={onUseMessage}
                onAppendHint={onAppendHint}
              />


              {viralLoading ? (
                <ViralSnippetsSkeleton />
              ) : (
                <ViralSnippets items={viral} onViewAll={() => console.log("view all")} />
              )}

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
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
                  ⏳
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Trend Snapshot
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Pilih konteks di panel kiri lalu klik <b>Refresh Trends</b>.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
                  Trending terms & sentiment akan muncul di sini.
                </div>
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
                  Ringkasan insight & pola konten.
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
