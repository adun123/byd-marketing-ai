// src/pages/preview-generation/utils/previewContextStorage.ts
export type PreviewContextPayload = {
  savedAt: number;
  topic: string;
  targetAudience: string;
  platformLabel: string;
  formatLabel: string;
  language?: string;
  toneOfVoice?: string;
};

const KEY = "byd:previewContext:v1";

export function savePreviewContext(ctx: Omit<PreviewContextPayload, "savedAt">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), ...ctx }));
  } catch (e) {
    console.error("savePreviewContext failed:", e);
  }
}

export function loadPreviewContext(): PreviewContextPayload | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PreviewContextPayload;
  } catch (e) {
    console.error("loadPreviewContext failed:", e);
    return null;
  }
}

export function clearPreviewContext() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error("clearPreviewContext failed:", e);
  }
}
