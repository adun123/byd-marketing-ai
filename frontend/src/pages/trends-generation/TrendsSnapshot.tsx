import { Cloud, BarChart3 } from "lucide-react";
import type { TrendSnapshot, SearchTrendsResponse } from "./types";


/** Normalized sentiment type used across UI */
type Sentiment = "Positive" | "Negative" | "Neutral";

/** Component props */
type Props = {
  data: TrendSnapshot;
  searchTrends?: SearchTrendsResponse | null;
  selectedTerms: string[];
  onSelectedTermsChange: (next: string[]) => void;
  onUseMessage: (msg: string) => void;
  onAppendHint?: (hint: string) => void;
};

/*Utilities / Helpers*/
/**
 * Tailwind class name helper
 * Filters falsy values and joins them into a single string
 */
function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

/**
 * Toggle a term in the selected list
 * - If exists → remove
 * - If not → add
 */
function toggleTerm(list: string[], term: string) {
  return list.includes(term)
    ? list.filter((x) => x !== term)
    : [...list, term];
}

/**
 * Clamp a number between min and max (default 0–100)
 * Used for sentiment scores and progress bars
 */
function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Normalize sentiment label from API into UI-safe enum
 */
function normalizeSentiment(label?: string): Sentiment {
  const s = (label || "").toLowerCase().trim();
  if (s.includes("neg")) return "Negative";
  if (s.includes("neu") || s.includes("mix")) return "Neutral";
  if (s.includes("pos")) return "Positive";
  return "Neutral"; //  default netral, bukan positive
}


/**
 * Resolve numeric score from a trend item
 * Priority:
 * 1. scale (0..1) → percent
 * 2. sentiment numeric values
 * 3. safe fallback
 */
function scoreFromTrend(
  trend: SearchTrendsResponse["trends"][number]
): number {
  // scale (0..1) => persen
  if (typeof trend.scale === "number") {
    const s = Math.round(trend.scale * 100);
    if (s >= 5) return clamp(s); // jangan 0
  }

  const label = normalizeSentiment(trend.sentiment?.label);

  const raw =
    label === "Positive" ? trend.sentiment?.positive :
    label === "Negative" ? trend.sentiment?.negative :
    trend.sentiment?.neutral;

  if (typeof raw === "number") {
    // 0/1 itu bukan persen, itu cuma penanda
    if (raw <= 5) return 60; // tampilkan stabil
    return clamp(raw);
  }

  return 60;
}


function prettifyKeyTopic(s: string) {
  const raw = String(s || "").trim();

  // Sisip spasi: camelCase / PascalCase + angka
  const spaced = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")     // aB -> a B
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")   // ABc -> A Bc
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")        // a1 -> a 1
    .replace(/(\d)([a-zA-Z])/g, "$1 $2");       // 1a -> 1 a

  // Capitalize kata pertama doang (opsional)
  return spaced;
}


/* UI Style Helpers*/
/**
 * Pill (chip) style based on sentiment
 */
function pillClass(sentiment: Sentiment) {
  if (sentiment === "Positive") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200";
  }
  if (sentiment === "Negative") {
    return "border-rose-600/20 bg-rose-600/10 text-rose-700 dark:text-rose-200";
  }
  return "border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300";
}

/**
 * Bar color for sentiment visualization
 */
function barClass(sentiment: Sentiment) {
  if (sentiment === "Positive") return "bg-emerald-500";
  if (sentiment === "Negative") return "bg-rose-500";
  return "bg-slate-400";
}

/**
 * Font sizing for term chips (based on importance / rank)
 */
function sizeClass(index: number) {
  if (index === 0) return "text-[13px] sm:text-[14px] font-extrabold";
  if (index === 1) return "text-[12px] sm:text-[13px] font-bold";
  if (index <= 3) return "text-[12px] font-semibold";
  return "text-[12px] font-semibold";
}

/* Component
 */

