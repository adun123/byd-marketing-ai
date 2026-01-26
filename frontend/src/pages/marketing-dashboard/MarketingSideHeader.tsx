
import { ChevronLeft, ChevronRight } from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function MarketingSideHeader({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className={cn("h-16 border-b border-slate-200 bg-white flex items-center", collapsed ? "px-2" : "px-3")}>
      <div className={cn("flex w-full items-center gap-2", collapsed && "justify-center")}>
        <div
          className={cn(
            "grid place-items-center rounded-xl text-white text-xs font-bold",
            "bg-gradient-to-br from-[#068773] to-[#0fb9a8]",
            "h-9 w-9"
          )}
        >
          AI
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-900">Marketing</div>
            <div className="text-[11px] text-slate-500">Console</div>
          </div>
        )}

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "ml-auto grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              collapsed && "ml-0"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
