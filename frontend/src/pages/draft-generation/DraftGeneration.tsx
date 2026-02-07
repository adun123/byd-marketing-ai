import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TopBarGenerate from "../../components/layout/TopBarGenerate";
import DraftResult from "./DraftResult";
import OptionDraftFilter from "./OptionDraftFilter";
import DraftFooter from "./DraftFooter";

import type { DraftContextPayload } from "../trends-generation/types";
import { loadDraftContext } from "../trends-generation/utils/draftContextStorage";

import type { GenerateContentResponse } from "./types";
import type { FinalizeContentPayload } from "../content-generation/types";
import { saveContentCtx } from "../content-generation/utils/contentContextStorage";

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

type DraftResultState = {
  scriptHtml?: string;
  visualPrompt?: string;
};

const LS_KEYS = {
  draftResult: "byd:draft-result",
  generated: "byd:generated",
} as const;

/** Safely parse JSON string; returns null if invalid. */
function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function DraftGeneration() {
  const navigate = useNavigate();
  const location = useLocation();

  const navCtx = location.state as DraftContextPayload | null;
  const ctx = navCtx || loadDraftContext();

  const API_BASE = useMemo(
    () => (import.meta.env.VITE_API_BASE?.trim() || "/api") as string,
    []
  );

  const [draftConfig, setDraftConfig] = useState<DraftConfig | null>(null);

  const [draftResult, setDraftResult] = useState<DraftResultState>({});
  const [generated, setGenerated] = useState<GenerateContentResponse | null>(null);

  const [isGenerating, setIsGenerating] = useState(false); // guard: anti double-click
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const canFinalize = useMemo(() => {
    const edited = (draftResult.visualPrompt || "").trim();

    const photoPrompt = (generated?.visualDescription?.photo?.prompt || "").trim();
    const videoPrompt = (generated?.visualDescription?.video?.prompt || "").trim();

    return Boolean(edited || photoPrompt || videoPrompt);
  }, [draftResult.visualPrompt, generated]);

  /** Reset semua state hasil generate & editor + bersihkan localStorage cache. */
  function handleResetDraft() {
    setDraftResult({ scriptHtml: "", visualPrompt: "" });
    setGenerated(null);

    setGenError(null);
    setGenLoading(false);
    setIsGenerating(false);

    localStorage.removeItem(LS_KEYS.draftResult);
    localStorage.removeItem(LS_KEYS.generated);
  }

  /** Ambil prompt final (prioritas: hasil edit user → fallback dari generated). */
  function getFinalPrompt(): string {
    const edited = (draftResult.visualPrompt || "").trim();
    if (edited) return edited;

    const photoPrompt = (generated?.visualDescription?.photo?.prompt || "").trim();
    if (photoPrompt) return photoPrompt;

    const videoPrompt = (generated?.visualDescription?.video?.prompt || "").trim();
    if (videoPrompt) return videoPrompt;

    return "";
  }

  /** Navigate ke Content Generator dengan payload dari draft (script + prompt final). */
  function handleFinalize() {
    const prompt = getFinalPrompt();
    if (!prompt) {
      console.warn("FinalizeContent: prompt kosong");
      return;
    }

    const payload: FinalizeContentPayload = {
      from: "draft",
      draftId: generated?.draftId,
      topic: generated?.topic,
      imagePrompt: prompt,
      scriptPreview: (draftResult.scriptHtml || "").trim(),
      style: generated?.visualDescription?.photo?.style,
      aspectRatio: generated?.visualDescription?.photo?.aspectRatio,
      brand: ctx?.form?.brand || undefined,
    };

    saveContentCtx(payload);
    navigate("/content-generator", { state: payload });
  }

  /** Generate draft content dari API berdasarkan config yang dipilih user. */
  async function handleGenerate() {
    // reset editor result dulu biar output lama nggak “nempel”
    setDraftResult({ scriptHtml: "", visualPrompt: "" });

    // guard anti double click
    if (isGenerating) return;

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

      if (!topic) {
        setGenError("Topic kosong. Pilih minimal 1 term atau isi manual topic.");
        return;
      }

      const keyTopic =
        draftConfig.sourceMode === "trend"
          ? (draftConfig.terms[0] || "").replace(/\s+/g, "")
          : topic.replace(/\s+/g, "");

      const extraTerms =
        draftConfig.sourceMode === "trend" ? draftConfig.terms.slice(1).join(", ") : "";

      const targetKeywords = [draftConfig.keywords, extraTerms].filter(Boolean).join(", ");

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

      const json = safeJsonParse<GenerateContentResponse>(raw);
      if (!json) {
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

  /** Persist draftResult ke localStorage setiap kali user edit hasil. */
  useEffect(() => {
    if (!draftResult.scriptHtml && !draftResult.visualPrompt) return;
    localStorage.setItem(LS_KEYS.draftResult, JSON.stringify(draftResult));
  }, [draftResult]);

  /** Load cached generated output dari localStorage sekali saat mount. */
  useEffect(() => {
    const rawGen = localStorage.getItem(LS_KEYS.generated);
    if (!rawGen) return;

    const parsed = safeJsonParse<GenerateContentResponse>(rawGen);
    if (parsed) setGenerated(parsed);
  }, []);

  /** Persist generated ke localStorage setelah generate selesai (hindari save saat loading). */
  useEffect(() => {
    if (!generated) return;
    if (genLoading) return;
    localStorage.setItem(LS_KEYS.generated, JSON.stringify(generated));
  }, [generated, genLoading]);


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
                 onReset={handleResetDraft}
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
