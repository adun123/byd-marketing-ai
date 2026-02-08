// src/pages/preview-generation/PreviewCanvasPanel.tsx
import * as React from "react";
import { Eye } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

// helpers (taruh di atas component file)
function isProbablyHtml(s: string) {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}

// sanitizer ringan: buang script + inline handlers
function sanitizeBasicHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function htmlToPlainText(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
}


type OutputItem = {
  id: string;
  imageUrl?: string; // preview expects this
  base64?: string;   // raw base64 OR data url
};

function aspectClass(aspect: "1:1" | "4:5" | "16:9" | "9:16") {
  if (aspect === "1:1") return "aspect-square";
  if (aspect === "4:5") return "aspect-[4/5]";
  if (aspect === "16:9") return "aspect-video";
  return "aspect-[9/16]";
}

function resolveSrc(it?: OutputItem | null) {
  if (!it) return undefined;

  if (it.imageUrl && it.imageUrl.trim()) return it.imageUrl;

  const b64 = (it.base64 || "").trim();
  if (b64) {
    if (b64.startsWith("data:")) return b64;

    const isJpeg = b64.startsWith("/9j/");
    const mime = isJpeg ? "image/jpeg" : "image/png";
    return `data:${mime};base64,${b64}`;
  }

  return undefined;
}


type Props = {
  title?: string;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  items: OutputItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  caption: string;
};

