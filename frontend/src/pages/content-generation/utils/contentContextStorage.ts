// src/pages/content-generation/utils/contentContextStorage.ts
import type { FinalizeContentPayload } from "../types";

const KEY = "byd.content.ctx.v1";

export function saveContentCtx(v: FinalizeContentPayload) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

export function loadContentCtx(): FinalizeContentPayload | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FinalizeContentPayload) : null;
  } catch {
    return null;
  }
}

export function clearContentCtx() {
  localStorage.removeItem(KEY);
}
