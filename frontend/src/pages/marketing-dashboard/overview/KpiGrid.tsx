// src/pages/marketing-dashboard/overview/KpiGrid.tsx
import { Zap, BarChart3, DollarSign, Users } from "lucide-react";
import KpiCard from "./KpiCard";

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
       title="AI Credits"
       note="Total pemakaian AI pada periode berjalan"
       value="24"
     
        icon={Zap}
      />

      <KpiCard
        title="Active Campaigns"
        value="24"
        note="Jumlah campaign yang sedang berjalan saat ini"
        icon={BarChart3}
      />

      <KpiCard
        title="Generated Leads"
        value="Rp.12,483"
        note="Lead yang dihasilkan dari seluruh channel marketing"
        icon={DollarSign}
      />

      <KpiCard
      title="Audience Exposure"
        value="145.2K"
        note="Pertumbuhan 12.5% bulan ini"
        icon={Users}
      />
    </div>
  );
}
