// src/pages/marketing-dashboard/scheduler/QuickStatsCard.tsx
import { BarChart3 } from "lucide-react";

type Stat = { label: string; value: string };

export default function QuickStatsCard({
  stats,
  onViewAnalytics,
}: {
  stats: Stat[];
  onViewAnalytics: () => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] font-semibold text-slate-900">Snapshot</div>
          <button
            type="button"
            onClick={onViewAnalytics}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div className="text-[14px] font-semibold text-slate-900">{s.value}</div>
              <div className="mt-0.5 text-[11px] text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
