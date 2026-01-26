// src/pages/marketing-dashboard/services/AiToolkitPage.tsx
import { Wand2 } from "lucide-react";
import ToolkitCard from "./ToolkitCard";
import { TOOL_ITEMS, type ToolItem } from "./tools";

export default function AiToolkitPage({
  onOpenTool,
}: {
  onOpenTool?: (k: ToolItem["key"]) => void;
}) {
  function handleOpen(k: ToolItem["key"]) {
    // default fallback: no-op
    onOpenTool?.(k);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <Wand2 className="h-3.5 w-3.5 text-[#068773]" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-slate-900">AI Toolkit</div>
              <div className="mt-0.5 text-[12px] text-slate-500">
                Pilih tool untuk generate, refine, dan eksplorasi ide.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOOL_ITEMS.map((it) => (
          <ToolkitCard key={it.key} item={it} onOpen={handleOpen} />
        ))}
      </div>
    </div>
  );
}
