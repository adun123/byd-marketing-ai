import { Users } from "lucide-react";
import { cn } from "../../../lib/cn";

export type TargetAudienceSectionProps = {
  presetAudiences: string[];
  audiences: string[];
  toggleAudience: (audience: string) => void;

  audienceCustom: string;
  setAudienceCustom: (v: string) => void;
  addCustomAudience: () => void;

  title?: string;
};

export default function TargetAudienceSection({
  presetAudiences,
  audiences,
  toggleAudience,
  audienceCustom,
  setAudienceCustom,
  addCustomAudience,
  title = "Target Audience",
}: TargetAudienceSectionProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#068773]/10 text-[#068773]">
          <Users className="h-3 w-3" />
        </span>
        {title}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {presetAudiences.map((a) => {
          const active = audiences.includes(a);

          return (
            <button
              key={a}
              type="button"
              onClick={() => toggleAudience(a)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                active
                  ? "border-[#068773]/25 bg-[#068773]/10 text-[#056d5c] dark:text-emerald-200"
                  : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              {a}
            </button>
          );
        })}
      </div>

      {/* Custom input */}
      <div className="mt-3">
        <input
          value={audienceCustom}
          onChange={(e) => setAudienceCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              addCustomAudience();
            }
          }}
          placeholder="Add a custom audience…"
          className={cn(
            "h-10 w-full rounded-2xl border px-3 text-[12px]",
            "border-slate-200/80 dark:border-slate-800/80",
            "bg-white dark:bg-slate-950",
            "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "outline-none transition focus:border-[#068773]/35 focus:ring-2 focus:ring-[#068773]/15"
          )}
        />

        <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
          Press <span className="font-semibold text-slate-700 dark:text-slate-200">Enter</span>{" "}
          to add.
        </div>
      </div>
    </div>
  );
}
