import { useEffect, useMemo, useState } from "react";
import TopBarGenerate from "../../components/layout/TopBarGenerate";
import DraftResult from "./DraftResult";
import OptionDraftFilter from "./OptionDraftFilter";
import { useLocation } from "react-router-dom";
import DraftFooter from "./DraftFooter";
import type { DraftContextPayload } from "../trends-generation/types";
import { loadDraftContext } from "../trends-generation/utils/draftContextStorage";
import type { GenerateContentResponse } from "./types";

import { useNavigate } from "react-router-dom";
import { saveContentCtx } from "../content-generation/utils/contentContextStorage";
import type { FinalizeContentPayload } from "../content-generation/types";

type DraftConfig = {
  sourceMode: "trend" | "manual";
  terms: string[];
  topicManual: string;
  audiences: string[];
  tone: string;
  keywords: string;
  slides: number;
  language: "id" | "en";
};

export default function DraftGeneration() {
const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  const navCtx = location.state as DraftContextPayload | null;
  const ctx = navCtx || loadDraftContext();

  const [draftConfig, setDraftConfig] = useState<DraftConfig | null>(null);
  const [generated, setGenerated] = useState<GenerateContentResponse | null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE?.trim() || "/api") as string,
    []
  );

const navigate = useNavigate();




 const [draftResult, setDraftResult] = useState<{
  scriptHtml?: string;
  visualPrompt?: string;
}>({});

const canFinalize = Boolean(
  (draftResult.visualPrompt && draftResult.visualPrompt.trim()) ||
  (generated?.visualDescription?.photo?.prompt && generated.visualDescription.photo.prompt.trim()) ||
  (generated?.visualDescription?.video?.prompt && generated.visualDescription.video.prompt.trim())
);


function handleFinalize() {
  // prioritas: yang user edit terakhir (draftResult.visualPrompt)
  const prompt =
    draftResult.visualPrompt?.trim() ||
    generated?.visualDescription?.photo?.prompt?.trim() ||
    generated?.visualDescription?.video?.prompt?.trim() ||
    "";

  if (!prompt) {
    console.warn("FinalizeContent: prompt kosong");
    return;
  }

  const payload: FinalizeContentPayload = {
    from: "draft",
    draftId: generated?.draftId,
    topic: generated?.topic,
    imagePrompt: prompt,
    style: generated?.visualDescription?.photo?.style,
    aspectRatio: generated?.visualDescription?.photo?.aspectRatio,
    brand: ctx?.form?.brand || undefined,
     scriptPreview: draftResult.scriptHtml || "",

  };

  saveContentCtx(payload);
  navigate("/content-generator", { state: payload });
}



async function handleGenerate() {
  if (isGenerating) return; //  paling atas dulu

  if (!draftConfig) {
    setGenError("Config belum siap. Coba ubah opsi dulu.");
    return;
  }

  setIsGenerating(true);
  setGenLoading(true);
  setGenError(null);

  try {
    const topic =
      draftConfig.sourceMode === "trend"
        ? (draftConfig.terms[0] || "").trim()
        : draftConfig.topicManual.trim();

    const keyTopic =
      draftConfig.sourceMode === "trend"
        ? (draftConfig.terms[0] || "").replace(/\s+/g, "")
        : topic.replace(/\s+/g, "");

    const extraTerms =
      draftConfig.sourceMode === "trend" ? draftConfig.terms.slice(1).join(", ") : "";

    const targetKeywords = [draftConfig.keywords, extraTerms].filter(Boolean).join(", ");

    if (!topic) {
      setGenError("Topic kosong. Pilih minimal 1 term atau isi manual topic.");
      return;
    }

    const payload = {
      topic,
      keyTopic,
      targetAudience: draftConfig.audiences.join(", "),
      toneOfVoice: draftConfig.tone,
      targetKeywords,
      slideCount: draftConfig.slides,
      language: draftConfig.language,
    };

    const res = await fetch(`${API_BASE}/trends/generate-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    if (!raw) throw new Error(`Empty response body (status ${res.status})`);

    let json: GenerateContentResponse;
    try {
      json = JSON.parse(raw);
    } catch {
      throw new Error(`Non-JSON response (status ${res.status}): ${raw.slice(0, 120)}`);
    }

    if (!res.ok || json?.success === false) {
      throw new Error(json?.error || `Request failed (status ${res.status})`);
    }

    setGenerated(json);
  } catch (e: any) {
    setGenError(e?.message || "Generate failed");
    setGenerated(null);
  } finally {
    setIsGenerating(false);
    setGenLoading(false);
  }
}

useEffect(() => {
  if (!draftResult.scriptHtml && !draftResult.visualPrompt) return;
  localStorage.setItem("byd:draft-result", JSON.stringify(draftResult));
}, [draftResult]);

useEffect(() => {
  const rawGen = localStorage.getItem("byd:generated");
  if (rawGen) {
    try {
      setGenerated(JSON.parse(rawGen));
    } catch {
      // ignore parse error
    }
  }
}, []);

useEffect(() => {
  if (!generated) return;
  localStorage.setItem("byd:generated", JSON.stringify(generated));
}, [generated]);




return (
  <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col">
    <TopBarGenerate active="draft" />

    {/* MAIN grows */}
    <main className="flex-1">
      {/* Page container */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-[96px]">
        

        {/* Main grid */}
        <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* LEFT */}
          <aside className="lg:sticky lg:top-[72px] lg:self-start">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <OptionDraftFilter
                draftCtx={ctx}
                onChangeConfig={setDraftConfig}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-3 text-[11px] text-slate-600 dark:text-slate-300 lg:hidden">
              Tip: adjust tone, audience, and structure, then click <b>Generate Draft</b>.
            </div>
          </aside>

          {/* RIGHT */}
          <section className="min-w-0">
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <DraftResult
                draftCtx={ctx}
                generated={generated}
                isLoading={genLoading}
                error={genError}
                onRegenerateAll={handleGenerate}
                scriptHtml={draftResult.scriptHtml}
                visualPrompt={draftResult.visualPrompt}
                onChangeScript={(v) =>
                  setDraftResult((p) => ({ ...p, scriptHtml: v }))
                }
                onChangeVisual={(v) =>
                  setDraftResult((p) => ({ ...p, visualPrompt: v }))
                }
              />
            </div>
          </section>
        </div>
      </div>
    </main>

    {/* ✅ Footer OUTSIDE container so it truly sticks */}
    <DraftFooter
      onViewHistory={() => console.log("view history")}
      onSaveDraft={() => console.log("save draft")}
      onFinalize={handleFinalize}
      disabled={!canFinalize || genLoading}
    />
  </div>
);

}
