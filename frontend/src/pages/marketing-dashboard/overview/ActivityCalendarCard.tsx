// src/pages/marketing-dashboard/overview/ActivityCalendarCard.tsx
import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

type DotColor = "emerald" | "blue";

type CalendarCell = {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  key: string; // yyyy-mm-dd
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, delta: number) {
  const next = new Date(d);
  next.setMonth(next.getMonth() + delta);
  return new Date(next.getFullYear(), next.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarGrid(view: Date): CalendarCell[] {
  const today = new Date();
  const first = startOfMonth(view);
  const last = endOfMonth(view);

  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));

  const cells: CalendarCell[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const cellDate = new Date(cursor);
    cells.push({
      date: cellDate,
      inMonth: cellDate.getMonth() === view.getMonth(),
      isToday: isSameDay(cellDate, today),
      key: ymd(cellDate),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}

// mock dots (replace with API later)
const MOCK_DOTS: Record<string, DotColor> = {
  "2027-06-30": "blue",
  "2027-06-12": "emerald",
  "2027-06-14": "emerald",
  "2027-06-18": "emerald",
  "2027-06-21": "emerald",
  "2027-06-25": "blue",
};

export default function ActivityCalendarCard() {
  // initial view (contoh). Kalau mau realtime: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const [viewMonth, setViewMonth] = React.useState<Date>(() => new Date(2027, 5, 1));
  const [selected, setSelected] = React.useState<Date | null>(null);

  const cells = React.useMemo(() => buildCalendarGrid(viewMonth), [viewMonth]);
  const title = `${MONTHS[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  function onPrev() {
    setViewMonth((m) => addMonths(m, -1));
  }

  function onNext() {
    setViewMonth((m) => addMonths(m, 1));
  }

  function onToday() {
    const t = new Date();
    setViewMonth(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelected(t);
  }

  function onPick(d: Date) {
    setSelected(d);
    if (d.getMonth() !== viewMonth.getMonth() || d.getFullYear() !== viewMonth.getFullYear()) {
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                <CalendarDays className="h-3.5 w-3.5 text-[#068773]" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-900">
                  Activity Calendar
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Timeline post & campaign (preview)
                </div>
              </div>
            </div>

            {selected && (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                Selected: {ymd(selected)}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={onNext}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </button>

              <div className="ml-1 text-[13px] font-semibold text-slate-900">
                {title}
              </div>
            </div>

            <button
              type="button"
              onClick={onToday}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4">
        {/* Weekday labels */}
        <div className="mt-1 grid grid-cols-7 gap-2 text-[10px] font-semibold text-slate-500">
          {DAYS.map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="mt-2 grid grid-cols-7 gap-2">
          {cells.map((c) => {
            const isSelected = selected ? isSameDay(c.date, selected) : false;
            const dot = MOCK_DOTS[c.key];

            return (
              <button
                key={c.key}
                type="button"
                onClick={() => onPick(c.date)}
                className={cn(
                  "relative grid h-9 place-items-center rounded-xl transition",
                  "ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-emerald-200",
                  "hover:bg-slate-50",
                  c.inMonth ? "text-slate-900" : "text-slate-400",
                  isSelected && "bg-emerald-50 ring-emerald-100",
                  c.isToday && !isSelected && "ring-1 ring-emerald-100"
                )}
                aria-label={`Pick ${c.key}`}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg text-[12px] font-semibold",
                    c.isToday && !isSelected && "bg-[#068773] text-white"
                  )}
                >
                  {c.date.getDate()}
                </span>

                {dot && (
                  <span
                    className={cn(
                      "absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                      dot === "emerald" ? "bg-emerald-500" : "bg-blue-500"
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
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Campaign</span>
          </div>
        </div>
      </div>
    </section>
  );
}
