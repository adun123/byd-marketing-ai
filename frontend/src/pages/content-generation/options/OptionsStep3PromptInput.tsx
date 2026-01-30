
import { Sparkles, Wand2 } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  prompt: string;
  onChange: (v: string) => void;

  onGenerate: () => void;
  isGenerating?: boolean;
  disabledGenerate?: boolean;

  active?: boolean;
  suggestions?: string[];
  title?: string;
};

const defaultSuggestions = [
  "Cinematic product shot, clean studio lighting, sharp focus, premium automotive style.",
  "Lifestyle scene, warm sunlight, candid feel, soft shadows, social media friendly.",
  "Minimal infographic, bold typography, high contrast, brand-safe layout.",
  "UGC style, handheld camera, natural light, authentic social vibe.",
];

export default function OptionsStep3PromptInput({
  prompt,
  onChange,
  onGenerate,
  isGenerating = false,
  disabledGenerate = false,
  active,
  suggestions = defaultSuggestions,
  title = "Prompt Input",
}: Props) {
  const isDisabled = disabledGenerate || isGenerating;

  return (
    <aside className="w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-200">
              3
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
                {title}
              </div>
              <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                Describe subject, style, lighting, and composition
              </div>
            </div>
          </div>

          {active ? (
            <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#068773]">
              Active
            </span>
          ) : null}
        </div>

        {/* Textarea (scrollable) */}
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-3">
          <textarea
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write a detailed prompt…"
            className={cn(
              "h-40 w-full resize-none bg-transparent",
              "text-[12px] leading-relaxed text-slate-800 dark:text-slate-100",
              "placeholder:text-slate-400 dark:placeholder:text-slate-600",
              "outline-none",
              "overflow-y-auto"
            )}
          />

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Tip: add camera angle, mood, and background context.</span>
            <span className="font-semibold">{prompt.trim().length} chars</span>
          </div>
        </div>

        {/* Suggestions (compact chips) */}
        {suggestions?.length ? (
          <div className="mt-4">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Quick suggestions
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {suggestions.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange(s)}
                  className={cn(
                    "group rounded-2xl border border-slate-200/70 dark:border-slate-800/70",
                    "bg-white dark:bg-slate-900 px-3 py-2 text-left transition",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/20"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[#068773]/10 text-[#068773]">
                      <Wand2 className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-[11px] font-medium leading-snug text-slate-700 dark:text-slate-200 line-clamp-2">
                      {s}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Generate */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isDisabled}
          className={cn(
            "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
            "text-[12px] font-semibold text-white transition",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
            isGenerating
              ? "bg-[#068773] cursor-wait"
              : !disabledGenerate
              ? "bg-gradient-to-r from-[#068773] to-[#0fb9a8] shadow-sm ring-1 ring-[#068773]/25 hover:brightness-105 active:brightness-95"
              : "cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          )}
        >
          <Sparkles className={cn("h-4 w-4", isGenerating && "animate-pulse")} />
          {isGenerating ? "Generating…" : "Generate"}
        </button>

        <div className="mt-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
          Better prompts → better outputs.
        </div>
      </div>
    </aside>
  );
}
