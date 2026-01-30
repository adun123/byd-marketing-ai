// src/pages/content-generation/OptionsPanel.tsx
import React, { useState } from "react";
import OptionsStep1SourcePlatform, { type SourceMode } from "./OptionsStep1SourcePlatform";
import OptionsStep2CreativeModeStyle from "./OptionsStep2CreativeModeStyle";
import OptionsStep3PromptInput from "./OptionsStep3PromptInput";

export type Workflow = "text_to_image" | "image_to_image" | "upscale";
export type VisualStyle = "clean" | "premium" | "lifestyle" | "ugc" | "bold";

export type ImgAttachment = { id: string; file: File; previewUrl: string };

type Props = {
  workflow: Workflow;
  visualStyle: VisualStyle;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  onChange: (v: { workflow?: Workflow; visualStyle?: VisualStyle }) => void;

  sourceMode: SourceMode;
  onSourceModeChange: (m: SourceMode) => void;

  draftScriptPreview?: string;
  draftVisualPrompt?: string;

  prompt: string;
  onPromptChange: (v: string) => void;
  onGenerate: () => void;

  attachments: ImgAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ImgAttachment[]>>;
};

export default function OptionsPanel({
  workflow,
  visualStyle,
  aspect,
  onChange,
  sourceMode,
  onSourceModeChange,
  draftScriptPreview = "",
  draftVisualPrompt = "",
  prompt,
  onPromptChange,
  onGenerate,
  attachments,
  setAttachments,
  
}: Props) {
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "linkedin">("instagram");

   const handlePickImages = (files: FileList) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const max = workflow === "image_to_image" ? 6 : 1; // upscale = 1
    const picked = arr.slice(0, max);

    const next: ImgAttachment[] = picked.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setAttachments((prev) => {
      // upscale: replace (biar selalu 1)
      if (workflow === "upscale") {
        prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
        return next.slice(0, 1);
      }

      // image_to_image: gabung + max 6 total
      const merged = [...next, ...prev];
      return merged.slice(0, 6);
    });
  };

  const handleRemoveImage = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const handleClearImages = () => {
    setAttachments((prev) => {
      prev.forEach((x) => URL.revokeObjectURL(x.previewUrl));
      return [];
    });
  };
  function htmlToPlainText(html?: string) {
    if (!html) return "";
    // aman di browser
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.innerText || "").trim();
  }
  const previewText =
    sourceMode === "draft"
      ? (htmlToPlainText(draftScriptPreview) || "No draft imported.")
      : "Manual mode.";
  
  return (
    <div className="space-y-4">
      <OptionsStep1SourcePlatform
        workflow={workflow}
        aspect={aspect}
        onChange={(v) => {
          if (v.workflow) onChange({ workflow: v.workflow });
          if (v.aspect) onChange({ ...v }); // atau khusus aspect handler kamu
        }}
        sourceMode={sourceMode}
        onSourceModeChange={(m) => {
          onSourceModeChange(m);
          if (m === "draft" && draftVisualPrompt) onPromptChange(draftVisualPrompt);
        }}
        scriptPreview={sourceMode === "draft" ? (previewText || "No draft imported.") : "Manual mode."}
        platform={platform}
        onPlatformChange={setPlatform}
      />


      <OptionsStep2CreativeModeStyle
        workflow={workflow}
        visualStyle={visualStyle}
        onChange={onChange}
        attachments={attachments}
        onPickImages={handlePickImages}
        onRemoveImage={handleRemoveImage}
        onClearImages={handleClearImages}
      />



      {/* Step 3 (only for manual) */}
      {sourceMode === "manual" ? (
        <OptionsStep3PromptInput
          prompt={prompt}
          onChange={onPromptChange}
          onGenerate={onGenerate}
          isGenerating={false /* pass your state */}
          disabledGenerate={false /* pass your rule */}
          active
        />
      ) : (
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-200">
                  3
                </span>
                <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
                  Prompt Input
                </div>
              </div>

              <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#068773]">
                Locked
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 px-3 py-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              You’re using <b>Script from Draft</b>. Step 3 is not needed.
              <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                Switch to <b>Manual Prompt</b> if you want to write your own prompt.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
