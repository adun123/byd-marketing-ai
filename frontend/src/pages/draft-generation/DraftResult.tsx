import { RefreshCw, Lightbulb } from "lucide-react";
import ScriptEditorCard from "./ScriptEditorCard";
import {  useEffect} from "react";
import VisualDescriptionCard from "./VisualDescriptionCard";
import type { DraftContextPayload } from "../trends-generation/types";
import type { GenerateContentResponse } from "./types";
import DraftHookCard from "./components/DraftHookCard";
import DraftHookCardSkeleton from "./components/DraftHookCardSkeleton";


function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function DraftResult({
  draftCtx,
  generated,
  isLoading,
  error,
  scriptHtml,
  visualPrompt,
  onChangeScript,
  onChangeVisual,
  onRegenerateAll,
}: {
  draftCtx: DraftContextPayload | null;
  generated: GenerateContentResponse | null;
  isLoading?: boolean;
  error?: string | null;
  onReset?: () => void;

  scriptHtml?: string;
  visualPrompt?: string;
  onChangeScript: (v?: string) => void;
  onChangeVisual: (v?: string) => void;

  onRegenerateAll?: () => void;
}) {
  

 


  const hooks =
  generated?.headlines?.length
    ? generated.headlines.slice(0, 3).map((h) => ({
        text: h.text,
        badge: (h.type || "TRENDY").toString().toUpperCase(),
        active: false,
      }))
    : [];

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


useEffect(() => {
  if (!generated) return;

  // ✅ isi scriptHtml ke parent kalau belum ada
  const slides = generated.storyline?.slides || [];
  if (!scriptHtml && slides.length) {
    const html = slides
      .map(
        (s) =>
          `<p><strong>[SLIDE ${s.slideNumber}: ${s.title}]</strong><br/>${s.content}</p>` +
          (s.visualCue ? `<p><em>Visual:</em> ${s.visualCue}</p>` : "")
      )
      .join("");

    onChangeScript(html); // ✅ penting: set ke parent (biar kepersist)
  }

  // ✅ isi visualPrompt ke parent kalau belum ada
  const p =
    generated.visualDescription?.photo?.prompt ||
    generated.visualDescription?.video?.prompt;

  if (!visualPrompt && p) onChangeVisual(p); // ✅ ke parent
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [generated]);


const hasGenerated = !!generated;


return (
  
  <div className="w-full p-5">
    {/* Header */}
    
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        
      <div className="min-w-0">
        
        <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Campaign Draft
        </div>

        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Draft ID:{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            #HK-8821-2024
          </span>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Source:{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {draftCtx ? "Imported from Trend Insight" : "Manual / Empty"}
        </span>
      </div>
    </div>

    {/* Hooks header */}
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900 dark:text-slate-50">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
          <Lightbulb className="h-4 w-4" />
        </span>
        Hook / Headline Options
      </div>

      <button
        type="button"
        onClick={onRegenerateAll}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-2 py-1 text-[11px] font-semibold transition",
          "focus:outline-none focus:ring-2 focus:ring-[#068773]/20",
          isLoading
            ? "text-slate-400 cursor-not-allowed"
            : "text-[#068773] hover:bg-[#068773]/10"
        )}
      >
        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        {isLoading ? "Generating…" : "Regenerate"}
      </button>
    </div>

    {/* Error */}
    {error ? (
      <div className="rounded-2xl border border-rose-200/70 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 p-3 text-[12px] text-rose-700 dark:text-rose-200">
        {error}
      </div>
    ) : null}

    {/* Empty */}
    {!generated && !isLoading ? (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 text-[12px] text-slate-600 dark:text-slate-300">
        Click <b>Generate Draft</b> on the left panel to create hooks, scripts, and visual prompts.
      </div>
    ) : null}

    {/* Loading helper */}
    {isLoading ? (
      <div className="mb-3 text-[11px] text-slate-500 dark:text-slate-400">
        AI is crafting the best hooks based on trends & your configuration…
      </div>
    ) : null}

    {/* Hooks cards */}
    {isLoading ? (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <DraftHookCardSkeleton key={i} />
        ))}
      </div>
    ) : hooks.length ? (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {hooks.map((h, idx) => (
          <DraftHookCard
            key={idx}
            text={h.text}
            badge={h.badge}
            onUse={(t) => {
              const hookHtml = `
                <p>
                  <strong style="color:#068773;">HOOK:</strong>
                  “${escapeHtml(t)}”
                </p>
                <p><br/></p>
              `;

              // append hook ke atas, lalu lanjut isi script yang sudah ada
              const next = `${hookHtml}${scriptHtml || ""}`;
              onChangeScript(next);

              // optional: fokus ke editor
              requestAnimationFrame(() => {
                const el = document.querySelector('[data-script-editor="true"]') as HTMLElement | null;
                el?.focus?.();
              });
            }}
          />
        ))}
      </div>

    ) : null}

    {/* Script + Visual */}
    {!hasGenerated && !isLoading ? (
  <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 p-4 text-[12px] text-slate-600 dark:text-slate-300">
      <div className="font-semibold text-slate-900 dark:text-slate-50">Script Editor</div>
      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        Belum ada script. Klik <b>Generate Draft</b> di panel kiri.
      </div>
    </div>

    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 p-4 text-[12px] text-slate-600 dark:text-slate-300">
      <div className="font-semibold text-slate-900 dark:text-slate-50">Visual Prompt</div>
      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        Belum ada visual prompt. Klik <b>Generate Draft</b> di panel kiri.
      </div>
    </div>
  </div>
) : (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="animate-[fadeUp_.18s_ease-out]">
        <ScriptEditorCard
          value={scriptHtml}
          onChange={onChangeScript}
          onPolish={(plain) => console.log("POLISH:", plain)}
          isLoading={isLoading}
        />
      </div>

      <div className="animate-[fadeUp_.18s_ease-out]">
        <VisualDescriptionCard
          value={visualPrompt}
          onChange={onChangeVisual}
          onPolish={(plain) => console.log("polish:", plain)}
        />
      </div>
    </div>
    )}
  </div>
  
);
}