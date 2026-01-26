
import { Download, Play, Loader2, Film } from "lucide-react";

export type VideoOutput = {
  id: string;
  prompt: string;
  createdAt: number;

  status?: "processing" | "done" | "failed";
  videoUrl?: string;     // contoh: http://localhost:4000/...mp4
  posterUrl?: string;    // thumbnail optional
  error?: string;
};

type Props = {
  items: VideoOutput[];
  isGenerating?: boolean;

  onDownload?: (item: VideoOutput) => void;
  onSelect?: (item: VideoOutput) => void; // kalau mau click-to-preview
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function VideoCanvas({ items, isGenerating, onDownload, onSelect }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <div className="text-xs font-semibold text-slate-900">Video Canvas</div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            Hasil video akan muncul sebagai gallery.
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          {items.length > 0
            ? `Terakhir: ${new Date(items[0].createdAt).toLocaleTimeString("id-ID")}`
            : isGenerating
            ? "Rendering..."
            : "Belum ada output"}
        </div>
      </div>

      <div className="p-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white shadow-sm">
              <Film className="h-5 w-5" />
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-900">
              No video yet
            </div>
            <div className="mt-1 text-[11px] text-slate-600">
              Tulis prompt, pilih format & durasi, lalu klik <span className="font-semibold">Generate</span>.
            </div>

            <div className="mx-auto mt-4 max-w-md rounded-xl border border-emerald-200/60 bg-white px-3 py-2 text-left text-[11px] text-slate-600">
              <div className="text-[10px] font-semibold text-emerald-700">Contoh prompt</div>
              <div className="mt-1">
                “BYD car driving in rainy neon city, cinematic, slow motion, dramatic lighting”
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => {
              const status = it.status ?? (it.videoUrl ? "done" : "processing");
              const canDownload = !!it.videoUrl && status === "done";

              return (
                <div
                  key={it.id}
                  className={cn(
                    "group rounded-2xl border bg-white p-3 shadow-sm transition",
                    status === "failed"
                      ? "border-red-200"
                      : "border-slate-200 hover:border-emerald-200/70 hover:shadow-md"
                  )}
                >
                  {/* Preview box */}
                  <button
                    type="button"
                    onClick={() => onSelect?.(it)}
                    className="group relative mb-2 block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                    style={{ aspectRatio: "16/9" }}
                    title="Open preview"
                  >
                    {it.posterUrl ? (
                      <img
                        src={it.posterUrl}
                        alt="Video poster"
                        className="h-full w-full object-cover transition group-hover:scale-[1.01]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {status === "processing" ? (
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Rendering…
                          </div>
                        ) : status === "failed" ? (
                          <span className="text-[11px] text-red-600">Failed</span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Video Preview</span>
                        )}
                      </div>
                    )}

                    {/* Play overlay */}
                    {status === "done" && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                          <Play className="h-5 w-5" />
                        </div>
                      </div>
                    )}

                    {/* Download button */}
                    {canDownload && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDownload?.(it);
                        }}
                        className="
                          absolute right-2 top-2
                          inline-flex items-center gap-1
                          rounded-lg bg-black/60 px-2 py-1
                          text-[11px] font-semibold text-white
                          opacity-0 transition
                          hover:bg-black/80
                          group-hover:opacity-100
                        "
                        title="Download video"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    )}
                  </button>

                  {/* Meta */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold text-slate-700">
                        Instruction
                      </div>
                      <div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                        {it.prompt}
                      </div>
                    </div>

                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold",
                        status === "done"
                          ? "border-emerald-200/60 bg-emerald-50 text-emerald-700"
                          : status === "processing"
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      {status === "done" ? "Rendered" : status === "processing" ? "Processing" : "Failed"}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400">
                    {new Date(it.createdAt).toLocaleTimeString("id-ID")}
                    {status === "failed" && it.error ? ` • ${it.error}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
