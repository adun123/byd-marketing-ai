// src/pages/content-generation/SceneSelector.tsx

import type { SceneItem, SceneKey } from "./types";

function cls(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function SceneRow({
  active,
  title,
  desc,
  emoji,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls(
        "group flex w-full items-start gap-3 rounded-md px-3 py-2 text-left",
        "transition-colors",
        active
          ? "bg-slate-100 dark:bg-slate-900/70"
          : "hover:bg-slate-100 dark:hover:bg-slate-900/60"
      )}
    >
      <span
        className={cls(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1",
          active
            ? "bg-white ring-slate-300 dark:bg-slate-950 dark:ring-slate-700"
            : "bg-slate-50 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
        )}
        aria-hidden
      >
        <span className="text-base">{emoji}</span>
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cls(
            "block text-sm font-medium",
            active
              ? "text-slate-900 dark:text-slate-50"
              : "text-slate-800 dark:text-slate-100"
          )}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-600 dark:text-slate-300">
          {desc}
        </span>
      </span>

      <span
        className={cls(
          "mt-1 shrink-0 text-slate-400 transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        aria-hidden
      >
        →
      </span>
    </button>
  );
}

export default function SceneSelector({
  scene,
  setScene,
  scenes,
  variant = "list",
  title = "Select Scenes",
}: {
  scene: SceneKey;
  setScene: (s: SceneKey) => void;
  scenes: SceneItem[];
  variant?: "list" | "tabs";
  title?: string;
}) {
  // Tabs (chip) — tetap flat
  if (variant === "tabs") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {scenes.length}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scenes.map((s) => {
            const active = scene === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setScene(s.key)}
                className={cls(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                <span aria-hidden>{s.emoji}</span>
                <span className="font-medium">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // List (tanpa border/bg/rounded — ikut container utama)
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          
        </div>
      </div>

      {/* List */}
      <div className="max-h-[520px] overflow-auto pr-1">
        <div className="space-y-1">
          {scenes.map((s) => (
            <SceneRow
              key={s.key}
              active={scene === s.key}
              title={s.title}
              desc={s.desc}
              emoji={s.emoji}
              onClick={() => setScene(s.key)}
            />
          ))}
        </div>
      </div>

      {/* Optional hint */}
      <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
        Pilih scene untuk menyesuaikan format prompt dan output.
      </div>
    </section>
  );
}
