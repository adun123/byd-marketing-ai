// src/pages/content-generation/components/OutputCanvasCard.tsx

import { Download, Pencil, Sparkles, Trash2, Upload } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type CanvasItem = {
  id: string | number;
  createdAt: string | number | Date;
  prompt: string;
  imageUrl?: string;
  base64?: string;
};

type Props = {
  title?: string;
  subtitle?: string;

  items: CanvasItem[];
  onClear?: () => void;

  // main actions
  onScaleUp?: (item: CanvasItem) => void;
  onEdit?: (item: CanvasItem) => void;
  onExport?: (item: CanvasItem) => void;
  onSaveDraft?: (item: CanvasItem) => void;

  // optional util
  onDownload?: (src: string, filename: string) => void;

  // display meta (optional)
  metaLeft?: string;  // e.g. "1080 x 1080"
  metaMid?: string;   // e.g. "2.4 MB"
};

export default function OutputCanvasCard({
  title = "Output Canvas",
  subtitle = "Preview generated content",
  items,
  onClear,
  onScaleUp,
  onEdit,
  onExport,
  onSaveDraft,
  onDownload,
  metaLeft = "1080 x 1080",
  metaMid = "—",
}: Props) {
  const latest = items?.[0];
  const src = latest?.imageUrl
    ? latest.imageUrl
    : latest?.base64
    ? `data:image/png;base64,${latest.base64}`
    : "";

  const updatedLabel = latest
    ? `Terakhir: ${new Date(latest.createdAt).toLocaleTimeString("id-ID")}`
    : "Belum ada output";

return (
  <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
    {/* header */}
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
      <div className="min-w-0 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
          ✦
        </span>

        <div className="min-w-0">
          <div className="truncate text-[12px] font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </div>
          <div className="mt-0.5 truncate text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            {subtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {items.length > 0 ? (
          <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500">
            {updatedLabel}
          </span>
        ) : null}

        {items.length > 0 && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2",
              "border-rose-200/80 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30",
              "text-[11px] font-semibold text-rose-700 dark:text-rose-300",
              "hover:bg-rose-100 dark:hover:bg-rose-950/40"
            )}
            title="Clear canvas"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        ) : null}
      </div>
    </div>

    {/* body */}
    <div className="p-4">
      {/* Preview block */}
      <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-4">
        {items.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
              No output yet
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Write a prompt on the left, then click <b>Generate</b>.
            </div>

            <div className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-[#068773]/20 bg-white/70 dark:bg-slate-900/60 px-4 py-3 text-left">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#068773]">
                Example prompt
              </div>
              <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                “BYD Seal electric car in a futuristic city at sunset, cinematic lighting”
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[520px]">
              <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)]">
                <div className="relative aspect-square">
                  {src ? (
                    <img
                      src={src}
                      alt="Generated"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-[11px] text-slate-400">
                      Generated Preview
                    </div>
                  )}

                  {/* subtle overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>

              {/* actions */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={!latest}
                  onClick={() => latest && onScaleUp?.(latest)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2",
                    "text-[11px] font-semibold transition",
                    "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                    "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40",
                    !latest && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Scale Up
                </button>

                <button
                  type="button"
                  disabled={!latest}
                  onClick={() => latest && onEdit?.(latest)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2",
                    "text-[11px] font-semibold transition",
                    "border border-[#068773]/20 bg-[#068773]/10 text-[#068773]",
                    "hover:bg-[#068773]/15",
                    !latest && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Result
                </button>
              </div>

              <div className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500">
                {updatedLabel}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* footer actions */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={metaLeft} />
          <Pill label={metaMid} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!latest}
            onClick={() => latest && onSaveDraft?.(latest)}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border px-4 py-2",
              "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
              "text-[11px] font-semibold text-slate-700 dark:text-slate-200",
              "hover:bg-slate-50 dark:hover:bg-slate-800/40",
              !latest && "cursor-not-allowed opacity-60"
            )}
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={!latest}
            onClick={() => latest && onExport?.(latest)}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
              "text-[11px] font-semibold text-white transition",
              "bg-gradient-to-r from-[#068773] to-[#0fb9a8] shadow-sm ring-1 ring-[#068773]/25",
              "hover:brightness-105 active:brightness-95",
              "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
              !latest && "cursor-not-allowed opacity-60"
            )}
          >
            <Upload className="h-4 w-4" />
            Export
          </button>

          {latest && src && onDownload ? (
            <button
              type="button"
              onClick={() => onDownload(src, `result-${latest.id}.png`)}
              className={cn(
                "hidden md:inline-flex items-center gap-2 rounded-2xl border px-3 py-2",
                "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                "text-[11px] font-semibold text-slate-700 dark:text-slate-200",
                "hover:bg-slate-50 dark:hover:bg-slate-800/40"
              )}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          ) : null}
        </div>
      </div>
    </div>
  </div>
);

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
      {label}
    </span>
  );
}
}