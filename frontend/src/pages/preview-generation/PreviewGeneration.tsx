import * as React from "react";
import { useLocation } from "react-router-dom"; // ✅ tambah

import PreviewFooter from "./PreviewFooter";
import PreviewMetaPanel from "./PreviewMetaPanel";
import PreviewCanvasPanel from "./PreviewCanvasPanel";
import PreviewValidationPanel from "./PreviewValidationPanel";

import { loadContentCtx } from "../content-generation/utils/contentContextStorage";
import { loadContentPreviewMeta } from "../content-generation/utils/contentPreviewMetaStorage";
import TopBarPreview from "./TopBarPreview";

const LS_KEY_ITEMS = "cg.canvas.items.v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type OutputItem = { id: string; imageUrl?: string; base64?: string };

function normalizeItems(rawItems: any[]): OutputItem[] {
  return rawItems.map((it, idx) => ({
    id: String(it.id ?? it.filename ?? `${it.variant ?? "v"}-${idx}`),
    imageUrl: it.imageUrl ?? it.url,
    base64: it.base64,
  }));
}

export default function PreviewGeneration() {
  const location = useLocation(); // ✅ baru

  // 1) DRAFT DATA
  const draft = loadContentCtx();
  const topic = draft?.topic ?? "—";
  const targetAudience = draft?.targetAudience ?? "—";
  const caption = (draft?.scriptPreview ?? "").trim();

  // 2) CONTENT META
  const cgMeta = loadContentPreviewMeta();
  const aspect = cgMeta?.aspect ?? "4:5";
  const platformLabel = cgMeta?.platform ? `${cgMeta.platform} (${aspect})` : `Content Generator (${aspect})`;
  const formatLabel = cgMeta?.format === "carousel" ? `Carousel - ${cgMeta.slides ?? 1} Slides` : "Infographic";

  // 3) ITEMS
  function loadItemsFromLS(): OutputItem[] {
    const saved = safeParse<any>(localStorage.getItem(LS_KEY_ITEMS));

    const arr =
      Array.isArray(saved) ? saved :
      Array.isArray(saved?.items) ? saved.items :
      Array.isArray(saved?.images) ? saved.images :
      [];

    return normalizeItems(arr).filter((x) => x.imageUrl || x.base64);
  }

  const [items, setItems] = React.useState<OutputItem[]>(() => loadItemsFromLS());
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isPublishOpen, setIsPublishOpen] = React.useState(false);

  // ✅ Reload setiap kali route ini "dikunjungi lagi"
  React.useEffect(() => {
    const next = loadItemsFromLS();
    setItems(next);

    // reset selected kalau item berubah banyak / item sebelumnya hilang
    setSelectedId((prev) => (prev && next.some((x) => x.id === prev) ? prev : next[0]?.id ?? null));
  }, [location.key, (location.state as any)?.refresh]); // ✅ kunci

  // ✅ optional: kalau LS berubah dari tab lain, auto update
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== LS_KEY_ITEMS) return;
      const next = loadItemsFromLS();
      setItems(next);
      setSelectedId((prev) => (prev && next.some((x) => x.id === prev) ? prev : next[0]?.id ?? null));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ fallback: kalau belum ada selectedId, set pertama
  React.useEffect(() => {
    if (!selectedId && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);
  
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-[96px]">
      <TopBarPreview />

      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px] xl:items-start">
          <PreviewMetaPanel
            topic={topic}
            targetAudience={targetAudience}
            platformLabel={platformLabel}
            formatLabel={formatLabel}
          />

          <PreviewCanvasPanel
            aspect={aspect}
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
            caption={caption}
          />

          <PreviewValidationPanel
            brandAlignment={98}
            imageQuality="HIGH"
            visualSafety="PASSED"
            contrastRatio="OPTIMAL"
            breakdown={{ composition: 9.5, lighting: 9.2, toneConsistency: 9.8 }}
          />
        </div>
      </main>

      <PreviewFooter
        generatedAt={new Date()}
        onSaveDraft={() => console.log("save preview to draft")}
        onPublish={() => setIsPublishOpen(true)}
        draftDisabled={items.length === 0}
        publishDisabled={items.length === 0}
      />

      {isPublishOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-xl">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Publish / Export
            </div>
            <button
              className="mt-4 w-full rounded-xl bg-[#068773] px-4 py-2.5 text-sm font-semibold text-white"
              onClick={() => setIsPublishOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
