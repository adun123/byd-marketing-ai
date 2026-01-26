// src/pages/marketing-dashboard/overview/AiUsageOverviewCard.tsx
import { Cpu } from "lucide-react";

type Usage = { label: string; value: number; note: string };

const USAGE: Usage[] = [
  { label: "Text generation", value: 73, note: "Posts, captions, hooks" },
  { label: "Image workflow", value: 45, note: "Prompts & variations" },
  { label: "Video scripting", value: 28, note: "Outline & storyboard" },
];


function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default function AiUsageOverviewCard() {
  const total = Math.round(
    USAGE.reduce((acc, u) => acc + u.value, 0) / USAGE.length
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="flex items-start justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <Cpu className="h-3.5 w-3.5 text-[#068773]" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">
                AI Usage
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Ringkasan penggunaan bulan ini
              </div>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
            Avg {total}%
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {USAGE.map((u) => (
            <div
              key={u.label}
              className="rounded-2xl border border-slate-200 bg-white p-3 hover:bg-slate-50/60 transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-semibold text-slate-900">
                  {u.label}
                </div>
                <div className="text-[11px] font-semibold text-slate-600">
                  {u.value}%
                </div>
              </div>

              <div className="mt-1 text-[11px] text-slate-500">{u.note}</div>

              <ProgressBar value={u.value} />

              <div className="mt-2 text-[10px] text-slate-400">
                Updated this month
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
