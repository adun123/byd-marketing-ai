// src/pages/content-generation/OptionsPanel.tsx
import { SlidersHorizontal, Image as ImageIcon, Layers, ArrowUpRight } from "lucide-react";

export type Workflow = "text_to_image" | "image_to_image" | "upscale";
export type VisualStyle = "clean" | "premium" | "lifestyle" | "ugc" | "bold";

type Props = {
  workflow: Workflow;
  visualStyle: VisualStyle;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  onChange: (v: Partial<Props>) => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function OptionsPanel({ workflow, visualStyle, aspect, onChange }: Props) {
  const scenes = [
    {
      id: "text_to_image" as const,
      title: "Text to Image",
      desc: "Generate images from text (endpoint: /api/image/generate).",
      icon: ImageIcon,
    },
    {
      id: "image_to_image" as const,
      title: "Edit Image",
      desc: "Edit/transform image (endpoint: /api/image/edit).",
      icon: Layers,
    },
    {
      id: "upscale" as const,
      title: "Upscale",
      desc: "Increase resolution (endpoint: /api/image/upscale).",
      icon: ArrowUpRight,
    },
  ];

  const styleItems: Array<{ id: VisualStyle; label: string }> = [
    { id: "clean", label: "Clean" },
    { id: "premium", label: "Premium" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "ugc", label: "UGC" },
    { id: "bold", label: "Bold" },
  ];

  const showGenerateControls = workflow === "text_to_image";

  return (
    <div className="w-full rounded-2xl border border-emerald-200/60 bg-white p-3 shadow-sm">
      {/* Mode */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold text-slate-700">Mode</div>

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

                  {/* UX hint per mode */}
                  {!active ? null : s.id === "image_to_image" ? (
                    <div className="mt-2 text-[11px] text-white/85">
                      Butuh <span className="font-semibold">1 gambar</span> untuk diedit + prompt instruksi.
                    </div>
                  ) : s.id === "upscale" ? (
                    <div className="mt-2 text-[11px] text-white/85">
                      Butuh <span className="font-semibold">1 gambar</span> untuk di-upscale.
                    </div>
                  ) : (
                    <div className="mt-2 text-[11px] text-white/85">
                      Gunakan prompt + (opsional) style & aspect ratio.
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls khusus Text-to-Image */}
      {showGenerateControls ? (
        <>
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
                        ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              (Backend: dikirim sebagai <span className="font-semibold text-slate-700">style</span>)
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <SlidersHorizontal className="h-4 w-4" />
              Settings
            </div>

            {/* Aspect */}
            <div className="mb-1">
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
                          ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-[11px] text-slate-500">
                (Backend: dikirim sebagai <span className="font-semibold text-slate-700">aspectRatio</span>)
              </div>
            </div>
          </div>
        </>
      ) : (
        // Info panel untuk mode non-generate supaya tidak misleading
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold text-slate-700">Info</div>
          <div className="mt-1 text-[11px] leading-snug text-slate-600">
            {workflow === "image_to_image"
              ? "Mode ini fokus edit gambar. Pengaturan style/aspect tidak ditampilkan karena tidak ada di parameter endpoint docs."
              : "Mode ini fokus upscale gambar. Pengaturan style/aspect tidak ditampilkan karena tidak ada di parameter endpoint docs."}
          </div>
        </div>
      )}
    </div>
  );
}
