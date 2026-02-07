// src/pages/content-generation/components/OutputCanvasCard.tsx
import * as React from "react";
import { Download, Pencil, Sparkles, Trash2, } from "lucide-react";
import type { GeneratedOutput } from "./types";
import MaskEditor from "./MaskEditor";








function cn(...s: Array<string | undefined | false>) {
  return s.filter(Boolean).join(" ");
}

type CanvasItem = GeneratedOutput;

type Props = {
  title?: string;
  subtitle?: string;

  API_BASE: string; // NEW: buat hit /image/edit
  items: CanvasItem[];
  onAddItems: (items: CanvasItem[]) => void; // NEW: push hasil edit ke parent

  onClear?: () => void;
  aspect?: "1:1" | "4:5" | "9:16" | "16:9";

  // main actions
  onScaleUp?: (item: CanvasItem) => void;
  onExport?: (item: CanvasItem) => void;
  onSaveDraft?: (item: CanvasItem) => void;

  // optional util
  onDownload?: (src: string, filename: string) => void;

  // display meta (optional)
  metaLeft?: string; // e.g. "1080 x 1080"
  metaMid?: string; // e.g. "2.4 MB"

  isGenerating?: boolean;
};

function aspectClass(a?: "1:1" | "4:5" | "9:16" | "16:9") {
  switch (a) {
    case "4:5":
      return "aspect-[4/5]";
    case "9:16":
      return "aspect-[9/16]";
    case "16:9":
      return "aspect-[16/9]";
    case "1:1":
    default:
      return "aspect-square";
  }
}

// helper: dataURL -> File
function dataUrlToFile(dataUrl: string, filename = "edit.png") {
  // support kalau src sudah full data url
  const [meta, b64] = dataUrl.split(",");
  const mime = meta?.match(/data:(.*?);base64/)?.[1] || "image/png";
  const bin = atob(b64 || "");
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new File([arr], filename, { type: mime });
}

