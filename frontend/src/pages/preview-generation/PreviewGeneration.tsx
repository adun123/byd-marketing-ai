import * as React from "react";

import PreviewFooter from "./PreviewFooter";

import PreviewMetaPanel from "./PreviewMetaPanel";
import PreviewCanvasPanel from "./PreviewCanvasPanel";
import PreviewValidationPanel from "./PreviewValidationPanel";

import { loadContentCtx } from "../content-generation/utils/contentContextStorage";
import { loadContentPreviewMeta } from "../content-generation/utils/contentPreviewMetaStorage";
import TopBarPreview from "./TopBarPreview";

// ⚠️ samakan dengan LS_KEY_ITEMS yang kamu pakai di ContentGeneration.tsx
const LS_KEY_ITEMS = "cg.canvas.items.v1"; // <- kalau beda, ganti sesuai konstanta kamu

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
  // 1) DRAFT DATA (topic, audience, caption) dari Draft Generation via saveContentCtx
  const draft = loadContentCtx();

  const topic = draft?.topic ?? "—";
  const targetAudience = draft?.targetAudience ?? "—";
  const caption = (draft?.scriptPreview ?? "").trim();

  // 2) CONTENT META dari Content Generation (aspect/format/slides/platform)
  const cgMeta = loadContentPreviewMeta();
  const aspect = cgMeta?.aspect ?? "4:5";

  const platformLabel = cgMeta?.platform
    ? `${cgMeta.platform} (${aspect})`
    : `Content Generator (${aspect})`;

  const formatLabel =
    cgMeta?.format === "carousel"
      ? `Carousel - ${cgMeta.slides ?? 1} Slides`
      : "Infographic";

  // 3) ITEMS (preview image outputs) dari localStorage ContentGeneration
  
    function loadItemsFromLS(): OutputItem[] {
      const saved = safeParse<any>(localStorage.getItem(LS_KEY_ITEMS));

      const arr =
        Array.isArray(saved) ? saved :
        Array.isArray(saved?.items) ? saved.items :
        Array.isArray(saved?.images) ? saved.images : // ✅ penting (backend kamu pakai "images")
        [];

      return normalizeItems(arr).filter((x) => x.imageUrl || x.base64);
    }

    const [items, setItems] = React.useState<OutputItem[]>(() => loadItemsFromLS());

    // optional: refresh saat halaman kebuka
    React.useEffect(() => {
      setItems(loadItemsFromLS());
    }, []);



  // optional: kalau user generate lagi di tab lain lalu balik ke preview
  React.useEffect(() => {
    const saved = safeParse<OutputItem[]>(localStorage.getItem(LS_KEY_ITEMS));
    if (Array.isArray(saved)) setItems(saved);
  }, []);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedId && items.length) setSelectedId(items[0].id);
  }, [items, selectedId]);

  const [isPublishOpen, setIsPublishOpen] = React.useState(false);

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
