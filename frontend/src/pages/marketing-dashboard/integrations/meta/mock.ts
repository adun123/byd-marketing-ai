// src/pages/marketing-dashboard/integrations/meta/mock.ts
import type { MetaConnection, MetaPerf } from "./types";

export const META_CONN: MetaConnection = {
  connected: true,
  accountName: "Meta Marketing",
  lastSync: "2 min ago",
};

export const META_PERF: MetaPerf = {
  reach: "24.5K",
  engagement: "1,847",
  comments: "203",
  shares: "156",
  engagementRate: 7.5,
  adSpendToday: "$284",
};
