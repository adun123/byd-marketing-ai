import TopBar from "../../components/layout/TopBar";
import AgentCardItem from "./components/ui/AgentCardItem";

import { dashboardCards as cards } from "./data/dashboardCards";
import cn from "./components/ui/cn";
import StatFeature from "./components/ui/StatFeature";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar />

      <main className="relative w-full overflow-hidden px-6 py-10 sm:py-9 lg:px-10">
        {/* Corporate background: grid + soft gradients (antigravity) */}
        <div className="pointer-events-none absolute inset-0">
          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
            style={{
              backgroundImage:
                // light
                "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at 40% 10%, black 35%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 40% 10%, black 35%, transparent 70%)",
            }}
          />
          {/* Dark-mode grid overlay (lebih halus & terang tipis) */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at 40% 10%, black 35%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 40% 10%, black 35%, transparent 70%)",
              opacity: 0.22,
            }}
          />

          {/* soft blobs */}
          <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-emerald-500/18 blur-3xl dark:bg-emerald-400/10" />
          <div className="absolute top-10 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-sky-500/14 blur-3xl dark:bg-sky-400/10" />
          <div className="absolute bottom-[-10rem] left-[20%] h-[26rem] w-[26rem] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          {/* Hero */}
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              {/* Headline */}
              <h1 className="mt-5 text-[44px] font-extrabold leading-[0.95] tracking-[-0.04em] text-slate-900 dark:text-slate-100 sm:text-[64px]">
                <span className="block">Skala, Eksekusi </span>
                <span className="mt-2 block font-extrabold italic text-emerald-700 dark:text-emerald-400">
                  Hasil Lebih Presisi.
                </span>
              </h1>

              {/* Subcopy */}
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                Satu platform terpadu untuk discovery tren, produksi konten, dan
                monitoring performa secara end-to-end.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/trends"
                  className={cn(
                    "group inline-flex items-center justify-center gap-2 rounded-2xl",
                    "bg-gradient-to-r from-[#068773] to-[#0fb9a8]",
                    "px-6 py-3 text-sm font-semibold text-white",
                    "shadow-sm transition",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/30 dark:focus:ring-emerald-400/30"
                  )}
                >
                  Buka Workspace Trend
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80 transition group-hover:translate-x-0.5" />
                </a>

                <a
                  href="/generator"
                  className={cn(
                    "group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300",
                    // default (light & dark)
                    "border border-slate-200/70 bg-white/70 text-slate-900 backdrop-blur shadow-sm",
                    "dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-100",
                    // hover gradient + nonjol
                    "hover:bg-gradient-to-r hover:from-[#068773] hover:to-[#0fb9a8]",
                    "hover:text-white hover:border-transparent",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    // focus ring
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/30 dark:focus:ring-emerald-400/30"
                  )}
                >
                  Masuk ke Generator
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current/80 transition group-hover:translate-x-0.5" />
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <StatFeature
                  icon="trend"
                  title="Trendy"
                  subtitle="Pantau topik dan momentum"
                />
                <StatFeature
                  icon="workflow"
                  title="Workflow"
                  subtitle="Dari riset hingga produksi"
                />
                <StatFeature
                  icon="standards"
                  title="Standards"
                  subtitle="Konsisten dengan guideline"
                />
              </div>
            </div>

            {/* Right panel: marketing hook snapshot */}
            <div className="hidden lg:block">
              <div className="relative w-[22rem]">
                {/* ambient glow */}
                <div className="absolute -inset-10 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />

                <div className="relative rounded-[28px] border border-slate-200/70 bg-white/90 p-5 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/70 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.45)] dark:shadow-[0_18px_48px_-28px_rgba(0,0,0,0.55)]">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                        ✨
                      </span>
                      Marketing Hook
                    </div>

                    <span className="inline-flex items-center rounded-full border border-emerald-600/15 bg-emerald-600/10 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                      SNAPSHOT AKTIF
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-4 space-y-3">
                    {/* Trend Hook */}
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-950/40">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                        ● Hook Trend
                      </div>

                      <div className="mt-2 text-sm font-semibold italic text-slate-800 dark:text-slate-100">
                        “Kenapa brand kecil bisa viral tanpa banyak iklan?”
                      </div>
                    </div>

                    {/* Visual Strategy */}
                    <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-300/20 dark:bg-emerald-400/10">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                        👁 Strategi Visual
                      </div>

                      <p className="mt-2 text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
                        Gunakan split screen untuk membandingkan masalah vs
                        solusi. Pakai cut cepat dan teks bergerak (kinetic
                        typography) agar lebih dinamis. kinetic typography.
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="/draft-generator"
                    type="button"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#068773]/30 dark:focus:ring-emerald-400/30"
                  >
                    Generate Draft Marketing
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section header */}
          <div className="mt-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Modules
              </div>
              <div className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-900 dark:text-slate-100">
                Pilih workflow yang mau kamu jalankan
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-slate-700 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-200">
                Tips: Disarankan memulai dari Insight → Content Generation
              </span>
            </div>
          </div>

   


          {/* Cards */}
        
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <AgentCardItem key={card.title} card={card} />
            ))}
          </div>


          {/* Footer note */}
         
        </div>
      </main>
    </div>
  );
}
