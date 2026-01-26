// src/pages/marketing-dashboard/scheduler/PostsForDateCard.tsx
import type { ScheduledPost } from "./types";
import { Calendar, Plus } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

function statusLabel(s: ScheduledPost["status"]) {
  switch (s) {
    case "scheduled":
      return "Scheduled";
    case "published":
      return "Live";
    case "failed":
      return "Failed";
    default:
      return s;
  }
}

function statusPill(s: ScheduledPost["status"]) {
  const base = "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border";

  if (s === "scheduled") {
    return cn(base, "border-emerald-200 bg-emerald-50 text-[#068773]");
  }
  if (s === "published") {
    return cn(base, "border-slate-200 bg-slate-900 text-white");
  }
  return cn(base, "border-rose-200 bg-rose-50 text-rose-700");
}

export default function PostsForDateCard({
  title,
  items,
  onSchedule,
}: {
  title: string;
  items: ScheduledPost[];
  onSchedule: () => void;
}) {
  const countLabel =
    items.length === 0 ? "No items" : `${items.length} item${items.length === 1 ? "" : "s"}`;

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* top accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-900">{title}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">{countLabel}</div>
          </div>

          <button
            type="button"
            onClick={onSchedule}
            className="inline-flex items-center gap-2 rounded-lg bg-[#068773] px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-95 active:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Body */}
        <div className="mt-3">
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-white border border-slate-200">
                <Calendar className="h-5 w-5 text-slate-300" />
              </div>

              <div className="mt-3 text-[12px] font-semibold text-slate-900">
                Belum ada posting untuk tanggal ini
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Tambahkan draft atau jadwalkan konten baru.
              </div>

              <button
                type="button"
                onClick={onSchedule}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Create schedule
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-semibold text-slate-900">
                        {p.title}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {p.platform} • {p.time}
                      </div>
                    </div>

                    <span className={statusPill(p.status)}>{statusLabel(p.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
