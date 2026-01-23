// src/pages/content-generation/SideNav.tsx
import * as React from "react";
import { Image as ImageIcon, Video as VideoIcon } from "lucide-react";

export type ContentGenTab = "image" | "video";

type SideNavProps = {
  value: ContentGenTab;
  onSelect: (tab: ContentGenTab) => void;
  className?: string;
};

const items: Array<{
  key: ContentGenTab;
  label: string;
  icon: React.ElementType;
  desc: string;
}> = [
  {
    key: "image",
    label: "Image",
    icon: ImageIcon,
    desc: "Generate gambar",
  },
  {
    key: "video",
    label: "Video",
    icon: VideoIcon,
    desc: "Generate video",
  },
];

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function SideNav({ value, onSelect, className }: SideNavProps) {
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={cn(
          "hidden md:block md:w-64 md:shrink-0",
           "sticky top-14 h-[calc(100vh-56px)]",
          "border-r border-slate-200 bg-white/70 backdrop-blur",
          "px-3 py-4 overflow-y-auto",
          className
        )}
        aria-label="Content generation navigation"
      >
        <div className="mb-3 px-2">
          <div className="text-xs font-semibold tracking-wide text-slate-500">
            CONTENT GENERATION
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((it) => {
            const active = value === it.key;
            const Icon = it.icon;

            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onSelect(it.key)}
                className={cn(
                  "group w-full rounded-xl px-2.5 py-2 text-left transition-colors",
                  active
                    ? "bg-slate-900 text-white"
                    : "hover:bg-slate-100 text-slate-800"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      active ? "bg-white/15" : "bg-slate-100 group-hover:bg-white"
                    )}
                    aria-hidden="true"
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-white" : "text-slate-700"
                      )}
                    />
                  </span>

                  <div className="min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium leading-5",
                        active ? "text-white" : "text-slate-900"
                      )}
                    >
                      {it.label}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] leading-4",
                        active ? "text-white/70" : "text-slate-500"
                      )}
                    >
                      {it.desc}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav
        className={cn(
          "md:hidden",
          "fixed bottom-0 left-0 right-0 z-30",
          "border-t border-slate-200 bg-white/85 backdrop-blur",
          // safe area biar aman di iPhone notch
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
                  "flex w-full flex-col items-center justify-center gap-1 rounded-xl px-3 py-2",
                  "transition-colors",
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-700")} />
                <span className={cn("text-[11px] font-semibold leading-none")}>
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
