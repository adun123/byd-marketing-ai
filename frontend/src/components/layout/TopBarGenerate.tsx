
import { Link } from "react-router-dom";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}
type TopBarProps = {
  active?: "trend" | "draft" | "content";
};

export default function TopBarGenerate({ active = "trend" }: TopBarProps) {
  const tabs = [
    { key: "trend" as const, label: "Trend Insight", href: "/trends" },
    { key: "draft" as const, label: "Draft Generator", href: "/draft-generator" },
    { key: "content" as const, label: "Content Generator", href: "/content-generator" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* LEFT: Back + Brand */}
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full",
              "text-slate-700 transition hover:bg-slate-100"
            )}
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-extrabold tracking-tight text-slate-900">
              HAKA AUTO
            </div>
            <div className="truncate text-[11px] font-semibold tracking-[0.18em] text-emerald-700">
              MARKETING INTELLIGENCE
            </div>
          </div>
        </div>

        {/* CENTER: Tabs */}
        <nav className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-8">
            {tabs.map((t) => {
              const isActive = t.key === active;
              return (
                <Link
                  key={t.key}
                  to={t.href}
                  className={cn(
                    "relative py-2 text-sm font-medium transition",
                    isActive ? "text-emerald-700" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t.label}
                  <span className={cn(
                    "pointer-events-none absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-full rounded-full transition",
                    isActive ? "bg-emerald-600" : "bg-transparent"
                  )}/>
                </Link>

              );
            })}
          </div>
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-600/20 transition hover:brightness-105"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Management Center
          </button>

          {/* Moon */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:bg-slate-50"
            aria-label="Toggle theme"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
            </svg>
          </button>

          {/* User */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:bg-slate-50"
            aria-label="User"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </button>

          <span className="hidden sm:inline text-sm font-semibold text-slate-800">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
