// src/pages/trends-generation/TrendsResults.tsx
import TrendIdeaCard from "./TrendIdeaCard";
import type { TrendsIdeas, TrendSnapshot } from "./types";
import TrendingHookCard from "./TredingHookCard";
import ContentAngleCard from "./ContentAngleCard";
import SingleIdeaCard from "./SingleIdeaCard";
import TrendsSnapshot from "./TrendsSnapshot";

type Props = {
  ideas: TrendsIdeas | null;
  isLoading: boolean;
  onUseIdea?: (text: string) => void;

  rightMode: "snapshot" | "brainstorm";
  onChangeMode: (m: "snapshot" | "brainstorm") => void;

  snapshot: TrendSnapshot | null;
  snapshotLoading: boolean;
  onUseMessage: (msg: string) => void;
  onAppendHint: (hint: string) => void;

  // ✅ baru: manual trigger
  onFetchSnapshot: () => void;
};

function ModeTabs({
  mode,
  onChange,

  hasSnapshot,
}: {
  mode: "snapshot" | "brainstorm";
  onChange: (m: "snapshot" | "brainstorm") => void;
  hasIdeas: boolean;
  hasSnapshot: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
      <div className="relative flex items-center rounded-xl bg-slate-100 p-1">
        {/* active indicator */}
        <div
          className={[
            "pointer-events-none absolute top-1 bottom-1 w-1/2 rounded-lg transition-all duration-200",
            mode === "snapshot"
              ? "left-1 bg-gradient-to-br from-[#068773] to-[#0fb9a8]"
              : "left-1/2 bg-gradient-to-br from-[#068773] to-[#0fb9a8]",
          ].join(" ")}
        />

        {/* SNAPSHOT */}
        <button
          type="button"
          onClick={() => onChange("snapshot")}
          className={[
            "relative z-10 flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors",
            mode === "snapshot"
              ? "text-white"
              : "text-slate-600 hover:text-slate-800",
          ].join(" ")}
        >
          Trend Snapshot
        </button>

        {/* BRAINSTORM */}
       <button
        type="button"
        onClick={() => onChange("brainstorm")}
      
        className={[
          "relative z-10 flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors",
          mode === "brainstorm" ? "text-white" : "text-slate-600 hover:text-slate-800",
        ].join(" ")}
      >
        Brainstorm
      </button>

      </div>

      {/* helper hint */}
      {!hasSnapshot && mode === "snapshot" ? (
        <div className="mt-2 text-center text-[11px] text-slate-500">
          Klik <span className="font-semibold text-slate-700">Lihat Trend Snapshot</span> untuk mulai.
        </div>
      ) : null}
    </div>
  );
}


export default function TrendsResults({
  ideas,
  isLoading,
  onUseIdea,
  rightMode,
  onChangeMode,
  snapshot,
  snapshotLoading,
  onUseMessage,
  onAppendHint,
  onFetchSnapshot,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-40 rounded bg-slate-100" />
          <div className="mt-3 space-y-2">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-44 rounded bg-slate-100" />
          <div className="mt-3 space-y-2">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  const hasIdeas = !!ideas;
  const hasSnapshot = !!snapshot;

  return (
    <div className="space-y-4">
      <ModeTabs
        mode={rightMode}
        onChange={onChangeMode}
        hasIdeas={hasIdeas}
        hasSnapshot={hasSnapshot}
      />

      {/* =========================
          MODE: SNAPSHOT
         ========================= */}
      {rightMode === "snapshot" ? (
        snapshotLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-4 w-44 rounded bg-slate-100" />
            <div className="mt-4 space-y-2">
              <div className="h-10 rounded bg-slate-100" />
              <div className="h-10 rounded bg-slate-100" />
              <div className="h-10 rounded bg-slate-100" />
            </div>
          </div>
        ) : snapshot ? (
          <TrendsSnapshot
            data={snapshot}
            onUseMessage={onUseMessage}
            onAppendHint={onAppendHint}
          />
        ) : (
          //  Empty state awal + tombol manual (tidak auto fetch)
       
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white p-10">
                {/* subtle gradient accent */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#0fb9a8]/20 to-[#068773]/20 blur-3xl" />

                <div className="relative mx-auto max-w-lg text-center">
                  <div className="text-[26px] font-extrabold tracking-tight text-slate-900">
                    Cek dulu{" "}
                    <span className="bg-gradient-to-br from-[#068773] to-[#0fb9a8] bg-clip-text text-transparent">
                      apa yang lagi rame
                    </span>{" "}
                    🔍
                  </div>

                  <div className="mt-4 text-sm leading-relaxed text-slate-600">
                    Biar idemu nggak ngawang, kita mulai dari{" "}
                    <span className="font-semibold text-slate-800">
                      real insight yang lagi jalan
                    </span>
                    . Isi konteks singkat di kiri, lalu ambil{" "}
                    <span className="font-semibold text-[#068773]">
                      Trend Snapshot
                    </span>{" "}
                    berisi:
                    <div className="mt-3 space-y-1 text-[13px]">
                      <div>• Topik & narasi yang lagi viral</div>
                      <div>• Pola hook & angle yang sering dipakai</div>
                      <div>• CTA & hashtag cluster yang relevan</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onFetchSnapshot}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#068773] to-[#0fb9a8] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-95"
                  >
                    Lihat Trend Snapshot
                  </button>

                  <div className="mt-4 text-[12px] text-slate-500">
                    ✨ Tip: makin spesifik produk & pesan → insight makin tajam.
                  </div>
                </div>
              </div>

        )
      ) : null}

      {/* =========================
          MODE: BRAINSTORM
         ========================= */}
      {rightMode === "brainstorm" ? (
        !ideas ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="text-2xl font-semibold tracking-tight text-slate-900">
                Partner Brainstorm{" "}
                <span className="bg-gradient-to-br from-[#068773] to-[#0fb9a8] bg-clip-text text-transparent">
                  Konten Kamu
                </span>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-slate-600">
                Klik <span className="font-semibold">Brainstorm</span> di panel kiri untuk generate ide.
              </div>
              <div className="mt-5 text-[12px] text-slate-500">
                Atau cek Trend Snapshot dulu ✨
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. TRENDING HOOKS */}
            <section>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {ideas.hooks[0] && (
                  <div className="lg:col-span-2">
                    <TrendingHookCard
                      hook={ideas.hooks[0]}
                      visualBrief={ideas.visualBriefs?.[0]}
                      onCopy={(t) => onUseIdea?.(t)}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* 2. CONTENT ANGLES */}
            <section>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {ideas.angles[0] && (
                  <div className="lg:col-span-2">
                    <ContentAngleCard
                      angle={ideas.angles[0]}
                      howTo={ideas.angleHowTos?.[0]}
                      onCopy={(t) => onUseIdea?.(t)}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* 3. CAPTION & CTA */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SingleIdeaCard
                title="Caption Terpilih"
                text={ideas.captions?.[0]}
                onCopy={onUseIdea}
              />
              <SingleIdeaCard
                title="CTA yang Disarankan"
                text={ideas.ctas?.[0]}
                onCopy={onUseIdea}
              />
            </section>

            {/* 4. HASHTAGS */}
            <section>
              <TrendIdeaCard title="Hashtags" items={ideas.hashtags} onUse={onUseIdea} />
            </section>
          </div>
        )
      ) : null}
    </div>
  );
}
