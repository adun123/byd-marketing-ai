import * as React from "react";
import { Image as  Wand2, Sparkles, UploadCloud, X } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Workflow = "text_to_image" | "image_to_image" | "upscale";
type VisualStyle = "clean" | "premium" | "lifestyle" | "ugc" | "bold";

export type ImgAttachment = { id: string; file: File; previewUrl: string };

type Props = {
  workflow: Workflow;
  visualStyle: VisualStyle;
  onChange: (v: { workflow?: Workflow; visualStyle?: VisualStyle }) => void;

  attachments: ImgAttachment[];
  onPickImages?: (files: FileList) => void;
  onRemoveImage?: (id: string) => void;
  onClearImages?: () => void;
};

const MODE_ITEMS: Array<{
  id: Workflow;
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    id: "text_to_image",
    title: "Text → Image",
    desc: "Generate from prompt only",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "image_to_image",
    title: "Image → Image",
    desc: "Remix / edit with references",
    icon: <Wand2 className="h-4 w-4" />,
  },
  // {
  //   id: "upscale",
  //   title: "Upscale",
  //   desc: "Sharpen + enhance resolution",
  //   icon: <ImageIcon className="h-4 w-4" />,
  // },
];

const STYLES: Array<{ id: VisualStyle; label: string }> = [
  { id: "clean", label: "Clean" },
  { id: "premium", label: "Premium" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "ugc", label: "UGC" },
  { id: "bold", label: "Bold" },
];

export default function OptionsStep2CreativeModeStyle({
  workflow,
  visualStyle,
  onChange,
  attachments,
  onPickImages,
  onRemoveImage,
  onClearImages,
}: Props) {
  const needsImage = workflow === "image_to_image" || workflow === "upscale";
  const hasImage = attachments.length > 0;

  const uploadMax = workflow === "image_to_image" ? 5 : 1;
  const uploadLabel =
    workflow === "image_to_image" ? `Upload up to ${uploadMax} images` : "Upload 1 image";

  return (
    <aside className="w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-200">
            2
          </span>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
              Creative Mode
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
              Pick a workflow & style for the output
            </div>
          </div>
        </div>

        {/* Mode (segmented list) */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-1">
          <div className="space-y-1">
            {MODE_ITEMS.map((m) => {
              const active = workflow === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange({ workflow: m.id })}
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                    active
                      ? "bg-white dark:bg-slate-900 shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                      : "hover:bg-white/70 dark:hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-2xl",
                        active
                          ? "bg-[#068773]/10 text-[#068773]"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                      )}
                    >
                      {m.icon}
                    </span>

                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-[12px] font-semibold",
                          active ? "text-slate-900 dark:text-slate-50" : "text-slate-800 dark:text-slate-100"
                        )}
                      >
                        {m.title}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        {m.desc}
                      </div>
                    </div>

                    <span
                      className={cn(
                        "ml-auto h-2.5 w-2.5 rounded-full border",
                        active
                          ? "border-[#068773] bg-[#068773] ring-2 ring-[#068773]/20"
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      )}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Image requirement */}
        {needsImage ? (
          <div className="mt-4 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                  Reference image
                </div>
                <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  {workflow === "image_to_image"
                    ? "Add 1–6 images to guide the remix."
                    : "Add 1 image to upscale (sharpen & enhance)."}
                </div>
              </div>

              {hasImage ? (
                <button
                  type="button"
                  onClick={onClearImages}
                  className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="px-4 py-4">
              {/* Dropzone */}
              <label
                className={cn(
                  "group flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed px-3 py-3 transition",
                  "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-900",
                  "focus-within:ring-2 focus-within:ring-[#068773]/20"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple={workflow === "image_to_image"}
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) onPickImages?.(files);
                    e.currentTarget.value = "";
                  }}
                />
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
                  <UploadCloud className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                    {uploadLabel}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    JPG/PNG • {workflow === "image_to_image" ? "max 6" : "single"}
                  </div>
                </div>
              </label>

              {/* Thumbs */}
              {attachments.length ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {attachments.slice(0, 6).map((a) => (
                    <div
                      key={a.id}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950"
                    >
                      <img
                        src={a.previewUrl}
                        alt={a.file.name}
                        className="h-16 w-full object-cover"
                        loading="lazy"
                      />

                      <button
                        type="button"
                        onClick={() => onRemoveImage?.(a.id)}
                        className={cn(
                          "absolute right-1.5 top-1.5 inline-flex items-center justify-center rounded-xl",
                          "bg-black/55 px-2 py-1 text-[10px] font-semibold text-white",
                          "opacity-0 transition group-hover:opacity-100"
                        )}
                        title="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Warning */}
              {!hasImage ? (
                <div className="mt-3 rounded-2xl border border-amber-200/70 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-400/10 px-3 py-2 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
                  Add at least 1 image to continue.
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Visual style */}
        {workflow !== "upscale" ? (
          <div className="mt-4">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Visual style
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {STYLES.map((s) => {
                const active = visualStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChange({ visualStyle: s.id })}
                    className={cn(
                      "rounded-2xl px-3 py-2 text-[11px] font-semibold transition",
                      "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                      active
                        ? "bg-[#068773]/10 text-[#068773] border border-[#068773]/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 border border-transparent"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
              Tip: “Clean” for brand-safe, “UGC” for casual & social feel.
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
