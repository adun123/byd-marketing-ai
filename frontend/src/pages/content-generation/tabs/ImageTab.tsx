
import OptionsPanel from "../options/OptionsPanel";
import type { Workflow, VisualStyle } from "../options/OptionsPanel";
import type { GeneratedOutput } from "../types";
import OutputCanvasCard from "../OutputCanvasCard";
import type { SourceMode } from "../options/OptionsStep1SourcePlatform";
import { ArrowRight,  } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useNavigate } from "react-router-dom";
import React from "react";


function persistableItems<T extends { id: string; prompt?: string; createdAt?: number; imageUrl?: string; base64?: string }>(
  items: T[]
) {
  return items.map((it) => ({
    id: it.id,
    prompt: it.prompt ?? "",
    createdAt: it.createdAt ?? Date.now(),
    base64: it.base64,
    // ✅ simpan apa adanya kalau ada string
    imageUrl: it.imageUrl || undefined,
  }));
}


type ImgAttachment = { id: string; file: File; previewUrl: string };
type Platform = "instagram" | "tiktok"  | "linkedin";

type Props = {
  API_BASE: string;

  platform: Platform;
  setPlatform: (p: Platform) => void;

  workflow: Workflow;
  setWorkflow: (v: Workflow) => void;

  attachments: ImgAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ImgAttachment[]>>;

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

  onPickImages?: (files: FileList) => void;
  onRemoveImage?: (id: string) => void;
  onClearImages?: () => void;

  items: GeneratedOutput[];
  setItems: React.Dispatch<React.SetStateAction<GeneratedOutput[]>>;
  isGenerating: boolean;
  onGenerate: (prompt: string) => void;
  onDownload: (item: any) => void;

  sourceMode: SourceMode;
  setSourceMode: (v: SourceMode) => void;
  draftScriptPreview: string;
  draftVisualPrompt: string;

  // optional (kalau dipakai)
  selectedItem?: GeneratedOutput | null;
  setSelectedItem?: (v: GeneratedOutput | null) => void;
  preview?: string | null;
  setPreview?: (v: string | null) => void;
  
};

function aspectMeta(a: "1:1" | "4:5" | "9:16" | "16:9") {
  if (a === "1:1") return "1080 × 1080";
  if (a === "4:5") return "1080 × 1350";
  if (a === "9:16") return "1080 × 1920";
  return "1920 × 1080";
}

//buat download
// async function downloadImage(src: string, filename: string) {
//   // kalau data URL, bisa langsung
//   if (src.startsWith("data:image/")) {
//     const a = document.createElement("a");
//     a.href = src;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     return;
//   }

//   // kalau URL biasa, fetch blob biar aman
//   const res = await fetch(src);
//   const blob = await res.blob();
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();

//   URL.revokeObjectURL(url);
// }


