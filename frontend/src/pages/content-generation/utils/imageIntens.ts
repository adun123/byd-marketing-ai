export function isTextOverlayIntent(prompt: string) {
  const s = prompt.toLowerCase();

  // trigger yang lebih spesifik untuk "nempel text ke gambar"
  const hasOverlayVerb =
    /(\btambah(k)?an\b|\badd\b|\btempel\b|\boverlay\b|\bpasang\b)\s+(text|teks|tulisan)\b/.test(s) ||
    /\btext\s*:/.test(s) ||
    /\bteks\s*:/.test(s) ||
    /".+?"/.test(prompt) || /'.+?'/ .test(prompt);

  // kalau user cuma ngomong caption/headline tanpa konteks overlay, jangan auto overlay
  return hasOverlayVerb;
}

export function extractOverlayText(prompt: string): string | null {
  // Ambil teks di dalam kutip "..."
  const m1 = prompt.match(/"([^"]+)"/);
  if (m1?.[1]) return m1[1].trim();

  // Ambil teks di dalam kutip '...'
  const m2 = prompt.match(/'([^']+)'/);
  if (m2?.[1]) return m2[1].trim();

  // Ambil setelah "text:" atau "teks:"
  const m3 = prompt.match(/\b(?:text|teks)\s*:\s*(.+)$/i);
  if (m3?.[1]) return m3[1].trim();

  return null;
}
