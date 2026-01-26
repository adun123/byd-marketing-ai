
import cn from "../ui/cn";
import type { AgentCard } from "../../types/dashboard";

export default function AgentCardItem({ card }: { card: AgentCard }) {
  const Comp = card.href ? "a" : "div";

  return (
    <Comp
      {...(card.href ? { href: card.href } : {})}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white",
        "shadow-[0_1px_0_0_rgba(15,23,42,0.04)] transition",
        "hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-20px_rgba(15,23,42,0.35)]",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/25"
      )}
    >
      {/* subtle top hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-600/35 to-transparent" />

      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon chip */}
          <div
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-2xl",
              "border border-slate-200/70 bg-slate-50",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]"
            )}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-600/10 to-transparent opacity-80" />
            <div className="relative">{card.icon}</div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                    {card.title}
                  </h3>

                  {card.badge ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-600/15 bg-emerald-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {card.badge}
                    </span>
                  ) : null}
                </div>

                {card.meta ? (
                  <div className="mt-1 text-[12px] font-medium text-slate-500">{card.meta}</div>
                ) : null}
              </div>

              <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-600/40 ring-4 ring-emerald-600/10 opacity-80 transition group-hover:opacity-100" />
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{card.desc}</p>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-[12px] font-medium text-slate-500">Quick access</div>

              {card.href ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition group-hover:border-emerald-600/25 group-hover:bg-emerald-600/5">
                  Open
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600/80" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Comp>
  );
}
