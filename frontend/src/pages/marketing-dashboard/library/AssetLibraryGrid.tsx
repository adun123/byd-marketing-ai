// src/pages/marketing-dashboard/library/AssetGrid.tsx
import type { AssetItem } from "./types";
import AssetCard from "./AssetLibraryCard";

export default function AssetGrid({
  items,
  onView,
  onEdit,
}: {
  items: AssetItem[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((it) => (
        <AssetCard key={it.id} item={it} onView={() => onView(it.id)} onEdit={() => onEdit(it.id)} />
      ))}
    </div>
  );
}
