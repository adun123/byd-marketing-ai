// src/pages/marketing-dashboard/services/ToolkitCard.tsx
import type { ToolItem } from "./tools";
import { ArrowRight, Lock } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function ToolkitCard({
  item,
  onOpen,
}: {
  item: ToolItem;
  onOpen: (k: ToolItem["key"]) => void;
}) {
  const Icon = item.icon;
  const isPrimary = item.accent === "emerald";
  const disabled = !!item.disabled;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white overflow-hidden",
        "transition hover:shadow-sm"
      )}
    >
      {/* subtle accent strip */}
      <div
        className={cn(
          "h-[3px] w-full",
          isPrimary
            ? "bg-gradient-to-r from-[#068773] to-[#0fb9a8]"
            : "bg-slate-200"
        )}
      />

      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg ring-1",
                isPrimary ? "bg-emerald-50 ring-emerald-100" : "bg-slate-50 ring-slate-200"
              )}
            >
              <Icon className={cn("h-4 w-4", isPrimary ? "text-[#068773]" : "text-slate-600")} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold text-slate-900">
                {item.title}
              </div>
              <div className="mt-0.5 truncate text-[11px] text-slate-500">
                {item.meta}
              </div>
            </div>
          </div>

          {disabled && (
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600">
              <Lock className="h-3 w-3" />
              Coming soon
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
          {item.desc}
        </p>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => !disabled && onOpen(item.key)}
            disabled={disabled}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition",
              disabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isPrimary
                ? "bg-[#068773] text-white hover:opacity-95 active:opacity-90"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {item.cta}
            <ArrowRight className="h-4 w-4" />
          </button>

          {item.secondary && (
            <div className="text-[11px] text-slate-500 truncate">
              {item.secondary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
