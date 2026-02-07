// src/pages/content-generation/components/OptionsStep1SourcePlatform.tsx
import * as React from "react";
import { Instagram, Linkedin, Music2 } from "lucide-react";
import type { Workflow } from "../options/OptionsPanel";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Platform = "instagram" | "tiktok" | "linkedin";
export type SourceMode = "draft" | "manual";

type Props = {
  workflow: Workflow;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  onChange: (v: { workflow?: Workflow; aspect?: Props["aspect"] }) => void;
  // platform optional (bisa controlled atau fallback local)
  platform?: Platform;
  onPlatformChange?: (p: Platform) => void;
  sourceMode: SourceMode;
  onSourceModeChange: (m: SourceMode) => void;
  scriptPreview?: string;
};

export default function OptionsStep1SourcePlatform({
 
  aspect,
  onChange,
  workflow,
  platform: platformProp = "instagram",
  onPlatformChange,

  sourceMode,
  onSourceModeChange,

  scriptPreview = "Belum ada draft yang di-import.",
}: Props) {
  // local fallback (kalau parent belum supply onPlatformChange)
  const [platformLocal, setPlatformLocal] = React.useState<Platform>(platformProp);

  // sync kalau platformProp berubah dari parent
  React.useEffect(() => {
    setPlatformLocal(platformProp);
  }, [platformProp]);

  // nilai yang dipakai UI
  const platform = onPlatformChange ? platformProp : platformLocal;

  function setPlatform(p: Platform) {
    if (onPlatformChange) onPlatformChange(p);
    else setPlatformLocal(p);
  }
  const draftDisabled = workflow !== "text_to_image";
  return (
    <div className="space-y-3">
      {/* SOURCE MODE */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 p-1">
        <div className="grid grid-cols-2 gap-1">
          <ModeTab
            active={sourceMode === "draft"}
            label="Draft Script"
            disabled={draftDisabled}
            onClick={() => {
              if (!draftDisabled) onSourceModeChange("draft");
            }}
          />
          <ModeTab
            active={sourceMode === "manual"}
            label="Manual Prompt"
            onClick={() => onSourceModeChange("manual")}
          />
        </div>
      </div>

      {/* CARD */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#068773]/10 text-[10px] font-extrabold text-[#068773]">
              1
            </span>
            <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
              Source & Platform
            </div>
          </div>

          <span className="rounded-full border border-[#068773]/15 bg-[#068773]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#068773]">
            {sourceMode}
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Preview */}
          {sourceMode === "draft" ? (
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 px-3 py-3">
              <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Imported script preview
              </div>

              <div
                className={cn(
                  "max-h-24 overflow-y-auto whitespace-pre-wrap break-words",
                  "text-[11px] leading-relaxed text-slate-600 dark:text-slate-300"
                )}
              >
                <span className="italic">
                  “{scriptPreview?.trim() ? scriptPreview : "No draft imported yet."}”
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 px-3 py-3">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Manual mode
              </div>
              <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                You’ll write the prompt manually in step 3.
              </div>
            </div>
          )}

          {/* Platform */}
          <div>
            <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Platform
            </div>

            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <PlatformChip
                  key={p.id}
                  active={platform === p.id}
                  label={p.label}
                  icon={p.icon}
                  onClick={() => setPlatform(p.id)}
                />
              ))}
            </div>


            {!onPlatformChange ? (
              <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                Platform is optional (local selection only).
              </div>
            ) : null}
          </div>

          {/* Aspect */}
          <div>
            <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Aspect ratio
            </div>

            <div className="grid grid-cols-4 gap-2">
              <AspectChip
                active={aspect === "1:1"}
                ratio="1:1"
                hint="Feed"
                box="square"
                onClick={() => onChange({ aspect: "1:1" })}
              />
              <AspectChip
                active={aspect === "4:5"}
                ratio="4:5"
                hint="Portrait"
                box="portrait"
                onClick={() => onChange({ aspect: "4:5" })}
              />
              <AspectChip
                active={aspect === "9:16"}
                ratio="9:16"
                hint="Stories"
                box="tall"
                onClick={() => onChange({ aspect: "9:16" })}
              />
              <AspectChip
                active={aspect === "16:9"}
                ratio="16:9"
                hint="Wide"
                box="wide"
                onClick={() => onChange({ aspect: "16:9" })}
              />
            </div>

            <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small components ---------- */

function ModeTab({ active, label, onClick, disabled }: { active: boolean; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-2 text-[11px] font-semibold transition",
        active ? "bg-white dark:bg-slate-900 shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/60",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
      )}
    >
      {label}
    </button>
  );
}


const platforms: Array<{ id: Platform; label: string; icon: React.ReactNode }> = [
  { id: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
  { id: "tiktok", label: "TikTok", icon: <Music2 className="h-4 w-4" /> },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
];

function PlatformChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2",
        "text-[11px] font-semibold transition",
        active
          ? "border-[#068773]/40 bg-[#068773]/10 text-[#068773]"
          : "border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
      )}
    >
      <span className={cn("opacity-90", active ? "text-[#068773]" : "")}>{icon}</span>
      {label}
    </button>
  );
}


function AspectChip({
  active,
  ratio,
  hint,
  box,
  onClick,
}: {
  active: boolean;
  ratio: string;
  hint: string;
  box: "square" | "portrait" | "tall" | "wide";
  onClick: () => void;
}) {
  const boxCls =
    box === "square"
      ? "h-4 w-4"
      : box === "portrait"
      ? "h-4 w-3.5"
      : box === "tall"
      ? "h-4 w-3"
      : "h-3 w-4";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-2 py-2 text-center transition",
        "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
        active
          ? "border-[#068773]/25 bg-[#068773]/10"
          : "border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
      )}
    >
      <div
        className={cn(
          "mx-auto mb-1 rounded-sm border",
          boxCls,
          active ? "border-[#068773]" : "border-slate-300 dark:border-slate-700"
        )}
      />
      <div className={cn("text-[10px] font-extrabold", active ? "text-[#068773]" : "text-slate-700 dark:text-slate-200")}>
        {ratio}
      </div>
      <div className="text-[9px] font-semibold text-slate-400">{hint}</div>
    </button>
  );
}
