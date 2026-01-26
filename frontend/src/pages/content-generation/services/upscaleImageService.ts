import type { GeneratedOutput } from "../types";




type UpscaleParams = {
  API_BASE: string;
  file: File;
  preset?: "hd" | "fullhd" | "2k" | "4k";
  width?: number;
  height?: number;
  quality?: number;
};


export async function upscaleImageService({
  API_BASE,
  file,
  preset = "4k",
  quality = 90,
}: UpscaleParams): Promise<GeneratedOutput[]> {
  const formData = new FormData();

  // 🔥 INI KUNCI UTAMANYA
  formData.append("image", file); // harus File, bukan object

  formData.append("preset", preset);
  formData.append("quality", String(quality));

  const res = await fetch(`${API_BASE}/image/upscale`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    console.log("UPSCALE RESPONSE:", data);

    const text = await res.text();
    throw new Error(text || "Failed to upscale image");
  }

const data = await res.json();

// API_BASE mungkin "http://localhost:4000/api"
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, ""); // -> "http://localhost:4000"

const imageUrl =
  typeof data.image?.url === "string"
    ? `${API_ORIGIN}${data.image.url}` //  /outputs/...
    : undefined;

const base64 =
  typeof data.image?.base64 === "string" ? data.image.base64 : undefined;

return [
  {
    id: crypto.randomUUID(),
    imageUrl,
    base64,
    prompt: `Upscale to ${preset.toUpperCase()}`,
    createdAt: Date.now(),
    kind: "upscale",
  },
];




}

