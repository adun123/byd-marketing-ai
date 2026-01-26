// src/pages/marketing-dashboard/integrations/meta/MetaTabs.tsx
import type { MetaTabKey } from "./types";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

const TABS: Array<{ key: MetaTabKey; label: string }> = [
  { key: "scheduler", label: "Schedule" },
  { key: "performance", label: "Results" },
  { key: "insights", label: "Insights" },
  { key: "settings", label: "Config" },
];

export default function MetaTabs({
  value,
  onChange,
}: {
  value: MetaTabKey;
  onChange: (v: MetaTabKey) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {TABS.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[12px] font-medium transition border",
                active
                  ? "border-emerald-200 bg-emerald-50 text-[#068773]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
