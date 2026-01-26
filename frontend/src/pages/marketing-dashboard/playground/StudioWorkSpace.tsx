// src/pages/marketing-dashboard/playground/StudioWorkspace.tsx
import { Bookmark, CalendarPlus, Save } from "lucide-react";
import OutputSectionCard from "./OutputSectionCard";
import PinnedIdeasCard from "./PinnedIdeasCard";
import type { PinnedItem, StudioBrief, StudioOutput } from "./types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function StudioWorkspace({
  brief,
  output,
  isGenerating,
  pinned,
  onPin,
  onUnpin,
  onSaveToLibrary,
  onAddToScheduler,
}: {
  brief: StudioBrief;
  output: StudioOutput | null;
  isGenerating: boolean;
  pinned: PinnedItem[];
  onPin: (group: PinnedItem["group"], text: string) => void;
  onUnpin: (id: string) => void;
  onSaveToLibrary: () => void;
  onAddToScheduler: () => void;
}) {
  return (
    <div className="min-w-0 space-y-4">
      {/* Top actions row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[15px] font-semibold text-slate-900">Campaign Studio</div>
          <div className="mt-1 text-[12px] text-slate-500">
            Generate paket ide (hook, angle, caption, CTA) lalu pin yang terbaik.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveToLibrary}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" />
            Save to Library
          </button>
          <button
            type="button"
            onClick={onAddToScheduler}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <CalendarPlus className="h-4 w-4" />
            Add to Scheduler
          </button>
        </div>
      </div>

      {/* Main grid: outputs + pinned */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {!output ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                <Bookmark className="h-5 w-5 text-[#068773]" />
              </div>
              <div className="mt-3 text-[13px] font-semibold text-slate-900">
                Ready when you are
              </div>
              <div className="mt-1 text-[12px] text-slate-500">
                Isi brief di kiri lalu klik <span className="font-semibold text-slate-700">Generate ideas</span>.
              </div>
            </div>
          ) : (
            <>
              <OutputSectionCard
                title="Hooks"
                subtitle="Pilihan opening yang langsung menarik"
                items={output.hooks}
                onPin={(text) => onPin("Hook", text)}
                isGenerating={isGenerating}
              />

              <OutputSectionCard
                title="Angles"
                subtitle="Sudut pandang konten untuk variasi"
                items={output.angles}
                onPin={(text) => onPin("Angle", text)}
                isGenerating={isGenerating}
              />

              <OutputSectionCard
                title="CTA"
                subtitle="Arahkan audience ke tindakan"
                items={output.ctas}
                onPin={(text) => onPin("CTA", text)}
                isGenerating={isGenerating}
              />

              <OutputSectionCard
                title="Hashtags"
                subtitle="Cluster hashtag yang relevan"
                items={output.hashtags}
                onPin={(text) => onPin("Hashtag", text)}
                isGenerating={isGenerating}
              />

              <OutputSectionCard
                title="Captions"
                subtitle="3 panjang: short / medium / long"
                items={[output.captions.short, output.captions.medium, output.captions.long]}
                onPin={(text) => onPin("Caption", text)}
                isGenerating={isGenerating}
                variant="multiline"
              />
            </>
          )}
        </div>

        <PinnedIdeasCard pinned={pinned} onRemove={onUnpin} />
      </div>
    </div>
  );
}
