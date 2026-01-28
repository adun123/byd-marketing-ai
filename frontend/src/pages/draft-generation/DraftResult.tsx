import { RefreshCw, Lightbulb } from "lucide-react";
import ScriptEditorCard from "./ScriptEditorCard";
import { useState , useEffect} from "react";
import VisualDescriptionCard from "./VisualDescriptionCard";
import type { DraftContextPayload } from "../trends-generation/types";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

export default function DraftResult({ draftCtx }: { draftCtx: DraftContextPayload | null }) {

  
    const terms = draftCtx?.derived?.terms ?? [];
    const sentiments = draftCtx?.derived?.topSentiment ?? [];
    const topTerm = terms[0] || "Topik Viral";
    const secondTerm = terms[1] || "Insight";
    const neg = sentiments.find((s) => s.sentiment === "Negative")?.name;
    const pos = sentiments.find((s) => s.sentiment === "Positive")?.name;
    const [visualPrompt, setVisualPrompt] = useState<string | undefined>(undefined);
    const [scriptHtml, setScriptHtml] = useState<string | undefined>(undefined);
    const hooks = [
  {
    text: `STOP SCROLLING: ${topTerm} lagi rame — ini cara bikin konten yang ikut keangkat!`,
    badge: "TRENDY",
    active: false,
  },
  {
    text: pos
      ? `Kenapa orang suka banget "${pos}"? Ini angle yang bisa kamu pakai hari ini.`
      : `5 angle paling gampang untuk ngonten soal ${topTerm} (tanpa ribet).`,
    badge: "HIGH CLICKRATE",
    active: false,
  },
  {
    text: neg
      ? `Banyak yang protes soal "${neg}" — coba format ini biar kontenmu kebaca kredibel.`
      : `Myth vs Fact: ${secondTerm} — bikin audiens langsung “oh gitu ya”.`,
    badge: "DIRECT",
    active: false,
  },
];

useEffect(() => {
  if (!draftCtx) return;

  if (!scriptHtml) {
    const t1 = terms[0] || "Topik Viral";
    const t2 = terms[1] || "Angle";
    const snippet = draftCtx.viralSnippets?.[0]?.title || "snippet viral teratas";

    setScriptHtml(
      `<p><strong>[SLIDE 1: HOOK]</strong><br/>Buka dengan: <em>${hooks[0].text}</em></p>
       <p><strong>[SLIDE 2: CONTEXT]</strong><br/>Jelaskan singkat kenapa ${t1} naik: ambil dari tren & komentar netizen.</p>
       <p><strong>[SLIDE 3: VALUE]</strong><br/>Kasih 3 poin: ${t1}, ${t2}, dan contoh cepat dari "${snippet}".</p>
       <p><strong>[SLIDE 4: CTA]</strong><br/>Ajak audiens komentar/share: “Kamu tim setuju atau nggak?”</p>`
    );
  }

  if (!visualPrompt) {
    const t = terms[0] || "viral trend";
    setVisualPrompt(
      `Cinematic social content, clean modern layout, focus on "${t}", high contrast typography, soft gradient background, product-friendly, Indonesian audience style, 4:5 ratio, sharp details.`
    );
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [draftCtx]);


  return (
    <div className="mx-auto w-full px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold tracking-tight text-slate-900">
            New Campaign Draft
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Draft ID : <span className="font-semibold">#HK-8821-2024</span>
          </div>
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Source:{" "}
          <span className="font-semibold">
            {draftCtx ? "Import from Trend Insight" : "Manual / Empty"}
          </span>
        </div>
      </div>

      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/10">
                <Lightbulb className="h-4 w-4 text-emerald-600" />
            </span>
            Hook / Headline Options
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate All
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {hooks.map((h, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-2xl border bg-white p-5 transition",
              h.active
                ? "border-emerald-600 shadow-[0_14px_40px_-26px_rgba(5,150,105,0.45)]"
                : "border-slate-200 hover:shadow-[0_14px_40px_-26px_rgba(15,23,42,0.25)]"
            )}
          >
            <div className="text-sm font-semibold leading-relaxed text-slate-900">
              “{h.text}”
            </div>

            <div className="mt-4">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  h.badge === "HIGH CLICKRATE"
                    ? "bg-emerald-600/10 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {h.badge}
              </span>
            </div>
          </div>
        ))}
      </div>


      {/* Storyline & Script + Visual Description */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Storyline & Script */}
            <ScriptEditorCard
                value={scriptHtml}
                onChange={setScriptHtml}
                onPolish={(plain) => {
                    console.log("POLISH REQUEST:", plain);
                    // nanti sambung ke API AI → lalu setScriptHtml(updatedHtml)
                }}
            />

        {/* RIGHT: Visual Description */}
         <VisualDescriptionCard
          value={visualPrompt}
          onChange={setVisualPrompt}
          onPolish={(plain) => console.log("polish prompt:", plain)}
        />
        

        
        </div>

    </div>
  );
}
