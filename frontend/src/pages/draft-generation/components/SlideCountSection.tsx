import { Layers } from "lucide-react";

type Props = {
  slides: number;
  setSlides: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

export default function SlideCountSection({
  slides,
  setSlides,
  min = 1,          // 👈 start from 1
  max = 16,
  label = "Slide Count",
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#068773]/10 text-[#068773]">
            <Layers className="h-3 w-3" />
          </span>
          {label}
        </div>

        <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2 py-0.5 text-[10px] font-semibold text-[#056d5c] dark:text-emerald-200">
          {slides}
        </span>
      </div>

      {/* Range */}
      <input
        type="range"
        min={min}
        max={max}
        value={slides}
        onChange={(e) => setSlides(Number(e.target.value))}
        className="w-full accent-[#068773]"
      />

      <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
        Number of slides to generate.
      </div>
    </div>
  );
}
