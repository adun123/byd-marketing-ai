// src/pages/draft-generation/OptionDraftFilter.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {   SlidersHorizontal,  } from "lucide-react";
import type { DraftContextPayload } from "../trends-generation/types";
import TagInput from "../../components/ui/TagInput";
import TargetAudienceSection from "./components/TargetAudienceSection";
import ToneOfVoiceSection from "./components/ToneOfVoiceSection";
import TargetKeywordsSection from "./components/TargetKeywordsSection";
// import SlideCountSection from "./components/SlideCountSection";
import LanguageSection from "./components/LanguageSection";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}



type SourceMode = "trend" | "manual";

type DraftConfigLike = {
  sourceMode: SourceMode;
  terms: string[];
  topicManual: string;
  audiences: string[];
  tone: string;
  keywords: string;
  slides: number;
  language: "id" | "en";
};

type Props = {
  draftCtx?: DraftContextPayload | null;
  initialConfig?: DraftConfigLike | null; // ✅ dari localStorage (Opsi A)
  onChangeConfig?: (v: DraftConfigLike) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
};







export default function OptionDraftFilter({
  draftCtx = null,
  initialConfig = null,
  onChangeConfig,
  onGenerate,
  isGenerating = false,
}: Props) {
  function humanizeTerm(term: string) {
    return term
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
      .replace(/^./, (s) => s.toUpperCase());
  }

  const hasSelectedTerms = (draftCtx?.selectedTerms?.length ?? 0) > 0;

  // fallback dari trend insight (kalau belum ada initialConfig)
  const initialTerms = useMemo(() => {
    return (draftCtx?.selectedTerms ?? []).slice(0, 12).map(humanizeTerm);
  }, [draftCtx]);

  // ===== init state: prioritas initialConfig =====
  const [sourceMode, setSourceMode] = useState<SourceMode>(
    initialConfig?.sourceMode ?? "trend"
  );

  const [terms, setTerms] = useState<string[]>(
    initialConfig?.terms?.length ? initialConfig.terms : initialTerms
  );

  const [topicManual, setTopicManual] = useState<string>(
    initialConfig?.topicManual ?? ""
  );

  // target audience chips
  const presetAudiences = useMemo(
    () => ["SUV Buyers", "Gen Z", "Car Enthusiasts", "Luxury"],
    []
  );

  const [audiences, setAudiences] = useState<string[]>(
    initialConfig?.audiences?.length ? initialConfig.audiences : ["SUV Buyers"]
  );
  const [audienceCustom, setAudienceCustom] = useState("");

  // tone
  const [tone, setTone] = useState<string>(
    initialConfig?.tone ?? "Professional & Authoritative"
  );

  // keywords
  const [keywords, setKeywords] = useState<string>(initialConfig?.keywords ?? "");

  // slide count
  const [slides] = useState<number>(initialConfig?.slides ?? 1);

  // language
  const [language, setLanguage] = useState<"id" | "en">(
    initialConfig?.language ?? "id"
  );
const didHydrate = useRef(false);
  // ✅ hydrate jika initialConfig baru kebaca setelah mount
useEffect(() => {
  if (!initialConfig) return;
  if (didHydrate.current) return; // ✅ cuma sekali
  didHydrate.current = true;

  setSourceMode(initialConfig.sourceMode ?? "trend");
  setTerms(initialConfig.terms ?? []);
  setTopicManual(initialConfig.topicManual ?? "");
  setAudiences(
    initialConfig.audiences?.length ? initialConfig.audiences : ["SUV Buyers"]
  );
  setTone(initialConfig.tone ?? "Professional & Authoritative");
  setKeywords(initialConfig.keywords ?? "");
  setLanguage(initialConfig.language ?? "id");
}, [initialConfig]);

  // tombol
  const canGenerate =
    sourceMode === "trend" ? terms.length > 0 : topicManual.trim().length > 0;

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

const didMountRef = useRef(false);

useEffect(() => {
  if (!didMountRef.current) {
    didMountRef.current = true;
    return; // ✅ jangan emit saat mount pertama
  }

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
    <div className="w-full">
      {/* Sidebar title */}
      <div className="mb-5">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Draft Configuration
        </div>
      </div>

      <div className="space-y-6">
        {/* SOURCE */}
        <section>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#068773]/10 text-[#068773]">
              <SlidersHorizontal className="h-3 w-3" />
            </span>
            Source
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setSourceMode("trend")}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-[11px] font-semibold transition",
                  sourceMode === "trend"
                    ? "bg-white dark:bg-slate-900 text-[#068773]"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/60"
                )}
              >
                Trend Insight
              </button>

              <button
                type="button"
                onClick={() => setSourceMode("manual")}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-[11px] font-semibold transition",
                  sourceMode === "manual"
                    ? "bg-white dark:bg-slate-900 text-[#068773]"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/60"
                )}
              >
                Manual Input
              </button>
            </div>
          </div>
        </section>
       


        {/* CONTEXT */}
        <section>
          {sourceMode === "trend" ? (
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-3">
              {!hasSelectedTerms ? (
                <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Tidak Ada Trend Insight yang Dimasukan.
                </div>
              ) : (
                <TagInput
                  label="Topic / Terms"
                  value={terms}        // ✅ jangan map humanize
                  onChange={setTerms}  // ✅ jangan strip spasi di sini
                  placeholder="e.g. Range Anxiety"
                  hint="Primary topic signals"
                  max={20}
                />


              )}
            </div>
          ) : (
            <input
              value={topicManual}
              onChange={(e) => setTopicManual(e.target.value)}
              placeholder="Specific topic or keyword…"
              className="
                h-10 w-full rounded-xl border px-3 text-[12px]
                border-slate-200/80 dark:border-slate-800/80
                bg-white dark:bg-slate-950
                text-slate-900 dark:text-slate-100
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                outline-none focus:ring-2 focus:ring-[#068773]/20 dark:focus:ring-emerald-400/20
              "
            />

          )}
        </section>

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
        {/* <SlideCountSection slides={slides} setSlides={setSlides} /> */}

        {/* LANGUAGE */}
        <LanguageSection language={language} setLanguage={setLanguage} />

        {/* GENERATE */}
        <section className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={onGenerate}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-[12px] font-semibold",
              isGenerating
                ? "bg-[#068773] text-white cursor-wait"
                : canGenerate
                ? "bg-gradient-to-r from-[#068773] to-[#0fb9a8] text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-500"
            )}
          >
            {isGenerating ? "Generating…" : "Generate Draft"}
          </button>
        </section>
      </div>
    </div>
  );
}



        