export default function ImageTab({
  API_BASE,
  platform,
  setPlatform,

  workflow,
  setWorkflow,
  visualStyle,
  setVisualStyle,
  aspect,
  setAspect,

  prompt,
  setPrompt,

  sourceMode,
  setSourceMode,
  draftScriptPreview,
  draftVisualPrompt,

  onGenerate,
  items,
  setItems,
  onDownload,

  attachments,
  setAttachments,
  quality,
  model,
  isGenerating,



  setSelectedItem,
  setPreview,
}: Props)  {

 const navigate = useNavigate();

// function handleClearCanvas() {
//   const ok = window.confirm("Hapus semua hasil di canvas?");
//   if (!ok) return;

//   setItems([]);
//   setSelectedItem?.(null);
//   setPreview?.(null);
// }
const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

function handleResetAll() {
  const ok = window.confirm("Reset semua pengaturan & hasil? (Canvas, prompt, gambar, opsi)");
  if (!ok) return;

  // 1) Canvas
  setItems([]);
  setSelectedItem?.(null);
  setPreview?.(null);

  // 2) Attachments
  setAttachments((prev) => {
    prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
    return [];
  });

  // 3) Prompt + mode
  setPrompt("");
  setSourceMode("manual");

  // 4) Options basic
  setWorkflow("text_to_image");
  setVisualStyle("clean");
  setAspect("1:1");
  setPlatform("instagram");
}



function isSideNavReady(params: {
  workflow: string;
  visualStyle: string;
  aspect: string;
  quality: string;
  model: string;
}) {
  const { workflow, visualStyle, aspect, quality, model } = params;
  return Boolean(workflow && visualStyle && aspect && quality && model);
}

const ready = isSideNavReady({ 
  workflow, visualStyle, aspect, quality, model });

const canPreview = ready && items.length > 0 && !isGenerating;


  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* LEFT (IMAGE OPTIONS) */}
      <aside className="lg:sticky lg:top-[72px] lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3">
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
              Options
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
              Configure generation before composing.
            </div>
          </div>

          <div className="p-3">
            {!ready ? (
              <LockedOptionsHint />
            ) : (
              <OptionsPanel
                  workflow={workflow}
                  visualStyle={visualStyle}
                  aspect={aspect}
                  onChange={(v) => {
                    if (v.workflow) setWorkflow(v.workflow);
                    if (v.visualStyle) setVisualStyle(v.visualStyle);
                    if (v.aspect) setAspect(v.aspect); //  INI KUNCI
                  }}
                  sourceMode={sourceMode}
                  onSourceModeChange={setSourceMode}
                  draftScriptPreview={draftScriptPreview}
                  draftVisualPrompt={draftVisualPrompt}
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  onGenerate={(p) => onGenerate(p)}  //  jangan onGenerate(() => onGenerate(prompt))
                  isGenerating={isGenerating}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  
                  platform={platform}              //  add
                  onPlatformChange={setPlatform}
                />

            )}
          </div>
        </div>
      </aside>

      {/* RIGHT (CANVAS) */}
      <section className="min-w-0">
        {!ready ? (
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 p-4 shadow-sm">
            <LockedCanvasHint />
          </div>
        ) : (
          <div className="space-y-3">
            <OutputCanvasCard
              API_BASE={API_BASE}
              items={items}
              onAddItems={(newOnes) => setItems((prev) => [...newOnes, ...prev])}
              aspect={aspect}
              isGenerating={isGenerating}
              onClear={handleResetAll}
              onScaleUp={(it) => console.log("scale up", it)}
              onSaveDraft={(it) => console.log("save draft", it)}
              onExport={(it) => console.log("export", it)}
              onDownload={(src, filename) => onDownload({ src, filename })}
              metaLeft={aspectMeta(aspect)}
              metaMid=""
               onDeleteItem={(id) => {
                setItems((prev) => prev.filter((x) => x.id !== id));
              }}
               onSelectItem={(it) => {
                  const src = it.promptSource ?? "manual";

                  // 1) pindah tab mode di option step 1
                  setSourceMode(src);

                  // 2) isi prompt sesuai sumber
                  // versi simple (paling cepat):
                  setPrompt(it.prompt || "");

                  // versi lebih presisi (kalau kamu simpan manualPrompt/draftPrompt):
                  // if (src === "manual") setPrompt(it.manualPrompt ?? it.prompt ?? "");
                  // else setPrompt(it.draftPrompt ?? it.prompt ?? "");
                }}
            />

            {/* CTA -> Preview Generator */}
            {/* CTA -> Preview Generator (Compact) */}
            <div
              className={cn(
                "relative overflow-hidden rounded-xl border",
                "border-slate-200/70 dark:border-slate-800/70",
                "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
                "px-3 py-3 sm:px-4 sm:py-3"
              )}
            >
              {/* subtle glow (lebih kecil) */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center justify-between gap-3">
                {/* LEFT */}
                <div className="min-w-0">
                  <div className="text-sm font-bold tracking-tight text-white">
                    Preview Generator
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-white/80">
                    Review & export hasil final dari semua generator.
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-white/85">
                    <span className="rounded-full bg-white/15 px-2 py-0.5">
                      {items.length} assets
                    </span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5">
                      {aspect}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <button
                  type="button"
                  disabled={!canPreview}
                  onClick={() => {
                    try {
                      localStorage.setItem(
                        "cg.canvas.items.v1",
                        JSON.stringify(persistableItems(itemsRef.current))
                      );
                    } catch (e) {
                      console.error("Persist before preview failed", e);
                    }

                    navigate("/preview-generator", { state: { refresh: Date.now() }});
                  }}


                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5",
                    "rounded-xl px-3 py-2",
                    "bg-white text-[#068773]",
                    "text-[12px] font-semibold",
                    "shadow-sm",
                    "hover:brightness-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title={!canPreview ? "Generate dulu sampai ada output" : "Buka Preview Generator"}
                >
                  Preview
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>


            {!canPreview ? (
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Untuk masuk ke Preview Generator, pastikan sudah ada output (dan proses generate tidak sedang berjalan).
              </div>
            ) : null}
          </div>
        )}
      </section>

    </div>
  );
}

function LockedOptionsHint() {
  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-4">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Locked
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
        Complete SideNav first
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
        Choose workflow, style, aspect, quality, and model to unlock image options.
      </p>
      <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
        Tip: After configuration is complete, this panel will open automatically.
      </div>
    </div>
  );
}

function LockedCanvasHint() {
  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-6 text-center">
      <div className="mx-auto inline-flex items-center rounded-full bg-[#068773]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#068773]">
        Setup Required
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
        Image canvas is locked
      </div>
      <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-300">
        Finish the SideNav configuration to start generating outputs.
      </p>
    </div>
  );
}
