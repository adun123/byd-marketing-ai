// src/pages/marketing-dashboard/services/tools.ts
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Mail,
  Wand2,
  Globe,
} from "lucide-react";

export type ToolKey =
  | "content-generator"
  | "campaign-studio"
  | "trend-snapshot"
  | "text-to-image"
  | "video-script"
  | "email-writer"
  | "website-helper"
  | "optimizer";

export type ToolItem = {
  key: ToolKey;
  title: string;
  desc: string;
  meta: string; // kecil 1 baris
  icon: LucideIcon;
  accent?: "emerald" | "slate";
  cta: string;
  secondary?: string;
  disabled?: boolean;
};

export const TOOL_ITEMS: ToolItem[] = [
  {
    key: "content-generator",
    title: "Content Generator",
    desc: "Buat caption, CTA, dan variasi copy untuk social & ads.",
    meta: "Output: caption • CTA • hashtag",
    icon: FileText,
    accent: "emerald",
    cta: "Open generator",
  },
  {
    key: "campaign-studio",
    title: "Campaign Studio",
    desc: "Eksperimen hook & angle, lalu kurasi ide terbaik.",
    meta: "Brief → generate → pin → export",
    icon: Sparkles,
    accent: "emerald",
    cta: "Open studio",
  },
  {
    key: "trend-snapshot",
    title: "Trend Snapshot",
    desc: "Cari topik naik dan pattern konten yang lagi works.",
    meta: "Topik • hook pattern • hashtag cluster",
    icon: TrendingUp,
    cta: "View trends",
  },
  {
    key: "text-to-image",
    title: "Image Generator",
    desc: "Generate konsep visual & prompt untuk desain konten.",
    meta: "Prompt → variations → export",
    icon: ImageIcon,
    cta: "Open image tool",
  },
  {
    key: "video-script",
    title: "Video Script",
    desc: "Buat script short form: hook, beats, CTA.",
    meta: "TikTok / Reels / Shorts",
    icon: Video,
    cta: "Create script",
  },
  {
    key: "email-writer",
    title: "Email Writer",
    desc: "Draft subject, body, dan follow-up sequence.",
    meta: "Subject lines • body • sequence",
    icon: Mail,
    cta: "Draft email",
    disabled: true,
  },
  {
    key: "website-helper",
    title: "Website Helper",
    desc: "Bantu copy landing page dan struktur section.",
    meta: "Hero • benefits • FAQ",
    icon: Globe,
    cta: "Open helper",
    disabled: true,
  },
  {
    key: "optimizer",
    title: "Copy Optimizer",
    desc: "Rapikan copy biar lebih jelas, ringkas, dan sesuai tone.",
    meta: "Rewrite • shorten • tone match",
    icon: Wand2,
    cta: "Optimize copy",
    disabled: true,
  },
];
