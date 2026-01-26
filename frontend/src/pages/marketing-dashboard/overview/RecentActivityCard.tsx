// src/pages/marketing-dashboard/overview/RecentActivityCard.tsx
import { Activity as ActivityIcon } from "lucide-react";

type Activity = {
  title: string;
  channel: string;
  time: string;
  status: "ok" | "warn" | "error";
};

const ITEMS: Activity[] = [
  {
    title: "Caption generated for Instagram carousel",
    channel: "Meta",
    time: "2 min ago",
    status: "ok",
  },
  {
    title: "Campaign email delivered to 1,200 subscribers",
    channel: "Linkedin",
    time: "1 hour ago",
    status: "ok",
  },
  {
    title: "Draft created for TikTok script",
    channel: "TikTok",
    time: "3 hours ago",
    status: "warn",
  },
  
];

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function statusMeta(status: Activity["status"]) {
  switch (status) {
    case "ok":
      return {
        label: "Success",
        dot: "bg-emerald-500",
        pill: "bg-emerald-50 text-emerald-800 ring-emerald-100",
      };
    case "warn":
      return {
        label: "Pending",
        dot: "bg-amber-400",
        pill: "bg-amber-50 text-amber-800 ring-amber-100",
      };
    case "error":
      return {
        label: "Failed",
        dot: "bg-rose-500",
        pill: "bg-rose-50 text-rose-700 ring-rose-100",
      };
  }
}

function ChannelChip({ channel }: { channel: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
      {channel}
    </span>
  );
}

function StatusPill({ status }: { status: Activity["status"] }) {
  const m = statusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
        m.pill
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export default function RecentActivityCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="flex items-start justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <ActivityIcon className="h-3.5 w-3.5 text-[#068773]" />
            </div>

            <div>
              <div className="text-[13px] font-semibold text-slate-900">
                Activity Feed
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Recent system actions
              </div>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            View all
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          {ITEMS.map((it, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-50/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-slate-900">
                    {it.title}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <ChannelChip channel={it.channel} />
                    <span className="text-slate-400">•</span>
                    <span className="truncate">{it.time}</span>
                  </div>
                </div>

                <StatusPill status={it.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
