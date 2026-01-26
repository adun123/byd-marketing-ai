// src/pages/marketing-dashboard/MarketingSideNav.tsx
import * as React from "react";
import {
  LayoutDashboard,
  Sparkles,
  LibraryBig,
  Wand2,
  CalendarDays,

  Facebook,
  Music2,


  X,
} from "lucide-react";

function cn(...s: Array<string | undefined | false | null>) {
  return s.filter(Boolean).join(" ");
}

export type MarketingNavKey =
  | "dashboard"
  | "playground"
  | "library"
  | "services"
  | "scheduler"
  | "omnisernd"
  | "meta"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "shopify";

type NavItem = {
  key: MarketingNavKey;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: "main" | "integrations";
  badge?: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Overview",
    hint: "Ringkasan performa",
    icon: LayoutDashboard,
    section: "main",
  },
  {
    key: "playground",
    label: "Campaign Studio",
    hint: "Eksperimen ide campaign",
    icon: Sparkles,
    section: "main",
    badge: "New",
  },
  {
    key: "library",
    label: "Asset Library",
    hint: "Template & copy",
    icon: LibraryBig,
    section: "main",
  },
  {
    key: "services",
    label: "AI Toolkit",
    hint: "Generate & optimize",
    icon: Wand2,
    section: "main",
  },
  {
    key: "scheduler",
    label: "Scheduler",
    hint: "Kalender publikasi",
    icon: CalendarDays,
    section: "main",
  },

 
  {
    key: "meta",
    label: "Meta",
    hint: "Instagram & Facebook",
    icon: Facebook,
    section: "integrations",
  },
  {
    key: "tiktok",
    label: "TikTok",
    hint: "Short video",
    icon: Music2,
    section: "integrations",
  },
 
];

export default function MarketingSideNav({
  value,
  onSelect,
  collapsed = false,

  className,
   mobileOpen,          //  NEW
  setMobileOpen,
}: {
  value: MarketingNavKey;
  onSelect: (v: MarketingNavKey) => void;
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
   mobileOpen: boolean;                 //  NEW
  setMobileOpen: (v: boolean) => void;
}) {


  const main = NAV_ITEMS.filter((i) => i.section === "main");
  const integrations = NAV_ITEMS.filter((i) => i.section === "integrations");

  function handleSelect(k: MarketingNavKey) {
    onSelect(k);
    setMobileOpen(false);
  }

  return (
    <>
      {/* MOBILE: topbar trigger (clean + accent) */}
      <div className="md:hidden z-40 border-b border-slate-200 bg-white">
        <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />
        <div className="flex items-center justify-between px-3 py-2">
          

          {/* <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button> */}
        </div>
      </div>

      {/* MOBILE: overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* MOBILE: drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[320px] max-w-[88vw] transform transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full bg-white border-r border-slate-200 flex flex-col">
          {/* Drawer header */}
          <div className="shrink-0 border-b border-slate-200">
            <div className="h-1 w-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />
            <div className="flex items-center justify-between px-3 py-2">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900">Navigation</div>
                <div className="text-[11px] text-slate-500">Marketing dashboard</div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Drawer body scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3">
            <NavSurface
              value={value}
              onSelect={handleSelect}
              collapsed={false}
              main={main}
              integrations={integrations}
            />
          </div>
        </div>
      </div>

      {/* DESKTOP: sidebar */}
      <aside
        className={cn(
          "h-[calc(100vh-64px)] hidden md:block",
          collapsed ? "w-[86px]" : "w-[272px]",
          className
        )}
      >
        <div className="h-full border-r border-slate-200 bg-white flex flex-col">
          

          {/* Body scroll */}
          <div className={cn("flex-1 min-h-0 overflow-y-auto", collapsed ? "px-2 py-2" : "px-2 py-3")}>
            <NavSurface
              value={value}
              onSelect={onSelect}
              collapsed={collapsed}
              main={main}
              integrations={integrations}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ */

function NavSurface({
  value,
  onSelect,
  collapsed = false,
  main,
  integrations,
}: {
  value: MarketingNavKey;
  onSelect: (v: MarketingNavKey) => void;
  collapsed?: boolean;
  main: NavItem[];
  integrations: NavItem[];
}) {
  return (
    <div className="space-y-3">
      {/* Main */}
      <div className="space-y-1">
        {main.map((item) => (
          <NavButton
            key={item.key}
            item={item}
            active={value === item.key}
            collapsed={!!collapsed}
            onClick={() => !item.disabled && onSelect(item.key)}
          />
        ))}
      </div>

      <div className={cn("border-t border-slate-200/80", collapsed ? "mx-1" : "mx-2")} />

      {/* Integrations */}
      {!collapsed && (
        <div className="px-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Integrations
          </div>
          <div className="mt-0.5 text-[11px] text-slate-400">
            Hubungkan channel pemasaran
          </div>
        </div>
      )}

      <div className="space-y-1">
        {integrations.map((item) => (
          <NavButton
            key={item.key}
            item={item}
            active={value === item.key}
            collapsed={!!collapsed}
            onClick={() => !item.disabled && onSelect(item.key)}
          />
        ))}
      </div>

      {/* Tip box */}
      {!collapsed && (
        <div className="mx-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-[11px] font-semibold text-slate-900">Quick tip</div>
          <div className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Mulai dari <span className="font-semibold text-slate-800">Overview</span>, lalu build ide di{" "}
            <span className="font-semibold text-slate-800">Campaign Studio</span>.
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        "group w-full text-left transition",
        "rounded-2xl px-2.5 py-2",
        active
          ? "bg-emerald-50 text-slate-900 ring-1 ring-emerald-100"
          : "bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        item.disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
        <div
          className={cn(
            "grid h-8 w-8 place-items-center rounded-xl ring-1 transition",
            active ? "bg-white ring-emerald-100" : "bg-white ring-slate-200 group-hover:ring-slate-300"
          )}
        >
          <Icon className={cn("h-4 w-4", active ? "text-[#068773]" : "text-slate-600")} />
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-[12px] font-semibold">{item.label}</div>

              {item.badge && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  {item.badge}
                </span>
              )}
            </div>

            {item.hint && <div className="text-[11px] truncate text-slate-500">{item.hint}</div>}
          </div>
        )}
      </div>
    </button>
  );
}
