// src/pages/marketing-dashboard/integrations/meta/sections/MetaSettings.tsx
import * as React from "react";
import { Target } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function MetaSettings() {
  const [enabled, setEnabled] = React.useState(true);
  const [frequency, setFrequency] = React.useState("Daily");
  const [contentType, setContentType] = React.useState("Mixed content");

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* top accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <Target className="h-4 w-4 text-[#068773]" />
            </div>

            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-slate-900">
                Auto-posting rules
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Atur frekuensi, jenis konten, dan status auto-post.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[11px] font-semibold",
              enabled ? "text-[#068773]" : "text-slate-500"
            )}>
              {enabled ? "Enabled" : "Disabled"}
            </span>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Summary card */}
          <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-[11px] font-semibold text-slate-700">Status</div>
            <div className="mt-1 text-[12px] font-semibold text-slate-900">
              {enabled ? "Auto-post aktif" : "Auto-post nonaktif"}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              {enabled
                ? "Sistem akan menyarankan waktu terbaik dan menyiapkan draft otomatis."
                : "Semua posting dibuat & dijadwalkan secara manual."}
            </div>

            <div className="mt-3 text-[11px] text-slate-500">
              Recommended time (mock):{" "}
              <span className="font-semibold text-slate-700">14:00</span>
            </div>
          </div>

          {/* Frequency */}
          <div className="lg:col-span-4">
            <div className="text-[11px] font-semibold text-slate-700">Posting frequency</div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option>Daily</option>
              <option>3x per week</option>
              <option>Weekly</option>
            </select>
            <div className="mt-1 text-[11px] text-slate-500">
              Atur seberapa sering sistem membuat draft otomatis.
            </div>
          </div>

          {/* Content type */}
          <div className="lg:col-span-4">
            <div className="text-[11px] font-semibold text-slate-700">Content mix</div>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option>Mixed content</option>
              <option>Educational</option>
              <option>Promotional</option>
              <option>Community</option>
            </select>
            <div className="mt-1 text-[11px] text-slate-500">
              Pilih fokus konten agar output lebih konsisten.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
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
  );
}
