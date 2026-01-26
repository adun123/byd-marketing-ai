import { Copy, Sparkles } from "lucide-react";

type Props = {
  title: string;
  items: string[];
  onUse?: (text: string) => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function TrendIdeaCard({ title, items, onUse }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-br from-[#068773] to-[#0fb9a8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm font-semibold text-white">{title}</div>
        </div>

        <button
          type="button"
          disabled={!onUse}
          onClick={() => onUse?.(items[0] ?? "")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold",
            "bg-white/90 text-[#068773] hover:bg-white transition-colors",
            !onUse && "opacity-60 cursor-not-allowed"
          )}
          title="Gunakan ide pertama"
        >
          <Copy className="h-3.5 w-3.5" />
          Pakai
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        {items.map((t, idx) => (
          <div
            key={idx}
            className={cn(
              "relative rounded-xl border px-3 py-2.5",
              "bg-slate-50 border-slate-200"
            )}
          >
            {/* Accent bar */}
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-[#068773] to-[#0fb9a8]" />

            <div className="pl-2 text-[12px] leading-snug text-slate-800">
              {t}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
