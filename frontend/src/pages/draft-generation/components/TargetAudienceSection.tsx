import { Users, Plus, X } from "lucide-react";
import { cn } from "../../../lib/cn";

export type TargetAudienceSectionProps = {
  presetAudiences: string[];
  audiences: string[];
  toggleAudience: (audience: string) => void;

  audienceCustom: string;
  setAudienceCustom: (v: string) => void;
  addCustomAudience: () => void;

  title?: string;
};

export default function TargetAudienceSection({
  presetAudiences,
  audiences,
  toggleAudience,
  audienceCustom,
  setAudienceCustom,
  addCustomAudience,
  title = "Target Audience",
}: TargetAudienceSectionProps) {
  const hasText = !!audienceCustom.trim();

  // const selectedCustom = audiences.filter((a) => !presetAudiences.includes(a));

  function submitCustom() {
    if (!hasText) return;
    addCustomAudience();
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
          <Users className="h-3 w-3" />
        </span>
        {title}
      </div>

      {/* Panel */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/50">
        {/* Presets */}
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Presets
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {presetAudiences.map((a) => {
            const active = audiences.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAudience(a)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20",
                  active
                    ? "border-emerald-600/25 bg-emerald-600/10 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                    : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-800/50"
                )}
              >
                {a}
              </button>
            );
          })}
        </div>

        {/* Selected (including custom) */}
        <div className="mt-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Selected
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {audiences.length === 0 ? (
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Belum ada audience dipilih.
              </div>
            ) : (
              audiences.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-800 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => toggleAudience(a)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/60"
                    aria-label={`Remove ${a}`}
                    title="Hapus"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Custom input */}
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              value={audienceCustom}
              onChange={(e) => setAudienceCustom(e.target.value)}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  submitCustom();
                }
              }}
              placeholder="Add a custom audience…"
              className={cn(
                "h-10 w-full rounded-2xl border px-3 text-[12px] outline-none transition",
                "border-slate-200/80 bg-white text-slate-900 placeholder:text-slate-400",
                "dark:border-slate-800/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500",
                "focus:border-emerald-600/35 focus:ring-2 focus:ring-emerald-600/15",
                "dark:focus:border-emerald-400/30 dark:focus:ring-emerald-400/15"
              )}
            />

            <button
              type="button"
              onClick={submitCustom}
              disabled={!hasText}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-[12px] font-semibold transition",
                hasText
                  ? "bg-emerald-600 text-white hover:brightness-105 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            Press{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Enter
            </span>{" "}
            to add.
          </div>
        </div>
      </div>
    </section>
  );
}
