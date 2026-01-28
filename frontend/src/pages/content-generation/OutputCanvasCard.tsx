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
    <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.22)]">
      {/* header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700">
              ✦
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">{title}</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {subtitle}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          {items.length > 0 ? <span className="hidden sm:inline">{updatedLabel}</span> : null}

          {items.length > 0 && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5",
                "text-[10px] font-semibold text-rose-700 hover:bg-rose-100"
              )}
              title="Clear canvas"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {/* body */}
      <div className="p-5">
        {/* Preview */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          {items.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="text-[12px] font-semibold text-slate-900">No output yet</div>
              <div className="mt-1 text-[11px] text-slate-500">
                Tulis prompt di panel kiri lalu klik <span className="font-semibold">Generate</span>.
              </div>

              <div className="mx-auto mt-4 max-w-md rounded-2xl border border-emerald-200/60 bg-white px-4 py-3 text-left">
                <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Contoh prompt
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  “BYD Seal electric car in a futuristic city at sunset, cinematic lighting”
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[420px]">
                <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)]">
                  {src ? (
                    <img
                      src={src}
                      alt="Generated"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                      Generated Preview
                    </div>
                  )}
                </div>

                {/* mini actions (Scale Up / Edit Result) */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={!latest}
                    onClick={() => latest && onScaleUp?.(latest)}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2",
                      "text-[11px] font-semibold transition",
                      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      !latest && "opacity-60"
                    )}
                    title="Scale up"
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
                      "border border-emerald-600/20 bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/15",
                      !latest && "opacity-60"
                    )}
                    title="Edit result"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Result
                  </button>
                </div>

                {/* tiny info */}
                <div className="mt-3 text-center text-[10px] text-slate-400">
                  {updatedLabel}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions (like screenshot) */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Pill label={metaLeft} />
            <Pill label={metaMid} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!latest}
              onClick={() => latest && onSaveDraft?.(latest)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2",
                "text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50",
                !latest && "cursor-not-allowed opacity-60"
              )}
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={!latest}
              onClick={() => latest && onExport?.(latest)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
                "text-[11px] font-semibold text-white transition",
                "bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-sm hover:-translate-y-0.5 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-emerald-600/25",
                !latest && "cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-sm"
              )}
            >
              <Upload className="h-4 w-4" />
              Export Result
            </button>

            {/* optional download shortcut */}
            {latest && src && onDownload ? (
              <button
                type="button"
                onClick={() => onDownload(src, `result-${latest.id}.png`)}
                className={cn(
                  "hidden md:inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2",
                  "text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                )}
                title="Download"
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
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600">
      {label}
    </span>
  );
}
