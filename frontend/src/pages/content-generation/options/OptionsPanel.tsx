// src/pages/content-generation/OptionsPanel.tsx
import React, { useMemo } from "react";
import OptionsStep1SourcePlatform, { type SourceMode } from "./OptionsStep1SourcePlatform";
import OptionsStep2CreativeModeStyle from "./OptionsStep2CreativeModeStyle";
import OptionsStep3PromptInput from "./OptionsStep3PromptInput";

import { cn } from "../../../lib/cn";

export type Workflow = "text_to_image" | "image_to_image" | "upscale";
export type VisualStyle = "clean" | "premium" | "lifestyle" | "ugc" | "bold";
type Platform = "instagram" | "tiktok"  | "linkedin";

export type ImgAttachment = { id: string; file: File; previewUrl: string };

type Props = {

  platform: Platform;
  onPlatformChange: (p: Platform) => void;

  workflow: Workflow;
  visualStyle: VisualStyle;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";

  onChange: (v: { workflow?: Workflow; visualStyle?: VisualStyle; aspect?: Props["aspect"] }) => void;

  sourceMode: SourceMode;
  onSourceModeChange: (m: SourceMode) => void;

  draftScriptPreview?: string;
  draftVisualPrompt?: string;

  prompt: string;
  onPromptChange: (v: string) => void;

  // ✅ generate selalu pakai prompt final (effectivePrompt)
  onGenerate: (prompt: string) => void;

  attachments: ImgAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ImgAttachment[]>>;
  isGenerating?: boolean;
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
  isGenerating = false,
  platform,
  onPlatformChange,
}: Props) {
  
  const handlePickImages = (files: FileList) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const max = workflow === "image_to_image" ? 5 : 1; // upscale = 1
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

      // image_to_image: gabung + max 5 total
      const merged = [...next, ...prev];
      return merged.slice(0, 5);
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
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.innerText || "").trim();
  }

  const previewText =
    sourceMode === "draft"
      ? htmlToPlainText(draftScriptPreview) || "No draft imported."
      : "Manual mode.";

  // ✅ prompt yang benar-benar dipakai untuk generate
  const effectivePrompt = useMemo(() => {
    return sourceMode === "draft" ? (draftVisualPrompt?.trim() || "") : prompt.trim();
  }, [sourceMode, draftVisualPrompt, prompt]);

  const handleGenerateClick = () => {
    if (!effectivePrompt) return;

    // sync state prompt (biar UI step3 kebaca konsisten)
    onPromptChange(effectivePrompt);

    // ✅ generate pakai prompt final, tanpa nunggu state update
    onGenerate(effectivePrompt);
  };

  // ✅ validasi pakai effectivePrompt (bukan prompt state doang)
  const promptOk = effectivePrompt.trim().length >= 2;
  const hasRef = attachments.length >= 1;

  const disabledGenerate =
    workflow === "text_to_image"
      ? !promptOk
      : workflow === "image_to_image"
      ? !(promptOk && hasRef)
      : workflow === "upscale"
      ? !hasRef
      : true;

  return (
    <div className="space-y-4">
      <OptionsStep1SourcePlatform
        workflow={workflow}
        aspect={aspect}
        onChange={(v) => {
          // ✅ 1 jalur update: semuanya lewat onChange
          if (v.workflow) onChange({ workflow: v.workflow });
          if (v.aspect) onChange({ aspect: v.aspect });
        }}
        sourceMode={sourceMode}
        onSourceModeChange={(m) => {
          onSourceModeChange(m);
          if (m === "draft" && draftVisualPrompt) onPromptChange(draftVisualPrompt);
        }}
        scriptPreview={sourceMode === "draft" ? previewText : "Manual mode."}
        platform={platform}
        onPlatformChange={onPlatformChange}

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
          // ✅ pastikan Step3 generate pakai handler yang sama
          onGenerate={() => handleGenerateClick()}
          isGenerating={isGenerating}
          disabledGenerate={disabledGenerate}
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
            Prompt from Draft
          </div>
        </div>

        <span className="inline-flex items-center rounded-full border border-[#068773]/20 bg-[#068773]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#068773]">
          Auto-filled
        </span>
      </div>
      


      {/* tampilkan script yang dibawa dari Draft (HOOK + script) */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 px-3 py-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Script preview
        </div>

        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
          {previewText?.trim() ? (
            <span className="italic">“{previewText}”</span>
          ) : (
            <span className="text-slate-400">No script imported.</span>
          )}
        </div>
      </div>

      {/*  tombol Generate tetap ada */}
      <button
        type="button"
        onClick={handleGenerateClick}
        disabled={!effectivePrompt || isGenerating}
        className={cn(
          "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
          "text-[12px] font-semibold text-white transition",
          "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
          isGenerating
            ? "bg-[#068773] cursor-wait"
            : effectivePrompt
            ? "bg-gradient-to-r from-[#068773] to-[#0fb9a8] shadow-sm ring-1 ring-[#068773]/25 hover:brightness-105 active:brightness-95"
            : "cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        )}
      >
        {isGenerating ? "Generating…" : "Generate from Draft"}
      </button>

      <div className="mt-2 text-center text-[10px] text-slate-500 dark:text-slate-400">
        Prompt ini diambil otomatis dari Draft. Kalau mau edit, pindah ke <b>Manual Prompt</b>.
      </div>
    </div>
  </div>
)}



    </div>
  );
}
