import React from "react";
import {
  Instagram,
  Youtube,
  Play,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Eye,
} from "lucide-react";
import type { ViralSnippet, ViralSnippetSource } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

function iconBySource(src: ViralSnippetSource) {
  if (src === "instagram") return <Instagram className="h-4 w-4" />;
  if (src === "youtube") return <Youtube className="h-4 w-4" />;
  if (src === "tiktok") return <Play className="h-4 w-4" />;
  return <ExternalLink className="h-4 w-4" />; // news/linkedin
}

function badgeClass(src: ViralSnippetSource) {
  if (src === "youtube") return "bg-rose-600 text-white";
  if (src === "instagram") return "bg-fuchsia-600 text-white";
  if (src === "tiktok") return "bg-slate-900 text-white";
  return "bg-blue-600 text-white";
}

function formatK(n?: number) {
  if (typeof n !== "number") return "-";
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}

export default function ViralSnippets({
  items,
  onViewAll,
}: {
  items: ViralSnippet[];
  onViewAll?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.25)]">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">
            Viral Snippets Discovery
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            Displaying top engagement from last 24h
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="rounded-xl px-2 py-1 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          View All
        </button>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 4).map((it) => {
          const canOpen = Boolean(it.href);
          const initial =
            (it.authorHandle || "?").replace("@", "").slice(0, 1).toUpperCase() || "?";

          return (
            <a
              key={it.id}
              href={it.href || "#"}
              target={canOpen ? "_blank" : undefined}
              rel={canOpen ? "noreferrer" : undefined}
              aria-disabled={!canOpen}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white",
                "shadow-sm transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
                !canOpen && "pointer-events-none opacity-70"
              )}
            >
              {/* THUMB */}
              <div className="relative h-36 w-full bg-slate-100">
                <img
                  src={it.thumbUrl}
                  alt={it.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* hover dark layer */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-slate-900/0 transition",
                    "group-hover:bg-slate-900/35"
                  )}
                />

                {/* Preview overlay */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center",
                    "opacity-0 translate-y-1 transition duration-200",
                    "group-hover:opacity-100 group-hover:translate-y-0"
                  )}
                >
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-[12px] font-semibold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
                      <Eye className="h-4 w-4" />
                    </span>
                    Preview
                  </div>
                </div>

                {/* source badge */}
                <div
                  className={cn(
                    "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-[11px] font-semibold",
                    badgeClass(it.source)
                  )}
                >
                  {iconBySource(it.source)}
                  <span className="sr-only">{it.source}</span>
                </div>
              </div>

              {/* BODY */}
              <div className="p-4">
                {/* author row */}
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-[11px] font-bold text-emerald-700">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-semibold text-slate-900">
                      {it.authorHandle || "Unknown"}
                    </div>
                  </div>

                  <span className="ml-auto hidden rounded-xl bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 md:inline">
                    24h
                  </span>
                </div>

                {/* title */}
                <div className="mt-3 line-clamp-2 text-[12px] font-semibold text-slate-900">
                  {it.title}
                </div>

                {/* metrics */}
                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-600">
                  <Metric icon={<Heart className="h-3.5 w-3.5" />} label="Likes" value={formatK(it.likes)} />
                  <Metric
                    icon={<MessageCircle className="h-3.5 w-3.5" />}
                    label="Comments"
                    value={formatK(it.comments)}
                  />
                  <Metric icon={<Share2 className="h-3.5 w-3.5" />} label="Shares" value={formatK(it.shares)} />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-slate-500">{icon}</span>
      <span className="font-semibold text-slate-800">{value}</span>
      <span className="text-slate-500">{label}</span>
    </div>
  );
}
