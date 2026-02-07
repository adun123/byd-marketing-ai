import JSZip from "jszip";
import { saveAs } from "file-saver";

type Item = {
  id: string;
  imageUrl?: string;
  base64?: string; // base64 tanpa prefix "data:image..."
};

function toDataUrlFromBase64(b64: string) {
  // asumsi PNG; kalau kamu simpan mime type, bisa dibikin dinamis
  return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
}

async function srcToBlob(src: string): Promise<Blob> {
  // data URL (base64)
  if (src.startsWith("data:")) {
    const res = await fetch(src);
    return await res.blob();
  }

  // URL biasa
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  return await res.blob();
}

export async function downloadAllImagesZip(
  items: Item[],
  zipName = "byd-outputs.zip"
) {
  const zip = new JSZip();

  const tasks = items.map(async (it, idx) => {
    const src =
      it.imageUrl || (it.base64 ? toDataUrlFromBase64(it.base64) : undefined);
    if (!src) return;

    const blob = await srcToBlob(src);
    const filename = `result-${String(idx + 1).padStart(2, "0")}-${it.id}.png`;

    zip.file(filename, blob);
  });

  await Promise.all(tasks);

  const out = await zip.generateAsync({ type: "blob" });
  saveAs(out, zipName);
}
