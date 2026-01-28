import { useMemo, useState } from "react";
import type { DraftContextPayload } from "../trends-generation/types";
import { clearDraftContext } from "../trends-generation/utils/draftContextStorage";
import { Trash2, ExternalLink } from "lucide-react";


function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type SourceMode = "trend" | "manual";

export default function OptionDraftFilter({ draftCtx }: { draftCtx: DraftContextPayload | null }) {

  const [sourceMode, setSourceMode] = useState<SourceMode>("trend");
  const [topic, setTopic] = useState("");

  const [audiences, setAudiences] = useState<string[]>(["SUV Buyers"]);
  const [audienceCustom, setAudienceCustom] = useState("");

  const [tone, setTone] = useState("Professional & Authoritative");
  const [keywords, setKeywords] = useState("");

  const [slides, setSlides] = useState(8);

  const presetAudiences = useMemo(
    () => ["SUV Buyers", "Gen Z", "Car Enthusiasts", "Luxury"],
    []
  );

  function toggleAudience(a: string) {
    setAudiences((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function addCustomAudience() {
    const v = audienceCustom.trim();
    if (!v) return;
    setAudiences((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setAudienceCustom("");
  }

  return (
    <aside className="w-full overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.25)]">
      <div className="p-5">
        {/* Title */}
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Configuration
        </div>

        <div className="mt-5 space-y-6">
          {/* SOURCE */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                    ⛁
                  </span>
                  Source
                </div>

                {sourceMode === "trend" && (
                  <button
                    type="button"
                    onClick={() => {
                      clearDraftContext();
                      // optional: kamu bisa juga reset UI lokal kalau mau
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    title="Hapus imported context"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                    Clear
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-1">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setSourceMode("trend")}
                    className={cn(
                      "rounded-xl px-3 py-2 text-xs font-semibold transition",
                      sourceMode === "trend"
                        ? "bg-white text-emerald-700 shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                        : "text-slate-600 hover:bg-white/60"
                    )}
                  >
                    Trend Insight
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode("manual")}
                    className={cn(
                      "rounded-xl px-3 py-2 text-xs font-semibold transition",
                      sourceMode === "manual"
                        ? "bg-white text-emerald-700 shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                        : "text-slate-600 hover:bg-white/60"
                    )}
                  >
                    Manual Input
                  </button>
                </div>
              </div>

              {/*  TREND PREVIEW */}
              {sourceMode === "trend" ? (
                <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white p-3">
                  {!draftCtx ? (
                    <div className="text-[12px] text-slate-600">
                      Belum ada data dari Trend Insight. Balik ke tab <b>Trend Insight</b> lalu klik{" "}
                      <b>Generate Draft</b>.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-[12px] font-semibold text-slate-900">
                          Imported from Trend Tool 1
                        </div>
                        <a
                          href="/trends"
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 hover:underline"
                          title="Edit selection di Trend Insight"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Edit
                        </a>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-500">Terms</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(draftCtx.derived?.terms || []).slice(0, 8).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-emerald-600/15 bg-emerald-600/10 px-3 py-1 text-[11px] font-semibold text-emerald-800"
                            >
                              {t}
                            </span>
                          ))}
                          {(draftCtx.derived?.terms || []).length > 8 && (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                              +{(draftCtx.derived.terms.length || 0) - 8} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-500">Top Sentiment</div>
                        <div className="mt-2 space-y-2">
                          {(draftCtx.derived?.topSentiment || []).slice(0, 3).map((s) => (
                            <div
                              key={s.name}
                              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
                            >
                              <div className="text-[12px] font-semibold text-slate-900">{s.name}</div>
                              <div className="text-[11px] font-bold text-slate-700">
                                {s.score}% • {s.sentiment}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[12px] text-slate-600">
                        Viral snippets: <b>{draftCtx.viralSnippets?.length || 0}</b>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /*  MANUAL INPUT */
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Tulis ide mentah / topik yang ingin dibuatkan draft..."
                  rows={4}
                  className={cn(
                    "mt-3 w-full rounded-2xl border border-slate-200/70 bg-white p-3 text-sm text-slate-900",
                    "outline-none transition focus:border-emerald-600/25 focus:ring-2 focus:ring-emerald-600/10"
                  )}
                />
              )}
            </div>

        </div>
      </div>
    </aside>
  );
}
