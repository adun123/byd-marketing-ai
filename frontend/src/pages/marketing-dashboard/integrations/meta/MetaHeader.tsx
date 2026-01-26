// src/pages/marketing-dashboard/integrations/meta/MetaHeader.tsx
import { CheckCircle2, Facebook, RefreshCw, Settings2 } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function MetaHeader({
  title,
  subtitle,
  connected,
  onReconnect,
}: {
  title: string;
  subtitle: string;
  connected: boolean;
  onReconnect: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* top accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
            <Facebook className="h-4 w-4 text-[#068773]" />
          </div>

          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900">{title}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">{subtitle}</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[11px] font-semibold border",
              connected
                ? "border-emerald-200 bg-emerald-50 text-[#068773]"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            <CheckCircle2 className={cn("h-4 w-4", connected ? "text-[#068773]" : "text-rose-600")} />
            {connected ? "Active connection" : "Needs reconnect"}
          </span>

          <button
            type="button"
            onClick={onReconnect}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition border",
              connected
                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "border-emerald-200 bg-[#068773] text-white hover:opacity-95 active:opacity-90"
            )}
          >
            {connected ? (
              <>
                <Settings2 className="h-4 w-4" />
                Manage
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Reconnect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
