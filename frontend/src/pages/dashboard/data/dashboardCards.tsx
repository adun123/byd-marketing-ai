
import type { AgentCard } from "../types/dashboard";
import { IconChart, IconChartBar, IconSearch, IconSparkles } from "../../../components/icons/dashboardIcons";

export const dashboardCards: AgentCard[] = [
  {
    title: "Trend & Social Insight",
    badge: "Insight",
    desc: "Pantau tren yang sedang berkembang dan dapatkan insight siap pakai: hook, angle, CTA, audiens, dan ide konten.",
    icon: <IconChart />,
    href: "/trends",
    ctaLabel: ""
  },
   {
    title: "Marketing Draft Generator",
    badge: "Draft",
    desc: "Buat draft konten marketing siap pakai. Mulai dari hook, caption, hingga CTA berdasarkan tujuan kampanye dan channel yang dipilih.",
    icon: <IconSearch />,
    href: "/draft-generator",
    ctaLabel: ""
  },
  {
    title: "Content Generation",
    badge: "Content",
    desc: "Ubah insight menjadi konten siap tayang, seperti caption, script pendek, hingga prompt AI visual yang disesuaikan dengan tiap channel.",
    icon: <IconSparkles className="h-5 w-5 text-emerald-600" />,
    href: "content-generator",
    ctaLabel: ""
  },
 
  {
    title: "Marketing Dashboard",
    badge: "Performance",
   
    desc: "Pantau performa konten, insight channel, dan rekomendasi aksi dalam satu dashboard marketing yang ringkas.",
    icon: <IconChartBar className="h-5 w-5 text-emerald-600" />,
    href: "/Marketing-Dashboard",
    ctaLabel: ""
  },
];
