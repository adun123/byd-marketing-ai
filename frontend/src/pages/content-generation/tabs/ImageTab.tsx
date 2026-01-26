
import { Download } from "lucide-react";
import OptionsPanel from "../OptionsPanel";
import Composer from "../Composer";
import type { Workflow, VisualStyle } from "../OptionsPanel";
import type { GeneratedOutput } from "../types";

type Props = {
  // state
  workflow: Workflow;
  setWorkflow: (v: Workflow) => void;

  visualStyle: VisualStyle;
  setVisualStyle: (v: VisualStyle) => void;

  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  setAspect: (v: "1:1" | "4:5" | "16:9" | "9:16") => void;

  quality: "draft" | "standard" | "high";
  setQuality: (v: "draft" | "standard" | "high") => void;

  model: "banana" | "gemini" | "other";
  setModel: (v: "banana" | "gemini" | "other") => void;

  prompt: string;
  setPrompt: (v: string) => void;

  attachments: any[];
  setAttachments: (v: any[]) => void;

  items: GeneratedOutput[];
  setItems: React.Dispatch<React.SetStateAction<GeneratedOutput[]>>;

  // OPTIONAL: kalau memang ada di parent
  selectedItem?: GeneratedOutput | null;
  setSelectedItem?: (v: GeneratedOutput | null) => void;

  preview?: string | null;
  setPreview?: (v: string | null) => void;

  // actions
  isGenerating: boolean;
  onGenerate: (prompt: string) => void;
  onDownload: (src: string, filename: string) => void;
};


export default function ImageTab({
  workflow,
  setWorkflow,
  visualStyle,
  setVisualStyle,
  aspect,
  setAspect,
  quality,
  setQuality,
  model,
  setModel,
  prompt,
  setPrompt,
  attachments,
  setAttachments,
  items,
  isGenerating,
  onGenerate,
  onDownload,
  setItems,
  setSelectedItem,
  setPreview,
}: Props) {

 
function handleClearCanvas() {
  const ok = window.confirm("Hapus semua hasil di canvas?");
  if (!ok) return;

  setItems([]);
  setSelectedItem?.(null);
  setPreview?.(null);
}



  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* LEFT (IMAGE OPTIONS) */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-emerald-200/60 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-xs font-semibold text-slate-900">Options</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Sesuaikan kebutuhan output
            </div>
          </div>

          <div className="p-3">
            <OptionsPanel
              workflow={workflow}
              visualStyle={visualStyle}
              aspect={aspect}
              onChange={(v) => {
                if (v.workflow) setWorkflow(v.workflow);
                if (v.visualStyle) setVisualStyle(v.visualStyle);
                if (v.aspect) setAspect(v.aspect);
              }}
            />
          </div>
        </div>
      </aside>

      {/* RIGHT (IMAGE CANVAS + COMPOSER) */}
      <section className="min-w-0">
        
        {/* Canvas */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <div className="text-xs font-semibold text-slate-900">Canvas</div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Hasil generate & edit gambar
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                  title="Clear canvas"
                >
                  🗑 Clear
                </button>
              )}

              <span>
                {items.length > 0
                  ? `Terakhir: ${new Date(items[0].createdAt).toLocaleTimeString("id-ID")}`
                  : "Belum ada output"}
              </span>
            </div>

          </div>

          <div className="p-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-10 text-center">
                <div className="text-sm font-semibold text-slate-900">No output yet</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Tulis prompt di bawah lalu klik{" "}
                  <span className="font-semibold">Generate</span>.
                </div>

                <div className="mx-auto mt-4 max-w-md rounded-xl border border-emerald-200/60 bg-white px-3 py-2 text-left text-[11px] text-slate-600">
                  <div className="text-[10px] font-semibold text-emerald-700">
                    Contoh prompt
                  </div>
                  <div className="mt-1">
                    “BYD Seal electric car in a futuristic city at sunset, cinematic lighting”
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((it) => {
                  const src = it.imageUrl
                    ? it.imageUrl
                    : it.base64
                      ? `data:image/png;base64,${it.base64}`
                      : "";

                  return (
                    <div
                      key={it.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-emerald-200/70 hover:shadow-md"
                    >
                      <div className="group relative mb-2 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {src ? (
                          <img
                            src={src}
                            alt="Generated image"
                            className="h-full w-full object-cover transition group-hover:scale-[1.01]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-[11px] text-slate-400">
                              {it.prompt.includes("Error:")
                                ? "Failed to generate"
                                : "Generated Image Preview"}
                            </span>
                          </div>
                        )}

                        {src ? (
                          <button
                            type="button"
                            onClick={() => onDownload(src, `generated-${it.id}.png`)}
                            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
                            title="Download image"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        ) : null}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="mt-2 text-[10px] text-slate-500">
                            <span className="font-semibold text-slate-600">
                              Instruction:
                            </span>{" "}
                            {it.prompt}
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          Done
                        </span>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400">
                        {new Date(it.createdAt).toLocaleTimeString("id-ID")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="sticky bottom-3 mt-4">
          <div className="rounded-2xl border border-emerald-200/60 bg-white/85 shadow-lg backdrop-blur">
            {/* <div className="border-b border-slate-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Image Controls
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Atur instruksi & parameter untuk canvas
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  {isGenerating ? "Running" : "Ready"}
                </span>
              </div>
            </div> */}

            <div className="p-3">
              <Composer
                prompt={prompt}
                workflow={workflow}
                setPrompt={setPrompt}
                attachments={attachments}
                setAttachments={setAttachments}
                aspect={aspect}
                setAspect={setAspect}
                quality={quality}
                setQuality={setQuality}
                model={model}
                setModel={setModel}
                isGenerating={isGenerating}
                onGenerate={() => onGenerate(prompt)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
