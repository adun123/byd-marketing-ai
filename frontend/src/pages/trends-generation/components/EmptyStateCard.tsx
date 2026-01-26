import React from "react";

export default function EmptyStateCard({
  eyebrow,
  title,
  desc,
  bullets,
  ctaLabel,
  onCta,
  footnote,
  secondaryHint,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc: React.ReactNode;
  bullets?: string[];
  ctaLabel: string;
  onCta: () => void;
  footnote?: string;
  secondaryHint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#0fb9a8]/18 to-[#068773]/18 blur-3xl" />
      <div className="relative mx-auto max-w-lg text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {eyebrow}
        </div>

        <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[26px]">
          {title}
        </div>

        <div className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</div>

        {bullets?.length ? (
          <div className="mt-4 space-y-1 text-left text-[13px] text-slate-600">
            {bullets.map((b) => (
              <div key={b} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#068773]/70" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onCta}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#068773]/30"
        >
          {ctaLabel}
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
        </button>

        {secondaryHint ? <div className="mt-3 text-[12px] text-slate-500">{secondaryHint}</div> : null}
        {footnote ? <div className="mt-4 text-[12px] text-slate-500">{footnote}</div> : null}
      </div>
    </div>
  );
}
