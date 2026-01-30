// src/pages/draft-generation/OptionDraftFilter.tsx
import { useEffect, useMemo, useState } from "react";
import { ExternalLink,  SlidersHorizontal, Sparkles } from "lucide-react";
import type { DraftContextPayload } from "../trends-generation/types";
import TagInput from "../../components/ui/TagInput";
import TargetAudienceSection from "./components/TargetAudienceSection";
import ToneOfVoiceSection from "./components/ToneOfVoiceSection";
import TargetKeywordsSection from "./components/TargetKeywordsSection";
import SlideCountSection from "./components/SlideCountSection";
import LanguageSection from "./components/LanguageSection";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type SourceMode = "trend" | "manual";

type Props = {
  draftCtx?: DraftContextPayload | null;
  onChangeConfig?: (v: {
    sourceMode: SourceMode;
    terms: string[];
    topicManual: string;
    audiences: string[];
    tone: string;
    keywords: string;
    slides: number;
    language: "id" | "en";
    
  }) => void;
  onGenerate?: () => void;
    isGenerating?: boolean;
};







export default function OptionDraftFilter({ draftCtx = null, onChangeConfig, onGenerate, isGenerating = false,  }: Props) {
  const [sourceMode, setSourceMode] = useState<SourceMode>("trend");

  // --- terms dari trend insight (yang sudah dipilih) ---
  const initialTerms = useMemo(() => {
    const selected = draftCtx?.selectedTerms?.length ? draftCtx.selectedTerms : null;
    const fallback = draftCtx?.derived?.terms?.length ? draftCtx.derived.terms : [];
    return (selected ?? fallback).slice(0, 12);
  }, [draftCtx]);

  const [terms, setTerms] = useState<string[]>(initialTerms);

  // manual topic (kalau sourceMode manual)
  const [topicManual, setTopicManual] = useState("");

  // target audience chips
  const presetAudiences = useMemo(
    () => ["SUV Buyers", "Gen Z", "Car Enthusiasts", "Luxury"],
    []
  );
  const [audiences, setAudiences] = useState<string[]>(["SUV Buyers"]);
  const [audienceCustom, setAudienceCustom] = useState("");
 
  // tone
  const [tone, setTone] = useState("Professional & Authoritative");

  // keywords
  const [keywords, setKeywords] = useState("");

  // slide count
  const [slides, setSlides] = useState(8);
  
 
  //tombol
  const canGenerate =
  sourceMode === "trend"
    ? terms.length > 0
    : topicManual.trim().length > 0;


  // language (opsional tapi bagus buat API kamu)
  const [language, setLanguage] = useState<"id" | "en">("id");

  useEffect(() => {
  if (!terms.length && initialTerms.length) setTerms(initialTerms);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTerms]);

  function toggleAudience(a: string) {
    setAudiences((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }
  function addCustomAudience() {
    const v = audienceCustom.trim();
    if (!v) return;
    setAudiences((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setAudienceCustom("");
  }

  // emit config changes (optional)
  useEffect(() => {
    onChangeConfig?.({
      sourceMode,
      terms,
      topicManual,
      audiences,
      tone,
      keywords,
      slides,
      language,
    });
  }, [sourceMode, terms, topicManual, audiences, tone, keywords, slides, language, onChangeConfig]);

 return (
  <aside className="w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
    <div className="p-4">
      {/* Title */}
      <div className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        Configuration
      </div>

      <div className="mt-4 space-y-5">
        {/* SOURCE */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#068773]/10 text-[#068773]">
              <SlidersHorizontal className="h-3 w-3" />
            </span>
            Source
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setSourceMode("trend")}
                className={cn(
                  "rounded-xl px-2.5 py-2 text-[11px] font-semibold transition",
                  sourceMode === "trend"
                    ? "bg-white dark:bg-slate-900 text-[#068773] shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/60"
                )}
              >
                Trend Insight
              </button>
              <button
                type="button"
                onClick={() => setSourceMode("manual")}
                className={cn(
                  "rounded-xl px-2.5 py-2 text-[11px] font-semibold transition",
                  sourceMode === "manual"
                    ? "bg-white dark:bg-slate-900 text-[#068773] shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/60"
                )}
              >
                Manual Input
              </button>
            </div>
          </div>

          {/* TREND / MANUAL UI */}
          {sourceMode === "trend" ? (
            <div className="mt-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-3">
              {!draftCtx ? (
                <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  No Trend Insight context found. Go back to{" "}
                  <b>Trend Insight</b> and click <b>Generate Draft</b>.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                      Imported from Trend Insight
                    </div>

                    <a
                      href="/trends"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#068773] hover:underline"
                      title="Edit selection in Trend Insight"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Edit
                    </a>
                  </div>

                  <TagInput
                    label="Topic / Terms"
                    value={terms}
                    onChange={setTerms}
                    placeholder="e.g. Range Anxiety"
                    hint="Used as primary topic signals for the draft."
                    max={20}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Topic
              </div>
              <input
                value={topicManual}
                onChange={(e) => setTopicManual(e.target.value)}
                placeholder="Specific topic or keyword…"
                className={cn(
                  "mt-2 h-10 w-full rounded-2xl border px-3 text-[12px]",
                  "border-slate-200/80 dark:border-slate-800/80",
                  "bg-white dark:bg-slate-950",
                  "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
                  "outline-none transition focus:border-[#068773]/35 focus:ring-2 focus:ring-[#068773]/15"
                )}
              />
            </div>
          )}
        </div>

        {/* TARGET AUDIENCE */}
        <TargetAudienceSection
          presetAudiences={presetAudiences}
          audiences={audiences}
          toggleAudience={toggleAudience}
          audienceCustom={audienceCustom}
          setAudienceCustom={setAudienceCustom}
          addCustomAudience={addCustomAudience}
        />

        {/* TONE OF VOICE */}
        <ToneOfVoiceSection tone={tone} setTone={setTone} />

        {/* TARGET KEYWORDS */}
        <TargetKeywordsSection keywords={keywords} setKeywords={setKeywords} />

        {/* SLIDE COUNT */}
        <SlideCountSection slides={slides} setSlides={setSlides} />

        {/* LANGUAGE */}
        <LanguageSection language={language} setLanguage={setLanguage} />

        
   

        {/* GENERATE ACTION */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={onGenerate}
            className={cn(
              "relative flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
              "text-[12px] font-semibold transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
              isGenerating
                ? "bg-[#068773] text-white cursor-wait"
                : canGenerate
                ? "bg-gradient-to-r from-[#068773] to-[#0fb9a8] text-white shadow-sm ring-1 ring-[#068773]/25 hover:brightness-105 active:brightness-95"
                : "cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            )}
          >
            {isGenerating ? (
              "Generating…"
            ) : (
              <>
                <Sparkles className="h-4 w-4 opacity-90" />
                Generate Draft
              </>
            )}
          </button>

          <div className="mt-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
            The output follows your configuration.
          </div>
        </div>

      </div>
    </div>
  </aside>
);

}
