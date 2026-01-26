// src/pages/trends-generation/TrendingHookCard.tsx
import { Copy, Sparkles, Eye } from "lucide-react";

type Props = {
  hook: string;
  visualBrief?: string;
  onCopy?: (text: string) => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function fallbackBrief(hook: string) {
  // placeholder: nanti kalau backend sudah return visualBrief, tinggal pakai dari props
  return `Split screen. Kiri: situasi yang relevan dengan hook (ramai/kontras). Kanan: creator/produk muncul dengan ekspresi yang “confident”, highlight benefit utama. Tambahkan text overlay singkat yang nyambung: "${hook.slice(
    0,
    32
  )}${hook.length > 32 ? "..." : ""}"`;
}


export default function TrendingHookCard({ hook, visualBrief, onCopy }: Props) {
  const brief = visualBrief?.trim() ? visualBrief : fallbackBrief(hook);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Eye className="h-5 w-5 text-slate-700" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              Hook Nyolok Mata <span className="text-slate-400">(0–3s)</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Format hook untuk stop scroll
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onCopy?.(hook)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2",
            "text-xs font-semibold text-slate-700 hover:bg-slate-50",
            !onCopy && "opacity-60 cursor-not-allowed"
          )}
          disabled={!onCopy}
          title="Copy hook"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </div>

      {/* hook quote */}
      <div className="px-4 pb-4">
        <div className="relative rounded-2xl bg-slate-50 px-4 py-4">
          {/* accent bar */}
          <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-gradient-to-b from-[#068773] to-[#0fb9a8]" />
          <div className="pl-2">
            <div className="text-sm font-semibold italic leading-relaxed text-slate-800">
              “{hook}”
            </div>
          </div>
        </div>

        {/* visual brief */}
        <div className="mt-3 rounded-2xl border border-slate-200 bg-[#F3F8F7] p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#068773]">
            <Sparkles className="h-4 w-4" />
            VISUAL BRIEF (HOOK)
          </div>
          <div className="text-[12px] leading-relaxed text-slate-700">
            {brief}
          </div>
        </div>
      </div>
    </div>
  );
}
