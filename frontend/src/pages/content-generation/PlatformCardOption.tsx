// src/pages/content-generation/components/OptionsStep1SourcePlatform.tsx
import * as React from "react";
import { Instagram, Linkedin, Music2 } from "lucide-react";
import type { Workflow } from "./options/OptionsPanel";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type Platform = "instagram" | "tiktok" | "linkedin";

type Props = {
  workflow: Workflow;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  onChange: (v: { workflow?: Workflow; aspect?: Props["aspect"] }) => void;

  // optional (biar bisa controlled dari parent nanti)
  platform?: Platform;
  onPlatformChange?: (p: Platform) => void;

  scriptPreview?: string;
};

export default function OptionsStep1SourcePlatform({
  workflow,
  aspect,
  onChange,
  platform: platformProp,
  onPlatformChange,
  scriptPreview = "Experience the future of mobility with Haka Auto’s latest electric sedan. Sleek lines, sustainable power, and unmatched luxury at your fingertips.",
}: Props) {
  const [platformState, setPlatformState] = React.useState<Platform>("instagram");
  const platform = platformProp ?? platformState;

  function setPlatform(p: Platform) {
    if (platformProp == null) setPlatformState(p);
    onPlatformChange?.(p);
  }

  const sourceMode: "draft" | "manual" =
    workflow === "image_to_image" ? "draft" : "manual";

  return (
    <aside className="w-full rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.22)]">
      <div className="p-5">
        {/* Step header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
            1
          </span>
          <div className="text-sm font-semibold text-slate-900">
            Source &amp; Platform
          </div>
        </div>

        {/* Source tabs */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ workflow: "image_to_image" })}
              className={cn(
                "rounded-xl px-3 py-2 text-[11px] font-semibold transition",
                sourceMode === "draft"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              Script from Draft
            </button>

            <button
              type="button"
              onClick={() => onChange({ workflow: "text_to_image" })}
              className={cn(
                "rounded-xl px-3 py-2 text-[11px] font-semibold transition",
                sourceMode === "manual"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              Manual Prompt
            </button>
          </div>
        </div>

        {/* Script content preview */}
        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Script Content Preview
          </div>

          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[12px] leading-relaxed text-slate-600">
            <span className="italic">“{scriptPreview}”</span>
          </div>
        </div>

        {/* Social media platform */}
        <div className="mt-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Social Media Platform
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <PlatformTile
              active={platform === "instagram"}
              label="Instagram"
              icon={<Instagram className="h-5 w-5" />}
              onClick={() => setPlatform("instagram")}
            />
            <PlatformTile
              active={platform === "tiktok"}
              label="TikTok"
              icon={<Music2 className="h-5 w-5" />}
              onClick={() => setPlatform("tiktok")}
            />
            <PlatformTile
              active={platform === "linkedin"}
              label="LinkedIn"
              icon={<Linkedin className="h-5 w-5" />}
              onClick={() => setPlatform("linkedin")}
            />
          </div>
        </div>

        {/* Aspect ratio */}
        <div className="mt-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Aspect Ratio
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <AspectTile
              active={aspect === "1:1"}
              ratio="1:1"
              hint="FEED"
              onClick={() => onChange({ aspect: "1:1" })}
            />
            <AspectTile
              active={aspect === "4:5"}
              ratio="4:5"
              hint="PORTRAIT"
              onClick={() => onChange({ aspect: "4:5" })}
            />
            <AspectTile
              active={aspect === "9:16"}
              ratio="9:16"
              hint="REELS / STORIES"
              onClick={() => onChange({ aspect: "9:16" })}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function PlatformTile({
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
        "rounded-2xl border p-3 text-center transition",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
        active
          ? "border-emerald-600/25 bg-emerald-600/5"
          : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-10 w-10 items-center justify-center rounded-2xl",
          active ? "bg-emerald-600/10 text-emerald-700" : "bg-slate-100 text-slate-600"
        )}
      >
        {icon}
      </div>
      <div className="mt-2 text-[11px] font-semibold text-slate-700">{label}</div>
    </button>
  );
}

function AspectTile({
  active,
  ratio,
  hint,
  onClick,
}: {
  active: boolean;
  ratio: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-3 text-left transition",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
        active
          ? "border-emerald-600/25 bg-emerald-600/5"
          : "border-slate-200 bg-white hover:bg-slate-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl border",
            active
              ? "border-emerald-600/25 bg-white text-emerald-700"
              : "border-slate-200 bg-white text-slate-500"
          )}
        >
          <div
            className={cn(
              "rounded-sm border border-slate-300",
              ratio === "1:1"
                ? "h-5 w-5"
                : ratio === "4:5"
                ? "h-6 w-5"
                : "h-6 w-4"
            )}
          />
        </div>

        {active ? (
          <span className="h-2 w-2 rounded-full bg-emerald-600 ring-4 ring-emerald-600/15" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        )}
      </div>

      <div className="mt-2 text-[11px] font-semibold text-slate-900">{ratio}</div>
      <div className="mt-0.5 max-w-full break-words text-[9px] font-semibold tracking-wide text-slate-500">
        {hint}
      </div>
    </button>
  );
}
