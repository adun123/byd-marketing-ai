
import logo from "/logo_haka.webp";
function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export default function TopBar() {
  // function toggleTheme() {
  //   const root = document.documentElement;
  //   root.classList.toggle("dark");
  //   try {
  //     localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
  //   } catch {}
  // }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-3 px-4">
        {/* LEFT: Brand */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Logo block */}
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="HAKA Logo"
              className="h-10 w-auto object-contain"
            />

            <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                Marketing Intelligence
              </div>
              <div className="truncate text-[10px] sm:text-[11px] font-medium tracking-[0.14em] text-slate-500">
                INTERNAL WORK SPACE
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Primary (desktop only) */}
        <div className="hidden md:flex flex-1 justify-end">
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full",
              "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
              "px-6 py-2 text-sm font-semibold text-white shadow-sm",
              "ring-1 ring-[#068773]/25 transition hover:brightness-105 active:brightness-95"
            )}
          >
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
          {/* Mobile Manage */}
          <button
            type="button"
            className={cn(
              "md:hidden inline-flex items-center gap-2 rounded-full",
              "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
              "px-3 py-2 text-xs font-semibold text-white shadow-sm",
              "ring-1 ring-[#068773]/25 transition hover:brightness-105 active:brightness-95"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            <span className="hidden xs:inline">Manage</span>
          </button>

          {/* Theme */}
          {/* <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full",
              "border border-slate-200 dark:border-slate-800",
              "bg-white dark:bg-slate-900",
              "text-slate-700 dark:text-slate-200",
              "shadow-[0_1px_0_rgba(15,23,42,0.04)]",
              "transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
            )}
            aria-label="Toggle theme"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
            </svg>
          </button> */}

          {/* User */}
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full",
              "border border-slate-200 dark:border-slate-800",
              "bg-white dark:bg-slate-900",
              "text-slate-800 dark:text-slate-100",
              "shadow-[0_1px_0_rgba(15,23,42,0.04)]",
              "transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
            )}
            aria-label="User"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </button>

          <div className="ml-1 hidden sm:block text-sm font-semibold text-slate-800 dark:text-slate-100">
            Admin
          </div>
        </div>
      </div>
    </header>
  );
}
