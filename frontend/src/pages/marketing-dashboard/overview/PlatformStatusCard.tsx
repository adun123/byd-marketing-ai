// src/pages/marketing-dashboard/overview/PlatformStatusCard.tsx
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Plus,
  Plug2,
} from "lucide-react";

type Row = {
  name: string;
  state: "connected" | "pending" | "error";
};

const ROWS: Row[] = [
  { name: "Instagram", state: "connected" },
  { name: "Reels", state: "connected" },
  { name: "TikTok", state: "pending" },
  { name: "Linkedin", state: "error" },
];

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function statusMeta(state: Row["state"]) {
  switch (state) {
    case "connected":
      return {
        label: "Connected",
        pill: "bg-emerald-50 text-emerald-800 ring-emerald-100",
        dot: "bg-emerald-500",
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      };
    case "pending":
      return {
        label: "Pending",
        pill: "bg-amber-50 text-amber-800 ring-amber-100",
        dot: "bg-amber-400",
        icon: <Clock3 className="h-4 w-4 text-amber-500" />,
      };
    case "error":
      return {
        label: "Issue",
        pill: "bg-rose-50 text-rose-700 ring-rose-100",
        dot: "bg-rose-500",
        icon: <XCircle className="h-4 w-4 text-rose-500" />,
      };
  }
}

function StatusPill({ state }: { state: Row["state"] }) {
  const m = statusMeta(state);
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

export default function PlatformStatusCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="flex items-start justify-between gap-3 p-4">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <Plug2 className="h-3.5 w-3.5 text-[#068773]" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">
                Integration Health
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Status koneksi channel
              </div>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
            {ROWS.filter((r) => r.state === "connected").length}/{ROWS.length} live
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          {ROWS.map((r) => {
            const m = statusMeta(r.state);

            return (
              <div
                key={r.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50/60"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
                    {m.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 truncate">
                      {r.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {r.state === "connected"
                        ? "Ready to sync"
                        : r.state === "pending"
                        ? "Waiting authorization"
                        : "Action required"}
                    </div>
                  </div>
                </div>

                <StatusPill state={r.state} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          Add integration
        </button>
      </div>
    </section>
  );
}
