import { Clock,  ArrowRight } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  lastSavedLabel?: string;
  onViewHistory?: () => void;
  onSaveDraft?: () => void;
  onFinalize?: () => void;
  disabled?: boolean;
};

export default function DraftFooter({
  lastSavedLabel = "",
  // onViewHistory,
  // onSaveDraft,
  onFinalize,
  disabled,
}: Props) {
  return (
    <footer
      className="
        sticky bottom-0 z-30
        border-t border-slate-200/80 dark:border-slate-800/80
        bg-white/90 dark:bg-slate-950/85
        backdrop-blur
      "
      style={{
        height: "96px",
        ["--footer-h" as any]: "96px",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4">
        {/* LEFT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* <button
            type="button"
            onClick={onViewHistory}
            className="
              inline-flex items-center gap-2 rounded-xl
              border border-slate-200/80 dark:border-slate-800/80
              bg-white dark:bg-slate-900
              px-4 py-2
              text-xs font-semibold text-slate-700 dark:text-slate-200
              transition hover:bg-slate-50 dark:hover:bg-slate-800/60
            "
          >
            <History className="h-4 w-4" />
            View History
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="
              inline-flex items-center gap-2 rounded-xl
              border border-slate-200/80 dark:border-slate-800/80
              bg-white dark:bg-slate-900
              px-4 py-2
              text-xs font-semibold text-slate-700 dark:text-slate-200
              transition hover:bg-slate-50 dark:hover:bg-slate-800/60
            "
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button> */}
        </div>

        {/* RIGHT STATUS + CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            {lastSavedLabel}
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onFinalize}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-3",
              "text-xs font-semibold text-white transition-all",
              "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
              "focus:outline-none focus:ring-2 focus:ring-[#068773]/30",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:-translate-y-0.5 hover:shadow-md"
            )}
          >
            FINALIZE
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

