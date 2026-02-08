import * as React from "react";
import { useLocation } from "react-router-dom";
import type { SourceMode } from "./options/OptionsStep1SourcePlatform";

import { useEffect, useState } from "react";
import ImageTab from "./tabs/ImageTab";
import TopBarGenerate from "../../components/layout/TopBarGenerate";

import SideNav from "./SideNav";
// import VideoTab from "./tabs/VideoTab";
import type { Workflow, VisualStyle } from "./options/OptionsPanel";
import { upscaleImageService } from "./services/upscaleImageService";

import type { ContentGenTab } from "./SideNav";
import type { GeneratedOutput,  } from "./types";
import { generateImageService } from "./services/imageService";

import { cn } from "../../lib/cn";
import ComingSoonPage from "../ComingSoonPage";

import { saveContentPreviewMeta } from "./utils/contentPreviewMetaStorage";
type ImgAttachment = {
  id: string;
  file: File;
  previewUrl: string;
};

const LS_KEY_ITEMS = "cg.canvas.items.v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function persistableItems<T extends { id: string; prompt?: string; createdAt?: number; imageUrl?: string; base64?: string }>(
  items: T[]
) {
  return items.map((it) => ({
    id: it.id,
    prompt: it.prompt ?? "",
    createdAt: it.createdAt ?? Date.now(),
    base64: it.base64,
    imageUrl: it.imageUrl || undefined, // ✅ simpan data: juga
  }));
}







