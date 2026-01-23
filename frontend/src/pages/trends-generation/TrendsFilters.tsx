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

export default function TrendsFilters({ value, onChange, onBrainstorm, isLoading }: Props) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-3">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
            <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
                <SlidersHorizontal className="h-4 w-4 text-slate-700" />
            </div>
            <div>
                <div className="text-sm font-semibold text-slate-900">
                Filter Tren
                </div>
                <div className="text-[11px] text-slate-500">
                Pilih konteks biar ide lebih nyambung.
                </div>
            </div>
            </div>
        </div>
        </div>

        {/* PLATFORM */}
        <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">
             Platform
        </div>

        <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => {
            const active = value.platform === p.id;

            return (
                <button
                key={p.id}
                type="button"
                onClick={() => onChange({ platform: p.id })}
                className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    "hover:shadow-sm",
                    active
                    ? "border-transparent text-white bg-gradient-to-br from-[#068773] to-[#0fb9a8]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
                >
                <div className={cn("text-xs font-semibold", active ? "text-white" : "text-slate-900")}>
                    {p.label}
                </div>
                <div className={cn("mt-0.5 text-[10px]", active ? "text-white/80" : "text-slate-500")}>
                    {p.hint}
                </div>
                </button>
            );
            })}
        </div>
        </div>

        {/* JENIS KONTEN */}
        <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">
            Jenis Konten
        </div>

        <div className="grid grid-cols-2 gap-2">
            {contentTypes.map((c) => {
            const active = value.contentType === c.id;

            const desc =
                c.id === "edu-ent"
                ? "Edukasi tapi tetap seru"
                : "Promosi halus (soft selling)";

            return (
                <button
                key={c.id}
                type="button"
                onClick={() => onChange({ contentType: c.id })}
                className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    "hover:shadow-sm",
                    active
                    ? "border-transparent text-white bg-gradient-to-br from-[#068773] to-[#0fb9a8]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
                >
                <div className={cn("text-xs font-semibold", active ? "text-white" : "text-slate-900")}>
                    {c.label}
                </div>
                <div className={cn("mt-0.5 text-[10px]", active ? "text-white/80" : "text-slate-500")}>
                    {desc}
                </div>
                </button>
            );
            })}
        </div>
        </div>

        {/* TARGET AUDIENCE */}
        <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-slate-700">
             Target Penonton
        </div>

        <div className="grid grid-cols-2 gap-2">
            {audiences.map((a) => {
            const active = value.targetAudience === a.id;

            // bikin label pendek biar rapi
            const short =
                a.id === "genz-balanced"
                ? "Gen Z • Santai"
                : a.id === "genz-emotional"
                ? "Gen Z • Emosional"
                : a.id === "genalpha-balanced"
                ? "Gen Alpha • Santai"
                : "Gen Alpha • Emosional";

            const desc =
                a.id.includes("emotional")
                ? "Lebih relate & feeling"
                : "Lebih jelas & informatif";

            return (
                <button
                key={a.id}
                type="button"
                onClick={() => onChange({ targetAudience: a.id })}
                className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    "hover:shadow-sm",
                    active
                    ? "border-transparent text-white bg-gradient-to-br from-[#068773] to-[#0fb9a8]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
                >
                <div className={cn("text-xs font-semibold", active ? "text-white" : "text-slate-900")}>
                    {short}
                </div>
                <div className={cn("mt-0.5 text-[10px]", active ? "text-white/80" : "text-slate-500")}>
                    {desc}
                </div>
                </button>
            );
            })}
        </div>
        </div>

        {/* DETAIL TOPIK */}
        <div className="mb-3">
        <div className="mb-2 text-xs font-semibold text-slate-700">
             Detail Topik
        </div>

        <div className="space-y-3">
            <label className="block">
            <div className="mb-1 text-xs font-semibold text-slate-700">
                Produk / Topik
            </div>
            <input
                value={value.product ?? ""}
                onChange={(e) => onChange({ product: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                placeholder="Contoh: BYD Seal, kopi susu, skincare..."
            />
            </label>

            <label className="block">
            <div className="mb-1 text-xs font-semibold text-slate-700">
                Brand (opsional)
            </div>
            <input
                value={value.brand ?? ""}
                onChange={(e) => onChange({ brand: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                placeholder="Contoh: BYD"
            />
            </label>

            <label className="block">
            <div className="mb-1 text-xs font-semibold text-slate-700">
                Pesan Utama (opsional)
            </div>
            <textarea
                value={value.message ?? ""}
                onChange={(e) => onChange({ message: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                placeholder='Contoh: “mobil listrik yang nyaman dan modern untuk daily”'
            />
            </label>
        </div>
        </div>

        {/* CTA */}
        <button
        type="button"
        disabled={isLoading}
        onClick={onBrainstorm}
        className={cn(
            "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
            isLoading
            ? "bg-slate-200 text-slate-500"
            : "text-white bg-gradient-to-br from-[#068773] to-[#0fb9a8] hover:opacity-95 shadow-sm"
        )}
        >
        <Sparkles className="h-4 w-4" />
        {isLoading ? "Lagi cari ide..." : "Brainstorm Ide"}
        </button>

        <div className="mt-2 text-[11px] text-slate-500">
        Hasil: hook, angle konten, caption, CTA, hashtag (text-only).
        </div>
    </div>
    );

}
