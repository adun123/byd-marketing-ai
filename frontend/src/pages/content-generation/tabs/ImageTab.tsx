
import OptionsPanel from "../options/OptionsPanel";
import type { Workflow, VisualStyle } from "../options/OptionsPanel";
import type { GeneratedOutput } from "../types";
import OutputCanvasCard from "../OutputCanvasCard";

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
 
  
 
  items,
  
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
        <OutputCanvasCard
          items={items}
          onClear={handleClearCanvas}
          onScaleUp={(it) => console.log("scale up", it)}
          onEdit={(it) => console.log("edit", it)}
          onSaveDraft={(it) => console.log("save draft", it)}
          onExport={(it) => console.log("export", it)}
          onDownload={onDownload}
          metaLeft="1080 x 1080"
          metaMid="2.4 MB"
        />

        {/* Composer (tetap) */}
       
      </section>
    </div>
  );
}
