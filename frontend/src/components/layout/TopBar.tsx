export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur">
      {/* top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#068773]/60 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          {/* logo */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-[#068773]/15 blur-xl opacity-60" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white text-sm font-semibold shadow-sm">
              BYD
            </div>
          </div>

          {/* title */}
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-slate-900">
                Content Marketing AI
              </div>
              <span className="hidden sm:inline-flex items-center rounded-full border border-[#068773]/15 bg-[#068773]/10 px-2 py-0.5 text-[11px] font-semibold text-[#068773]">
                PoC
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Workspace • Trend → Insight → Generate
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* status */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#068773]/30" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#068773]" />
            </span>
            Ready
          </div>

          {/* primary action */}
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Management Center
          </button>

          {/* user chip */}
          <div className="ml-1 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-800 shadow-sm">
            <span className="hidden sm:inline">maman</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-xs font-semibold text-white">
              mm
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
