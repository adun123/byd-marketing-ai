// src/pages/marketing-dashboard/overview/KpiCard.tsx
import * as React from "react";

type Props = {
  title: string;
  value: string;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function KpiCard({
  title,
  value,
  note,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
          <Icon className="h-4 w-4 text-[#068773]" />
        </div>
      </div>

      {/* Value */}
      <div className="mt-3 text-xl font-semibold text-slate-900">
        {value}
      </div>

      {/* Description */}
      <div className="mt-1 text-[11px] leading-relaxed text-slate-600">
        {note}
      </div>
    </div>
  );
}
