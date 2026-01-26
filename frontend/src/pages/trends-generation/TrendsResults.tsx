// src/pages/trends-generation/TrendsResults.tsx
import TrendIdeaCard from "./TrendIdeaCard";
import type { TrendsIdeas, TrendSnapshot } from "./types";
import TrendingHookCard from "./TredingHookCard";
import ContentAngleCard from "./ContentAngleCard";
import SingleIdeaCard from "./SingleIdeaCard";
import TrendsSnapshot from "./TrendsSnapshot";
import SectionHeader from "./components/SectionHeader";
import ModeTabs from "./components/ModeTabs";
import EmptyStateCard from "./components/EmptyStateCard";
import PanelSkeleton from "./components/PanelSkeleton";

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

  // baru: manual trigger
  onFetchSnapshot: () => void;
};



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
      <div className="space-y-4">
        <PanelSkeleton titleW="w-44" rows={3} />
        <PanelSkeleton titleW="w-52" rows={2} />
      </div>
    );
  }

  const hasIdeas = !!ideas;
  const hasSnapshot = !!snapshot;

  const renderSnapshot = () => {
    if (snapshotLoading) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-4 w-44 rounded bg-slate-100" />
          <div className="mt-4 space-y-2">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
      );
    }

    if (snapshot) {
      return (
        <TrendsSnapshot
          data={snapshot}
          onUseMessage={onUseMessage}
          onAppendHint={onAppendHint}
        />
      );
    }

    return (
      <EmptyStateCard
        eyebrow="Snapshot"
        title={
          <>
            Ambil <span className="text-slate-900">Trend Snapshot</span> untuk mulai
          </>
        }
        desc={
          <>
            Snapshot membantu tim memahami topik yang sedang naik, pola hook, angle, serta CTA &
            hashtag cluster yang relevan terhadap konteks di panel kiri.
          </>
        }
        bullets={[
          "Topik & narasi yang sedang naik",
          "Pola hook & angle yang sering dipakai",
          "CTA & hashtag cluster yang relevan",
        ]}
        ctaLabel="Lihat Trend Snapshot"
        onCta={onFetchSnapshot}
        footnote="Tip: produk & pesan yang spesifik menghasilkan insight yang lebih tajam."
      />
    );
  };

  const renderBrainstorm = () => {
    if (!ideas) {
      return (
        <EmptyStateCard
          eyebrow="Brainstorm"
          title="Generate ide konten dari konteks yang dipilih"
          desc="Klik tombol Brainstorm di panel kiri untuk membuat ide: hook, angle, caption, CTA, dan hashtag."
          bullets={[
            "Hook & angle turunan dari tren",
            "Caption + CTA yang siap direview",
            "Hashtag yang relevan per tema",
          ]}
          ctaLabel="Kembali ke Snapshot"
          onCta={() => onChangeMode("snapshot")}
          secondaryHint="Atau jalankan Brainstorm dari panel kiri."
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* 1) TRENDING HOOKS */}
        <SectionHeader
          title="Trending Hook"
          desc="Pilih 1 hook utama yang paling kuat untuk dijadikan pembuka."
        />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ideas.hooks?.[0] ? (
            <div className="lg:col-span-2">
              <TrendingHookCard
                hook={ideas.hooks[0]}
                visualBrief={ideas.visualBriefs?.[0]}
                onCopy={(t) => onUseIdea?.(t)}
              />
            </div>
          ) : null}
        </section>

        {/* 2) CONTENT ANGLES */}
        <SectionHeader
          title="Content Angle"
          desc="Angle membantu positioning & struktur cerita biar konten lebih fokus."
        />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ideas.angles?.[0] ? (
            <div className="lg:col-span-2">
              <ContentAngleCard
                angle={ideas.angles[0]}
                howTo={ideas.angleHowTos?.[0]}
                onCopy={(t) => onUseIdea?.(t)}
              />
            </div>
          ) : null}
        </section>

        {/* 3) COPY & CTA */}
        <SectionHeader title="Copy & CTA" desc="Draft singkat yang siap dipakai atau disesuaikan." />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SingleIdeaCard title="Caption Terpilih" text={ideas.captions?.[0]} onCopy={onUseIdea} />
          <SingleIdeaCard title="CTA yang Disarankan" text={ideas.ctas?.[0]} onCopy={onUseIdea} />
        </section>

        {/* 4) HASHTAGS */}
        <SectionHeader title="Hashtags" desc="Cluster hashtag untuk memperkuat relevansi dan reach." />
        <section>
          <TrendIdeaCard title="Hashtags" items={ideas.hashtags} onUse={onUseIdea} />
        </section>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <ModeTabs
        mode={rightMode}
        onChange={onChangeMode}
        hasIdeas={hasIdeas}
        hasSnapshot={hasSnapshot}
      />

      {rightMode === "snapshot" ? renderSnapshot() : null}
      {rightMode === "brainstorm" ? renderBrainstorm() : null}
    </div>
  );
}

