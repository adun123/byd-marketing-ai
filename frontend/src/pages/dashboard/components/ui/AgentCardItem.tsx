import cn from "../ui/cn";
import type { AgentCard } from "../../types/dashboard";

export default function AgentCardItem({ card }: { card: AgentCard }) {
  const Comp = card.href ? "a" : "div";

  return (
    <Comp
      {...(card.href ? { href: card.href } : {})}
      className={cn(
        "group relative block overflow-hidden rounded-[28px] border border-slate-200/60",
        "bg-white/80 backdrop-blur",
        "shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)]",
        "transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-34px_rgba(15,23,42,0.45)]",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
      )}
    >
      {/* soft corner blob like screenshot */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-600/8 blur-2xl" />
      <div className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-full bg-slate-50" />

      <div className="relative p-6">
        {/* Top row: icon */}
        <div className="flex items-start justify-between">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-600/10">
            {card.icon}
          </div>
        </div>

        {/* Badge (small capsule) */}
        <div className="mt-5">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            {card.badge ?? card.meta ?? "WORKSPACE"}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-slate-900">
          {card.title}
        </h3>

        {/* Desc */}
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {card.desc}
        </p>

        {/* Bottom CTA pill */}
        <div className="mt-6">
          {card.href ? (
            <div
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-full",
                "border border-slate-200/70 bg-white/70 px-4 py-3",
                "text-sm font-semibold text-slate-900",
                "shadow-[0_1px_0_rgba(15,23,42,0.04)] transition",
                "group-hover:border-emerald-600/20 group-hover:bg-emerald-600/5"
              )}
            >
              {card.ctaLabel ?? "Open"}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/5 text-slate-700 transition group-hover:bg-emerald-600/10 group-hover:text-emerald-700">
                {/* small arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h12" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          ) : (
            <div className="inline-flex w-full items-center justify-center rounded-full border border-slate-200/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-400">
              Coming soon
            </div>
          )}
        </div>
      </div>
    </Comp>
  );
}
