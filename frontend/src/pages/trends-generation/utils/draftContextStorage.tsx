import type { DraftContextPayload } from "../types";

const KEY = "byd:draftContext:v1";

export function saveDraftContext(ctx: DraftContextPayload) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), ctx }));
  } catch (e) {
    console.error("saveDraftContext failed:", e);
  }
}

export function loadDraftContext(): DraftContextPayload | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.ctx ?? null;
  } catch (e) {
    console.error("loadDraftContext failed:", e);
    return null;
  }
}

export function clearDraftContext() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error("clearDraftContext failed:", e);
  }
}
