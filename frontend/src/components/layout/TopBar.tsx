export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* LEFT: Brand */}
        <div className="flex min-w-0 items-center gap-4">
          {/* Logo block */}
          <div className="flex items-center gap-3">
            <div className="leading-none">
              <div className="text-lg font-extrabold tracking-tight text-slate-900">
                HAKA
              </div>
              <div className="text-xs font-semibold tracking-[0.25em] text-emerald-600">
                AUTO
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-slate-900">
                Marketing Intelligence
              </div>
              <div className="truncate text-[11px] font-medium tracking-[0.14em] text-slate-500">
                INTERNAL WORK SPACE
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Primary */}
        <div className="hidden md:flex flex-1 justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-6 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-600/20 transition hover:brightness-105 active:brightness-95"
          >
            {/* grid icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="opacity-95"
            >
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            <span>Management Center</span>
          </button>
        </div>


        {/* RIGHT: Actions */}
        <div className="flex flex-none items-center gap-2">
          {/* Mobile center button fallback */}
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-600/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            <span>Manage</span>
          </button>

          {/* Theme / Moon */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:bg-slate-50"
            aria-label="Toggle theme"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
            </svg>
          </button>

          {/* User icon */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:bg-slate-50"
            aria-label="User"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </button>

          {/* Admin text */}
          <div className="ml-1 hidden sm:block text-sm font-semibold text-slate-800">
            Admin
          </div>
        </div>
      </div>
    </header>
  );
}
