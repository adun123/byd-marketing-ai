// src/pages/marketing-dashboard/integrations/meta/types.ts
export type MetaTabKey = "scheduler" | "performance" | "insights" | "settings";

export type MetaConnection = {
  connected: boolean;
  accountName: string;
  lastSync: string;
};

export type MetaPerf = {
  reach: string;
  engagement: string;
  comments: string;
  shares: string;
  engagementRate: number; // 0-100
  adSpendToday: string;
};
