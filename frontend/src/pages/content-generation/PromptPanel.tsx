// src/pages/content-generation/PromptPanel.tsx
import * as React from "react";
import { Sparkles, Wand2, Dices, SlidersHorizontal, Trash2 } from "lucide-react";

export type ContentGenMode = "image" | "video";

export type PromptPanelValues = {
  prompt: string;
  negativePrompt?: string;
  aspect?: "1:1" | "4:5" | "16:9" | "9:16";
  durationSec?: 4 | 6 | 8 | 10;
  seed?: number | null;
  guidance?: number; // optional slider
};

type PromptPanelProps = {
  mode: ContentGenMode;
  defaultValues?: Partial<PromptPanelValues>;
  onGenerate: (values: PromptPanelValues) => void;
  isGenerating?: boolean;
  className?: string;
};

const aspectOptions: Array<NonNullable<PromptPanelValues["aspect"]>> = [
  "1:1",
  "4:5",
  "16:9",
  "9:16",
];

const durationOptions: Array<NonNullable<PromptPanelValues["durationSec"]>> = [
  4, 6, 8, 10,
];

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function PromptPanel({
  mode,
  defaultValues,
  onGenerate,
  isGenerating = false,
  className,
}: PromptPanelProps) {
  const [prompt, setPrompt] = React.useState(defaultValues?.prompt ?? "");
  const [negativePrompt, setNegativePrompt] = React.useState(
    defaultValues?.negativePrompt ?? ""
  );

  const [aspect, setAspect] = React.useState<PromptPanelValues["aspect"]>(
    defaultValues?.aspect ?? "1:1"
  );

  const [durationSec, setDurationSec] = React.useState<
    PromptPanelValues["durationSec"]
  >(defaultValues?.durationSec ?? 6);

  const [seed, setSeed] = React.useState<number | "random" | "none">(
    defaultValues?.seed === null ? "none" : defaultValues?.seed ?? "random"
  );

  const [guidance, setGuidance] = React.useState<number>(
    defaultValues?.guidance ?? 7
  );

  const promptTooShort = prompt.trim().length < 4;

  function handleGenerate() {
    const values: PromptPanelValues = {
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      guidance,
      seed:
        seed === "random" ? undefined : seed === "none" ? null : Number(seed),
    };

    if (mode === "image") {
      values.aspect = aspect;
    } else {
      values.durationSec = durationSec;
    }

    onGenerate(values);
  }

  function handleClear() {
    setPrompt("");
    setNegativePrompt("");
  }

  function randomizeSeed() {
    const next = Math.floor(Math.random() * 1_000_000_000);
    setSeed(next);
  }

  return (
    <section
      className={cn(
        "w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
        className
      )}
      aria-label="Prompt panel"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Wand2 className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Prompt Panel
              </div>
              <div className="text-[11px] text-slate-500">
                Mode:{" "}
                <span className="font-medium text-slate-700">
                  {mode === "image" ? "Image Generate" : "Video Generate"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          title="Clear"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <label className="block">
          <div className="mb-1 text-xs font-medium text-slate-700">
            Prompt <span className="text-slate-400">(required)</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className={cn(
              "w-full resize-none rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none",
              "border-slate-200 focus:border-slate-400"
            )}
            placeholder={
              mode === "image"
                ? "Contoh: cinematic product photo of a black coffee bottle on marble table, soft light, 50mm"
                : "Contoh: slow dolly-in shot, a futuristic city skyline at sunrise, cinematic, realistic"
            }
          />
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className={promptTooShort ? "text-rose-600" : "text-slate-500"}>
              {promptTooShort
                ? "Prompt minimal 4 karakter."
                : "Tulis deskripsi yang jelas (subjek, style, lighting, kamera)."}
            </span>
            <span className="text-slate-400">{prompt.length}</span>
          </div>
        </label>

        {/* Negative prompt */}
        <label className="block">
          <div className="mb-1 text-xs font-medium text-slate-700">
            Negative Prompt <span className="text-slate-400">(optional)</span>
          </div>
          <input
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
            placeholder="Contoh: blurry, low-res, watermark, text, deformed hands"
          />
        </label>
      </div>

      {/* Controls */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <SlidersHorizontal className="h-4 w-4" />
          Settings
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Mode specific */}
          {mode === "image" ? (
            <div>
              <div className="mb-1 text-[11px] font-medium text-slate-700">
                Aspect Ratio
              </div>
              <div className="flex flex-wrap gap-2">
                {aspectOptions.map((opt) => {
                  const active = aspect === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAspect(opt)}
                      className={cn(
                        "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-1 text-[11px] font-medium text-slate-700">
                Duration
              </div>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((d) => {
                  const active = durationSec === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationSec(d)}
                      className={cn(
                        "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {d}s
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Guidance */}
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-700">
              <span>Guidance</span>
              <span className="text-slate-500">{guidance.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={guidance}
              onChange={(e) => setGuidance(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 text-[11px] text-slate-500">
              Lebih tinggi = lebih patuh prompt (kadang kurang natural).
            </div>
          </div>

          {/* Seed */}
          <div>
            <div className="mb-1 text-[11px] font-medium text-slate-700">
              Seed
            </div>

            <div className="flex items-center gap-2">
              <select
                value={seed === "random" ? "random" : seed === "none" ? "none" : "fixed"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "random") setSeed("random");
                  else if (v === "none") setSeed("none");
                  else {
                    // keep current fixed or set a default
                    setSeed(typeof seed === "number" ? seed : 42);
                  }
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400"
              >
                <option value="random">Random</option>
                <option value="fixed">Fixed</option>
                <option value="none">None</option>
              </select>

              <input
                type="number"
                value={typeof seed === "number" ? seed : ""}
                onChange={(e) => setSeed(Number(e.target.value))}
                disabled={seed === "random" || seed === "none"}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400",
                  (seed === "random" || seed === "none") && "opacity-60"
                )}
                placeholder="42"
              />

              <button
                type="button"
                onClick={randomizeSeed}
                disabled={seed === "random" || seed === "none"}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium",
                  seed === "random" || seed === "none"
                    ? "opacity-60 text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-50"
                )}
                title="Randomize seed"
              >
                <Dices className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-1 text-[11px] text-slate-500">
              Random = hasil beda tiap run. Fixed = bisa repeat. None = biarin model.
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500">
          Tips: tambahkan style, lighting, dan kamera untuk hasil lebih konsisten.
        </div>

        <button
          type="button"
          disabled={promptTooShort || isGenerating}
          onClick={handleGenerate}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
            promptTooShort || isGenerating
              ? "bg-slate-200 text-slate-500"
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
    </section>
  );
}
