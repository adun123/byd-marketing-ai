import { Cloud, BarChart3 } from "lucide-react";
import type { TrendSnapshot } from "./types";
import type { SearchTrendsResponse } from "./types";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  data: TrendSnapshot;
  searchTrends?: SearchTrendsResponse | null;
  selectedTerms: string[];
  onSelectedTermsChange: (next: string[]) => void;
  onUseMessage: (msg: string) => void;
  onAppendHint?: (hint: string) => void;
};

function toggleTerm(list: string[], t: string) {
  return list.includes(t) ? list.filter((x) => x !== t) : [...list, t];
}

type Sentiment = "Positive" | "Negative" | "Neutral";

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function pillClass(sent: Sentiment) {
  if (sent === "Positive") return "border-[#068773]/20 bg-[#068773]/10 text-[#056d5c] dark:text-emerald-200";
  if (sent === "Negative") return "border-rose-600/20 bg-rose-600/10 text-rose-700 dark:text-rose-200";
  return "border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300";
}

function barClass(sent: Sentiment) {
  if (sent === "Positive") return "bg-[#068773]";
  if (sent === "Negative") return "bg-rose-500";
  return "bg-slate-400";
}

/** terms chip sizing (lebih rapi + konsisten) */
function sizeClass(i: number) {
  if (i === 0) return "text-[13px] sm:text-[14px] font-extrabold";
  if (i === 1) return "text-[12px] sm:text-[13px] font-bold";
  if (i <= 3) return "text-[12px] font-semibold";
  return "text-[12px] font-semibold";
}

export default function TrendsSnapshot({
  data,
  searchTrends,
  selectedTerms,
  onSelectedTermsChange,
}: Props) {
  const baseTerms = [
    ...data.trendTopics.map((t) => t.title),
    ...data.hookPatterns.map((h) => h.pattern),
    ...data.anglePatterns.map((a) => a.angle),
  ]
    .filter(Boolean)
    .slice(0, 10);

  
  type Sentiment = "Positive" | "Negative" | "Neutral";

function normLabel(l?: string): Sentiment {
  const s = (l || "").toLowerCase();
  if (s === "negative") return "Negative";
  if (s === "neutral") return "Neutral";
  return "Positive";
}

function scoreFromTrend(t: SearchTrendsResponse["trends"][number]) {
  // prioritas: scale (0..1) -> persen
  if (typeof t.scale === "number") return clamp(Math.round(t.scale * 100));

  // fallback: pakai angka sentiment kalau ada
  const label = normLabel(t.sentiment?.label);
  if (label === "Positive" && typeof t.sentiment?.positive === "number") return clamp(t.sentiment.positive);
  if (label === "Negative" && typeof t.sentiment?.negative === "number") return clamp(t.sentiment.negative);
  if (label === "Neutral" && typeof t.sentiment?.neutral === "number") return clamp(t.sentiment.neutral);

  return 60; // fallback aman
}

const trends = searchTrends?.trends || [];

// TERMS dari searchTrends (utama). Kalau belum ada, fallback ke insights seperti sebelumnya.
const terms =
  trends.length > 0
    ? trends
        .map((t) => (t.keyTopic?.trim() ? t.keyTopic.trim() : t.topic?.trim()))
        .filter(Boolean)
        .slice(0, 10) as string[]
    : [
        ...data.trendTopics.map((t) => t.title),
        ...data.hookPatterns.map((h) => h.pattern),
        ...data.anglePatterns.map((a) => a.angle),
      ]
        .filter(Boolean)
        .slice(0, 10);

// sentimentByTerm: kalau ada searchTrends, pakai label per trend
const sentimentByTerm = new Map<string, Sentiment>();

if (trends.length > 0) {
  for (const t of trends.slice(0, 10)) {
    const term = (t.keyTopic?.trim() ? t.keyTopic.trim() : t.topic?.trim()) || "";
    if (!term) continue;
    sentimentByTerm.set(term, normLabel(t.sentiment?.label));
  }
} else {
  // fallback kalau belum ada searchTrends (biar UI tetap jalan)
  terms.forEach((t) => sentimentByTerm.set(t, "Positive"));
}

// sentimentRows top 5: dari trends (utama), kalau tidak ada trends pakai terms saja (tapi labelnya default)
const sentimentRows =
  trends.length > 0
    ? trends.slice(0, 5).map((t) => {
        const name = t.topic;
        const sentiment = normLabel(t.sentiment?.label);
        const score = scoreFromTrend(t);
        return { name, score, sentiment };
      })
    : terms.slice(0, 5).map((name, idx) => ({
        name,
        score: clamp(80 - idx * 6),
        sentiment: "Positive" as Sentiment,
      }));


 

  
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* LEFT: Terms cloud */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
              <Cloud className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Trending Terms
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Tap untuk pilih keyword (multi-select)
              </div>
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#068773]">
            Snapshot
          </span>
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
                {t}
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
          {sentimentRows.map((r, idx) => (
            <div key={r.name} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {idx + 1}. {r.name}
                </div>

                <div className="text-right">
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
          ))}
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
