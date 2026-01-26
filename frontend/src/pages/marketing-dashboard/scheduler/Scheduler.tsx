// src/pages/marketing-dashboard/scheduler/SchedulerPage.tsx
import * as React from "react";
import PlatformFilterCard from "./PlatformFilterCard";
import ScheduleCalendarCard from "./scheduleCalenderCard";
import QuickStatsCard from "./QuickStatsCard";
import BestTimesCard from "./BestTimesCard";
import PostsForDateCard from "./PostsForDateCard";
import type { PlatformKey, ScheduledPost } from "./types";
import { BEST_TIMES, POSTS } from "./mock";
import { ymd } from "./date";
import { Plus } from "lucide-react";

export default function SchedulerPage() {
  const [platform, setPlatform] = React.useState<PlatformKey>("all");

  // fixed demo: Jan 2026 (bisa ganti new Date())
  const [viewMonth, setViewMonth] = React.useState<Date>(() => new Date(2026, 0, 1));
  const [selected, setSelected] = React.useState<Date>(() => new Date(2026, 0, 26));

  const selectedKey = ymd(selected);

  const filteredPosts = React.useMemo(() => {
    if (platform === "all") return POSTS;
    return POSTS.filter((p) => p.platform === platform);
  }, [platform]);

  const postsForSelected = React.useMemo(() => {
    return filteredPosts
      .filter((p) => p.dateKey === selectedKey)
      .sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [filteredPosts, selectedKey]);

  const dots = React.useMemo(() => {
    const map: Record<string, "emerald" | "slate"> = {};
    const byDate: Record<string, ScheduledPost[]> = {};
    for (const p of filteredPosts) (byDate[p.dateKey] ||= []).push(p);

    for (const k of Object.keys(byDate)) {
      const sts = new Set(byDate[k].map((x) => x.status));
      map[k] = sts.size > 1 ? "slate" : "emerald";
    }
    return map;
  }, [filteredPosts]);

  const stats = React.useMemo(() => {
    const scheduled = filteredPosts.filter((p) => p.status === "scheduled").length;
    const published = filteredPosts.filter((p) => p.status === "published").length;

    // mock
    const avgEngagement = "7.9%";
    const totalReach = "42.8K";

    return [
      { label: "Queued", value: String(scheduled) },
      { label: "Published", value: String(published) },
      { label: "Engagement (avg)", value: avgEngagement },
      { label: "Reach (total)", value: totalReach },
    ];
  }, [filteredPosts]);

  return (
    <div className="space-y-4">
      {/* Header (consistent w/ brand) */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="h-[3px] w-full rounded-t-xl bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900">Scheduler</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Atur jadwal posting, pantau draft, dan lihat slot terbaik.
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#068773] px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-95 active:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New schedule
          </button>
        </div>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <PlatformFilterCard value={platform} onChange={setPlatform} />
        </div>

        <div className="lg:col-span-6">
          <ScheduleCalendarCard
            viewMonth={viewMonth}
            setViewMonth={setViewMonth}
            selected={selected}
            setSelected={setSelected}
            dots={dots}
          />
        </div>

        <div className="lg:col-span-3">
          <QuickStatsCard stats={stats} onViewAnalytics={() => {}} />
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <BestTimesCard rows={BEST_TIMES} onViewAnalytics={() => {}} />
        </div>

        <div className="lg:col-span-9">
          <PostsForDateCard
            title={`Schedule • ${selectedKey}`}
            items={postsForSelected}
            onSchedule={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
