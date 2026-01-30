// src/pages/trends-generation/TrendsFilters.tsx
import * as React from "react";
import { Bolt, Camera, Play, Linkedin } from "lucide-react";
import type { TrendsForm, Platform, ContentType } from "./types";

type Props = {
  value: TrendsForm;
  onChange: (patch: Partial<TrendsForm>) => void;
  onBrainstorm: () => void;
  isLoading: boolean;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

/** Sidebar list: discovery source */
const sources: Array<{ id: Platform; label: string; icon: React.ReactNode }> = [
  { id: "instagram-post", label: "Instagram", icon: <Camera className="h-4 w-4" /> },
  { id: "tiktok-reels", label: "TikTok", icon: <Play className="h-4 w-4" /> },
  { id: "youtube-shorts", label: "YouTube", icon: <Play className="h-4 w-4" /> },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
];

/** Topic selection (masih pakai ContentType biar compatible) */
const topics: Array<{ id: ContentType; label: string }> = [
  { id: "edu-ent", label: "General" },
  { id: "soft-campaign", label: "Automotive" },
  // NOTE: kalau kamu punya enum lain buat Cars, ganti id ini.
  // Untuk sementara: pakai "soft-campaign" tapi bedakan via input product.
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-slate-600 dark:text-slate-300">
      {children}
    </div>
  );
}


export default function TrendsFilters({ value, onChange, onBrainstorm, isLoading }: Props) {
  const currentTopicLabel =
    value.product && value.product.trim().length > 0
      ? value.product.trim()
      : value.contentType === "edu-ent"
      ? "General"
      : "Automotive";

return (
  <aside className="w-full overflow-hidden  dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
    <div className="p-4">
      {/* DISCOVERY SOURCE */}
      <div>
        <SectionTitle>Discovery Source</SectionTitle>

        <div className="mt-3 space-y-2">
          {sources.map((s) => {
            const active = value.platform === s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ platform: s.id })}
                className={cn(
                  "w-full rounded-2xl border px-3 py-2 text-left transition",
                  "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                  active
                    ? "border-[#068773]/25 bg-[#068773]/5"
                    : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white dark:bg-slate-950",
                      active
                        ? "border-[#068773]/25 text-[#068773]"
                        : "border-slate-200/80 dark:border-slate-800/80 text-slate-500 dark:text-slate-300"
                    )}
                  >
                    {s.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "truncate text-[12px] font-semibold",
                        active
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-slate-800 dark:text-slate-100"
                      )}
                    >
                      {s.label}
                    </div>
                    {/* optional hint */}
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Source discovery
                    </div>
                  </div>

                  {/* active dot */}
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-[#068773]" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-5 h-px w-full bg-slate-100 dark:bg-slate-800/70" />

      {/* TOPIC SELECTION */}
      <div>
        <SectionTitle>Topic Selection</SectionTitle>

        <div className="mt-3 space-y-2">
          {topics.map((t) => {
            const active =
              value.contentType === t.id && !(value.product && value.product.trim());

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange({ contentType: t.id, product: "" })}
                className={cn(
                  "w-full rounded-2xl border px-3 py-2 text-left transition",
                  "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
                  active
                    ? "border-[#068773]/25 bg-[#068773]/5"
                    : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border",
                      active
                        ? "border-[#068773] bg-[#068773]"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    )}
                  >
                    {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>

                  <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">
                    {t.label}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Quick-fill Cars */}
          <button
            type="button"
            onClick={() => onChange({ contentType: "soft-campaign", product: "Cars" })}
            className={cn(
              "w-full rounded-2xl border px-3 py-2 text-left transition",
              "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
              value.product?.trim().toLowerCase() === "cars"
                ? "border-[#068773]/25 bg-[#068773]/5"
                : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid h-4 w-4 place-items-center rounded-full border",
                  value.product?.trim().toLowerCase() === "cars"
                    ? "border-[#068773] bg-[#068773]"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                )}
              >
                {value.product?.trim().toLowerCase() === "cars" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                ) : null}
              </span>

              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">
                Cars
              </span>
            </div>
          </button>

          {/* Custom topic input */}
          <div className="pt-1">
            <input
              value={value.product ?? ""}
              onChange={(e) => onChange({ product: e.target.value })}
              placeholder="Input custom topic"
              className={cn(
                "h-10 w-full rounded-2xl border px-3",
                "border-slate-200/80 dark:border-slate-800/80",
                "bg-white dark:bg-slate-950",
                "text-[12px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
                "outline-none transition focus:border-[#068773]/40 focus:ring-2 focus:ring-[#068773]/15"
              )}
            />

            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Selected:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {currentTopicLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onBrainstorm}
        className={cn(
          "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
          "text-[12px] font-semibold transition",
          "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
          isLoading
            ? "cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            : "bg-gradient-to-r from-[#068773] to-[#0fb9a8] text-white shadow-sm ring-1 ring-[#068773]/25 hover:brightness-105 active:brightness-95"
        )}
      >
        <Bolt className="h-4 w-4" />
        {isLoading ? "Refreshing…" : "Refresh Trends"}
      </button>

      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
        Pilih sumber + topik, lalu refresh untuk ambil tren terbaru.
      </div>
    </div>
  </aside>
);
}
