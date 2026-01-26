import {  useMemo, useState } from "react";
import TrendsFilters from "./TrendsFilters";
import TrendsResults from "./TrendsResults";
import type { TrendsForm, TrendsIdeas, TrendSnapshot } from "./types";
import { generateMockIdeas } from "./mock";

function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
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

  const [ideas, setIdeas] = useState<TrendsIdeas | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rightMode, setRightMode] = useState<"snapshot" | "brainstorm">("snapshot");

  //  snapshot state
  const [snapshot, setSnapshot] = useState<TrendSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const title = useMemo(() => "Trending Content (Brainstorm)", []);
  const API_BASE = (import.meta.env.VITE_API_BASE?.trim() || "/api") as string;

  // fetch snapshot (AI trend insights)
  async function fetchTrendInsights(signal?: AbortSignal) {
    setSnapshotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trends/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          platform: form.platform,
          contentType: form.contentType,
          targetAudience: form.targetAudience,
          product: form.product,
          brand: form.brand,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`INSIGHTS ${res.status}: ${text || res.statusText}`);
      }

      const data = (await res.json()) as TrendSnapshot;
      setSnapshot(data);
    } catch (e) {
      // kalau abort, diam
      if ((e as any)?.name === "AbortError") return;
      console.error("SNAPSHOT ERROR:", e);
      setSnapshot(null);
    } finally {
      setSnapshotLoading(false);
    }
  }


  async function onFetchSnapshot() {
  setRightMode("snapshot");
  await fetchTrendInsights();
}


  async function onBrainstorm() {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/image/marketing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: "ideas" }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${text || res.statusText}`);
      }

      const data = await res.json();
      const ideasFromApi = data?.ideas ?? data;

      setIdeas(normalizeTrendsIdeas(ideasFromApi));
      setRightMode("brainstorm");

    } catch (e) {
      console.error("BRAINSTORM ERROR:", e);
      setIdeas(generateMockIdeas(form));
     

      alert("API error / belum siap. Pakai mock dulu ya.");
    } finally {
      setIsLoading(false);
    }
  }

  function normalizeTrendsIdeas(x: any): TrendsIdeas {
    const safeArr = (v: any) => (Array.isArray(v) ? v.filter(Boolean).map(String) : []);
    const safeArrArr = (v: any) =>
      Array.isArray(v) ? v.map((row) => (Array.isArray(row) ? row.filter(Boolean).map(String) : [])).filter(Boolean) : [];

    return {
      hooks: safeArr(x?.hooks),
      visualBriefs: safeArr(x?.visualBriefs),

      angles: safeArr(x?.angles),
      angleHowTos: safeArrArr(x?.angleHowTos), //  fix: ini sebelumnya belum masuk

      captions: safeArr(x?.captions),
      ctas: safeArr(x?.ctas),
      hashtags: safeArr(x?.hashtags),
    };
  }

  function onUseIdea(text: string) {
    if (!text) return;
    alert(`Use idea:\n\n${text}`);
  }

  // helper buat snapshot buttons
  function useMessage(msg: string) {
    setForm((prev) => ({ ...prev, message: msg }));
  }
  function appendHint(hint: string) {
    setForm((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message}\n\nHint: ${hint}` : `Hint: ${hint}`,
    }));
  }

  return (
    <div className="mx-auto w-full px-4 py-6">
      <div className="mb-6 flex items-start gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-0.5 inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          ← Back
        </button>

        <div>
          <div className="text-lg font-bold tracking-tight text-slate-900">{title}</div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-16 lg:self-start">
          <TrendsFilters
            value={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            onBrainstorm={onBrainstorm}
            isLoading={isLoading}
          />
        </div>

        <section className={cn("min-w-0")}>
          <TrendsResults
            ideas={ideas}
            isLoading={isLoading}
            onUseIdea={onUseIdea}
            snapshot={snapshot}
            snapshotLoading={snapshotLoading}
            onUseMessage={useMessage}
            onAppendHint={appendHint}
            rightMode={rightMode}
            onChangeMode={setRightMode}
              onFetchSnapshot={onFetchSnapshot}
          />

        </section>
      </div>
    </div>
  );
}
