
import { ArrowRight } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  text: string;
  badge: string;
  onUse?: (text: string) => void;
};

export default function DraftHookCard({ text, badge, onUse }: Props) {
  return (
    <div
      className={cn(
        "group rounded-2xl border p-4 transition",
        "border-slate-200/80 dark:border-slate-800/80",
        "bg-white dark:bg-slate-950",
        "hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
      )}
    >
      {/* Hook text */}
      <div className="text-[13px] font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
        “{text}”
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
          {badge}
        </span>

        {/* Use action */}
        <button
          type="button"
          onClick={() => onUse?.(text)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5",
            "text-[11px] font-semibold transition",
            "text-[#068773]",
            "hover:bg-[#068773]/10",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/20"
          )}
        >
          Use this
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
