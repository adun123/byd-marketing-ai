
import type { AgentCard } from "../types/dashboard";
import { IconChart, IconChartBar, IconSearch, IconSparkles } from "../../../components/icons/dashboardIcons";

export const dashboardCards: AgentCard[] = [
  {
    title: "Trend & Social Insight",
    badge: "Trends",
    meta: "TikTok • Instagram • Pattern",
    desc: "Pantau konten yang lagi rame dan ambil insight: hook, angle, CTA, audiens, serta ide turunan yang siap dieksekusi.",
    icon: <IconChart />,
    href: "/trends",
    ctaLabel: ""
  },
   {
    title: "Marketing Draft Generator",
    badge: "Generate",
    meta: "Hook • Caption • CTA",
    desc: "Buat draft konten marketing siap pakai mulai dari hook, caption, sampai CTA berdasarkan tujuan dan channel.",
    icon: <IconSearch />,
    href: "/draft-generator",
    ctaLabel: ""
  },
  {
    title: "Content Generation",
    badge: "Generate",
    meta: "Caption • Script • Prompt",
    desc: "Ubah insight jadi output siap pakai: caption, script pendek, hingga prompt AI untuk visual sesuai kebutuhan channel.",
    icon: <IconSparkles className="h-5 w-5 text-emerald-600" />,
    href: "content-generator",
    ctaLabel: ""
  },
 
  {
    title: "Marketing Dashboard",
    badge: "Insight",
    meta: "Performance • Trend • Action",
    desc: "Pantau performa konten, insight channel, dan rekomendasi aksi dalam satu dashboard marketing yang ringkas.",
    icon: <IconChartBar className="h-5 w-5 text-emerald-600" />,
    href: "/Marketing-Dashboard",
    ctaLabel: ""
  },
];
