export type ContentPreviewMeta = {
  savedAt: number;
  aspect: "1:1" | "4:5" | "16:9" | "9:16";
  format: "infographic" | "carousel";
  slides: number;
  platform?: string; // optional kalau belum ada state platform
};

const KEY = "cg.preview.meta.v1";

export function saveContentPreviewMeta(v: Omit<ContentPreviewMeta, "savedAt">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), ...v }));
  } catch (e) {
    console.error("saveContentPreviewMeta failed:", e);
  }
}

export function loadContentPreviewMeta(): ContentPreviewMeta | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ContentPreviewMeta) : null;
  } catch (e) {
    console.error("loadContentPreviewMeta failed:", e);
    return null;
  }
}