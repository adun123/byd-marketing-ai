// src/pages/content-generation/Composer.tsx
import { Plus, X, Sparkles, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

export type Aspect = "1:1" | "4:5" | "16:9" | "9:16";
export type Quality = "draft" | "standard" | "high";
export type Model = "banana" | "gemini" | "other";

type Attachment = {
  id: string;
  file: File;
  preview: string;
};

type Props = {
  prompt: string;
  setPrompt: (v: string) => void;

  attachments: Attachment[];
  setAttachments: (v: Attachment[]) => void;

  aspect: Aspect;
  setAspect: (v: Aspect) => void;

  quality: Quality;
  setQuality: (v: Quality) => void;

  model: Model;
  setModel: (v: Model) => void;

  onGenerate: () => void;
  isGenerating: boolean;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function Composer({
  prompt,
  setPrompt,
  attachments,
  setAttachments,
  aspect,
  setAspect,
  quality,
  setQuality,
  model,
  setModel,
  onGenerate,
  isGenerating,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  function autosize() {
    const el = taRef.current;
    if (!el) return;

    el.style.height = "0px";
    const max = 220;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }

  useEffect(() => {
    autosize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setAttachments([...attachments, ...next]);
  }

  function remove(id: string) {
    const item = attachments.find((a) => a.id === id);
    if (item) URL.revokeObjectURL(item.preview);
    setAttachments(attachments.filter((a) => a.id !== id));
  }

  const promptTooShort = prompt.trim().length < 4;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
            >
              <img src={a.preview} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(a.id)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
          title="Add images"
        >
          <Plus className="h-4 w-4" />
        </button>

        <textarea
          ref={taRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          style={{ overflowY: "hidden" }}
          placeholder="Tulis prompt di sini..."
        />

        <button
          type="button"
          disabled={isGenerating || promptTooShort}
          onClick={onGenerate}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
            isGenerating || promptTooShort
              ? "bg-slate-200 text-slate-500"
              : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          <Sparkles className="h-4 w-4" />
          Generate
        </button>
      </div>

      {/* Options bar (chip style) */}
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
    {/* Aspect chip */}
    <div className="relative">
        <select
        value={aspect}
        onChange={(e) => setAspect(e.target.value as any)}
        className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 text-[11px] font-semibold text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-400"
        title="Aspect"
        >
        <option value="1:1">1:1</option>
        <option value="4:5">4:5</option>
        <option value="16:9">16:9</option>
        <option value="9:16">9:16</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>

    {/* Quality chip */}
    <div className="relative">
        <select
        value={quality}
        onChange={(e) => setQuality(e.target.value as any)}
        className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 text-[11px] font-semibold text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-400"
        title="Quality"
        >
        <option value="draft">Draft</option>
        <option value="standard">Standard</option>
        <option value="high">Full HD</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>

    {/* Model chip (with label inside) */}
    <div className="relative">
        {/* label "Model" di dalam chip */}
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-violet-600">
        Model
        </span>

        <select
        value={model}
        onChange={(e) => setModel(e.target.value as any)}
        className="h-9 appearance-none rounded-full border border-slate-200 bg-white pl-16 pr-8 text-[11px] font-semibold text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-400"
        title="Model"
        >
        <option value="banana">Google Nana banana</option>
        <option value="gemini">Gemini</option>
        <option value="other">Other</option>
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
    </div>


      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
