// src/pages/content-generation/OptionsPanel.tsx
import { SlidersHorizontal, Image as ImageIcon, Layers, ArrowUpRight } from "lucide-react";

export type Workflow = "text_to_image" | "image_to_image" | "upscale";

export type Objective = "promotion" | "awareness" | "ads" | "ecommerce";

export type Channel =
  | "ig_feed"
  | "ig_story"
  | "tiktok"
  | "yt_shorts"
  | "linkedin"
  | "web";

export type VisualStyle = "clean" | "premium" | "lifestyle" | "ugc" | "bold";

type Props = {
  workflow: Workflow;

  objective: Objective;
  channel: Channel;
  visualStyle: VisualStyle;

  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  guidance: number;

  onChange: (v: Partial<Props>) => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function OptionsPanel({
  workflow,
  objective,
  channel,
  visualStyle,
  aspect,
  guidance,
  onChange,
}: Props) {
  const scenes = [
    {
      id: "text_to_image" as const,
      title: "All Image",
      desc: "Generate images from text. Best for marketing, design, and creative concepts.",
      icon: ImageIcon,
    },
    {
      id: "image_to_image" as const,
      title: "Image to Image",
      desc: "Transform an existing image (style conversion, edits, variations).",
      icon: Layers,
    },
    {
      id: "upscale" as const,
      title: "Upscale Image",
      desc: "Increase resolution and clarity for better details and sharpness.",
      icon: ArrowUpRight,
    },
  ];

  const objectiveItems: Array<{ id: Objective; label: string }> = [
    { id: "promotion", label: "Promotion" },
    { id: "awareness", label: "Awareness" },
    { id: "ads", label: "Ads" },
    { id: "ecommerce", label: "E-commerce" },
  ];

  const channelItems: Array<{ id: Channel; label: string; hint?: string }> = [
    { id: "ig_feed", label: "IG Feed", hint: "4:5 / 1:1" },
    { id: "ig_story", label: "IG Story", hint: "9:16" },
    { id: "tiktok", label: "TikTok", hint: "9:16" },
    { id: "yt_shorts", label: "YT Shorts", hint: "9:16" },
    { id: "linkedin", label: "LinkedIn", hint: "1:1" },
    { id: "web", label: "Web", hint: "16:9" },
  ];

  const styleItems: Array<{ id: VisualStyle; label: string }> = [
    { id: "clean", label: "Clean" },
    { id: "premium", label: "Premium" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "ugc", label: "UGC" },
    { id: "bold", label: "Bold" },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-3">
      {/* Select Scene */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold text-slate-700">Select Scene</div>

        <div className="space-y-2">
          {scenes.map((s) => {
            const Icon = s.icon;
            const active = workflow === s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ workflow: s.id })}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-all",
                  "flex items-start gap-3",
                  active
                    ? "border-transparent text-white bg-gradient-to-br from-[#068773] to-[#0fb9a8] shadow-md"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className={cn("text-sm font-semibold", active ? "text-white" : "text-slate-900")}>
                    {s.title}
                  </div>
                  <div className={cn("mt-0.5 text-[11px] leading-snug", active ? "text-white/80" : "text-slate-500")}>
                    {s.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Objective */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">Objective</div>
        <div className="flex flex-wrap gap-2">
          {objectiveItems.map((o) => {
            const active = objective === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => onChange({ objective: o.id })}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Channel / Placement */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">Channel</div>
        <div className="flex flex-wrap gap-2">
          {channelItems.map((c) => {
            const active = channel === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ channel: c.id })}
                className={cn(
                  "rounded-xl px-2.5 py-1.5 text-left transition-colors",
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className={cn("text-[11px] font-semibold", active ? "text-white" : "text-slate-800")}>
                  {c.label}
                </div>
                {c.hint && (
                  <div className={cn("text-[10px] leading-3", active ? "text-white/75" : "text-slate-500")}>
                    {c.hint}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Style */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">Visual Style</div>
        <div className="flex flex-wrap gap-2">
          {styleItems.map((s) => {
            const active = visualStyle === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ visualStyle: s.id })}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <SlidersHorizontal className="h-4 w-4" />
          Settings
        </div>

        {/* Aspect */}
        <div className="mb-3">
          <div className="mb-1 text-[11px] font-semibold text-slate-700">Aspect</div>
          <div className="flex flex-wrap gap-2">
            {(["1:1", "4:5", "16:9", "9:16"] as const).map((a) => {
              const active = aspect === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => onChange({ aspect: a })}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guidance */}
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span>Guidance</span>
            <span className="text-slate-500">{guidance.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={0.5}
            value={guidance}
            onChange={(e) => onChange({ guidance: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
