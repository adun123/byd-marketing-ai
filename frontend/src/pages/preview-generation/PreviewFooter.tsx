// src/pages/preview-generation/PreviewFooter.tsx

import {  Rocket } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type Props = {
  generatedAt?: string | number | Date | null;

  /** Disable tombol publish */
  publishDisabled?: boolean;

  /** Disable tombol draft */
  draftDisabled?: boolean;

  /** Klik Save to Draft */
  onSaveDraft: () => void;

  /** Klik Publish / Export */
  onPublish: () => void;

  draftLabel?: string;
  publishLabel?: string;

  /** Optional info text override */
  infoText?: string;
};

function formatTime(val: Props["generatedAt"]) {
  if (!val) return "";
  const d = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function PreviewFooter({
  generatedAt,
  publishDisabled = false,
  // draftDisabled = false,
  // onSaveDraft,
  onPublish,
  // draftLabel = "Save to Draft",
  publishLabel = "Publish / Export",
  infoText,
}: Props) {
  const t = formatTime(generatedAt);
  const mid =
    infoText ??
    (t ? `Preview generated at ${t}` : "Preview ready");

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40",
        "border-t border-slate-200/70 dark:border-slate-800/70",
        "bg-white/80 dark:bg-slate-950/70 backdrop-blur",
        "supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-slate-950/60"
      )}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Save to Draft */}
          {/* <button
            type="button"
            onClick={onSaveDraft}
            disabled={draftDisabled}
            className={cn(
              "inline-flex items-center gap-2",
              "rounded-2xl px-4 py-2.5",
              "border border-white/20",
              "bg-slate-900/5 dark:bg-white/5",
              "text-[13px] font-semibold text-slate-800 dark:text-slate-100",
              "hover:bg-slate-900/10 dark:hover:bg-white/10",
              "active:scale-[0.99] transition",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Simpan hasil preview ke Draft"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900/5 dark:bg-white/10">
              <FileDown className="h-4 w-4 opacity-80" />
            </span>
            <span className="hidden sm:inline">{draftLabel}</span>
            <span className="sm:hidden">Draft</span>
          </button> */}

          {/* Middle info */}
          <div className="hidden sm:flex min-w-0 items-center justify-center">
            <div className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
              {mid}
            </div>
          </div>

          {/* Right: Publish */}
          <button
            type="button"
            onClick={onPublish}
            disabled={publishDisabled}
            className={cn(
              "relative inline-flex items-center justify-center gap-2",
              "rounded-2xl px-5 py-3",
              "text-[13px] font-extrabold tracking-tight",
              "bg-[#068773] text-white",
              "shadow-[0_10px_30px_-18px_rgba(6,135,115,0.85)]",
              "hover:brightness-95 active:scale-[0.99] transition",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            )}
            title="Export / publish asset final"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/12">
              <Rocket className="h-4 w-4" />
            </span>
            {publishLabel}
          </button>
        </div>

        {/* Middle info for mobile */}
        <div className="mt-2 sm:hidden text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {mid}
        </div>
      </div>
    </div>
  );
}
