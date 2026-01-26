// src/pages/marketing-dashboard/library/AssetLibraryPage.tsx
import * as React from "react";
import LibraryHeader from "./LibraryHeader";
import LibraryToolbar from "./LibraryToolbar";
import LibraryTabs, { type LibraryTabKey } from "./LibraryTabs";
import AssetGrid from "./AssetLibraryGrid";
import { MOCK_ASSETS } from "./mock";
import type { AssetItem, AssetStatus } from "./types";

export default function AssetLibraryPage() {
  const [q, setQ] = React.useState("");
  const [platform, setPlatform] = React.useState<string>("all");
  const [status, setStatus] = React.useState<AssetStatus | "all">("all");
  const [tab, setTab] = React.useState<LibraryTabKey>("all");

  const items = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return MOCK_ASSETS.filter((it: AssetItem) => {
      const matchQuery =
        query.length === 0 ||
        it.title.toLowerCase().includes(query) ||
        it.platform.toLowerCase().includes(query);

      const matchPlatform = platform === "all" || it.platform === platform;
      const matchStatus = status === "all" || it.status === status;
      const matchTab = tab === "all" ? true : it.type === tab;

      return matchQuery && matchPlatform && matchStatus && matchTab;
    });
  }, [q, platform, status, tab]);

  return (
    <div className="space-y-4">
      <LibraryHeader onNewAsset={() => {}} />

      <LibraryToolbar
        q={q}
        setQ={setQ}
        platform={platform}
        setPlatform={setPlatform}
        status={status}
        setStatus={setStatus}
        onMoreFilters={() => {}}
      />

      <LibraryTabs value={tab} onChange={setTab} />

      <div className="px-1 text-[11px] text-slate-500">
        {items.length} item{items.length === 1 ? "" : "s"}
      </div>

      <AssetGrid
        items={items}
        onView={(id) => {}}
        onEdit={(id) => {}}
      />
    </div>
  );
}
