import { Cloud, BarChart3 } from "lucide-react";
import type { TrendSnapshot } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}
type Props = {
  data: TrendSnapshot;
  onUseMessage: (msg: string) => void;
  onAppendHint?: (hint: string) => void;
};

type Sentiment = "Positive" | "Negative" | "Neutral";

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function pillClass(sent: Sentiment) {
  if (sent === "Positive") return "border-emerald-600/20 bg-emerald-600/10 text-emerald-800";
  if (sent === "Negative") return "border-rose-600/20 bg-rose-600/10 text-rose-700";
  return "border-slate-200/70 bg-slate-50 text-slate-600";
}

function barClass(sent: Sentiment) {
  if (sent === "Positive") return "bg-emerald-600";
  if (sent === "Negative") return "bg-rose-500";
  return "bg-slate-400";
}

/** --- terms cloud sizing --- */
function sizeClass(i: number) {
  if (i === 0) return "text-[18px] sm:text-[12px] font-extrabold";
  if (i === 1) return "text-[15px] sm:text-[14px] font-bold";
  if (i <= 3) return "text-[13px] font-semibold";
  return "text-[14px] font-semibold";
}

export default function TrendsSnapshot({ data }: Props) {
  // --- Build “terms cloud” from existing snapshot fields (fallback) ---
  const baseTerms = [
    ...data.trendTopics.map((t) => t.title),
    ...data.hookPatterns.map((h) => h.pattern),
    ...data.anglePatterns.map((a) => a.angle),
  ]
    .filter(Boolean)
    .slice(0, 10);

  // add a bit of variety
  const terms = (baseTerms.length ? baseTerms : ["Viral Hook", "Eco-Drive", "Charging Hub", "Range Anxiety"]).slice(0, 10);

  // --- Build sentiment list (fallback mock) ---
  const sentimentRows = terms.slice(0, 5).map((name, idx) => {
    const score = clamp(92 - idx * 9 + (idx % 2 ? -6 : 4)); // just to look realistic
    const sentiment: Sentiment =
      idx === 0 || idx === 4 ? "Negative" : idx === 2 ? "Neutral" : "Positive";
    return { name, score, sentiment };
  });

  const avg = Math.round(
    sentimentRows.reduce((acc, r) => acc + r.score, 0) / sentimentRows.length
  );
  

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* LEFT: Terms cloud */}
      <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.25)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Trending Terms Cloud</div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Highlight keyword yang sedang naik
              </div>
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-emerald-600/15 bg-emerald-600/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Primary Visual
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {terms.map((t, i) => {
            const sent: Sentiment =
              i === 1 || i === 5 ? "Negative" : i === 6 ? "Neutral" : "Positive";

            return (
              <span
                key={t + i}
                className={cn(
                  "rounded-2xl border px-4 py-2 leading-none",
                  sizeClass(i),
                  pillClass(sent)
                )}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Sentiment */}
      <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.25)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">Top 5 Topic Sentiment</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Ringkasan sentimen keyword teratas
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {sentimentRows.map((r, idx) => (
            <div key={r.name} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-semibold text-slate-900">
                  {idx + 1}. {r.name}
                </div>

                <div className="text-right">
                  <div
                    className={cn(
                      "text-[12px] font-bold",
                      r.sentiment === "Positive"
                        ? "text-emerald-700"
                        : r.sentiment === "Negative"
                        ? "text-rose-600"
                        : "text-slate-500"
                    )}
                  >
                    {r.score}%
                  </div>
                  <div
                    className={cn(
                      "text-[11px] font-semibold",
                      r.sentiment === "Positive"
                        ? "text-emerald-700"
                        : r.sentiment === "Negative"
                        ? "text-rose-600"
                        : "text-slate-500"
                    )}
                  >
                    {r.sentiment}
                  </div>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={cn("h-2 rounded-full", barClass(r.sentiment))}
                  style={{ width: `${r.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Avg. Sentiment
          </div>
          <div className="text-2xl font-extrabold tracking-tight text-emerald-700">
            {avg}
          </div>
        </div>
      </div>
    </div>
  );
}
