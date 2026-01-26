// src/components/ComingSoonPage.tsx

import type { ReactNode } from "react";

type ComingSoonPageProps = {
  eyebrow?: string;
  title: string;
  desc: string;
  icon?: ReactNode;
};

export default function ComingSoonPage({
  eyebrow = "Coming Soon",
  title,
  desc,
  icon,
}: ComingSoonPageProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      )}

      {/* Eyebrow */}
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {eyebrow}
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold text-slate-900">
        {title}
      </h1>

      {/* Description */}
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        {desc}
      </p>

      {/* Hint */}
      <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia.
      </div>
    </div>
  );
}
