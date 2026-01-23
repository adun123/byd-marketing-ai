// src/pages/trends-generation/ContentAngleCard.tsx
import { Copy, Layers3, Sparkles } from "lucide-react";

type Props = {
  angle: string;
  howTo?: string[];
  onCopy?: (text: string) => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function fallbackHowTo(angle: string) {
  return [
    `Buka dengan konteks yang relevan dengan angle: “${angle.slice(0, 28)}…”`,
    "Visualkan poin utama secara ringkas (before/after, list, atau contoh nyata).",
    "Tutup dengan ajakan ringan (save, share, atau komentar).",
  ];
}

export default function ContentAngleCard({ angle, howTo, onCopy }: Props) {
  const steps = howTo?.length ? howTo : fallbackHowTo(angle);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* subtle gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Layers3 className="h-4.5 w-4.5 text-slate-700" />
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Content Angle
            </div>
            <div className="mt-0.5 text-sm text-slate-600">
              Cara membingkai ide jadi konten
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onCopy?.(angle)}
          disabled={!onCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5",
            "text-[11px] font-semibold text-slate-600",
            "border border-slate-200 hover:bg-slate-50",
            !onCopy && "cursor-not-allowed opacity-60"
          )}
          title="Copy angle"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>

      {/* Angle headline */}
      <div className="px-5 pb-4 pt-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Angle Utama
          </div>
          <div
            className="
              mt-2
              text-[15px]
              font-semibold
              leading-relaxed
              tracking-tight
              text-slate-900
            "
          >
            {angle}
          </div>
        </div>

        {/* How to execute */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#068773]">
            <Sparkles className="h-4 w-4" />
            Cara Eksekusi
          </div>

          <ol className="mt-3 space-y-3">
            {steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E6F4F1] text-[12px] font-semibold text-[#068773]">
                  {idx + 1}
                </div>
                <div className="text-[13px] leading-relaxed text-slate-700">
                  {step}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
