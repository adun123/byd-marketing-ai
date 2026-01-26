// src/pages/marketing-dashboard/library/LibraryHeader.tsx
import { Plus, FolderKanban } from "lucide-react";

export default function LibraryHeader({ onNewAsset }: { onNewAsset: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* subtle top accent */}
      <div className="h-[3px] w-full rounded-t-xl bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
              <FolderKanban className="h-4 w-4 text-[#068773]" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[13px] font-semibold text-slate-900">
                Asset Library
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Simpan, cari, dan rapikan aset konten dari AI & campaign.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewAsset}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#068773] px-3 py-2 text-[12px] font-semibold text-white hover:opacity-95 active:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </button>
      </div>
    </div>
  );
}
