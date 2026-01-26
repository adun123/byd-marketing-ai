// src/pages/marketing-dashboard/scheduler/types.ts
export type PlatformKey =
  | "all"
  | "meta"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "omnisernd";

export type ScheduledPost = {
  id: string;
  dateKey: string; // YYYY-MM-DD
  platform: Exclude<PlatformKey, "all">;
  title: string;
  time: string; // "09:30"
  status: "scheduled" | "published" | "failed";
};

export type BestTimeRow = {
  platform: Exclude<PlatformKey, "all">;
  day: string; // "Tue"
  at: string; // "10:00"
};
