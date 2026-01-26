import type React from "react";

export type AgentCard = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  meta?: string;
};

export type IconProps = React.SVGProps<SVGSVGElement>;
