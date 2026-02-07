import * as React from "react";

type MaskEditorProps = {
  /** Image URL (dataURL / absolute / relative) */
  src: string;

  /** Close panel */
  onClose: () => void;

  /**
   * Called when user clicks Apply.
   * You will receive the PNG mask blob (white = remove), plus optional prompt.
   */
  onApply: (args: { maskBlob: Blob; prompt?: string }) => Promise<void>;

  /** Optional controlled prompt */
  prompt: string;
  setPrompt: (v: string) => void;

  /** Brush control */
  brushSize: number;
  setBrushSize: (v: number) => void;

  /** Loading / error state controlled by parent */
  loading?: boolean;
  error?: string | null;

  /**
   * Optional aspect ratio for editor area.
   * Examples: "1 / 1", "4 / 5", "16 / 9", "9 / 16"
   */
  aspectRatio?: string;

  /**
   * Optional: show hint overlay label text
   */
  hintText?: string;
};

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

/**
 * MaskEditor
 * - White stroke = area to remove
 * - Transparent/empty = keep
 * - Exports PNG mask blob via onApply()
 */
export default function MaskEditor({
  src,
  onClose,
  onApply,
  prompt,
  setPrompt,
  brushSize,
  setBrushSize,
  loading = false,
  error = null,
  aspectRatio = "1 / 1",
  hintText = "Coret area yang mau dihapus (putih = dihapus)",
}: MaskEditorProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const undoStack = React.useRef<ImageData[]>([]);
  const isDrawingRef = React.useRef(false);

  // Sync canvas size with wrapper (responsive)
  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const sync = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      if (canvas.width === w && canvas.height === h) return;

      canvas.width = w;
      canvas.height = h;

      // reset mask on resize (simple & safe)
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, w, h);
      undoStack.current = [];
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [src]);

  const getCtx = () => canvasRef.current?.getContext("2d");

  const pushUndo = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStack.current.push(snap);
      if (undoStack.current.length > 25) undoStack.current.shift();
    } catch {
      // ignore
    }
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const last = undoStack.current.pop();
    if (!last) return;
    ctx.putImageData(last, 0, 0);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    pushUndo();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(255,255,255,1)"; // white = remove
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    pushUndo();
    drawAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    drawAt(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    isDrawingRef.current = false;
  };

  const exportMaskBlob = async (): Promise<Blob> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not ready");

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png")
    );

    if (!blob) throw new Error("Failed to export mask");
    return blob;
  };

  const handleApply = async () => {
    const maskBlob = await exportMaskBlob();
    await onApply({ maskBlob, prompt: prompt.trim() || undefined });
  };

  return (
    <div className="mt-4 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Mask Editor
          </div>
          <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
            {hintText}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
        >
          Close
       z
        </button>
      </div>

      {/* Preview area */}
      <div
        ref={wrapRef}
        className="mt-3 relative w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        style={{ aspectRatio }}
      >
        {/* image */}
        <img
          src={src}
          alt="Mask target"
          className="absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
        />

        {/* canvas */}
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 h-full w-full touch-none",
            "cursor-crosshair"
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {/* hint overlay */}
        <div className="pointer-events-none absolute left-3 bottom-3 rounded-2xl bg-black/40 px-3 py-2 text-[10px] text-white">
          Draw to mask • Brush {brushSize}px
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="text-[11px] text-slate-700 dark:text-slate-200">
          Brush
          <input
            type="range"
            min={8}
            max={80}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="ml-2 align-middle"
          />
        </label>

        <button
          type="button"
          onClick={undo}
          disabled={loading}
          className={cn(
            "rounded-2xl border px-3 py-2 text-[11px] font-semibold",
            "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
            "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40",
            loading && "opacity-60 cursor-not-allowed"
          )}
        >
          Undo
        </button>

        <button
          type="button"
          onClick={clear}
          disabled={loading}
          className={cn(
            "rounded-2xl border px-3 py-2 text-[11px] font-semibold",
            "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
            loading && "opacity-60 cursor-not-allowed"
          )}
        >
          Clear
        </button>
      </div>

      {/* Prompt (optional) */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Optional prompt: contoh 'hapus plat nomor, isi area bumper natural, tetap realistis'"
        className="mt-3 w-full resize-none rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#068773]/25"
      />

      {error ? (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
            "text-[11px] font-semibold text-white transition",
            "bg-gradient-to-r from-[#068773] to-[#0fb9a8] shadow-sm ring-1 ring-[#068773]/25",
            "hover:brightness-105 active:brightness-95",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {loading ? "Applying..." : "Apply Mask Edit"}
        </button>
      </div>
    </div>
  );
}
