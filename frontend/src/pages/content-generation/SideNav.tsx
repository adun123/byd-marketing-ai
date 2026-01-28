// src/pages/content-generation/SideNav.tsx
import * as React from "react";
import { Image as ImageIcon, Video as VideoIcon } from "lucide-react";

export type ContentGenTab = "image" | "video";

type SideNavProps = {
  value: ContentGenTab;
  onSelect: (tab: ContentGenTab) => void;
  className?: string;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function SideNav({ value, onSelect, className }: SideNavProps) {
  const [imageCategory, setImageCategory] = React.useState<
    "infographic" | "carousel"
  >("infographic");
  const [slides, setSlides] = React.useState(5);

  return (
    <aside
      className={cn(
        "hidden md:block md:w-80 shrink-0",
        "border-r border-slate-200",
        "bg-white",
        "px-5 py-6",
        "overflow-y-auto",
        className
      )}
      aria-label="Content generation options"
    >
      {/* CONTENT FORMAT */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Content Format
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onSelect("image")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition",
                value === "image"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Image
            </button>

            <button
              type="button"
              onClick={() => onSelect("video")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition",
                value === "video"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              <VideoIcon className="h-3.5 w-3.5" />
              Video
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE CATEGORY */}
      <div className="mt-6">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Image Category
        </div>

        <div className="space-y-2">
          <RadioCard
            active={imageCategory === "infographic"}
            label="Infographic"
            onClick={() => setImageCategory("infographic")}
          />
          <RadioCard
            active={imageCategory === "carousel"}
            label="Slider Carousel"
            onClick={() => setImageCategory("carousel")}
          />
        </div>
      </div>

      {/* CAROUSEL SLIDES */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Carousel Slides
          </div>
          <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            {slides} Slides
          </span>
        </div>

        <input
          type="range"
          min={2}
          max={10}
          value={slides}
          onChange={(e) => setSlides(Number(e.target.value))}
          className="w-full accent-emerald-600"
        />

        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
          <span>2</span>
          <span>10</span>
        </div>
      </div>
    </aside>
  );
}

function RadioCard({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-3 py-3 text-left transition",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
        active
          ? "border-emerald-600/20 bg-emerald-600/5"
          : "border-slate-200/70 bg-white hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "h-3.5 w-3.5 rounded-full border",
            active
              ? "border-emerald-600 bg-emerald-600 ring-2 ring-emerald-600/20"
              : "border-slate-300 bg-white"
          )}
        />
        <div className="text-[12px] font-semibold text-slate-900">{label}</div>
      </div>
    </button>
  );
}
