// src/pages/trends-generation/TrendsFilters.tsx
import { SlidersHorizontal, Sparkles } from "lucide-react";
import type { TrendsForm, Platform, ContentType, TargetAudience } from "./types";

type Props = {
  value: TrendsForm;
  onChange: (patch: Partial<TrendsForm>) => void;
  onBrainstorm: () => void;
  isLoading: boolean;
};

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

const platforms: Array<{ id: Platform; label: string; hint: string }> = [
  { id: "tiktok-reels", label: "TikTok/Reels", hint: "9:16 • fast hook" },
  { id: "youtube-shorts", label: "YouTube Shorts", hint: "9:16 • punchy" },
  { id: "instagram-post", label: "Instagram Post", hint: "1:1 • 4:5" },
  { id: "linkedin", label: "LinkedIn", hint: "1.91:1 • pro" },
];

const contentTypes: Array<{ id: ContentType; label: string }> = [
  { id: "edu-ent", label: "Edu-ent" },
  { id: "soft-campaign", label: "Soft campaign" },
];

const audiences: Array<{ id: TargetAudience; label: string }> = [
  { id: "genz-balanced", label: "Gen Z • Balanced" },
  { id: "genz-emotional", label: "Gen Z • Emotional" },
  { id: "genalpha-balanced", label: "Gen Alpha • Balanced" },
  { id: "genalpha-emotional", label: "Gen Alpha • Emotional" },
];
/** Helpers (tetap di file yang sama) */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      {children}
    </label>
  );
}
export default function TrendsFilters({ value, onChange, onBrainstorm, isLoading }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
      {/* hairline accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#068773]/45 to-transparent" />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#068773]/12 to-transparent opacity-80" />
                <SlidersHorizontal className="relative h-4 w-4 text-slate-800" />
              </div>

              <div className="min-w-0">
                <div className="text-[13px] font-semibold tracking-[-0.01em] text-slate-900">
                  Filter Tren
                </div>
                <div className="mt-0.5 text-[12px] text-slate-500">
                  Pilih konteks supaya hasil lebih relevan dan konsisten.
                </div>
              </div>
            </div>
          </div>

          {/* optional: tiny status */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-[#068773]/70" />
            Internal
          </div>
        </div>

        {/* PLATFORM */}
        <Section title="Platform">
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => {
              const active = value.platform === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange({ platform: p.id })}
                  className={cn(
                    "group rounded-2xl border p-3 text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                    active
                      ? "border-transparent bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white shadow-sm"
                      : "border-slate-200/70 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className={cn("text-xs font-semibold", active ? "text-white" : "text-slate-900")}>
                    {p.label}
                  </div>
                  <div className={cn("mt-1 text-[11px] leading-snug", active ? "text-white/85" : "text-slate-500")}>
                    {p.hint}
                  </div>

                  {/* subtle underline */}
                  <div
                    className={cn(
                      "mt-2 h-px w-full transition",
                      active ? "bg-white/30" : "bg-slate-200/60 group-hover:bg-slate-300/70"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </Section>

        {/* JENIS KONTEN */}
        <Section title="Jenis Konten">
          <div className="grid grid-cols-2 gap-2">
            {contentTypes.map((c) => {
              const active = value.contentType === c.id;

              const desc =
                c.id === "edu-ent"
                  ? "Edukasi yang tetap engaging"
                  : "Promosi halus (soft selling)";

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ contentType: c.id })}
                  className={cn(
                    "group rounded-2xl border p-3 text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                    active
                      ? "border-transparent bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white shadow-sm"
                      : "border-slate-200/70 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className={cn("text-xs font-semibold", active ? "text-white" : "text-slate-900")}>
                    {c.label}
                  </div>
                  <div className={cn("mt-1 text-[11px] leading-snug", active ? "text-white/85" : "text-slate-500")}>
                    {desc}
                  </div>

                  <div
                    className={cn(
                      "mt-2 h-px w-full transition",
                      active ? "bg-white/30" : "bg-slate-200/60 group-hover:bg-slate-300/70"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </Section>

        {/* TARGET AUDIENCE */}
        <Section title="Target Penonton">
          <div className="grid grid-cols-2 gap-2">
            {audiences.map((a) => {
              const active = value.targetAudience === a.id;

              const short =
                a.id === "genz-balanced"
                  ? "Gen Z • Santai"
                  : a.id === "genz-emotional"
                  ? "Gen Z • Emosional"
                  : a.id === "genalpha-balanced"
                  ? "Gen Alpha • Santai"
                  : "Gen Alpha • Emosional";

              const desc = a.id.includes("emotional") ? "Lebih relate & feeling" : "Lebih jelas & informatif";

              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onChange({ targetAudience: a.id })}
                  className={cn(
                    "group rounded-2xl border p-3 text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                    active
                      ? "border-transparent bg-gradient-to-br from-[#068773] to-[#0fb9a8] text-white shadow-sm"
                      : "border-slate-200/70 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className={cn("text-xs font-semibold", active ? "text-white" : "text-slate-900")}>
                    {short}
                  </div>
                  <div className={cn("mt-1 text-[11px] leading-snug", active ? "text-white/85" : "text-slate-500")}>
                    {desc}
                  </div>

                  <div
                    className={cn(
                      "mt-2 h-px w-full transition",
                      active ? "bg-white/30" : "bg-slate-200/60 group-hover:bg-slate-300/70"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </Section>

        {/* DETAIL TOPIK */}
        <Section title="Detail Topik">
          <div className="space-y-3">
            <Field label="Produk / Topik">
              <input
                value={value.product ?? ""}
                onChange={(e) => onChange({ product: e.target.value })}
                className={cn(
                  "h-11 w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-3 text-sm text-slate-900",
                  "outline-none transition",
                  "focus:border-[#068773]/35 focus:bg-white focus:ring-2 focus:ring-[#068773]/15"
                )}
                placeholder="Contoh: BYD Seal, kopi susu, skincare..."
              />
            </Field>

            <Field label="Brand (opsional)">
              <input
                value={value.brand ?? ""}
                onChange={(e) => onChange({ brand: e.target.value })}
                className={cn(
                  "h-11 w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-3 text-sm text-slate-900",
                  "outline-none transition",
                  "focus:border-[#068773]/35 focus:bg-white focus:ring-2 focus:ring-[#068773]/15"
                )}
                placeholder="Contoh: BYD"
              />
            </Field>

            <Field label="Pesan Utama (opsional)">
              <textarea
                value={value.message ?? ""}
                onChange={(e) => onChange({ message: e.target.value })}
                rows={3}
                className={cn(
                  "w-full resize-none rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-sm text-slate-900",
                  "outline-none transition",
                  "focus:border-[#068773]/35 focus:bg-white focus:ring-2 focus:ring-[#068773]/15"
                )}
                placeholder='Contoh: “mobil listrik yang nyaman dan modern untuk daily”'
              />
            </Field>
          </div>
        </Section>

        {/* CTA */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onBrainstorm}
          className={cn(
            "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
            "focus:outline-none focus:ring-2 focus:ring-[#068773]/30",
            isLoading
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-gradient-to-r from-[#068773] to-[#0fb9a8] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          )}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Lagi cari ide..." : "Brainstorm Ide"}
          {!isLoading ? <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white/80" /> : null}
        </button>

        <div className="mt-2 text-[11px] text-slate-500">
          Output: hook, angle konten, caption, CTA, hashtag (text-only).
        </div>
      </div>
    </div>
  );
}



