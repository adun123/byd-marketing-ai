type StatFeatureProps = {
  icon: "trend" | "workflow" | "standards";
  title: string;
  subtitle: string;
};
function TrendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h8" />
      <path d="M8 12h8" />
      <path d="M8 18h8" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l8 4v5c0 5-3.5 9-8 9s-8-4-8-9V7l8-4z" />
    </svg>
  );
}
export default function StatFeature({
  icon,
  title,
  subtitle,
}: StatFeatureProps) {
  return (
    <div className="flex flex-col items-start text-left">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
        {icon === "trend" && <TrendIcon />}
        {icon === "workflow" && <WorkflowIcon />}
        {icon === "standards" && <ShieldIcon />}
      </div>

      {/* Text */}
      <div className="text-lg font-bold tracking-tight text-slate-900">
        {title}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {subtitle}
      </div>
    </div>
  );
}

