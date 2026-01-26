// src/pages/marketing-dashboard/library/mock.ts
import type { AssetItem } from "./types";

export const MOCK_ASSETS: AssetItem[] = [
  {
    id: "a1",
    title: "Summer Sale Banner",
    platform: "Instagram",
    type: "image",
    status: "published",
    updatedAtLabel: "2 hours ago",
    versions: 3,
  },
  {
    id: "a2",
    title: "Product Hero Image",
    platform: "Website",
    type: "image",
    status: "draft",
    updatedAtLabel: "1 day ago",
    versions: 5,
  },
  {
    id: "a3",
    title: "Brand Logo Variations",
    platform: "Multi-platform",
    type: "image",
    status: "published",
    updatedAtLabel: "3 days ago",
    versions: 8,
  },
];
