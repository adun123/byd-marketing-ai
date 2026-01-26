// src/pages/marketing-dashboard/library/LibraryToolbar.tsx
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { AssetStatus } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function LibraryToolbar({
  q,
  setQ,
  platform,
  setPlatform,
  status,
  setStatus,
  onMoreFilters,
}: {
  q: string;
  setQ: (v: string) => void;
  platform: string;
  setPlatform: (v: string) => void;
  status: AssetStatus | "all";
  setStatus: (v: AssetStatus | "all") => void;
  onMoreFilters: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_160px_140px_auto]">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your assets…"
            className={cn(
              "w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2.5 py-1.5",
              "text-[12px] text-slate-900 placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-emerald-200"
            )}
          />
        </div>

        {/* Platform */}
        <div className="relative">
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="all">All channels</option>
            <option value="Instagram">Instagram</option>
            <option value="Website">Website</option>
            <option value="Multi-platform">Multi-channel</option>
            <option value="Meta">Meta</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>

        {/* Status */}
        <div className="relative">
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="all">Any status</option>
            <option value="draft">Draft</option>
            <option value="published">Live</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Filters */}
        <button
          type="button"
          onClick={onMoreFilters}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>
    </div>
  );
}
