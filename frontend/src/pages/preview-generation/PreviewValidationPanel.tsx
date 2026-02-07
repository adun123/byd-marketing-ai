// src/pages/preview-generation/PreviewValidationPanel.tsx
import * as React from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  brandAlignment: number; // 0-100
  imageQuality: "LOW" | "MED" | "HIGH";
  visualSafety: "FAILED" | "PASSED";
  contrastRatio: "LOW" | "OK" | "OPTIMAL";
  breakdown: {
    composition: number;
    lighting: number;
    toneConsistency: number;
  };
};

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-lg bg-[#068773]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#068773]">
      {text}
    </span>
  );
}

export default function PreviewValidationPanel({
  brandAlignment,
  imageQuality,
  visualSafety,
  contrastRatio,
  breakdown,
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(brandAlignment)));

  return (
  <aside className="h-fit">
    <div
      className={cn(
        "rounded-3xl border border-slate-200/70 dark:border-slate-800/70",
        "bg-white/60 dark:bg-slate-900/30",
        "p-4"
      )}
    >
      <div className="px-1">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Validation Status
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {/* Brand alignment */}
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
              Brand Alignment
            </div>
            <div className="text-[14px] font-extrabold text-[#068773]">{pct}%</div>
          </div>

          <div className="mt-3 h-2 rounded-full bg-slate-200/70 dark:bg-slate-800/70 overflow-hidden">
            <div className="h-full bg-[#068773]" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-4 rounded-2xl border border-[#068773]/20 bg-[#068773]/5 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                  Image Quality
                </div>
                <Badge text={imageQuality} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                  Visual Safety
                </div>
                <Badge text={visualSafety} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                  Contrast Ratio
                </div>
                <Badge text={contrastRatio} />
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="text-[#068773]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              AI Score Breakdown
            </div>
          </div>

          <div className="mt-3 space-y-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Composition</span>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {breakdown.composition.toFixed(1)}/10
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Lighting</span>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {breakdown.lighting.toFixed(1)}/10
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Tone Consistency</span>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {breakdown.toneConsistency.toFixed(1)}/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
);

}