export default function TrendsSnapshot({
  data,
  searchTrends,
  selectedTerms,
  onSelectedTermsChange,
}: Props) {



  /* Derived data*/

  /** Trends from API (if available) */
  const trends = searchTrends?.trends ?? [];

  /**
   * Terms list:
   * - Primary: keyTopic from search trends (NO #)
   * - Fallback: snapshot data (topics, hooks, angles)
   */
  const terms =
    trends.length > 0
      ? trends
          .map((t) => String(t.keyTopic || "").trim())
          .filter(Boolean)
          .slice(0, 10)
      : [
          ...data.trendTopics.map((t) => t.title),
          ...data.hookPatterns.map((h) => h.pattern),
          ...data.anglePatterns.map((a) => a.angle),
        ]
          .filter(Boolean)
          .slice(0, 10);

  /**
   * Map term(keyTopic) → sentiment
   * Used to color term chips consistently
   */
  const sentimentByTerm = new Map<string, Sentiment>();

  if (trends.length > 0) {
    for (const t of trends.slice(0, 10)) {
      const term = String(t.keyTopic || "").trim();
      if (!term) continue;

      // kalau label kosong, jangan otomatis positive (biar gak bias)
      const s = normalizeSentiment(t.sentiment?.label);
      sentimentByTerm.set(term, s);
    }
  } else {
    // Fallback sentiment (keeps UI alive before trends load)
    terms.forEach((t) => sentimentByTerm.set(t, "Neutral"));
  }

  /**
   * Rows for sentiment summary (top 5)
   * (ini kanan, pakai topic biar judulnya panjang/jelas)
   */
  const sentimentRows =
    trends.length > 0
      ? trends.slice(0, 5).map((t, idx) => ({
          name: String(t.topic || t.keyTopic || `Trend ${idx + 1}`),
          score: scoreFromTrend(t),
          sentiment: normalizeSentiment(t.sentiment?.label),
        }))
      : terms.slice(0, 5).map((name, idx) => ({
          name: String(name || `Trend ${idx + 1}`),
          score: clamp(80 - idx * 6),
          sentiment: "Neutral" as Sentiment,
        }));

        
      const windowLabel =
        (searchTrends as any)?.windowLabel ||
        (typeof (searchTrends as any)?.daysUsed === "number"
          ? ((searchTrends as any).daysUsed === 1 ? "24h" : `${(searchTrends as any).daysUsed}d`)
          : undefined);

      



  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* LEFT: Terms cloud */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
              <Cloud className="h-4.5 w-4.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Trending Terms
                </div>

                {windowLabel ? (
                  <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#068773]">
                    {windowLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Tap untuk pilih keyword (multi-select)
              </div>
            </div>
          </div>

          
        </div>


        {/* chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {terms.map((t, i) => {
            const sent = sentimentByTerm.get(t) ?? "Positive";
            const selected = selectedTerms.includes(t);

            return (
              <button
                type="button"
                key={t + i}
                onClick={() => onSelectedTermsChange(toggleTerm(selectedTerms, t))}
                className={cn(
                  "rounded-2xl border px-3.5 py-2 leading-none transition",
                  "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                  "hover:shadow-sm",
                  sizeClass(i),
                  pillClass(sent),
                  selected ? "ring-2 ring-[#068773]/35 border-[#068773]/30" : ""
                )}
                title="Klik untuk memilih (multi-select)"
              >
               {prettifyKeyTopic(t)}
              </button>
            );
          })}
        </div>

        {/* Selected tray */}
        <div className="mt-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] text-slate-700 dark:text-slate-200">
              Selected: <b>{selectedTerms.length}</b>
              {selectedTerms.length ? (
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  ({selectedTerms.slice(0, 4).join(", ")}
                  {selectedTerms.length > 4 ? ", …" : ""})
                </span>
              ) : null}
            </div>

            <button
              type="button"
              disabled={!selectedTerms.length}
              onClick={() => onSelectedTermsChange([])}
              className={cn(
                "text-[12px] font-semibold hover:underline",
                selectedTerms.length ? "text-rose-600" : "text-slate-400 dark:text-slate-600"
              )}
            >
              Clear
            </button>
          </div>

          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Keyword terpilih akan dibawa ke Draft Generator.
          </div>
        </div>
      </div>

      {/* RIGHT: Sentiment */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
            <BarChart3 className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Topic Sentiment
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Ringkasan sentimen keyword teratas
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {sentimentRows.map((r, idx) => {
          return (
            
            <div key={`${idx}-${r.name}`} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  <span className="mr-1">{idx + 1}.</span>
                  <span className="line-clamp-2 break-words">{r.name}</span>
                </div>


               <div className= "shrink-0 text-right min-w-[56px] tabular-nums">

                  <div
                    className={cn(
                      "text-[12px] font-bold",
                      r.sentiment === "Positive"
                        ? "text-[#068773]"
                        : r.sentiment === "Negative"
                        ? "text-rose-500"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {r.score}%
                  </div>
                  <div
                    className={cn(
                      "text-[11px] font-semibold",
                      r.sentiment === "Positive"
                        ? "text-[#068773]"
                        : r.sentiment === "Negative"
                        ? "text-rose-500"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {r.sentiment}
                  </div>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={cn("h-2 rounded-full", barClass(r.sentiment))}
                  style={{ width: `${r.score}%` }}
                />
              </div>
            </div>
          );
          })}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Avg Sentiment
          </div>
         
        </div>
      </div>
    </div>
  );
}
