// src/pages/marketing-dashboard/playground/OutputSectionCard.tsx
import { Star, RotateCcw } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function OutputSectionCard({
  title,
  subtitle,
  items,
  onPin,
  isGenerating,
  variant = "singleline",
}: {
  title: string;
  subtitle: string;
  items: string[];
  onPin: (text: string) => void;
  isGenerating: boolean;
  variant?: "singleline" | "multiline";
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-slate-900">{title}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>
        </div>

        <button
          type="button"
          disabled
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-400",
            "cursor-not-allowed"
          )}
          title="Nanti bisa regenerate per section"
        >
          <RotateCcw className="h-4 w-4" />
          Regenerate
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="space-y-2">
          {items.map((text, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-2xl border border-slate-200 bg-white p-3 transition hover:bg-slate-50/60",
                isGenerating && "opacity-70"
              )}
            >
              <div className={cn("text-[12px] text-slate-800", variant === "multiline" && "whitespace-pre-wrap")}>
                {text}
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onPin(text)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Star className="h-4 w-4 text-[#068773]" />
                  Pin
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
