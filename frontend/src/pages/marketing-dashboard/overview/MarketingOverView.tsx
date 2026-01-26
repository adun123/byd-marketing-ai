// src/pages/marketing-dashboard/overview/MarketingOverview.tsx
import OverviewHeader from "./OverViewHeader";
import KpiGrid from "./KpiGrid";
import OverviewLowerGrid from "./OverViewLowerGrid";

export default function MarketingOverview() {
  return (
    <div className="space-y-6">
      <OverviewHeader />
      <KpiGrid />
      <OverviewLowerGrid />
    </div>
  );
}
