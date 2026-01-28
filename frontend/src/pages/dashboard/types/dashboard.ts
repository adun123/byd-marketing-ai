import type React from "react";

export type AgentCard = {
  ctaLabel: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  meta?: string;
};

export type IconProps = React.SVGProps<SVGSVGElement>;
