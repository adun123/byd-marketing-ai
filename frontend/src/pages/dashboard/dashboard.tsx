// frontend/src/pages/Dashboard.tsx
import React from "react";
import TopBar from "../../components/layout/TopBar";

type AgentCard = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
};

const IconSpark = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
    <path
      d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M19 11l.8 2.8 2.7 1.2-2.7 1.2L19 19l-1.2-2.8L15 15l2.8-1.2L19 11Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <path
      d="M5 12l.7 2.2L8 15l-2.3.8L5 18l-.8-2.2L2 15l2.2-.8L5 12Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-600">
    <path
      d="M4 19V5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M4 19h16"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M7 15l3-3 3 2 5-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 8h2v2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSearch = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
    <path
      d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M21 21l-4.3-4.3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconWand = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-rose-600">
    <path
      d="M4 20l10-10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M14 10l6-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M8 16l-2 2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M15.5 3.5l5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

function AgentCardItem({ card }: { card: AgentCard }) {
  const Comp = card.href ? "a" : "div";

  return (
    <Comp
      {...(card.href ? { href: card.href } : {})}
      className={[
        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80",
        "shadow-sm backdrop-blur transition",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-[#068773]/30",
      ].join(" ")}
    >
      {/* top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#068773] via-[#0fb9a8] to-[#068773]/60" />

      {/* soft corner glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#068773]/15 blur-3xl opacity-0 transition group-hover:opacity-100" />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            {/* inner icon tint */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#068773]/10 to-transparent opacity-70" />
            <div className="relative">{card.icon}</div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {card.title}
                </h3>

                {card.badge ? (
                  <div className="mt-2 inline-flex">
                    <span className="inline-flex items-center rounded-full border border-[#068773]/15 bg-[#068773]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#068773]">
                      {card.badge}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* mini indicator */}
              <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-[#068773]/40 ring-4 ring-[#068773]/10 opacity-70 transition group-hover:opacity-100" />
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {card.desc}
            </p>

            {/* footer */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-[12px] font-medium text-slate-500">
                Quick access
              </div>

              {card.href ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition group-hover:border-[#068773]/25 group-hover:bg-[#068773]/5">
                  Open
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#068773] to-[#0fb9a8]" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Comp>
  );
}




export default function Dashboard() {
 const cards: AgentCard[] = [
    {
      title: "Trend & Social Insight",
      badge: "Trends",
      desc:
        "Pantau konten yang lagi rame di TikTok & Instagram. Dapetin insight soal hook, CTA, audiens, plus ide turunan yang siap kamu eksekusi.",
      icon: <IconChart />,
      href: "/trends",
    },
    {
      title: "Competitor & Benchmark",
      badge: "Compare",
      desc:
        "Intip strategi konten kompetitor: mereka pakai angle apa, jual value apa, dan format apa yang paling jalan biar kamu bisa beda.",
      icon: <IconSearch />,
      href: "/competitors",
    },
    {
      title: "Content Generation",
      badge: "Generate",
      desc:
        "Ubah insight jadi konten siap pakai: caption, script singkat, sampai prompt AI untuk gambar & video sesuai kebutuhan channel.",
      icon: <IconSpark />,
      href: "/generator",
    },
    {
      title: "Channel Adaptation",
      badge: "Multi-channel",
      desc:
        "Sesuaikan konten kamu ke tiap platform — dari TikTok, IG, Reels, Ads, sampai Marketplace tanpa mikir ulang dari nol.",
      icon: <IconWand />,
      href: "/channels",
    },
  ];
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
         <TopBar />

      {/* Hero + Content */}
    
      <main className="relative w-full overflow-hidden px-6 py-10 sm:py-14 lg:px-10">
          {/* background gradient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#068773]/25 blur-3xl" />
            <div className="absolute top-20 right-0 h-80 w-80 rounded-full bg-[#0fb9a8]/20 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  BYD AI Marketing Content Platform
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  One-stop workflow dari{" "}
                  <span className="font-medium text-slate-900">trend analysis</span>{" "}
                  sampai{" "}
                  <span className="font-medium text-slate-900">content generation</span>{" "}
                  untuk mempercepat produksi konten multi-channel dengan AI.
                </p>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* primary */}
                  <a
                    href="/trends"
                    className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Explore Trending Content
                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-white/80 transition group-hover:translate-x-0.5" />
                  </a>

                  {/* secondary */}
                  <a
                    href="/generator"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition hover:bg-slate-50"
                  >
                    Go to Generator
                  </a>
                </div>

              </div>

              {/* Right illustration placeholder (no image asset yet) */}
             <div className="hidden lg:block">
                <div className="relative w-80 space-y-3">
                  {/* glow */}
                  <div className="absolute -inset-10 rounded-full bg-[#068773]/20 blur-3xl" />

                  {/* Card 1 */}
                  <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="text-[11px] font-semibold text-[#068773]">
                      AI TREND HOOK
                    </div>
                    <div className="mt-2 text-sm font-semibold italic text-slate-800">
                      “Kenapa brand kecil bisa viral tanpa ads?”
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="text-[11px] font-semibold text-[#068773]">
                      VISUAL BRIEF
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      Split screen: problem vs solution. Close-up ekspresi creator,
                      text overlay 3–5 kata.
                    </p>
                  </div>

                 
                </div>
              </div>

            </div>

            {/* Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <AgentCardItem key={card.title} card={card} />
            ))}
          </div>


          </div>
        
      </main>
    </div>
  );
}
