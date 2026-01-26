// src/pages/marketing-dashboard/overview/OverviewLowerGrid.tsx
import ActivityCalendarCard from "./ActivityCalendarCard";
import RecentActivityCard from "././RecentActivityCard";
import PlatformStatusCard from "./PlatformStatusCard";
import AiUsageOverviewCard from "./AiUsageOverviewCard";

export default function OverviewLowerGrid() {
  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ActivityCalendarCard />
        <RecentActivityCard />
        <PlatformStatusCard />
      </div>

      {/* Bottom row */}
      <AiUsageOverviewCard />
    </div>
  );
}
