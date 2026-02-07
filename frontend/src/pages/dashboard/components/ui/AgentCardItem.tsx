
import { useNavigate } from "react-router-dom";
import type { AgentCard } from "../../types/dashboard";
import { BarChart3, Lightbulb, PenTool, Sparkles } from "lucide-react";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type Accent = "emerald" | "blue" | "purple" | "amber";

const accentMap: Record<
  Accent,
  { bubble: string; iconWrap: string; ctaIconWrap: string }
> = {
  emerald: {
    bubble: "bg-emerald-500/5",
    iconWrap: "bg-emerald-500/10 text-emerald-600",
    ctaIconWrap: "text-emerald-700 dark:text-emerald-400",
  },
  blue: {
    bubble: "bg-blue-500/5",
    iconWrap: "bg-blue-500/10 text-blue-600",
    ctaIconWrap: "text-blue-700 dark:text-blue-400",
  },
  purple: {
    bubble: "bg-purple-500/5",
    iconWrap: "bg-purple-500/10 text-purple-600",
    ctaIconWrap: "text-purple-700 dark:text-purple-400",
  },
  amber: {
    bubble: "bg-amber-500/5",
    iconWrap: "bg-amber-500/10 text-amber-600",
    ctaIconWrap: "text-amber-700 dark:text-amber-400",
  },
};

function pickIconFromBadge(badge?: string) {
  const b = (badge || "").toLowerCase();

  if (b.includes("insight"))
    return <Lightbulb className="h-6 w-6" />;

  if (b.includes("draft"))
    return <PenTool className="h-6 w-6" />;

  if (b.includes("content"))
    return <Sparkles className="h-6 w-6" />;

  return <BarChart3 className="h-6 w-6" />;
}


function pickAccentFromBadge(badge?: string): Accent {
  const b = (badge || "").toLowerCase();
  if (b.includes("insight")) return "emerald";
  if (b.includes("draft")) return "blue";
  if (b.includes("content")) return "amber";
  return "purple";
}

export default function AgentCardItem({
  card,
  className,
}: {
  card: AgentCard;
  className?: string;
}) {
  const navigate = useNavigate();

  const accent = pickAccentFromBadge(card.badge);
  const a = accentMap[accent];

  const cta = card.ctaLabel?.trim() || "Open";

return (
  <div
    className={cn(
      "group relative bg-white dark:bg-slate-900",
      "rounded-3xl p-7",
      "border border-slate-200/80 dark:border-slate-800/80",
      "transition-all duration-500",
      "hover:border-primary/60 dark:hover:border-primary/60",
      "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2",
      "overflow-hidden",
      "h-full",              // penting: biar bisa stretch sejajar
      className
    )}
  >
    {/* bubble accent */}
    <div
      className={cn(
        "absolute -right-6 -top-6 w-32 h-32 rounded-full",
        a.bubble,
        "group-hover:scale-150 transition-transform duration-700"
      )}
    />

    {/* bikin konten jadi flex-col full height */}
    <div className="relative z-10 flex h-full flex-col">
      {/* icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
          a.iconWrap,
          "group-hover:bg-primary group-hover:text-white transition-colors"
        )}
      >
        <div className="scale-[1.05]">
          {pickIconFromBadge(card.badge)}
        </div>

      </div>

      {/* badge */}
      

      {/* meta */}
      {card.meta ? (
        <div className="text-[11px] font-semibold text-slate-400 mb-3">
          {card.meta}
        </div>
      ) : null}

      {/* title */}
      <h3 className="text-lg font-extrabold mb-2 text-slate-900 dark:text-slate-50 leading-snug">
        {card.title}
      </h3>

      {/* desc boleh beda panjang, CTA tetap ke bawah */}
      <p className="text-sm mb-10 text-slate-600 dark:text-slate-400 leading-relaxed">
        {card.desc}
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={() => navigate(card.href)}
        className={cn(
          "group w-full py-3 rounded-2xl mt-auto", // mt-auto = dorong ke bawah
          "bg-slate-100/90 dark:bg-slate-800/90",
          "text-slate-900 dark:text-slate-100",
          "flex items-center justify-center gap-2",
          "font-bold text-xs shadow-sm",
          "transition-all duration-300",
          "hover:bg-gradient-to-r hover:from-[#068773] hover:to-[#0fb9a8]",
          "hover:text-white hover:shadow-md hover:-translate-y-0.5",
          "active:scale-[0.98] active:translate-y-0",
          "focus:outline-none focus:ring-2 focus:ring-[#068773]/30"
        )}
      >
        {cta}
        <span
          className={cn(
            "text-base transition-transform duration-300",
            "group-hover:translate-x-1",
            a.ctaIconWrap
          )}
        >
          →
        </span>
      </button>
    </div>
  </div>
);

}
