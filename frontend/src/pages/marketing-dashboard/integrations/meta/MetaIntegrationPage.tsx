// src/pages/marketing-dashboard/integrations/meta/MetaIntegrationPage.tsx
import * as React from "react";
import MetaHeader from "./MetaHeader";
import MetaTabs from "./MetaTabs";
import type { MetaTabKey } from "./types";
import { META_CONN } from "./mock";
import MetaPostScheduler from "./sections/MetaPostScheduler";
import MetaSettings from "./sections/MetaSetting";
import MetaPerformance from "./sections/MetaPerformance";
import MetaAiInsights from "./sections/MetaAiInsights";

export default function MetaIntegrationPage() {
  const [tab, setTab] = React.useState<MetaTabKey>("scheduler");

  return (
    <div className="space-y-4">
      <MetaHeader
        title="Meta Marketing"
        subtitle="Kelola campaign Facebook & Instagram"
        connected={META_CONN.connected}
        onReconnect={() => {}}
      />

      <MetaTabs value={tab} onChange={setTab} />

      {tab === "scheduler" && <MetaPostScheduler />}
      {tab === "performance" && <MetaPerformance />}
      {tab === "insights" && <MetaAiInsights />}
      {tab === "settings" && <MetaSettings />}
    </div>
  );
}
