// src/pages/marketing-dashboard/overview/OverviewHeader.tsx
import { Plus } from "lucide-react";

export default function OverviewHeader() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] p-4 text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold">Marketing Overview</h1>
          <p className="mt-1 text-sm text-white/80">
            Snapshot performa campaign dan aktivitas AI saat ini.
          </p>
        </div>

        {/* Action */}
        <div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-[#068773] shadow-sm hover:bg-white transition"
          >
            <Plus className="h-4 w-4" />
            Create Content
          </button>
        </div>
      </div>
    </div>
  );
}
