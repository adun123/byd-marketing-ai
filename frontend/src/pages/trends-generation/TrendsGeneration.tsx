import { useEffect, useState } from "react";
import TrendsFilters from "./TrendsFilters";
import TrendsSnapshot from "./TrendsSnapshot";
import { useNavigate } from "react-router-dom";
import TopBarGenerate from "../../components/layout/TopBarGenerate";
import type { TrendsForm, TrendSnapshot ,ViralSnippet, ViralSnippetsResponse,DraftContextPayload, Sentiment  } from "./types";
import ViralSnippets from "./ViralSnippets";
import { saveDraftContext, loadDraftContext, clearDraftContext } from "./utils/draftContextStorage";
import { Trash2 } from "lucide-react";

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

export default function TrendsGeneration() {
  const [form, setForm] = useState<TrendsForm>({
    platform: "instagram-post",
    contentType: "edu-ent",
    targetAudience: "genz-balanced",
    product: "",
    brand: "",
    message: "",
  });

 const navigate = useNavigate();

  // snapshot state
  const [snapshot, setSnapshot] = useState<TrendSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const API_BASE = (import.meta.env.VITE_API_BASE?.trim() || "/api") as string;


  const [viral, setViral] = useState<ViralSnippet[]>([]);
  const [viralLoading, setViralLoading] = useState(false);

  useEffect(() => {
    const saved = loadDraftContext();
    if (!saved) return;

    // restore minimal yang kamu butuhkan
    if (saved.form) setForm(saved.form);
    if (saved.snapshot) setSnapshot(saved.snapshot);
    if (saved.viralSnippets) setViral(saved.viralSnippets as ViralSnippet[]);
    // kalau kamu punya state derived, gak perlu simpan terpisah—bisa dibangun ulang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchViralSnippets() {
    setViralLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trends/viral-snippets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json: ViralSnippetsResponse = await res.json();
      setViral(json.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setViralLoading(false);
    }
  }

  // === HANDLERS ===


  async function onFetchSnapshot() {
  setSnapshotLoading(true);
  try {
    const res = await fetch(`${API_BASE}/trends/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Snapshot API error:", json);
      throw new Error(json?.error || "Failed to fetch snapshot");
    }

    setSnapshot(json);
    await fetchViralSnippets();

  } catch (e) {
    console.error(e);
  } finally {
    setSnapshotLoading(false);
  }
}


  function onUseMessage(msg: string) {
    setForm((prev) => ({ ...prev, message: msg }));
  }

  function onAppendHint(hint: string) {
    setForm((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n${hint}` : hint,
    }));
  }


 function buildDraftContext(): DraftContextPayload {
  const snap = snapshot;

  const baseTerms = snap
    ? [
        ...snap.trendTopics.map((t) => t.title),
        ...snap.hookPatterns.map((h) => h.pattern),
        ...snap.anglePatterns.map((a) => a.angle),
      ].filter(Boolean).slice(0, 10)
    : [];

  const fallbackSentiment = baseTerms.slice(0, 5).map((name, idx) => {
    const score = clamp(92 - idx * 9 + (idx % 2 ? -6 : 4));
    const sentiment: Sentiment =
      idx === 0 || idx === 4 ? "Negative" : idx === 2 ? "Neutral" : "Positive";
    return { name, score, sentiment };
  });

  return {
    form,
    snapshot: snap,
    viralSnippets: (viral || []).slice(0, 20),
    derived: {
      terms: baseTerms,
      topSentiment: snap?.topSentiment?.length ? snap.topSentiment : fallbackSentiment,
    },
  };
}
  useEffect(() => {
    // simpan kalau sudah ada sesuatu (biar gak nyimpen kosong)
    if (!snapshot && (!viral || viral.length === 0)) return;

    const ctx = buildDraftContext();
    saveDraftContext(ctx);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, snapshot, viral]);
  
    function onGoDraft() {
    const ctx = buildDraftContext();
    saveDraftContext(ctx); //  persist
    navigate("/draft-generator", { state: ctx }); //  route sesuai TopBar
  }


  return (
    <div className="mx-auto w-full px-4 ">
      <TopBarGenerate active="trend" />
      <button
        type="button"
        onClick={() => {
          clearDraftContext();
          setSnapshot(null);
          setViral([]);
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
        title="Hapus data draft context"
      >
        <Trash2 className="h-4 w-4 text-rose-600" />
        Reset
      </button>


      <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* LEFT FILTER */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <TrendsFilters
            value={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            onBrainstorm={onFetchSnapshot}   //  ganti ini
             isLoading={snapshotLoading} 
          />
        </div>

        {/* RIGHT RESULT */}
        <section className="min-w-0">
            {snapshotLoading ? (
              // LOADING SKELETON
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-100" />
                    <div className="h-3 w-56 rounded bg-slate-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="h-48 rounded-2xl bg-slate-100" />
                  <div className="h-48 rounded-2xl bg-slate-100" />
                </div>
              </div>
            ) : snapshot ? (
              // REAL SNAPSHOT
               <div className="space-y-4">
                <TrendsSnapshot data={snapshot} onUseMessage={onUseMessage} onAppendHint={onAppendHint} />
                <ViralSnippets items={viral} onViewAll={() => console.log("view all")} />
              
                {/*  tombol gabungan context */}
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[12px] text-slate-600">
                      Generate draft dari <b>Terms</b>, <b>Sentiment</b>, dan <b>Viral Snippets</b>.
                    </div>

                    <button
                      type="button"
                      onClick={onGoDraft}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#068773] to-[#0fb9a8] px-4 py-2 text-[12px] font-semibold text-white hover:opacity-95"
                    >
                      Generate Draft →
                    </button>
                  </div>
                </div>
              
              </div>
              
            ) : (
              // EMPTY BUT NOT EMPTY STATE
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700">
                    ⏳
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Trend Snapshot
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Pilih konteks di panel kiri lalu klik <b>Refresh Trends</b>.
                    </div>
                  </div>
                </div>

                {/* lightweight placeholder blocks */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Trending terms & sentiment akan muncul di sini.
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Ringkasan insight & pola konten.
                  </div>
                </div>
              </div>
            )}
        </section>
       
      </div>




    </div>
  );
}
