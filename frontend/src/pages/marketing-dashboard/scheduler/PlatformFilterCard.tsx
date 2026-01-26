// src/pages/marketing-dashboard/scheduler/PlatformFilterCard.tsx
import type { PlatformKey } from "./types";
import { Facebook, Instagram, Music2, Youtube, Twitter } from "lucide-react";
import { cn } from "./date";

const ITEMS: Array<{
  key: PlatformKey;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}> = [
  { key: "all", label: "All channels" },
  { key: "meta", label: "Meta", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "tiktok", label: "TikTok", icon: Music2 },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "twitter", label: "X", icon: Twitter },
];

export default function PlatformFilterCard({
  value,
  onChange,
}: {
  value: PlatformKey;
  onChange: (v: PlatformKey) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="p-3">
        <div className="text-[12px] font-semibold text-slate-900">Channels</div>
        <div className="mt-0.5 text-[11px] text-slate-500">
          Filter jadwal berdasarkan platform.
        </div>

        <div className="mt-3 space-y-1.5">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            const active = it.key === value;

            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onChange(it.key)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left transition border",
                  active
                    ? "border-emerald-200 bg-emerald-50 text-[#068773]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  {Icon ? (
                    <Icon className={cn("h-4 w-4", active ? "text-[#068773]" : "text-slate-600")} />
                  ) : (
                    <span
                      className={cn(
                        "inline-block h-4 w-4 rounded bg-slate-200",
                        active && "bg-emerald-200"
                      )}
                      aria-hidden="true"
                    />
                  )}

                  <div className="text-[12px] font-medium">{it.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
