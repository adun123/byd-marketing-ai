// src/pages/content-generation/ContenGeneration.tsx
import * as React from "react";
import SideNav from "./SideNav";
import PromptPanel from "./PromptPanel";
import Composer from "./Composer";
import OptionsPanel from "./OptionsPanel";
import type { Workflow, Objective, Channel, VisualStyle } from "./OptionsPanel";

import type { ContentGenTab } from "./SideNav";

import type {
  ContentGenMode,
  PromptPanelValues,
} from "./PromptPanel";
import { useState } from "react";


import { Download, Trash2 } from "lucide-react";

type GeneratedItem = {
  id: string;
  mode: ContentGenMode;
  createdAt: number;
  prompt: string;
  // placeholder for real output (url/base64/etc)
  status: "queued" | "done" | "error";
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");





}



export default function ContenGeneration() {
  const [tab, setTab] = React.useState<ContentGenTab>("image");
  const mode: ContentGenMode = tab === "image" ? "image" : "video";

  const [isGenerating, setIsGenerating] = React.useState(false);


  const [quality, setQuality] = useState<"draft" | "standard" | "high">("standard");
  const [model, setModel] = useState<"banana" | "gemini" | "other">("banana");

 const [workflow, setWorkflow] = useState<Workflow>("text_to_image");
const [objective, setObjective] = useState<Objective>("promotion");
const [channel, setChannel] = useState<Channel>("ig_feed");
const [visualStyle, setVisualStyle] = useState<VisualStyle>("clean");

const [aspect, setAspect] = useState<"1:1" | "4:5" | "16:9" | "9:16">("1:1");
const [guidance, setGuidance] = useState(7);
const [seed, setSeed] = useState<number | "random" | "none">("random");

  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);

  
type DummyOutput = {
  id: string;
  prompt: string;
  createdAt: number;
};

const [items, setItems] = useState<DummyOutput[]>([]);
 function handleGenerate({ prompt }: { prompt: string }) {
  if (!prompt || prompt.trim().length < 2) return;

  const newItem: DummyOutput = {
    id: crypto.randomUUID(),
    prompt,
    createdAt: Date.now(),
  };

  setIsGenerating(true);

  // simulasi loading
  setTimeout(() => {
    setItems((prev) => [newItem, ...prev]);
    setIsGenerating(false);
  }, 600);
}


  function clearHistory() {
    setItems([]);
  }

return (
  <div className="flex min-h-[calc(100vh-64px)] pb-20 md:pb-0">
    <SideNav value={tab} onSelect={setTab} />

    <div className="flex flex-1 flex-col">
     <div className="grid w-full grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">

        {/* LEFT */}
        <div className="lg:sticky lg:top-14 lg:self-start">
         <OptionsPanel
          workflow={workflow}
          objective={objective}
          channel={channel}
          visualStyle={visualStyle}
          aspect={aspect}
          guidance={guidance}
          onChange={(v) => {
            if (v.workflow) setWorkflow(v.workflow);
            if (v.objective) setObjective(v.objective);
            if (v.channel) setChannel(v.channel);
            if (v.visualStyle) setVisualStyle(v.visualStyle);
            if (v.aspect) setAspect(v.aspect);
            if (typeof v.guidance === "number") setGuidance(v.guidance);
          }}
        />

        </div>

        {/* RIGHT */}
        <section className="min-w-0 flex flex-col">

          <div className="min-h-0 flex-1 overflow-auto pb-28">
            {/* OUTPUT */}
            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <div className="text-sm font-semibold text-slate-900">
                    No output yet
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Tulis prompt lalu klik Generate untuk melihat hasil.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      {/* Dummy image */}
                      <div className="mb-2 aspect-video rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center">
                        <span className="text-[11px] text-slate-400">
                          Generated Image Preview
                        </span>
                      </div>

                      {/* Prompt text */}
                      <div className="text-xs font-semibold text-slate-900">
                        Prompt
                      </div>
                      <div className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                        {it.prompt}
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400">
                        {new Date(it.createdAt).toLocaleTimeString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          

           {/* Floating composer */}
            <div className="sticky bottom-3">
              <div className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur shadow-lg">
               <Composer
                  prompt={prompt}
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
                  onGenerate={() => {
                    // PoC: kirim semua option ini ke handleGenerate kalau mau
                    handleGenerate({ prompt } as any);
                  }}
                />

              </div>
            </div>
          

          
         

        
        </section>
      </div>
    </div>
  </div>
);

}
