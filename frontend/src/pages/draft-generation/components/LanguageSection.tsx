import { cn } from "../../../lib/cn";

export type Language = "id" | "en";

type Props = {
  language: Language;
  setLanguage: (v: Language) => void;
  label?: string;
};

export default function LanguageSection({
  language,
  setLanguage,
  label = "Language",
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
        {label}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setLanguage("id")}
          className={cn(
            "rounded-2xl border px-3 py-2 text-[11px] font-semibold transition",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
            language === "id"
              ? "border-[#068773]/25 bg-[#068773]/10 text-[#056d5c] dark:text-emerald-200"
              : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          Indonesia
        </button>

        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={cn(
            "rounded-2xl border px-3 py-2 text-[11px] font-semibold transition",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
            language === "en"
              ? "border-[#068773]/25 bg-[#068773]/10 text-[#056d5c] dark:text-emerald-200"
              : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          English
        </button>
      </div>
    </div>
  );
}
