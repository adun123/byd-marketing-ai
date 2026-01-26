
export default function SectionHeader({
  title,
  desc,
}: {
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-[12px] font-semibold tracking-[-0.01em] text-slate-900">{title}</div>
        {desc ? <div className="mt-1 text-[12px] text-slate-500">{desc}</div> : null}
      </div>
      <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-slate-200/60 via-slate-200/20 to-transparent" />
    </div>
  );
}
