
import type { IconProps } from "../../pages/dashboard/types/dashboard";

export const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-sky-700">
    <path d="M4 19V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M7 15l3-3 3 2 5-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 8h2v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSearch = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-indigo-700">
    <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconSparkles = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconChartBar = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M4 20V10" strokeWidth="1.5" />
    <path d="M10 20V4" strokeWidth="1.5" />
    <path d="M16 20v-7" strokeWidth="1.5" />
    <path d="M22 20H2" strokeWidth="1.5" />
  </svg>
);
