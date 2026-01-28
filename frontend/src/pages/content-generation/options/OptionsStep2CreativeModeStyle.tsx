// src/pages/content-generation/components/OptionsStep2CreativeModeStyle.tsx
import * as React from "react";
import { Image as ImageIcon, Type } from "lucide-react";
import type { Workflow, VisualStyle } from "./OptionsPanel";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  workflow: Workflow; // text_to_image | image_to_image | upscale
  visualStyle: VisualStyle; // clean | premium | lifestyle | ugc | bold
  onChange: (v: { workflow?: Workflow; visualStyle?: VisualStyle }) => void;
};

export default function OptionsStep2CreativeModeStyle({
  workflow,
  visualStyle,
  onChange,
}: Props) {
  const modeItems: Array<{
    id: Workflow;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "text_to_image",
      title: "Text to Image",
      desc: "AI visualization from description",
      icon: <Type className="h-5 w-5" />,
    },
    {
      id: "image_to_image",
      title: "Image to Image",
      desc: "Remix and upscale existing media",
      icon: <ImageIcon className="h-5 w-5" />,
    },
  ];

  const styles: Array<{ id: VisualStyle; label: string }> = [
    { id: "clean", label: "Clean" },
    { id: "premium", label: "Premium" },
    { id: "lifestyle", label: "Lifestyle" },
  ];

  return (
     <aside className="w-full rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.22)]">
      <div className="p-5">
        {/* Step header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
            2
          </span>
          <div className="text-[13px] font-semibold text-slate-900">
            Creative Mode &amp; Style
          </div>
        </div>

        {/* Mode cards */}
        <div className="space-y-3">
          {modeItems.map((m) => {
            const active = workflow === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ workflow: m.id })}
                className={cn(
                  "w-full rounded-3xl border p-3.5 text-left transition",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
                  active
                    ? "border-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl",
                      active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {m.icon}
                  </div>

                  <div className="min-w-0">
                    <div
                      className={cn(
                        "text-[12px] font-semibold",
                        active ? "text-white" : "text-slate-900"
                      )}
                    >
                      {m.title}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 text-[10px] leading-snug",
                        active ? "text-white/80" : "text-slate-500"
                      )}
                    >
                      {m.desc}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual style */}
        <div className="mt-6">
          <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Visual Style
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {styles.map((s) => {
              const active = visualStyle === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ visualStyle: s.id })}
                  className={cn(
                    "rounded-2xl px-3.5 py-2 text-[11px] font-semibold transition",
                    active
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200/60"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
