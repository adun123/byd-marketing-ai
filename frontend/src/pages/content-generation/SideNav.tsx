// src/pages/content-generation/SideNav.tsx
import * as React from "react";
import { Image as ImageIcon, Video as VideoIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export type ContentGenTab = "image" | "video";

type SideNavProps = {
  value: ContentGenTab;
  onSelect: (tab: ContentGenTab) => void;
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
};

const items: Array<{
  key: ContentGenTab;
  label: string;
  icon: React.ElementType;
  desc: string;
}> = [
  { key: "image", label: "Image", icon: ImageIcon, desc: "Generate gambar" },
  { key: "video", label: "Video", icon: VideoIcon, desc: "Generate video" },
];

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function SideNav({
  value,
  onSelect,
  collapsed = false,
  onToggle,
  className,
}: SideNavProps) {


  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
      
        className={cn(
          "hidden md:flex md:shrink-0",
          collapsed ? "md:w-[72px]" : "md:w-64",
          "border-r border-emerald-100/70",
          "bg-gradient-to-b from-emerald-50/60 via-white to-white",
          "px-2 py-3",
          "overflow-y-auto",
          className
        )}
        aria-label="Content generation navigation"
      >
        <div className="flex w-full flex-col">
          {/* Header row */}
          <div className={cn("mb-2 flex items-center justify-between", collapsed ? "px-1" : "px-2")}>
            {!collapsed ? (
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-slate-600">
                  CONTENT GENERATION
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Pilih mode output
                </div>
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white text-[11px] font-bold">
                CG
              </div>
            )}

            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "z-30 inline-flex h-9 w-9 items-center justify-center", 
                "inline-flex items-center justify-center rounded-xl border border-emerald-200/60 bg-white/80 shadow-sm backdrop-blur",
                "h-9 w-9 hover:bg-white",
                "focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-emerald-700" />
              ) : (
                <PanelLeftClose className="h-4 w-4 text-emerald-700" />
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className={cn("mt-1 space-y-1", collapsed ? "px-1" : "px-1")}>
            {items.map((it) => {
              const active = value === it.key;
              const Icon = it.icon;

              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => onSelect(it.key)}
                  className={cn(
                    "group w-full rounded-xl transition",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-400/40",
                    collapsed ? "p-2" : "px-2.5 py-2",
                    active
                      ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white shadow-sm"
                      : "text-slate-800 hover:bg-slate-100"
                  )}
                  title={collapsed ? it.label : undefined}
                >
                  <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl",
                        active ? "bg-white/15" : "bg-slate-100 group-hover:bg-white"
                      )}
                      aria-hidden="true"
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-700")} />
                    </span>

                    {!collapsed ? (
                      <div className="min-w-0 text-left">
                        <div className={cn("text-sm font-semibold leading-5", active ? "text-white" : "text-slate-900")}>
                          {it.label}
                        </div>
                        <div className={cn("text-[11px] leading-4", active ? "text-white/75" : "text-slate-500")}>
                          {it.desc}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer hint (only expanded) */}
          {!collapsed ? (
            <div className="mt-3 rounded-xl border border-emerald-100/70 bg-white/70 px-3 py-2 text-[11px] text-slate-600">
              Tip: kamu bisa klik tombol <span className="font-semibold">Hide</span> untuk fokus ke hasil.
            </div>
          ) : null}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV (tetap) */}
      <nav
        className={cn(
          "md:hidden",
          "fixed bottom-0 left-0 right-0 z-30",
          "border-t border-emerald-100/70 bg-white/85 backdrop-blur",
          "pb-[env(safe-area-inset-bottom)]"
        )}
        aria-label="Mobile content generation navigation"
      >
        <div className="mx-auto flex max-w-6xl items-stretch justify-around px-3 py-2">
          {items.map((it) => {
            const active = value === it.key;
            const Icon = it.icon;

            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onSelect(it.key)}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
                  active ? "bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white" : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-700")} />
                <span className="text-[11px] font-semibold leading-none">{it.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
