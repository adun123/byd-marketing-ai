// src/pages/marketing-dashboard/scheduler/ScheduleCalendarCard.tsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCalendarGrid, cn, DAYS, MONTHS, addMonths, isSameDay, ymd } from "./date";

export default function ScheduleCalendarCard({
  viewMonth,
  setViewMonth,
  selected,
  setSelected,
  dots,
}: {
  viewMonth: Date;
  setViewMonth: (d: Date) => void;
  selected: Date;
  setSelected: (d: Date) => void;
  dots: Record<string, "emerald" | "slate">;
}) {
  const cells = React.useMemo(() => buildCalendarGrid(viewMonth), [viewMonth]);
  const title = `${MONTHS[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* top accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-900">Calendar</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Pilih tanggal untuk cek jadwal posting.
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMonth(addMonths(viewMonth, -1))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Month title */}
        <div className="mt-2 text-center text-[12px] font-semibold text-slate-900">
          {title}
        </div>

        {/* Days row */}
        <div className="mt-3 grid grid-cols-7 gap-1.5 text-[10px] font-semibold text-slate-500">
          {DAYS.map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {cells.map((c) => {
            const isSel = isSameDay(c.date, selected);
            const dot = dots[c.key];

            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelected(c.date)}
                className={cn(
                  "relative grid h-9 place-items-center rounded-lg text-[12px] transition",
                  "ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-emerald-200",
                  c.inMonth ? "text-slate-900" : "text-slate-400",
                  "hover:bg-slate-50",
                  isSel && "bg-emerald-50 ring-emerald-100"
                )}
                aria-label={`Pick ${ymd(c.date)}`}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-md",
                    // Today indicator (subtle brand)
                    c.isToday && !isSel && "bg-[#068773] text-white"
                  )}
                >
                  {c.date.getDate()}
                </span>

                {dot && (
                  <span
                    className={cn(
                      "absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                      dot === "emerald" ? "bg-[#068773]" : "bg-slate-400"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#068773]" />
            <span>Scheduled posts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span>Different statuses</span>
          </div>
        </div>
      </div>
    </section>
  );
}
