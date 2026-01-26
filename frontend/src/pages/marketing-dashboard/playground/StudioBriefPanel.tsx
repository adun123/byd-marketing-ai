// src/pages/marketing-dashboard/playground/StudioBriefPanel.tsx
import * as React from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import type { StudioBrief, StudioObjective, StudioPlatform, StudioTone } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        {children}
      </select>
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition",
        active
          ? "bg-emerald-50 text-[#068773] ring-emerald-100"
          : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );
}

export default function StudioBriefPanel({
  brief,
  setBrief,
  isGenerating,
  onGenerate,
}: {
  brief: StudioBrief;
  setBrief: React.Dispatch<React.SetStateAction<StudioBrief>>;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  function togglePlatform(p: StudioPlatform) {
    setBrief((prev) => {
      const has = prev.platforms.includes(p);
      const next = has ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p];
      return { ...prev, platforms: next };
    });
  }

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                <Sparkles className="h-3.5 w-3.5 text-[#068773]" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-900">Campaign Brief</div>
                <div className="mt-0.5 text-[11px] text-slate-500">Set konteks sebelum generate</div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Field label="Campaign name (optional)">
              <input
                value={brief.campaignName}
                onChange={(e) => setBrief((p) => ({ ...p, campaignName: e.target.value }))}
                placeholder="e.g. Q2 Launch"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="Objective">
              <Select
                value={brief.objective}
                onChange={(v) => setBrief((p) => ({ ...p, objective: v as StudioObjective }))}
              >
                <option value="awareness">Awareness</option>
                <option value="conversion">Conversion</option>
                <option value="retention">Retention</option>
              </Select>
            </Field>

            <Field label="Product">
              <input
                value={brief.product}
                onChange={(e) => setBrief((p) => ({ ...p, product: e.target.value }))}
                placeholder="What are you promoting?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="Offer">
              <input
                value={brief.offer}
                onChange={(e) => setBrief((p) => ({ ...p, offer: e.target.value }))}
                placeholder="e.g. 20% off, free trial, bundle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="Audience">
              <input
                value={brief.audience}
                onChange={(e) => setBrief((p) => ({ ...p, audience: e.target.value }))}
                placeholder="Who is this for?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="Tone">
              <Select
                value={brief.tone}
                onChange={(v) => setBrief((p) => ({ ...p, tone: v as StudioTone }))}
              >
                <option value="corporate">Corporate</option>
                <option value="friendly">Friendly</option>
                <option value="bold">Bold</option>
              </Select>
            </Field>

            <Field label="Target platforms">
              <div className="flex flex-wrap gap-2">
                {(["Instagram","TikTok","YouTube","Email","X"] as StudioPlatform[]).map((p) => (
                  <Chip key={p} active={brief.platforms.includes(p)} onClick={() => togglePlatform(p)}>
                    {p}
                  </Chip>
                ))}
              </div>
            </Field>

            <Field label="Brand notes (optional)">
              <textarea
                value={brief.brandNotes}
                onChange={(e) => setBrief((p) => ({ ...p, brandNotes: e.target.value }))}
                placeholder="Style rules, words to avoid, key message…"
                className="min-h-[92px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className={cn(
                "w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold text-white transition",
                "bg-slate-900 hover:bg-slate-800",
                isGenerating && "opacity-70 cursor-not-allowed"
              )}
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating…" : "Generate ideas"}
            </button>

            <div className="text-[10px] text-slate-500">
              Tip: isi minimal <span className="font-semibold text-slate-700">Product</span> +{" "}
              <span className="font-semibold text-slate-700">Audience</span> untuk output lebih relevan.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-700">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
