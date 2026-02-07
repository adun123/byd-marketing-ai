
import { Link, useLocation, useNavigate } from "react-router-dom";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

type TopBarProps = {
  active?: "trend" | "draft" | "content";
};

type TabKey = NonNullable<TopBarProps["active"]>;

export default function TopBarGenerate({ active = "trend" }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: "trend" as const, label: "Trend Insight", href: "/trends" },
    { key: "draft" as const, label: "Draft Generator", href: "/draft-generator" },
    { key: "content" as const, label: "Content Generator", href: "/content-generator" },
  ];

  // fallback auto-detect active from URL (kalau kamu lupa pass prop)
  const detectedActive: TabKey =
    (location.pathname.startsWith("/draft") && "draft") ||
    (location.pathname.startsWith("/content") && "content") ||
    "trend";

  const current = active ?? detectedActive;

  // function toggleTheme() {
  //   const root = document.documentElement;
  //   root.classList.toggle("dark");
  //   // optional: persist
  //   try {
  //     localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
  //   } catch {}
  // }

  return (
    <header className=" top-0 z-30 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/85 dark:bg-slate-950/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        {/* TOP ROW */}
        <div className="flex h-14 items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full",
                "text-slate-700 dark:text-slate-200",
                "transition hover:bg-slate-100 dark:hover:bg-slate-800/60"
              )}
              aria-label="Back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                HAKA AUTO
              </div>
              <div className="truncate text-[10px] font-semibold tracking-[0.18em] text-[#068773]">
                MARKETING INTELLIGENCE
              </div>
            </div>
          </div>

          {/* CENTER (desktop tabs) */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-7">
              {tabs.map((t) => {
                const isActive = t.key === current;
                return (
                  <Link
                    key={t.key}
                    to={t.href}
                    className={cn(
                      "relative py-2 text-sm font-semibold transition",
                      isActive
                        ? "text-[#068773]"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "pointer-events-none absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-full rounded-full transition",
                        isActive ? "bg-[#068773]" : "bg-transparent"
                      )}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* RIGHT */}
          <div className="flex flex-none items-center gap-2">
            <a
              className={cn(
                "hidden sm:inline-flex items-center gap-2 rounded-full",
                "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
                "px-4 py-2 text-xs font-semibold text-white shadow-sm",
                "ring-1 ring-[#068773]/25 transition hover:brightness-105"
              )}
              href="/"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
              Management
            </a>

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

            <span className="hidden sm:inline text-sm font-semibold text-slate-800 dark:text-slate-100">
              Admin
            </span>
          </div>
        </div>

        {/* MOBILE TABS ROW */}
        <div className="md:hidden pb-3">
          <div
            className={cn(
              "flex items-center gap-2 overflow-x-auto no-scrollbar",
              "rounded-2xl border border-slate-200/70 dark:border-slate-800/70",
              "bg-slate-50/70 dark:bg-slate-900/40 p-1"
            )}
          >
            {tabs.map((t) => {
              const isActive = t.key === current;
              return (
                <Link
                  key={t.key}
                  to={t.href}
                  className={cn(
                    "shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition",
                    isActive
                      ? "bg-white dark:bg-slate-950 text-[#068773] shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-950/60"
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
