// src/pages/marketing-dashboard/library/AssetCard.tsx
import { Eye, Pencil, Image as ImageIcon, Clock3 } from "lucide-react";
import type { AssetItem } from "./types";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

function statusLabel(status: AssetItem["status"]) {
  switch (status) {
    case "published":
      return "Live";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}

function StatusPill({ status }: { status: AssetItem["status"] }) {
  const base = "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border";

  if (status === "published") {
    return (
      <span className={cn(base, "border-emerald-200 bg-emerald-50 text-[#068773]")}>
        {statusLabel(status)}
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className={cn(base, "border-slate-200 bg-slate-50 text-slate-700")}>
        {statusLabel(status)}
      </span>
    );
  }
  return (
    <span className={cn(base, "border-amber-200 bg-amber-50 text-amber-800")}>
      {statusLabel(status)}
    </span>
  );
}

export default function AssetCard({
  item,
  onView,
  onEdit,
}: {
  item: AssetItem;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-sm transition">
      {/* top accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <ImageIcon className="h-3.5 w-3.5 text-[#068773]" />
            </div>

            <span className="truncate text-[12px] font-semibold text-slate-900">
              {item.title}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="rounded-md bg-slate-50 px-2 py-0.5 border border-slate-200">
              {item.platform}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {item.updatedAtLabel}
            </span>
          </div>
        </div>

        <StatusPill status={item.status} />
      </div>

      {/* Preview */}
      <div className="px-3 pb-3">
        <div className="aspect-[16/9] w-full rounded-lg bg-slate-50 border border-slate-200 grid place-items-center">
          <ImageIcon className="h-9 w-9 text-slate-300" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2">
        <div className="text-[11px] text-slate-500">
          {item.versions} revisions
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#068773] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:opacity-95 active:opacity-90"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
