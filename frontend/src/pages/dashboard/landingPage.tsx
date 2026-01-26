import TopBar from "../../components/layout/TopBar";
import AgentCardItem from "./components/ui/AgentCardItem";
import StatPill from "./components/ui/StatPill";
import { dashboardCards as cards } from "./data/dashboardCards";
import cn from "./components/ui/cn";




export default function Dashboard(){
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar />

      <main className="relative w-full overflow-hidden px-6 py-10 sm:py-14 lg:px-10">
        {/* Corporate background: grid + soft gradients (antigravity) */}
        <div className="pointer-events-none absolute inset-0">
          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at 40% 10%, black 35%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 40% 10%, black 35%, transparent 70%)",
            }}
          />
          {/* soft blobs */}
          <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-emerald-500/18 blur-3xl" />
          <div className="absolute top-10 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-sky-500/14 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-[20%] h-[26rem] w-[26rem] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          {/* Hero */}
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-slate-700 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              BYD • Internal Content Enablement
            </div>

            <h1 className="mt-4 text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-900 sm:text-[40px]">
              Workspace internal untuk{" "}
              <span className="text-emerald-700">standarisasi</span>,{" "}
              <span className="text-slate-900">percepatan</span>, dan{" "}
              <span className="text-slate-900">kontrol kualitas</span> konten.
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Satu tempat untuk discovery tren, benchmarking kompetitor, generasi konten, dan
              adaptasi multi-channel dengan output yang konsisten terhadap guideline brand.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatPill label="Environment" value="Internal" hint="Akses terbatas tim" />
              <StatPill label="Workflow" value="Insight → Draft" hint="Lebih cepat & rapi" />
              <StatPill label="Standards" value="Brand-aligned" hint="Guideline & tone" />
            </div>


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
                    "focus:outline-none focus:ring-2 focus:ring-[#068773]/30"
                  )}
                >
                  Open Trends Workspace
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80 transition group-hover:translate-x-0.5" />
                </a>


                <a
                  href="/generator"
                  className={cn(
                    "inline-flex items-center justify-center rounded-2xl",
                    "border border-slate-200/70 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur transition",
                    "hover:bg-white hover:shadow-[0_14px_40px_-26px_rgba(15,23,42,0.35)]"
                  )}
                >
                  Go to Generator
                </a>

                <a
                  href="/competitors"
                  className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                >
                  Benchmark competitors
                </a>
              </div>

              
            </div>

            {/* Right panel: executive preview */}
            <div className="hidden lg:block">
              <div className="relative w-[22rem]">
                <div className="absolute -inset-10 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Executive Snapshot
                    </div>
                    <span className="inline-flex items-center rounded-full border border-emerald-600/15 bg-emerald-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Trend Hook
                      </div>
                      <div className="mt-2 text-sm font-semibold italic text-slate-800">
                        “Kenapa brand kecil bisa viral tanpa ads?”
                      </div>
                      <div className="mt-2 text-[12px] text-slate-500">
                        Angle: proof-based • CTA: comment keyword
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Visual Brief
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
                        Split screen: problem vs solution. Close-up ekspresi creator,
                        text overlay 3–5 kata. Pace cepat, cut tiap 1–2 detik.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                        Output
                      </div>
                      <div className="mt-2 text-[12px] text-slate-600">
                        Caption + script + prompt visual siap generate.
                      </div>
                    </div>
                  </div>
                </div>

                {/* hairline */}
                <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
                
              </div>
            </div>
          </div>

          {/* Section header */}
          <div className="mt-10 flex items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Modules
              </div>
              <div className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-900">
                Pilih workflow yang mau kamu jalankan
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-slate-700 backdrop-blur">
                Tip: mulai dari Trends → Generate
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
