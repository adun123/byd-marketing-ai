



export default function EditorCardSkeleton({
  title = "Generating…",
}: {
  title?: string;
}) {
  return (
    <div className="">
      {/* Title row */}
      <div className="flex items-center gap-2 py-3 pt-5 text-sm font-semibold text-slate-900">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
          ▤
        </span>
        {title}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_-26px_rgba(15,23,42,0.20)]">
        {/* shimmer overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/60 to-transparent animate-[shimmer_1.15s_infinite]" />
        </div>

        {/* Toolbar row skeleton */}
        <div className="relative mt-4 flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-8 rounded-full bg-slate-100" />
            <div className="h-7 w-8 rounded-full bg-slate-100" />
            <div className="h-7 w-8 rounded-full bg-slate-100" />

            <div className="mx-2 h-4 w-px bg-slate-200" />

            <div className="h-7 w-14 rounded-full bg-slate-100" />
            <div className="h-7 w-16 rounded-full bg-slate-100" />

            <div className="mx-2 h-4 w-px bg-slate-200" />

            <div className="h-7 w-10 rounded-full bg-slate-100" />
            <div className="h-7 w-10 rounded-full bg-slate-100" />
          </div>

          <div className="h-8 w-32 rounded-full bg-slate-100" />
        </div>

        {/* Editor skeleton */}
        <div className="relative px-5 py-4">
          <div className="min-h-[260px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="space-y-3">
              <div className="h-3.5 w-[92%] rounded-full bg-slate-100" />
              <div className="h-3.5 w-[84%] rounded-full bg-slate-100" />
              <div className="h-3.5 w-[76%] rounded-full bg-slate-100" />
              <div className="h-3.5 w-[88%] rounded-full bg-slate-100" />
              <div className="h-3.5 w-[64%] rounded-full bg-slate-100" />
              <div className="h-3.5 w-[80%] rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="mt-2 h-3 w-52 rounded-full bg-slate-100" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-60%); opacity: .35; }
          60% { opacity: .55; }
          100% { transform: translateX(160%); opacity: .35; }
        }
      `}</style>
    </div>
  );
}
