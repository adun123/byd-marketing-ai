// src/pages/marketing-dashboard/scheduler/BestTimesCard.tsx
import type { BestTimeRow } from "./types";
import { Lightbulb } from "lucide-react";

function prettyPlatform(p: BestTimeRow["platform"]) {
  if (p === "omnisernd") return "Omnisend";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

export default function BestTimesCard({
  rows,
  onViewAnalytics,
}: {
  rows: BestTimeRow[];
  onViewAnalytics: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
          <Lightbulb className="h-4 w-4 text-[#068773]" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-slate-900">Best Times</div>
          <div className="mt-0.5 text-[12px] text-slate-500">
            Rekomendasi waktu posting (mock)
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.platform} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[12px] font-semibold text-slate-900">{prettyPlatform(r.platform)}</div>
            <div className="text-right">
              <div className="text-[12px] font-semibold text-slate-900">{r.day}</div>
              <div className="text-[11px] text-slate-500">{r.at}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onViewAnalytics}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
      >
        View analytics
      </button>
    </section>
  );
}
