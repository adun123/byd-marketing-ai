import * as React from "react";
import { useEffect, useState } from "react";
import ImageTab from "./tabs/ImageTab";
import TopBarGenerate from "../../components/layout/TopBarGenerate";

import SideNav from "./SideNav";
import VideoTab from "./tabs/VideoTab";
import type { Workflow, VisualStyle } from "./options/OptionsPanel";
import { upscaleImageService } from "./services/upscaleImageService";

import type { ContentGenTab } from "./SideNav";
import type { GeneratedOutput, VideoAttachment, VideoOutput } from "./types";
import { generateImageService } from "./services/imageService";
import { downloadImage } from "./utils/download";


export default function ContentGeneration() {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const [quality, setQuality] = useState<"draft" | "standard" | "high">("standard");
  const [model, setModel] = useState<"banana" | "gemini" | "other">("banana");

  const [workflow, setWorkflow] = useState<Workflow>("text_to_image");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("clean");
  const [aspect, setAspect] = useState<"1:1" | "4:5" | "16:9" | "9:16">("1:1");

  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [items, setItems] = useState<GeneratedOutput[]>([]);

  const [tab, setTab] = useState<ContentGenTab>("image");
  const API_BASE = (import.meta.env.VITE_API_BASE?.trim() || "/api") as string;

  // sidebar preference
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cg.sidebarOpen");
    if (saved !== null) setSidebarOpen(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("cg.sidebarOpen", sidebarOpen ? "1" : "0");
  }, [sidebarOpen]);

  // --- VIDEO STATE (masih mock di page dulu) ---
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoAttachments, setVideoAttachments] = useState<VideoAttachment[]>([]);
  const [videoItems, setVideoItems] = useState<VideoOutput[]>([]);
  const [videoWorkflow, setVideoWorkflow] =
    useState<"text_to_video" | "image_to_video">("text_to_video");

  const [videoFormat, setVideoFormat] =
    useState<"reels" | "tiktok" | "yt_shorts" | "landscape">("reels");
  const [videoDurationSec, setVideoDurationSec] = useState<5 | 8 | 10 | 15>(8);
  const [videoStyle, setVideoStyle] =
    useState<"cinematic" | "clean" | "ugc" | "bold">("cinematic");
  const [videoFps, setVideoFps] = useState<24 | 30>(24);

async function handleGenerate({ prompt }: { prompt: string }) {
  const hasImage = attachments.length > 0;

  if (workflow === "text_to_image" && prompt.trim().length < 2) return;

  if (workflow === "image_to_image") {
    if (prompt.trim().length < 2) return;
    if (!hasImage) return;
  }

  if (workflow === "upscale") {
    if (!hasImage) return;
  }

  setIsGenerating(true);
  try {
    let newItems: GeneratedOutput[] = [];

    if (workflow === "upscale") {
      // 🔥 AMBIL FILE DARI ATTACHMENTS
      const first = attachments[0];
      const file: File = first.file; // ⬅INI KUNCI

      newItems = await upscaleImageService({
        API_BASE,
        file,
        preset: "4k",
        quality: 95,
      });
    } else {
      newItems = await generateImageService({
        API_BASE,
        workflow,
        prompt: prompt.trim(),
        attachments,
        visualStyle,
        aspect,
      });
    }

    setItems((prev) => [...newItems, ...prev]);
  } catch (error) {
    const errorItem: GeneratedOutput = {
      id: crypto.randomUUID(),
      prompt: `${prompt || "(no prompt)"} (Error: ${
        error instanceof Error ? error.message : "Unknown error"
      })`,
      createdAt: Date.now(),
    };
    setItems((prev) => [errorItem, ...prev]);
  } finally {
    setIsGenerating(false);
  }
}



  function handleGenerateVideo({ prompt }: { prompt: string }) {
    if (videoWorkflow === "text_to_video" && prompt.trim().length < 2) return;
    if (videoWorkflow === "image_to_video" && videoAttachments.length === 0) return;

    setIsGenerating(true);

    const id = crypto.randomUUID();
    setVideoItems((prev) => [
      { id, prompt: prompt.trim() || "(no prompt)", createdAt: Date.now(), status: "processing" },
      ...prev,
    ]);

    setTimeout(() => {
      setVideoItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, status: "done", videoUrl: undefined } : it
        )
      );
      setIsGenerating(false);
    }, 1000);
  }

return (
  <div className="mx-auto w-full px-4">
    <TopBarGenerate active="content" />
   

    <div className="flex min-w-0 flex-1 flex-col">
      

      {/* CONTENT */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SideNav
          value={tab}
          onSelect={setTab}
          

        />

        <div className="mt-4">
          {tab === "image" ? (
          <ImageTab
              workflow={workflow}
              setWorkflow={setWorkflow}
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
              attachments={attachments}
              setAttachments={setAttachments}
              items={items}
              isGenerating={isGenerating}
              onGenerate={(p) => handleGenerate({ prompt: p })}
              onDownload={downloadImage} setItems={function (_value: React.SetStateAction<GeneratedOutput[]>): void {
                throw new Error("Function not implemented.");
              } }          />
          ) : (
            <VideoTab
              videoWorkflow={videoWorkflow}
              setVideoWorkflow={setVideoWorkflow}
              videoFormat={videoFormat}
              setVideoFormat={setVideoFormat}
              videoDurationSec={videoDurationSec}
              setVideoDurationSec={setVideoDurationSec}
              videoStyle={videoStyle}
              setVideoStyle={setVideoStyle}
              videoFps={videoFps}
              setVideoFps={setVideoFps}
              videoPrompt={videoPrompt}
              setVideoPrompt={setVideoPrompt}
              videoAttachments={videoAttachments}
              setVideoAttachments={setVideoAttachments}
              videoItems={videoItems}
              isGenerating={isGenerating}
              onGenerate={(p) => handleGenerateVideo({ prompt: p })}
              onDownloadVideo={(it) => {
                if (!it.videoUrl) return;
                const a = document.createElement("a");
                a.href = it.videoUrl;
                a.download = `video-${it.id}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              onSelectVideo={(it) => console.log("select video", it.id)}
            />
          )}
        </div>
       
        
      </div>
    </div>
  </div>
);
}