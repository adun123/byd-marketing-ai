// src/pages/trends-generation/SingleIdeaCard.tsx
import { Copy } from "lucide-react";

type Props = {
  title: string;
  text?: string;
  onCopy?: (text: string) => void;
};

export default function SingleIdeaCard({ title, text, onCopy }: Props) {
  if (!text) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-700">
          {title}
        </div>

        <button
          type="button"
          onClick={() => onCopy?.(text)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </div>

      <div className="relative rounded-xl bg-slate-50 px-3 py-3">
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-[#068773] to-[#0fb9a8]" />
        <div className="pl-2 text-sm leading-relaxed text-slate-800">
          {text}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-slate-500">
        Ditampilkan 1 ide terbaik untuk kamu.
      </div>
    </div>
  );
}
