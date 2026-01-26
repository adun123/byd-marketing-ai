
import cn from "../utils/cn";

export default function PanelSkeleton({
  titleW,
  rows,
}: {
  titleW: string;
  rows: number;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_1px_0_0_rgba(15,23,42,0.04)] backdrop-blur">
      <div className={cn("h-4 rounded bg-slate-100", titleW)} />
      <div className="mt-4 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