export default function OutputCanvasCard({
  title = "Output Canvas",
  subtitle = "Preview generated content",
  API_BASE,
  items,
  onAddItems,
  aspect,
  onClear,
  // onScaleUp,
  // onExport,
  // onSaveDraft,
  // onDownload,
  metaLeft = "1080 x 1080",
  metaMid = "—",
 isGenerating ,
}: Props) {
  const latest = items?.[0];
  

  const src = latest?.imageUrl
    ? latest.imageUrl
    : latest?.base64
    ? `data:image/png;base64,${latest.base64}`
    : "";

  const updatedLabel = latest
    ? `Terakhir: ${new Date(latest.createdAt).toLocaleTimeString("id-ID")}`
    : "Belum ada output";

  // EDIT STATE
  const [isEditing, setIsEditing] = React.useState(false);
  const [editPrompt, setEditPrompt] = React.useState("");
  const [preserveStyle, setPreserveStyle] = React.useState(true);
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState<string | null>(null);

  // ini const scale up
  const [upscaleLoading, setUpscaleLoading] = React.useState(false);
  const [, setUpscaleError] = React.useState<string | null>(null);

  //untuk maskedit:
  const [isMasking, setIsMasking] = React.useState(false);
  const [maskPrompt, setMaskPrompt] = React.useState("");
  const [maskLoading, setMaskLoading] = React.useState(false);
  const [maskError, setMaskError] = React.useState<string | null>(null);

  const [brushSize, setBrushSize] = React.useState(28);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = items.find((x) => x.id === selectedId) || items[0];
  const selectedSrc = selected?.imageUrl || selected?.base64 ? (selected.imageUrl ?? `data:image/png;base64,${selected.base64}`) : src;


  React.useEffect(() => {
    // kalau latest berubah, reset error (biar bersih)
    setEditError(null);
  }, [latest?.id]);

  function aspectRatioCss(a?: "1:1" | "4:5" | "9:16" | "16:9") {
  switch (a) {
    case "4:5":
      return "4 / 5";
    case "9:16":
      return "9 / 16";
    case "16:9":
      return "16 / 9";
    case "1:1":
    default:
      return "1 / 1";
  }
}

async function handleApplyMaskEdit(
  { maskBlob, prompt }: { maskBlob: Blob; prompt?: string },
  target: CanvasItem // atau GeneratedOutput (yang punya id, imageUrl/base64, prompt)
) {
  if (!target) return;

  // ambil src dari item yang dipilih
  const targetSrc =
    (target as any).imageUrl ||
    ((target as any).base64 ? `data:image/png;base64,${(target as any).base64}` : null);

  if (!targetSrc) return;

  setMaskLoading(true);
  setMaskError(null);

  try {
    // 1) ambil image target sebagai blob
    const imageRes = await fetch(targetSrc);
    if (!imageRes.ok) throw new Error(`Failed to fetch image (${imageRes.status})`);
    const imageBlob = await imageRes.blob();

    // 2) prepare multipart
    const fd = new FormData();
    fd.append("image", imageBlob, `image-${target.id}.png`);
    fd.append("mask", maskBlob, `mask-${target.id}.png`);
    if (prompt?.trim()) fd.append("prompt", prompt.trim());

    // 3) call endpoint
    const res = await fetch(`${API_BASE}/image/mask-edit`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `Mask edit failed (${res.status})`);
    }

    const ct = res.headers.get("content-type") || "";

    // kalau backend balikin binary image langsung
    if (ct.startsWith("image/")) {
      const outBlob = await res.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Failed to read image blob"));
        r.readAsDataURL(outBlob);
      });

      const b64 = dataUrl.split(",")[1] || "";

      const newItem: CanvasItem = {
        ...(target as any),
        id: crypto.randomUUID(), // ✅ id baru biar jadi item baru
        createdAt: Date.now(),
        imageUrl: dataUrl,
        base64: b64 || undefined,
        prompt: prompt?.trim() || (target as any).prompt,
      } as any;

      onAddItems([newItem]);
      setIsMasking(false);
      return;
    }

    // default JSON
    const json = await res.json();
    const first = Array.isArray(json?.images) ? json.images[0] : null;

    const returnedUrl: string | null = first?.url ?? null;
    let returnedBase64: string | null = first?.base64 ?? null;

    if (returnedBase64) returnedBase64 = String(returnedBase64).replace(/\s+/g, "");

    let finalSrc: string | null = null;
    if (returnedBase64) {
      finalSrc = `data:image/png;base64,${returnedBase64}`;
    } else if (returnedUrl) {
      const bust = `v=${Date.now()}`;
      finalSrc = returnedUrl.includes("?") ? `${returnedUrl}&${bust}` : `${returnedUrl}?${bust}`;
    }

    if (!finalSrc) {
      throw new Error("No image returned from /mask-edit (missing images[0].url/base64)");
    }

    const newItem: CanvasItem = {
      ...(target as any),
      id: crypto.randomUUID(), // ✅ id baru (hasil edit jadi item baru)
      createdAt: Date.now(),
      imageUrl: finalSrc,
      base64: returnedBase64 || undefined,
      prompt: prompt?.trim() || (target as any).prompt,
    } as any;

    onAddItems([newItem]);
    setIsMasking(false);
  } catch (e: any) {
    setMaskError(e?.message || "Mask edit error");
  } finally {
    setMaskLoading(false);
  }
}



  //ini bgian scale up
  async function handleScaleUpClick(target: GeneratedOutput) {
  if (!target) return;

  const targetSrc =
    target.imageUrl ||
    (target.base64 ? `data:image/png;base64,${target.base64}` : "");

  if (!targetSrc) return;

  setUpscaleLoading(true);
  setUpscaleError(null);

  try {
    // siapkan file
    let file: File;
    if (targetSrc.startsWith("data:image/")) {
      file = dataUrlToFile(targetSrc, `to-upscale-${target.id}.png`);
    } else {
      const resp = await fetch(targetSrc);
      const blob = await resp.blob();
      file = new File([blob], `to-upscale-${target.id}.png`, {
        type: blob.type || "image/png",
      });
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("preset", "4k");
    fd.append("quality", "95");

    const res = await fetch(`${API_BASE}/image/upscale`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${t}`.trim());
    }

    const data = await res.json();

    if (data?.success && data?.image?.base64) {
      const b64 = String(data.image.base64).replace(/\s+/g, "");
      const imageUrl = `data:image/png;base64,${b64}`;

      const mapped: GeneratedOutput[] = [
        {
          id: crypto.randomUUID(),
          prompt: `${target.prompt} (Upscaled ${data?.upscaled?.width}x${data?.upscaled?.height})`,
          createdAt: Date.now(),
          imageUrl,
          base64: b64,
        },
      ];

      onAddItems(mapped); // default: nambah versi baru (non-destruktif)
      return;
    }

    throw new Error(data?.error || "Upscale failed: no image returned");
  } catch (e: any) {
    setUpscaleError(e?.message || "Upscale failed");
  } finally {
    setUpscaleLoading(false);
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("Failed to read file"));
    r.onload = () => resolve(String(r.result || ""));
    r.readAsDataURL(file);
  });
}

  
// ini bagian edit (selected-aware)
async function handleSubmitEdit(target: GeneratedOutput) {
  if (!target) return;

  const p = editPrompt.trim();
  if (p.length < 2) return;

  const targetSrc =
    target.imageUrl ||
    (target.base64 ? `data:image/png;base64,${target.base64}` : "");

  if (!targetSrc) return;

  // harus data-url, kalau src bukan data-url (misal /outputs/...), kita fetch dulu
  let file: File;

  try {
    if (targetSrc.startsWith("data:image/")) {
      file = dataUrlToFile(targetSrc, `to-edit-${target.id}.png`);
    } else {
      // fallback: fetch url -> blob -> file
      const resp = await fetch(targetSrc);
      const blob = await resp.blob();
      file = new File([blob], `to-edit-${target.id}.png`, {
        type: blob.type || "image/png",
      });
    }
  } catch (e) {
    setEditError("Gagal menyiapkan file gambar untuk edit.");
    return;
  }

  setEditLoading(true);
  setEditError(null);

  try {
    const dataUrl = await fileToDataUrl(file);

    const res = await fetch(`${API_BASE}/image/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: dataUrl,                 // ✅ yang dibaca server
        prompt: p,
        preserveStyle: preserveStyle ? "true" : "false",
      }),
    });


    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${t}`.trim());
    }

    const data = await res.json();

    if (data?.success && Array.isArray(data.images) && data.images.length > 0) {
      const mapped: GeneratedOutput[] = data.images.map((img: any) => {
        const b64 = String(img.base64 || "").replace(/\s+/g, "");
        const isJpeg = b64.startsWith("/9j/");
        const mime = isJpeg ? "image/jpeg" : "image/png";

        return {
          id: crypto.randomUUID(),
          prompt: p,
          createdAt: Date.now(),
          imageUrl: b64 ? `data:${mime};base64,${b64}` : undefined,
          base64: b64 || undefined,
        };
      });

      onAddItems(mapped);

      // close editor
      setIsEditing(false);
    } else {
      throw new Error(data?.error || "Edit gagal: tidak ada gambar dari server.");
    }
  } catch (e: any) {
    setEditError(e?.message || "Edit gagal.");
  } finally {
    setEditLoading(false);
  }
}

    React.useEffect(() => {
      console.log("LATEST ID:", latest?.id);
      console.log("SRC head:", src?.slice(0, 30));
      console.log("SRC len:", src?.length);
    }, [latest?.id, src]);


    //ini buat save
  function saveDraftLocal(item: { prompt?: string; imageUrl?: string; base64?: string }) {

      const key = "cg.savedDrafts";
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const draft = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        prompt: item.prompt,
        imageUrl: item.imageUrl,
        base64: item.base64,
      };
      localStorage.setItem(key, JSON.stringify([draft, ...list].slice(0, 50)));
    }

    // buat hapus:
    async function downloadImage(src: string, filename: string) {
  // kalau data URL, bisa langsung
  if (src.startsWith("data:image/")) {
    const a = document.createElement("a");
    a.href = src;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  // kalau URL biasa, fetch blob biar aman
  const res = await fetch(src);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

// ini edit mask:


  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div>
          <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onClear?.()}
          className={cn(
            "inline-flex items-center gap-2 rounded-2xl border px-3 py-2",
            "border-rose-200 bg-rose-50 text-rose-700",
            "text-[11px] font-semibold hover:bg-rose-100"
          )}
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* body */}
      <div className="p-4">
          {/* Preview block */}
          <div className="relative rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-4">
            {/* LOADING OVERLAY */}
            {isGenerating ? (
              <div className="absolute inset-0 z-20 grid place-items-center rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/70 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#068773]/10 text-[#068773]">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
                        Generating…
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                        Please wait, we’re creating your image(s).
                      </div>
                    </div>
                  </div>

                  {/* progress bar (indeterminate) */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-[#068773]" />
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    Tip: carousel might take longer for multiple slides.
                  </div>
                </div>
              </div>
            ) : null}

            {items.length === 0 ? (
              isGenerating ? (
                // ✅ skeleton while generating but no items yet
                <div className="flex min-h-[320px] items-center justify-center">
                  <div className="w-full max-w-[520px] overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/40">
                    <div className={cn("relative w-full bg-slate-200/60 dark:bg-slate-800/40", aspectClass(aspect))}>
                      <div className="absolute inset-0 animate-pulse" />
                    </div>
                    <div className="p-4">
                      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800/70" />
                      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800/70" />
                    </div>
                  </div>
                </div>
              ) : (
                // ✅ existing empty state
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-50">
                    No output yet
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Write a prompt on the left, then click <b>Generate</b>.
                  </div>

                  <div className="mx-auto mt-4 w-full max-w-md rounded-2xl border border-[#068773]/20 bg-white/70 dark:bg-slate-900/60 px-4 py-3 text-left">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#068773]">
                      Example prompt
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      “BYD Seal electric car in a futuristic city at sunset, cinematic lighting”
                    </div>
                  </div>
                </div>
              )
            ) : (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[520px]">
                <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.35)]">
                  {/* IMAGE + HOVER ACTIONS */}
                  <div className={cn("relative w-full group bg-black/5", aspectClass(aspect))}>
                    {src ? (
                        <div className={cn("relative w-full group overflow-hidden bg-slate-100 dark:bg-slate-950", aspectClass(aspect))}>
                          <img
                            key={selected?.id}
                            src={selectedSrc}
                            alt="Generated"
                            className="absolute inset-0 h-full w-full object-cover"
                            draggable={false}
                          />

                        </div>
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[11px] text-slate-400">
                        Generated Preview
                      </div>
                    )}

                    {/* Hover pencil button */}
                    {selectedSrc  && selected  ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMaskPrompt("Hapus objek yang di-mask, isi background tetap natural dan realistis.");
                          setIsMasking(true);
                          setSelectedId(selected.id);
                        }}
                        className={cn(
                          "absolute right-3 top-3 z-20",
                          "opacity-0 group-hover:opacity-100 transition",
                          "inline-flex items-center gap-2 rounded-2xl px-3 py-2",
                          "border border-slate-200/70 dark:border-slate-800/70",
                          "bg-white/85 dark:bg-slate-950/70 backdrop-blur",
                          "text-[11px] font-semibold text-slate-700 dark:text-slate-200",
                          "hover:bg-white dark:hover:bg-slate-900"
                        )}
                        title="Mask edit (hapus bagian tertentu)"
                      >
                        <Pencil className="h-4 w-4" />
                        Mask
                      </button>
                    ) : null}
                  </div>

                </div>
                {/* THUMBNAILS (Carousel) */}
                {items.length > 1 ? (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                        Slides
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {items.length} images
                      </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {items.map((it, idx) => {
                        const tSrc =
                          it.imageUrl ||
                          (it.base64 ? `data:image/png;base64,${it.base64}` : undefined);

                        const active = it.id === selected?.id;

                        return (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => setSelectedId(it.id)}
                            className={cn(
                              "relative shrink-0 overflow-hidden rounded-2xl border",
                              "h-20 w-20 md:h-24 md:w-24",
                              active
                                ? "border-[#068773]/40 ring-2 ring-[#068773]/25"
                                : "border-slate-200/70 dark:border-slate-800/70 hover:brightness-95"
                            )}
                            title={`Slide ${idx + 1}`}
                          >
                            {tSrc ? (
                              <img
                                src={tSrc}
                                alt={`Slide ${idx + 1}`}
                                className="h-full w-full object-cover"
                                draggable={false}
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[10px] text-slate-400">
                                No image
                              </div>
                            )}

                            <div className="absolute bottom-1 right-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white">
                              {idx + 1}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}


                {/* actions */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => selected && handleScaleUpClick(selected)}
                    disabled={!selected || !selectedSrc || upscaleLoading}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2",
                      "text-[11px] font-semibold transition",
                      "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                      "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40",
                      (!selected || !selectedSrc) && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    {upscaleLoading ? "Upscaling..." : "Scale Up"}
                  </button>


                  <button
                    type="button"
                    disabled={!selected || !selectedSrc}
                    onClick={() => {
                      if (!selected || !selectedSrc) return;
                      setEditError(null);
                      setIsEditing((v) => !v);
                      setEditPrompt((p) =>
                        p ||
                        "Buat lebih cinematic, lighting lebih dramatis, tetap realistis, kualitas iklan profesional."
                      );
                    }}

                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2",
                      "text-[11px] font-semibold transition",
                      "border border-[#068773]/20 bg-[#068773]/10 text-[#068773]",
                      "hover:bg-[#068773]/15",
                      (!latest || !src) && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Result
                  </button>
                </div>
                {/* INLINE EDITOR */}
                {isEditing && selected && selectedSrc ? (
                  <div className="mt-4 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          Edit Prompt
                        </div>
                        <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                          Jelaskan perubahan yang kamu mau. Gambar terakhir akan dipakai sebagai input.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        Close
                      </button>
                    </div>

                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      rows={4}
                      placeholder="Contoh: tambahkan teks promo di bawah kanan, tone lebih hangat, lebih clean, jangan ubah mobil..."
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 px-3 py-2 text-[12px] text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#068773]/25"
                    />

                    <label className="mt-3 flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={preserveStyle}
                        onChange={(e) => setPreserveStyle(e.target.checked)}
                      />
                      Preserve original style (recommended)
                    </label>

                    {editError ? (
                      <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                        {editError}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={editLoading || editPrompt.trim().length < 2}
                        onClick={() => handleSubmitEdit(selected)}

                        className={cn(
                          "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
                          "text-[11px] font-semibold text-white transition",
                          "bg-gradient-to-r from-[#068773] to-[#0fb9a8] shadow-sm ring-1 ring-[#068773]/25",
                          "hover:brightness-105 active:brightness-95",
                          "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                          "disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                      >
                        {editLoading ? "Editing..." : "Apply Edit"}
                      </button>

                      <button
                        type="button"
                        disabled={editLoading}
                        onClick={() => {
                          setEditPrompt("");
                          setEditError(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 disabled:opacity-60"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : null}


                {/* INLINE MASK EDITOR */}
                {isMasking && selected  && selectedSrc  ? (
                  <MaskEditor
                    src={selectedSrc}
                    onClose={() => setIsMasking(false)}
                    onApply={(payload) => handleApplyMaskEdit(payload, selected)}
                    brushSize={brushSize}
                    setBrushSize={setBrushSize}
                    prompt={maskPrompt}
                    setPrompt={setMaskPrompt}
                    loading={maskLoading}
                    error={maskError}
                    aspectRatio={aspectRatioCss(aspect)} 
                  />
                ) : null}

                <div className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500">
                  {updatedLabel}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* footer actions */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Pill label={metaLeft} />
            <Pill label={metaMid} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                saveDraftLocal(selected as any);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2",
                "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                "text-[11px] font-semibold text-slate-700 dark:text-slate-200",
                "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                !selected && "cursor-not-allowed opacity-60"
              )}
            >
              Save Draft
            </button>

            {selected && selectedSrc ? (
              <button
                type="button"
                onClick={() => downloadImage(selectedSrc, `result-${selected.id}.png`)}
                className={cn(
                  "hidden md:inline-flex items-center gap-2 rounded-2xl border px-3 py-2",
                  "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
                  "text-[11px] font-semibold text-slate-700 dark:text-slate-200",
                  "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                )}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            ) : null}


          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- tiny UI ---- */
function Pill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 px-3 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
      {label}
    </span>
  );
}


{/* <button
              type="button"
              disabled={!latest}
              onClick={() => latest && onExport?.(latest)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
                "text-[11px] font-semibold text-white transition",
                "bg-gradient-to-r from-[#068773] to-[#0fb9a8] shadow-sm ring-1 ring-[#068773]/25",
                "hover:brightness-105 active:brightness-95",
                "focus:outline-none focus:ring-2 focus:ring-[#068773]/25",
                !latest && "cursor-not-allowed opacity-60"
              )}
            >
              <Upload className="h-4 w-4" />
              Export
            </button> */}