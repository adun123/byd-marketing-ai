function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function DraftHookCardSkeleton({
  showBadge = true,
}: {
  showBadge?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4",
        "border-slate-200/80 dark:border-slate-800/80",
        "bg-white dark:bg-slate-950",
        "shadow-sm"
      )}
    >
      {/* shimmer overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute inset-0 animate-[shimmer_1.15s_infinite]",
            "bg-gradient-to-r from-transparent via-slate-100/70 to-transparent",
            "dark:via-slate-800/50"
          )}
        />
      </div>

      {/* content blocks */}
      <div className="relative space-y-2">
        <div className="h-3 w-[92%] rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-[84%] rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-[68%] rounded-full bg-slate-100 dark:bg-slate-800" />

        {showBadge ? (
          <div className="pt-4 flex items-center justify-between">
            <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-6 w-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : null}
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
