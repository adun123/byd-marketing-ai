import * as React from "react";
import { SlidersHorizontal, Film, Timer, Ratio, Wand2 } from "lucide-react";

export type VideoWorkflow = "text_to_video" | "image_to_video";
export type VideoFormat = "reels" | "tiktok" | "yt_shorts" | "landscape";
export type VideoStyle = "cinematic" | "clean" | "ugc" | "bold";

type Props = {
  workflow: VideoWorkflow;
  format: VideoFormat;
  durationSec: 5 | 8 | 10 | 15;
  style: VideoStyle;

  // optional advanced (kalau backend kamu nanti support)
  fps?: 24 | 30;
  onChange: (v: Partial<Props>) => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

const workflowItems: Array<{
  id: VideoWorkflow;
  title: string;
  desc: string;
  icon: React.ElementType;
}> = [
  {
    id: "text_to_video",
    title: "Text to Video",
    desc: "Buat video dari prompt (scene baru).",
    icon: Film,
  },
  {
    id: "image_to_video",
    title: "Image to Video",
    desc: "Animasi dari gambar (butuh 1 image).",
    icon: Wand2,
  },
];

const formatItems: Array<{ id: VideoFormat; label: string; hint: string }> = [
  { id: "reels", label: "Reels", hint: "9:16" },
  { id: "tiktok", label: "TikTok", hint: "9:16" },
  { id: "yt_shorts", label: "YT Shorts", hint: "9:16" },
  { id: "landscape", label: "Landscape", hint: "16:9" },
];

const styleItems: Array<{ id: VideoStyle; label: string }> = [
  { id: "cinematic", label: "Cinematic" },
  { id: "clean", label: "Clean" },
  { id: "ugc", label: "UGC" },
  { id: "bold", label: "Bold" },
];

export default function VideoOptionsPanel({
  workflow,
  format,
  durationSec,
  style,
  fps = 24,
  onChange,
}: Props) {
  const needsImage = workflow === "image_to_video";

  return (
    <div className="w-full rounded-2xl border border-emerald-200/60 bg-white p-3 shadow-sm">
      {/* Mode */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold text-slate-700">Mode</div>

        <div className="space-y-2">
          {workflowItems.map((w) => {
            const Icon = w.icon;
            const active = workflow === w.id;

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onChange({ workflow: w.id })}
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
                    {w.title}
                  </div>
                  <div className={cn("mt-0.5 text-[11px] leading-snug", active ? "text-white/80" : "text-slate-500")}>
                    {w.desc}
                  </div>

                  {active && needsImage ? (
                    <div className="mt-2 text-[11px] text-white/85">
                      Butuh <span className="font-semibold">1 gambar</span> untuk dianimasikan.
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">Format</div>
        <div className="flex flex-wrap gap-2">
          {formatItems.map((f) => {
            const active = format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ format: f.id })}
                className={cn(
                  "rounded-xl px-2.5 py-1.5 text-left transition-colors",
                  active ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white" : "border border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className={cn("text-[11px] font-semibold", active ? "text-white" : "text-slate-800")}>
                  {f.label}
                </div>
                <div className={cn("text-[10px] leading-3", active ? "text-white/75" : "text-slate-500")}>
                  {f.hint}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Style */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">Visual Style</div>
        <div className="flex flex-wrap gap-2">
          {styleItems.map((s) => {
            const active = style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ style: s.id })}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  active ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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

        {/* Duration */}
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
            <Timer className="h-4 w-4" />
            Duration
          </div>
          <div className="flex flex-wrap gap-2">
            {([5, 8, 10, 15] as const).map((d) => {
              const active = durationSec === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ durationSec: d })}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    active ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {d}s
                </button>
              );
            })}
          </div>
        </div>

        {/* FPS (optional advanced) */}
        <div>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
            <Ratio className="h-4 w-4" />
            FPS
          </div>
          <div className="flex flex-wrap gap-2">
            {([24, 30] as const).map((v) => {
              const active = fps === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange({ fps: v })}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    active ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {v}
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            (Opsional — aktifkan jika backend support)
          </div>
        </div>
      </div>
    </div>
  );
}
