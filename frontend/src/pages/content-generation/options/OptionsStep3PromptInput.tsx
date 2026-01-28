// src/pages/content-generation/components/OptionsStep3PromptInput.tsx

import { Sparkles } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  prompt: string;
  onChange: (prompt: string) => void;

  active?: boolean;

  suggestions?: string[];
  onGenerate?: () => void;
  isGenerating?: boolean;
  disabledGenerate?: boolean;
};

export default function OptionsStep3PromptInput({
  prompt,
  onChange,
  active = true,
  suggestions = [
    "Sleek electric car in neon city",
    "Modern showroom with sunlight",
  ],
  onGenerate,
  isGenerating,
  disabledGenerate,
}: Props) {
  return (
    <aside className="w-full rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.22)]">
      <div className="p-5">
        {/* header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
              3
            </span>
            <div className="text-[13px] font-semibold text-slate-900">
              Prompt Input
            </div>
          </div>

          {active ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Active
            </span>
          ) : null}
        </div>

        {/* textarea */}
        <textarea
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your custom prompt here..."
          className={cn(
            "min-h-[150px] w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4",
            "text-[12px] leading-relaxed text-slate-800 outline-none transition",
            "placeholder:text-slate-300",
            "focus:border-emerald-600/25 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
          )}
        />

        {/* Suggestion prompts */}
        <div className="mt-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Suggestion Prompts
          </div>

          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className={cn(
                  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition",
                  "text-[12px] font-medium text-slate-600 hover:bg-slate-50",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                )}
              >
                “{s}”
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={disabledGenerate || isGenerating}
          className={cn(
            "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3",
            "text-[12px] font-semibold text-white transition",
            "bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-sm",
            "hover:-translate-y-0.5 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-emerald-600/25",
            (disabledGenerate || isGenerating) &&
              "cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-sm"
          )}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate"}
        </button>

        <div className="mt-2 text-[10px] text-slate-400">
          Tip: tulis detail objek, lighting, mood, style, dan angle kamera.
        </div>
      </div>
    </aside>
  );
}