export default function PreviewCanvasPanel({
  title = "Content Preview",
  aspect,
  items,
  selectedId,
  onSelect,
  caption,
}: Props) {
  const selected = React.useMemo(() => {
    if (!items.length) return null;
    return items.find((x) => x.id === selectedId) ?? items[0];
  }, [items, selectedId]);

  const selectedSrc = resolveSrc(selected);

  const idx = selected ? Math.max(0, items.findIndex((x) => x.id === selected.id)) : 0;

  const [showRaw, setShowRaw] = React.useState(false);
const [expanded, setExpanded] = React.useState(false);

  return (
    <section className="space-y-3">
      <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="text-[#068773]">
              <Eye className="h-4 w-4" />
            </div>
            <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* mini debug pill (hapus kalau udah beres) */}
            <div className="rounded-full bg-slate-900/5 dark:bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Items {items.length}
            </div>

            {items.length > 0 ? (
              <div className="rounded-full bg-slate-900/5 dark:bg-white/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Slide {idx + 1}/{items.length}
              </div>
            ) : null}
          </div>
        </div>

        <div className="p-5">
          {/* Canvas */}
          <div
            className={cn(
              "relative w-full group bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden",
              aspectClass(aspect)
            )}
          >
            {selectedSrc ? (
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-slate-100 dark:bg-slate-950",
                  aspectClass(aspect)
                )}
              >
                <img
                  key={selected?.id}
                  src={selectedSrc}
                  alt="Preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/60 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
                  No preview yet
                </div>
              </div>
            )}
          </div>

          {/* Filmstrip */}
          {items.length > 1 ? (
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Frames
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                  Click to preview
                </div>
              </div>

              <div
                className={cn(
                  "flex gap-2 overflow-x-auto pb-2",
                  "[&::-webkit-scrollbar]:h-1.5",
                  "[&::-webkit-scrollbar-thumb]:rounded-full",
                  "[&::-webkit-scrollbar-thumb]:bg-slate-200/70",
                  "dark:[&::-webkit-scrollbar-thumb]:bg-slate-800/70"
                )}
              >
                {items.map((it, i) => {
                  const tSrc = resolveSrc(it);
                  const active = it.id === selected?.id;

                  return (
                    <button
                      key={`${it.id}-${i}`}
                      type="button"
                      onClick={() => onSelect(it.id)}
                      className={cn(
                        "relative shrink-0 overflow-hidden rounded-xl border",
                        "h-16 w-16 md:h-[72px] md:w-[72px]",
                        active
                          ? "border-[#068773]/50 ring-2 ring-[#068773]/20"
                          : "border-slate-200/70 dark:border-slate-800/70 hover:brightness-95"
                      )}
                      title={`Frame ${i + 1}`}
                    >
                      {tSrc ? (
                        <img
                          src={tSrc}
                          alt={`Frame ${i + 1}`}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] text-slate-400">
                          No image
                        </div>
                      )}

                      <div
                        className={cn(
                          "absolute bottom-1 right-1 rounded-md px-1.5 py-0.5",
                          active ? "bg-[#068773] text-white" : "bg-slate-900/60 text-white"
                        )}
                        style={{ fontSize: 9, fontWeight: 700 }}
                      >
                        {i + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // kalau 1 item, kasih hint kecil biar user ngerti
            <div className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              Single output (no carousel).
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 shadow-sm overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              Script / Caption
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Preview caption yang akan dipakai untuk posting.
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const text = isProbablyHtml(caption) ? htmlToPlainText(caption) : caption;
                navigator.clipboard.writeText(text || "");
              }}
              className={cn(
                "inline-flex items-center rounded-xl px-3 py-2 text-[11px] font-semibold",
                "border border-slate-200/70 dark:border-slate-800/70",
                "bg-white/80 dark:bg-slate-950/40",
                "text-slate-700 dark:text-slate-200",
                "hover:bg-white dark:hover:bg-slate-900"
              )}
              title="Copy plain text"
            >
              Copy
            </button>

            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className={cn(
                "inline-flex items-center rounded-xl px-3 py-2 text-[11px] font-semibold",
                "border border-slate-200/70 dark:border-slate-800/70",
                "bg-white/80 dark:bg-slate-950/40",
                "text-slate-700 dark:text-slate-200",
                "hover:bg-white dark:hover:bg-slate-900"
              )}
              title="Toggle raw/preview"
            >
              {showRaw ? "Preview" : "Raw"}
            </button>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={cn(
                "inline-flex items-center rounded-xl px-3 py-2 text-[11px] font-semibold",
                "border border-slate-200/70 dark:border-slate-800/70",
                "bg-white/80 dark:bg-slate-950/40",
                "text-slate-700 dark:text-slate-200",
                "hover:bg-white dark:hover:bg-slate-900"
              )}
              title="Expand"
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>

        {/* body */}
        <div
            className={cn(
              "px-5 py-4",
              "text-slate-700 dark:text-slate-200", // ⬅️ FORCE BASE COLOR
              expanded ? "" : "max-h-[360px] overflow-auto"
            )}
          >

          {!caption ? (
            <div className="text-[13px] text-slate-500 dark:text-slate-400">—</div>
          ) : showRaw ? (
            <pre className="whitespace-pre-wrap break-words text-[11.5px] leading-[1.55] text-slate-700 dark:text-slate-200">

              {caption}
            </pre>
          ) : isProbablyHtml(caption) ? (
            <div
              className={cn(
                "prose max-w-none",
                "prose-slate dark:prose-invert",

                // ukuran & spacing
                "text-[11.5px] leading-[1.55]",
                "prose-p:my-1.5 prose-p:leading-[1.55]",
                "prose-ul:my-1.5 prose-ol:my-1.5",
                "prose-li:my-0.5",

                // 🔥 FORCE TEXT COLOR (INI KUNCI)
                "prose-p:text-slate-700 dark:prose-p:text-slate-200",
                "prose-li:text-slate-700 dark:prose-li:text-slate-200",
                "prose-span:text-slate-700 dark:prose-span:text-slate-200",

                // emphasis
                "prose-strong:font-semibold",
                "prose-strong:text-[#068773] dark:prose-strong:text-emerald-400",
                "prose-em:text-slate-600 dark:prose-em:text-slate-300"
              )}
              dangerouslySetInnerHTML={{ __html: sanitizeBasicHtml(caption) }}
            />

          ) : (
            <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700 dark:text-slate-200">
              {caption}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