export default function ContentGeneration() {

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [quality, setQuality] = useState<"draft" | "standard" | "high">("standard");
  const [model, setModel] = useState<"banana" | "gemini" | "other">("banana");
  const [workflow, setWorkflow] = useState<Workflow>("text_to_image");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("clean");
  const [aspect, setAspect] = useState<"1:1" | "4:5" | "16:9" | "9:16">("1:1");
  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<ImgAttachment[]>([]);

  const [items, setItems] = useState<GeneratedOutput[]>(() => {
    const saved = safeParse<GeneratedOutput[]>(localStorage.getItem(LS_KEY_ITEMS));
    return Array.isArray(saved) ? saved : [];
  });

  const [tab, setTab] = useState<ContentGenTab>("image");
  const API_BASE = (import.meta.env.VITE_API_BASE?.trim() || "/api") as string;
  // sidebar preference
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const location = useLocation();
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "linkedin">("instagram");


  // NEW
const [sourceMode, setSourceMode] = useState<SourceMode>("manual");
const [draftScriptPreview, setDraftScriptPreview] = useState("");
const [draftVisualPrompt, setDraftVisualPrompt] = useState("");

useEffect(() => {
  const st = location.state as any;

  if (st?.from === "draft") {
    setSourceMode("draft");
    setWorkflow("text_to_image");

    setPrompt(st.imagePrompt || "");
    setDraftScriptPreview(st.scriptPreview || "");
    setDraftVisualPrompt(st.imagePrompt || "");

  }
}, [location.state]);

  useEffect(() => {
    const saved = localStorage.getItem("cg.sidebarOpen");
    if (saved !== null) setSidebarOpen(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("cg.sidebarOpen", sidebarOpen ? "1" : "0");
  }, [sidebarOpen]);

  // --- VIDEO STATE (masih mock di page dulu) ---
  // const [videoPrompt, setVideoPrompt] = useState("");
  // const [videoAttachments, setVideoAttachments] = useState<VideoAttachment[]>([]);
  // const [, setVideoItems] = useState<VideoOutput[]>([]);
  // const [videoWorkflow, setVideoWorkflow] =
  //   useState<"text_to_video" | "image_to_video">("text_to_video");

  // const [videoFormat, setVideoFormat] =
  //   useState<"reels" | "tiktok" | "yt_shorts" | "landscape">("reels");
  // const [videoDurationSec, setVideoDurationSec] = useState<5 | 8 | 10 | 15>(8);
  // const [videoStyle, setVideoStyle] =
  //   useState<"cinematic" | "clean" | "ugc" | "bold">("cinematic");
  // const [videoFps, setVideoFps] = useState<24 | 30>(24);
  const [imageCategory, setImageCategory] = useState<"infographic" | "carousel">("infographic");
  const [slides, setSlides] = useState(5);


async function handleGenerate({ prompt }: { prompt: string }) {
  const hasImage = attachments.length > 0;
  const cleanPrompt = prompt.trim();

  if (workflow === "text_to_image" && cleanPrompt.length < 2) return;

  if (workflow === "image_to_image") {
    if (cleanPrompt.length < 2) return;
    if (!hasImage) return;
  }

  if (workflow === "upscale") {
    if (!hasImage) return;
  }

  setIsGenerating(true);
    try {
      let newItems: GeneratedOutput[] = [];

      if (workflow === "upscale") {
        const first = attachments[0];
        const file: File = first.file;

        newItems = await upscaleImageService({
          API_BASE,
          file,
          preset: "4k",
          quality: 95,
        });
      } else {
        const isCarousel =
          tab === "image" && imageCategory === "carousel" && workflow === "text_to_image";

        newItems = await generateImageService({
          API_BASE,
          workflow,
          prompt: cleanPrompt,
          attachments,
          visualStyle,
          aspect,
          numberOfResults: isCarousel ? slides : 1,
        });
      }

      // ✅ TAGGING DI SINI
      const sourceTag: "manual" | "draft" = sourceMode === "draft" ? "draft" : "manual";
      const tagged: GeneratedOutput[] = newItems.map((it) => ({
        ...it,
        promptSource: sourceTag,
        manualPrompt: sourceTag === "manual" ? cleanPrompt : undefined,
        draftPrompt: sourceTag === "draft" ? cleanPrompt : undefined,
      }));

      // ✅ PAKE tagged, BUKAN newItems
      setItems((prev) => [...tagged, ...prev]);

    } catch (error) {
      const errorItem: GeneratedOutput = {
        id: crypto.randomUUID(),
        prompt: `${prompt || "(no prompt)"} (Error: ${
          error instanceof Error ? error.message : "Unknown error"
        })`,
        createdAt: Date.now(),
        // optional: biar error juga “ingat” mode
        promptSource: sourceMode === "draft" ? "draft" : "manual",
      };

      setItems((prev) => [errorItem, ...prev]);
    } finally {
      setIsGenerating(false);
    }
}


  // function handleGenerateVideo({ prompt }: { prompt: string }) {
  //   if (videoWorkflow === "text_to_video" && prompt.trim().length < 2) return;
  //   if (videoWorkflow === "image_to_video" && videoAttachments.length === 0) return;

  //   setIsGenerating(true);

  //   const id = crypto.randomUUID();
  //   setVideoItems((prev) => [
  //     { id, prompt: prompt.trim() || "(no prompt)", createdAt: Date.now(), status: "processing" },
  //     ...prev,
  //   ]);

  //   setTimeout(() => {
  //     setVideoItems((prev) =>
  //       prev.map((it) =>
  //         it.id === id ? { ...it, status: "done", videoUrl: undefined } : it
  //       )
  //     );
  //     setIsGenerating(false);
  //   }, 1000);
  // }
  



function removeImage(id: string) {
  setAttachments((prev) => {
    const target = prev.find((x) => x.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    return prev.filter((x) => x.id !== id);
  });
}

function clearImages() {
  setAttachments((prev) => {
    prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
    return [];
  });
}

function handlePickImages(files: FileList) {
  const arr = Array.from(files);
  if (arr.length === 0) return;

  const max =
    workflow === "upscale" ? 1 :
    workflow === "image_to_image" ? 3 :
    2; // text_to_image: sesuai kebutuhan kamu

  const picked = arr.slice(0, max);

  const next: ImgAttachment[] = picked.map((file) => ({
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
  }));

  setAttachments((prev) => {
    // upscale: replace
    if (workflow === "upscale") {
      prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
      return next.slice(0, 1);
    }

    // image_to_image: merge + max 3
    if (workflow === "image_to_image") {
      const merged = [...next, ...prev];
      const trimmed = merged.slice(0, 3);

      // revoke yang kebuang biar ga memory leak
      merged.slice(3).forEach((x) => URL.revokeObjectURL(x.previewUrl));

      return trimmed;
    }

    // text_to_image: merge + max
    const merged = [...next, ...prev];
    const trimmed = merged.slice(0, max);
    merged.slice(max).forEach((x) => URL.revokeObjectURL(x.previewUrl));
    return trimmed;
  });
}


function isContentReady(params: {
  workflow: string;
  visualStyle: string;
  aspect: string;
  quality: string;
  model: string;
}) {
  const { workflow, visualStyle, aspect, quality, model } = params;
  return Boolean(workflow && visualStyle && aspect && quality && model);
}

useEffect(() => {
  try {
    localStorage.setItem(
      LS_KEY_ITEMS,
      JSON.stringify(persistableItems(items))
    );
  } catch (e) {
    console.error("Failed to persist canvas items", e);
  }
}, [items]);


useEffect(() => {
  saveContentPreviewMeta({
    aspect,
    format: imageCategory,
    slides,
    platform,
  });
}, [aspect, imageCategory, slides, platform]);

useEffect(() => {
  if (workflow === "image_to_image") {
    // paksa single image
    setImageCategory("infographic");
    setSlides(1);
  }
}, [workflow]);



return (
  <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col">
    <TopBarGenerate active="content" />

    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        {/* Page header */}
        {/* <div className="mb-4">
          <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Content Generator
          </h1>
          <p className="mt-1 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
            Configure your workflow first, then generate image or video outputs.
          </p>
        </div> */}

        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* LEFT: SideNav / Config */}
          <aside className="lg:sticky lg:top-[72px] lg:self-start">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
             <SideNav
              value={tab}
              onSelect={setTab}
              imageCategory={imageCategory}
              onImageCategoryChange={setImageCategory}
              slides={slides}
              onSlidesChange={setSlides}
              workflow={workflow}   // 👈 TAMBAH INI
            />


            </div>

            <div className="mt-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-3 text-[11px] text-slate-600 dark:text-slate-300 lg:hidden">
              Tip: complete the configuration on the left to unlock generation tools.
            </div>
          </aside>

          {/* RIGHT: Workspace */}
          <section className="min-w-0">
            <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              {/* gating */}
              {(() => {
                const ready = isContentReady({
                  workflow,
                  visualStyle,
                  aspect,
                  quality,
                  model,
                });

                if (ready) return null;

                return (
                  <div className="absolute inset-0 z-10">
                    {/* dim layer */}
                    <div className="absolute inset-0 rounded-3xl bg-slate-950/5 dark:bg-slate-950/50 backdrop-blur-[2px]" />

                    {/* lock card */}
                    <div className="relative p-5 sm:p-6">
                      <div className="mx-auto max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/80 p-5 shadow-sm">
                        <div className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                          Setup Required
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                          Complete the left panel first
                        </div>
                        <p className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                          Choose workflow, style, aspect ratio, quality, and model to unlock Image/Video generation.
                        </p>

                        {/* checklist */}
                        <div className="mt-4 space-y-2 text-[12px]">
                          <Req ok={!!workflow} label="Workflow" />
                          <Req ok={!!visualStyle} label="Visual Style" />
                          <Req ok={!!aspect} label="Aspect Ratio" />
                          <Req ok={!!quality} label="Quality" />
                          <Req ok={!!model} label="Model" />
                        </div>

                        <div className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
                          Once completed, your right panel will be enabled automatically.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Content tabs (enabled behind the overlay) */}
              <div className="">
                {tab === "image" ? (
                  <ImageTab
                   API_BASE={API_BASE}
                    workflow={workflow}
                    setWorkflow={setWorkflow}
                     platform={platform}
                    setPlatform={setPlatform}
                    visualStyle={visualStyle}
                    setVisualStyle={setVisualStyle}
                    aspect={aspect}
                    setAspect={setAspect}
                    quality={quality}
                    setQuality={setQuality}
                    model={model}
                    setModel={setModel}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    items={items}
                    setItems={setItems}
                    isGenerating={isGenerating}
                    onGenerate={(p) => handleGenerate({ prompt: p })}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    onPickImages={handlePickImages}
                    onRemoveImage={removeImage}
                    onClearImages={clearImages}
                    sourceMode={sourceMode}
                    setSourceMode={setSourceMode}
                    draftScriptPreview={draftScriptPreview}
                    draftVisualPrompt={draftVisualPrompt}
                    onDownload={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                ) : (
                 <ComingSoonPage title={""} desc={""}/>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
);

/** small helper row */
function Req({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 px-3 py-2">
      <span className="text-slate-700 dark:text-slate-200 font-semibold">{label}</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em]",
          ok
            ? "bg-[#068773]/10 text-[#068773]"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        )}
      >
        {ok ? "Done" : "Required"}
      </span>
    </div>
  );
}

}