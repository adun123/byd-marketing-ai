import { Flame, Lightbulb, Sparkles, Tag, Copy } from "lucide-react";
import type { TrendSnapshot } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  data: TrendSnapshot;
  onUseMessage: (msg: string) => void;
  onAppendHint?: (hint: string) => void;
};

export default function TrendsSnapshot({ data, onUseMessage, onAppendHint }: Props) {
  const updated = new Date(data.updatedAt);
  const updatedLabel = isNaN(updated.getTime())
    ? "Updated recently"
    : `Updated ${updated.toLocaleString()}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E6F4F1]">
              <Flame className="h-5 w-5 text-[#068773]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Trend Snapshot
              </div>
              <div className="mt-1 text-xs text-slate-500">{updatedLabel}</div>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-500">
            Klik “Use” untuk prefill prompt
          </div>
        </div>
      </div>

      {/* Trend Topics */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Lightbulb className="h-4 w-4" />
          Top Trend Topics
        </div>

        <div className="space-y-3">
          {data.trendTopics.map((t, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {t.title}
                  </div>
                  <div className="mt-2 text-[12px] leading-relaxed text-slate-600">
                    {t.whyItWorks}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUseMessage(t.useMessage)}
                  className={cn(
                    "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5",
                    "text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Use
                </button>
              </div>

              {t.useMessage ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-[12px] text-slate-700">
                  {t.useMessage}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Hook patterns */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="h-4 w-4" />
          Winning Hook Patterns
        </div>

        <div className="space-y-3">
          {data.hookPatterns.map((h, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{h.pattern}</div>
                  {h.examples?.length ? (
                    <ul className="mt-2 space-y-1 text-[12px] text-slate-600">
                      {h.examples.slice(0, 2).map((ex, i) => (
                        <li key={i}>• {ex}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {h.useHookHint ? (
                  <button
                    type="button"
                    onClick={() => onAppendHint?.(h.useHookHint)}
                    className={cn(
                      "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5",
                      "text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    Apply
                  </button>
                ) : null}
              </div>

              {h.useHookHint ? (
                <div className="mt-3 text-[12px] text-slate-600">
                  <span className="font-semibold text-slate-700">Hint:</span> {h.useHookHint}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Angle patterns */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="h-4 w-4" />
          Popular Content Angles
        </div>

        <div className="space-y-3">
          {data.anglePatterns.map((a, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{a.angle}</div>
                  {a.howTo?.length ? (
                    <ol className="mt-2 space-y-1 text-[12px] text-slate-600">
                      {a.howTo.slice(0, 4).map((s, i) => (
                        <li key={i}>{i + 1}. {s}</li>
                      ))}
                    </ol>
                  ) : null}
                </div>

                {a.useAngleHint ? (
                  <button
                    type="button"
                    onClick={() => onAppendHint?.(a.useAngleHint)}
                    className={cn(
                      "shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5",
                      "text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    Use
                  </button>
                ) : null}
              </div>

              {a.useAngleHint ? (
                <div className="mt-3 text-[12px] text-slate-600">
                  <span className="font-semibold text-slate-700">Angle hint:</span> {a.useAngleHint}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* CTA + Hashtags */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Sparkles className="h-4 w-4" />
            CTA Bank
          </div>
          <ul className="space-y-2 text-[12px] text-slate-700">
            {data.ctaBank.slice(0, 6).map((c, idx) => (
              <li key={idx} className="rounded-xl bg-slate-50 p-3">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Tag className="h-4 w-4" />
            Hashtag Clusters
          </div>

          <div className="space-y-3">
            {data.hashtagClusters.map((c, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 text-xs font-semibold text-slate-700">{c.label}</div>
                <div className="flex flex-wrap gap-2">
                  {c.tags.slice(0, 10).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={async () => {
              const all = data.hashtagClusters.flatMap((c) => c.tags).join(" ");
              try {
                await navigator.clipboard.writeText(all);
              } catch {}
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" />
            Copy all hashtags
          </button>
        </div>
      </div>
    </div>
  );
}
