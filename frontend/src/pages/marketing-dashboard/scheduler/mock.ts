// src/pages/marketing-dashboard/scheduler/mock.ts
import type { BestTimeRow, ScheduledPost } from "./types";

export const BEST_TIMES: BestTimeRow[] = [
  { platform: "meta", day: "Tue", at: "14:00" },
  { platform: "instagram", day: "Wed", at: "11:00" },
  { platform: "tiktok", day: "Thu", at: "18:00" },
  { platform: "youtube", day: "Sat", at: "15:00" },
  { platform: "twitter", day: "Wed", at: "09:00" },
];

export const POSTS: ScheduledPost[] = [
  {
    id: "p1",
    dateKey: "2026-01-26",
    platform: "instagram",
    title: "Carousel: 5 tips hemat waktu",
    time: "11:00",
    status: "scheduled",
  },
  {
    id: "p2",
    dateKey: "2026-01-26",
    platform: "meta",
    title: "Ad copy refresh — variant B",
    time: "14:10",
    status: "scheduled",
  },
  {
    id: "p3",
    dateKey: "2026-01-24",
    platform: "twitter",
    title: "Thread: product update highlights",
    time: "09:00",
    status: "published",
  },
  {
    id: "p4",
    dateKey: "2026-01-21",
    platform: "tiktok",
    title: "Short script: hook + 3 beats",
    time: "18:00",
    status: "failed",
  },
];
