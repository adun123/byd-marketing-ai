
export default function StatPill({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-900">{value}</div>
      <div className="mt-0.5 text-[12px] text-slate-500">{hint}</div>
    </div>
  );
}
