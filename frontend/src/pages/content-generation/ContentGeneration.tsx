// src/pages/content-generation/ContenGeneration.tsx
import * as React from "react";
import SideNav from "./SideNav";
import Composer from "./Composer";
import OptionsPanel from "./OptionsPanel";
import type { Workflow, Objective, Channel, VisualStyle } from "./OptionsPanel";

import type { ContentGenTab } from "./SideNav";
import { useState } from "react";


type GeneratedOutput = {
  id: string;
  prompt: string;
  createdAt: number;
  imageUrl?: string;
  base64?: string;
};



export default function ContenGeneration() {
  const [tab, setTab] = React.useState<ContentGenTab>("image");

  const [isGenerating, setIsGenerating] = React.useState(false);


  const [quality, setQuality] = useState<"draft" | "standard" | "high">("standard");
  const [model, setModel] = useState<"banana" | "gemini" | "other">("banana");

 const [workflow, setWorkflow] = useState<Workflow>("text_to_image");
const [objective, setObjective] = useState<Objective>("promotion");
const [channel, setChannel] = useState<Channel>("ig_feed");
const [visualStyle, setVisualStyle] = useState<VisualStyle>("clean");

const [aspect, setAspect] = useState<"1:1" | "4:5" | "16:9" | "9:16">("1:1");
const [guidance, setGuidance] = useState(7);

  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);


const [items, setItems] = useState<GeneratedOutput[]>([]);

async function handleGenerate({ prompt }: { prompt: string }) {
  if (!prompt || prompt.trim().length < 2) return;

  setIsGenerating(true);

  try {
    const response = await fetch('http://localhost:4000/api/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style: visualStyle,
        aspectRatio: aspect,
        numberOfResults: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.images && data.images.length > 0) {
      // Add the generated images to items
      const newItems: GeneratedOutput[] = data.images.map((image: any) => ({
        id: crypto.randomUUID(),
        prompt: data.prompt || prompt,
        createdAt: Date.now(),
        imageUrl: `http://localhost:4000${image.url}`,
        base64: image.base64,
      }));

      setItems((prev) => [...newItems, ...prev]);
    } else {
      throw new Error(data.error || 'Failed to generate image');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    // For now, add a dummy item with error message
    const errorItem: GeneratedOutput = {
      id: crypto.randomUUID(),
      prompt: `${prompt} (Error: ${error instanceof Error ? error.message : 'Unknown error'})`,
      createdAt: Date.now(),
    };
    setItems((prev) => [errorItem, ...prev]);
  } finally {
    setIsGenerating(false);
  }
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
                      {/* Generated image */}
                      <div className="mb-2 aspect-video rounded-xl border border-slate-200 bg-slate-100 overflow-hidden">
                        {it.imageUrl ? (
                          <img
                            src={it.imageUrl}
                            alt="Generated image"
                            className="h-full w-full object-cover"
                          />
                        ) : it.base64 ? (
                          <img
                            src={`data:image/png;base64,${it.base64}`}
                            alt="Generated image"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-[11px] text-slate-400">
                              {it.prompt.includes('Error:') ? 'Failed to generate' : 'Generated Image Preview'}
                            </span>
                          </div>
                        )}
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
                    // Send all options to handleGenerate
                    handleGenerate({ prompt });
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
