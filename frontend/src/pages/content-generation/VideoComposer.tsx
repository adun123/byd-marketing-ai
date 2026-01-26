// src/pages/content-generation/VideoComposer.tsx
import * as React from "react";
import { Plus, X, Film, ChevronDown } from "lucide-react";

export type VideoWorkflow = "text_to_video" | "image_to_video";
export type VideoQuality = "draft" | "standard" | "high";

export type VideoAttachment = {
  id: string;
  file: File;
  preview: string;
};

type Props = {
  prompt: string;
  setPrompt: (v: string) => void;

  attachments: VideoAttachment[];
  setAttachments: (v: VideoAttachment[]) => void;

  workflow: VideoWorkflow;

  // optional knobs (kalau belum dipakai, boleh dihapus)
  durationSec?: number;
  setDurationSec?: (v: number) => void;

  quality?: VideoQuality;
  setQuality?: (v: VideoQuality) => void;

  isGenerating: boolean;
  onGenerate: () => void;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function VideoComposer({
  prompt,
  setPrompt,
  attachments,
  setAttachments,
  workflow,
  durationSec,
  setDurationSec,
  quality,
  setQuality,
  isGenerating,
  onGenerate,
}: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  const needsImage = workflow === "image_to_video";
  const promptTooShort = prompt.trim().length < 4;
  const missingImage = needsImage && attachments.length === 0;

  function autosize() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    const max = 180;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }

  React.useEffect(() => {
    autosize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    // untuk image_to_video, biasanya cukup 1 reference image
    const f = files[0];
    const next: VideoAttachment = {
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
    };

    // revoke preview lama biar gak leak
    attachments.forEach((a) => URL.revokeObjectURL(a.preview));
    setAttachments([next]);
  }

  function remove(id: string) {
    const item = attachments.find((a) => a.id === id);
    if (item) URL.revokeObjectURL(item.preview);
    setAttachments(attachments.filter((a) => a.id !== id));
  }

  const disabled = isGenerating || missingImage || (!needsImage && promptTooShort) || (needsImage && promptTooShort);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      {/* Top hint bar */}
      <div className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/80 to-white px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800">
            <Film className="h-4 w-4" />
            {needsImage ? "Image to Video" : "Text to Video"}
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-slate-600">
            {needsImage
              ? "Upload 1 gambar referensi, lalu tulis instruksi animasi (kamera, mood, gerakan)."
              : "Tulis prompt video yang jelas: subject, scene, motion, style, lighting."}
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold",
            isGenerating
              ? "border-emerald-200/60 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-white text-slate-600"
          )}
        >
          {isGenerating ? "Rendering" : "Ready"}
        </span>
      </div>

      {/* Attachments (only shown when exist OR workflow needs) */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-700">
            Reference Image {needsImage ? <span className="text-red-500">*</span> : <span className="text-slate-400">(optional)</span>}
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {attachments.length > 0 ? (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                <img src={a.preview} alt="reference" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/75"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : needsImage ? (
          <div className="mt-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 px-3 py-2 text-[11px] text-slate-600">
            Upload 1 gambar untuk dianimasikan.
          </div>
        ) : (
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            Kamu bisa upload gambar sebagai referensi (opsional).
          </div>
        )}
      </div>

      {/* Prompt input */}
      <div className="flex items-end gap-2">
        <textarea
          ref={taRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className={cn(
            "flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none",
            "focus:border-slate-400",
            missingImage ? "border-slate-200" : "border-slate-200"
          )}
          style={{ overflowY: "hidden" }}
          placeholder={
            needsImage
              ? 'Contoh: "Gerakan kamera dolly-in pelan, hujan tipis, cinematic, highlight reflections, jangan ubah bentuk mobil."'
              : 'Contoh: "BYD car driving through rainy neon city, slow motion, cinematic lighting, smooth camera pan."'
          }
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onGenerate}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
            disabled
              ? "bg-slate-200 text-slate-500"
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
          title={
            missingImage
              ? "Upload reference image dulu"
              : promptTooShort
              ? "Prompt terlalu pendek"
              : "Render video"
          }
        >
          <Film className="h-4 w-4" />
          Render
        </button>
      </div>

      {/* Optional controls row */}
      {(setDurationSec || setQuality) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
          {setDurationSec && (
            <div className="relative">
              <select
                value={durationSec ?? 8}
                onChange={(e) => setDurationSec?.(Number(e.target.value))}
                className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 text-[11px] font-semibold text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-400"
                title="Duration"
              >
                <option value={5}>5s</option>
                <option value={8}>8s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          )}

          {setQuality && (
            <div className="relative">
              <select
                value={quality ?? "standard"}
                onChange={(e) => setQuality?.(e.target.value as VideoQuality)}
                className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 text-[11px] font-semibold text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-400"
                title="Quality"
              >
                <option value="draft">Draft</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          )}

          {/* small helper */}
          <div className="text-[11px] text-slate-500">
            Tips: sebutkan motion (pan/zoom), mood (cinematic/ugc), dan lighting.
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
