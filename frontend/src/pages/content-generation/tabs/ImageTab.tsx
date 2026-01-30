
import OptionsPanel from "../options/OptionsPanel";
import type { Workflow, VisualStyle } from "../options/OptionsPanel";
import type { GeneratedOutput } from "../types";
import OutputCanvasCard from "../OutputCanvasCard";
import type { SourceMode } from "../options/OptionsStep1SourcePlatform";


type ImgAttachment = { id: string; file: File; previewUrl: string };
type Props = {
  // state
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


  // OPTIONAL: kalau memang ada di parent
  selectedItem?: GeneratedOutput | null;
  setSelectedItem?: (v: GeneratedOutput | null) => void;

  preview?: string | null;
  setPreview?: (v: string | null) => void;

  // actions
  items: GeneratedOutput[];
  setItems: React.Dispatch<React.SetStateAction<GeneratedOutput[]>>;
  isGenerating: boolean;
  onGenerate: (prompt: string) => void;
  onDownload: (item: any) => void;

  sourceMode: SourceMode;
  setSourceMode: (v: SourceMode) => void;
  draftScriptPreview: string;
  draftVisualPrompt: string;



  
};


export default function ImageTab({
  workflow,
  setWorkflow,
  visualStyle,
  setVisualStyle,
  aspect,
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
  setSelectedItem,
  setPreview,
  attachments,
  setAttachments,
  quality,
  model,
  isGenerating
}: Props)  {

 
function handleClearCanvas() {
  const ok = window.confirm("Hapus semua hasil di canvas?");
  if (!ok) return;

  setItems([]);
  setSelectedItem?.(null);
  setPreview?.(null);
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

const ready = isSideNavReady({ workflow, visualStyle, aspect, quality, model });
  

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
                }}
                sourceMode={sourceMode}
                onSourceModeChange={setSourceMode}
                draftScriptPreview={draftScriptPreview}
                draftVisualPrompt={draftVisualPrompt}
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={() => onGenerate(prompt)}
                 isGenerating={isGenerating}
                attachments={attachments}
                setAttachments={setAttachments}
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
          <OutputCanvasCard
            items={items}
             isGenerating={isGenerating}
            onClear={handleClearCanvas}
            onScaleUp={(it) => console.log("scale up", it)}
            onEdit={(it) => console.log("edit", it)}
            onSaveDraft={(it) => console.log("save draft", it)}
            onExport={(it) => console.log("export", it)}
            onDownload={onDownload}
            metaLeft="1080 x 1080"
            metaMid="2.4 MB"
          />
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
