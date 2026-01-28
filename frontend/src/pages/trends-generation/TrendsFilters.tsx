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
    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
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
    <aside className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        {/* DISCOVERY SOURCE */}
        <div>
          <SectionTitle>Discovery Source</SectionTitle>

          <div className="space-y-1.5">
            {sources.map((s) => {
              const active = value.platform === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ platform: s.id })}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
                    active
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-lg border",
                        active
                          ? "border-emerald-200 bg-white text-[#068773]"
                          : "border-slate-200 bg-white text-slate-500"
                      )}
                    >
                      {s.icon}
                    </span>

                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-[12px] font-semibold truncate",
                          active ? "text-slate-900" : "text-slate-800"
                        )}
                      >
                        {s.label}
                      </div>
                      {/* optional mini hint (kalau mau) */}
                      {/* <div className="text-[11px] text-slate-500">Source</div> */}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="my-4 h-px w-full bg-slate-100" />

        {/* TOPIC SELECTION */}
        <div>
          <SectionTitle>Topic Selection</SectionTitle>

          <div className="space-y-1.5">
            {topics.map((t) => {
              const active = value.contentType === t.id && !(value.product && value.product.trim());
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChange({ contentType: t.id, product: "" })}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
                    active
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full border",
                        active ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"
                      )}
                    >
                      {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                    </span>

                    <span className="text-[12px] font-semibold text-slate-800">{t.label}</span>
                  </div>
                </button>
              );
            })}

            {/* “Cars” sebagai quick-fill custom topic biar nggak nempel tombol aneh */}
            <button
              type="button"
              onClick={() => onChange({ contentType: "soft-campaign", product: "Cars" })}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left transition",
                "focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
                value.product?.trim().toLowerCase() === "cars"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border",
                    value.product?.trim().toLowerCase() === "cars"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {value.product?.trim().toLowerCase() === "cars" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  ) : null}
                </span>

                <span className="text-[12px] font-semibold text-slate-800">Cars</span>
              </div>
            </button>

            <input
              value={value.product ?? ""}
              onChange={(e) => onChange({ product: e.target.value })}
              placeholder="Input custom topic"
              className={cn(
                "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3",
                "text-[12px] text-slate-900 placeholder:text-slate-400",
                "outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-600/15"
              )}
            />

            <div className="text-[11px] text-slate-500">
              Selected: <span className="font-semibold text-slate-700">{currentTopicLabel}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onBrainstorm}
          className={cn(
            "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
            "text-[12px] font-semibold transition",
            "focus:outline-none focus:ring-2 focus:ring-emerald-600/25",
            isLoading
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-gradient-to-r from-[#068773] to-[#0fb9a8] text-white hover:opacity-95"
          )}
        >
          <Bolt className="h-4 w-4" />
          {isLoading ? "Refreshing…" : "Refresh Trends"}
        </button>

        <div className="mt-2 text-[11px] text-slate-500">
          Pilih sumber + topik, lalu refresh untuk ambil tren terbaru.
        </div>
      </div>
    </aside>
  );
}
