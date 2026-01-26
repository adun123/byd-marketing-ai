// src/pages/marketing-dashboard/scheduler/date.ts
export function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function addMonths(d: Date, delta: number) {
  const next = new Date(d);
  next.setMonth(next.getMonth() + delta);
  return new Date(next.getFullYear(), next.getMonth(), 1);
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export type CalendarCell = {
  date: Date;
  key: string; // YYYY-MM-DD
  inMonth: boolean;
  isToday: boolean;
};

export function buildCalendarGrid(viewMonth: Date): CalendarCell[] {
  const today = new Date();
  const first = startOfMonth(viewMonth);
  const last = endOfMonth(viewMonth);

  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));

  const cells: CalendarCell[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const cd = new Date(cursor);
    cells.push({
      date: cd,
      key: ymd(cd),
      inMonth: cd.getMonth() === viewMonth.getMonth(),
      isToday: isSameDay(cd, today),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}

export const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
