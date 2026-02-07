// src/pages/content-generation/SideNav.tsx
import * as React from "react";
import { Image as ImageIcon, Video as VideoIcon } from "lucide-react";

export type ContentGenTab = "image" | "video";
export type ImageCategory = "infographic" | "carousel";


export type Workflow = "text_to_image" | "image_to_image" | "upscale" ;

type SideNavProps = {
  value: ContentGenTab;
  onSelect: (tab: ContentGenTab) => void;
  className?: string;

  // ✅ NEW: controlled values from parent
  imageCategory: ImageCategory;
  onImageCategoryChange: (v: ImageCategory) => void;

  slides: number;
  onSlidesChange: (n: number) => void;
   workflow: Workflow;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function SideNav({
  value,
  onSelect,
  className,
  workflow,

  imageCategory,
  onImageCategoryChange,
  slides,
  onSlidesChange,
}: SideNavProps) {
  const isImage = value === "image";
  
  
  const carouselDisabled = workflow === "image_to_image";
  const isCarousel = imageCategory === "carousel" && !carouselDisabled;

  return (
    <aside
      className={cn(
        "w-full",
        "rounded-3xl  border-slate-200/80 dark:border-slate-800/80",
        "bg-white dark:bg-slate-900",
        "shadow-sm",
        className
      )}
      aria-label="Content generation options"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Generator Setup
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Content Format
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-[#068773]/15 bg-[#068773]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#068773]">
            {value}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-5">
        {/* Format switch */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-1">
          <div className="grid grid-cols-2 gap-1">
            <FormatTab
              active={value === "image"}
              label="Image"
              onClick={() => onSelect("image")}
              icon={<ImageIcon className="h-4 w-4" />}
            />
            <FormatTab
              active={value === "video"}
              label="Video"
              onClick={() => onSelect("video")}
              icon={<VideoIcon className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Image-only settings */}
        {isImage ? (
          <>
            {/* Image Category */}
            <div>
              <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Image Category
              </div>

              <div className="grid grid-cols-2 gap-2">
                <RadioChip
                  active={imageCategory === "infographic"}
                  title="Infographic"
                  desc="Single frame"
                  onClick={() => onImageCategoryChange("infographic")}
                />
                <RadioChip
                  active={imageCategory === "carousel"}
                  title="Carousel"
                  desc="Multi-slide"
                  disabled={carouselDisabled}
                  onClick={() => {
                    if (!carouselDisabled) onImageCategoryChange("carousel");
                  }}
                />

              </div>
            </div>

            {/* Slides (only if carousel) */}
          {isCarousel ? (
  <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Slides
                  </div>

                  <span className="inline-flex items-center rounded-full border border-[#068773]/15 bg-[#068773]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#068773]">
                    {slides}
                  </span>
                </div>

                <input
                  type="range"
                  min={2}
                  max={10}
                  value={slides}
                  onChange={(e) => onSlidesChange(Number(e.target.value))}
                  className="mt-3 w-full accent-[#068773]"
                />

                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>2</span>
                  <span>10</span>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  Best practice: 5–7 slides for IG carousel.
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-3">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Video Tips
            </div>
            <div className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
              Keep prompts concise: action, subject, camera, mood. Use 9:16 for short-form.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}


/* ---------- UI bits ---------- */

function FormatTab({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5",
        "text-[12px] font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
        active
          ? "bg-gradient-to-r from-[#068773] to-[#0fb9a8] text-white shadow-sm"
          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
      )}
    >
      <span className={cn(active ? "text-white" : "text-slate-500 dark:text-slate-300")}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function RadioChip({
  active,
  title,
  desc,
  onClick,
  disabled = false,
}: {
  active: boolean;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl border px-3 py-3 text-left transition",
        "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
        disabled && "cursor-not-allowed opacity-40",
        active && !disabled
          ? "border-[#068773]/25 bg-[#068773]/10"
          : !disabled
          ? "border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60"
          : "border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={cn(
              "text-[12px] font-semibold",
              active && !disabled
                ? "text-slate-900 dark:text-white"
                : "text-slate-900 dark:text-slate-50"
            )}
          >
            {title}
          </div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {desc}
          </div>
        </div>

        <span
          className={cn(
            "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border",
            active && !disabled
              ? "border-[#068773] bg-[#068773]"
              : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          )}
        >
          {active && !disabled ? (
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          ) : null}
        </span>
      </div>
    </button>
  );
}
