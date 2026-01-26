export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur">
      {/* hairline accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#068773]/50 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Left: Brand */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Logo */}
          <div className="relative flex-none">
            <div className="absolute -inset-2 rounded-2xl bg-[#068773]/15 blur-xl opacity-60" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white text-sm font-semibold shadow-sm">
              BYD
            </div>
          </div>

          {/* Brand text */}
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-900">
                Internal Content Enablement
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full border border-[#068773]/15 bg-[#068773]/10 px-2 py-0.5 text-[11px] font-semibold text-[#068773]">
                Internal
              </span>
            </div>
            <div className="truncate text-xs text-slate-500">
              Workspace • Trends • Benchmark • Generate
            </div>
          </div>
        </div>

        {/* Center: Context (desktop only) */}
        <div className="hidden lg:flex min-w-0 flex-1 items-center justify-center">
          <div className="inline-flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#068773]/70 ring-4 ring-[#068773]/10" />
            <span className="truncate">
              Status: Ready • Mode: PoC • Output: Brand-aligned drafts
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-none items-center gap-2">
          {/* Status pill (tablet+) */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#068773]/25" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#068773]" />
            </span>
            Ready
          </div>

          {/* Primary action */}
          <button className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#068773]/30">
            <span className="hidden sm:inline">Management Center</span>
            <span className="sm:hidden">Manage</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80 transition group-hover:translate-x-0.5" />
          </button>

          {/* User chip */}
          <button className="ml-1 inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 shadow-[0_1px_0_0_rgba(15,23,42,0.04)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300/60">
            <span className="hidden sm:inline">Admin</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
              AD
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
