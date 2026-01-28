import { Clock, Save, History, ArrowRight } from "lucide-react";

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
  lastSavedLabel = "Auto-saved at 14:42 PM",
  onViewHistory,
  onSaveDraft,
  onFinalize,
  disabled,
}: Props) {
  return (
    <div className="sticky bottom-0 z-30 mt-6 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* LEFT ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewHistory}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2",
              "text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            )}
          >
            <History className="h-4 w-4" />
            View History
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2",
              "text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            )}
          >
            <Save className="h-4 w-4" />
            Save to Drafts
          </button>
        </div>

        {/* RIGHT STATUS + CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="h-4 w-4" />
            {lastSavedLabel}
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onFinalize}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white",
              "bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-sm transition",
              "hover:-translate-y-0.5 hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-emerald-600/30",
              disabled && "cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none"
            )}
          >
            FINALIZE CONTENT
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
