import { Tags } from "lucide-react";
import { cn } from "../../../lib/cn";

type Props = {
  keywords: string;
  setKeywords: (v: string) => void;
  label?: string;
  placeholder?: string;
};

export default function TargetKeywordsSection({
  keywords,
  setKeywords,
  label = "Target Keywords",
  placeholder = "e.g. EV, Safety, Performance",
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#068773]/10 text-[#068773]">
          <Tags className="h-3 w-3" />
        </span>
        {label}
      </div>

      {/* Input */}
      <input
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-2xl border px-3 text-[12px]",
          "border-slate-200/80 dark:border-slate-800/80",
          "bg-white dark:bg-slate-950",
          "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "outline-none transition focus:border-[#068773]/35 focus:ring-2 focus:ring-[#068773]/15"
        )}
      />
    </div>
  );
}
