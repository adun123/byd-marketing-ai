// src/pages/marketing-dashboard/integrations/meta/sections/MetaPostScheduler.tsx
import * as React from "react";
import { CalendarDays, Sparkles, Zap } from "lucide-react";
import { META_PERF } from "../mock";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="text-[11px] font-semibold text-slate-600">{label}</div>
      <div className="mt-0.5 text-[14px] font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function MetaPostScheduler() {
  const [prompt, setPrompt] = React.useState("");
  const [tone, setTone] = React.useState<"Corporate" | "Friendly" | "Bold">("Corporate");
  const [includeHashtags, setIncludeHashtags] = React.useState(true);
  const [postToIG, setPostToIG] = React.useState(true);
  const [result, setResult] = React.useState<string>("");

  function onGenerate() {
    const base = prompt.trim() || "Product update";
    const toneText =
      tone === "Corporate"
        ? "Profesional, ringkas, dan to-the-point."
        : tone === "Friendly"
        ? "Hangat, santai, dan mudah dibaca."
        : "Berani, direct, dan energik.";

    const hashtags = includeHashtags ? "\n\n#marketing #content #growth" : "";

    setResult(
      [
        "Draft caption:",
        base,
        "",
        `Style: ${toneText}`,
        postToIG ? "Target: Facebook + Instagram" : "Target: Facebook",
        hashtags ? "" : "",
      ].join("\n") + hashtags
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Left: generator */}
      <section className="lg:col-span-7 rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <Sparkles className="h-4 w-4 text-[#068773]" />
            </div>

            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-slate-900">Caption Builder</div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Buat draft caption untuk Meta (Facebook/Instagram) dari brief singkat.
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-slate-700">Brief</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: promo weekend, target audiens, highlight produk, CTA…"
              className="mt-1 min-h-[150px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Actions row */}
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_180px]">
            <button
              type="button"
              onClick={onGenerate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#068773] px-3 py-2 text-[12px] font-semibold text-white hover:opacity-95 active:opacity-90"
            >
              <Zap className="h-4 w-4" />
              Generate draft
            </button>

            <div>
              <div className="text-[11px] font-semibold text-slate-700">Tone</div>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option>Corporate</option>
                <option>Friendly</option>
                <option>Bold</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="mt-3 space-y-2">
            <ToggleRow
              label="Add hashtags"
              hint="Tambahkan hashtag otomatis di bagian akhir."
              checked={includeHashtags}
              onChange={setIncludeHashtags}
            />
            <ToggleRow
              label="Post to Instagram"
              hint="Jadwalkan juga ke Instagram (jika terhubung)."
              checked={postToIG}
              onChange={setPostToIG}
            />
          </div>

          {/* Schedule */}
          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-[#068773] hover:bg-emerald-100"
          >
            <CalendarDays className="h-4 w-4" />
            Schedule this draft
          </button>

          {/* Preview */}
          {result && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-semibold text-slate-700">Preview</div>
              <pre className="mt-2 whitespace-pre-wrap text-[12px] text-slate-800">{result}</pre>
            </div>
          )}
        </div>
      </section>

      {/* Right: performance */}
      <section className="lg:col-span-5 rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[12px] font-semibold text-slate-900">Today snapshot</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Metrics ringkas (mock).</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MetricCard label="Reach" value={META_PERF.reach} />
            <MetricCard label="Engagement" value={META_PERF.engagement} />
            <MetricCard label="Comments" value={META_PERF.comments} />
            <MetricCard label="Shares" value={META_PERF.shares} />
          </div>

          <div className="mt-4 space-y-3">
            <BarRow
              label="Engagement rate"
              value={`${META_PERF.engagementRate}%`}
              pct={META_PERF.engagementRate}
            />
            <BarRow label="Ad spend (today)" value={META_PERF.adSpendToday} pct={60} />
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-slate-700">{label}</div>
        {hint ? <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div> : null}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition border",
          checked ? "bg-[#068773] border-[#068773]" : "bg-slate-200 border-slate-200"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function BarRow({ label, value, pct }: { label: string; value: string; pct: number }) {
  const safe = Math.min(100, Math.max(0, pct));

  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <div className="font-semibold text-slate-700">{label}</div>
        <div className="text-slate-600">{value}</div>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-[#068773]"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
