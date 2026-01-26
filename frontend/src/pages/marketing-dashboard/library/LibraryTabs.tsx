// src/pages/marketing-dashboard/library/LibraryTabs.tsx
function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export type LibraryTabKey = "all" | "caption" | "video" | "email" | "image";

const TABS: Array<{ key: LibraryTabKey; label: string }> = [
  { key: "all", label: "Everything" },
  { key: "image", label: "AI Outputs" },
  { key: "caption", label: "Captions" },
  { key: "video", label: "Video" },
  { key: "email", label: "Email" },
];

export default function LibraryTabs({
  value,
  onChange,
}: {
  value: LibraryTabKey;
  onChange: (v: LibraryTabKey) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {TABS.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[12px] font-medium transition",
                "border",
                active
                  ? "border-emerald-200 bg-emerald-50 text-[#068773]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
