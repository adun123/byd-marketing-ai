import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketingTopHeader from "./MarketingTopHeader";
import MarketingSideNav from "./MarketingSideNav";
import type { MarketingNavKey } from "./MarketingSideNav";

import MarketingOverview from "./overview/MarketingOverView";
import AssetLibraryPage from "./library/AssetLibraryPage";
import CampaignStudioPage from "./playground/CampaignStudioPage";
import AiToolkitPage from "./services/AiToolKitPage";
import SchedulerPage from "./scheduler/Scheduler";
import MetaIntegrationPage from "./integrations/meta/MetaIntegrationPage";

export default function MarketingDashboard() {
  const navigate = useNavigate();
    //  NEW: state drawer mobile di parent
  const [mobileOpen, setMobileOpen] = useState(false);

  const [active, setActive] = useState<MarketingNavKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

 return (
    <div className="min-h-screen bg-slate-50">
      <MarketingTopHeader
        title="AI Marketing Platform"
        subtitle="Workspace • marketing console"
        credits={2500}
        notifications={3}
        userInitials="JD"
        onOpenMenu={() => setMobileOpen(true)} //  NEW
        
      />

      <div className="min-h-[calc(100vh-64px)] md:flex">
        <MarketingSideNav
          value={active}
          onSelect={(k) => {
            setActive(k);
            setMobileOpen(false); // biar auto close setelah pilih menu
          }}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          mobileOpen={mobileOpen}           //  tambah
          setMobileOpen={setMobileOpen}     //  tambah
        />


        <main className="min-w-0 flex-1 px-4 py-6 md:px-6">
          {active === "dashboard" && <MarketingOverview />}
          {active === "library" && <AssetLibraryPage />}
          {active === "playground" && <CampaignStudioPage />}

          {active === "services" && (
            <AiToolkitPage
              onOpenTool={(k) => {
                if (k === "campaign-studio") setActive("playground");
                if (k === "trend-snapshot") navigate("/trends");
                if (k === "content-generator") navigate("/generator");
                // TODO:
                // if (k === "text-to-image") navigate("/image");
                // if (k === "video-script") navigate("/video");
              }}
            />
          )}

          {active === "scheduler" && <SchedulerPage />}
          {active === "meta" && <MetaIntegrationPage />}
        </main>
      </div>
    </div>
  );
}



