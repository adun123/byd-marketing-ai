import type { GeneratedOutput } from "../types";
import { isTextOverlayIntent } from "../utils/imageIntens";


export async function generateImageService({
  API_BASE,
  workflow,
  prompt,
  attachments,
  visualStyle,
  aspect,
}: {
  API_BASE: string;
  workflow: "text_to_image" | "image_to_image" | "upscale";
  prompt: string;
  attachments: any[];
  visualStyle: string;
  aspect: string;
}): Promise<GeneratedOutput[]> {
  let response: Response;

  if (workflow === "text_to_image") {
    response = await fetch(`${API_BASE}/image/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        style: visualStyle,
        aspectRatio: aspect,
        numberOfResults: 1,
      }),
    });
  } else if (workflow === "image_to_image") {
    const fd = new FormData();
    fd.append("image", attachments[0].file);

    const cleanPrompt = prompt.trim();

    if (isTextOverlayIntent(cleanPrompt)) {
      fd.append("action", "add");
      fd.append("element", cleanPrompt);
      fd.append("position", "bottom center");
      fd.append(
        "description",
        "Overlay text only. Do not change the car or background. White bold text with subtle shadow, modern ad style."
      );

      response = await fetch(`${API_BASE}/image/elements`, {
        method: "POST",
        body: fd,
      });
    } else {
      fd.append("prompt", cleanPrompt);
      fd.append("preserveStyle", "true");

      response = await fetch(`${API_BASE}/image/edit`, {
        method: "POST",
        body: fd,
      });
    }
  } else {
    const fd = new FormData();
    fd.append("image", attachments[0].file);

    response = await fetch(`${API_BASE}/image/upscale`, {
      method: "POST",
      body: fd,
    });
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();

  // normalize: images array
  if (data?.success && Array.isArray(data.images) && data.images.length > 0) {
    return data.images.map((image: any) => {
      const b64 = (image.base64 || "").trim();
      const isJpeg = b64.startsWith("/9j/");
      const mime = isJpeg ? "image/jpeg" : "image/png";

      return {
        id: crypto.randomUUID(),
        prompt: data.prompt || prompt,
        createdAt: Date.now(),
        imageUrl: b64 ? `data:${mime};base64,${b64}` : undefined,
        base64: b64 || undefined,
      };
    });
  }

  // normalize: single base64/url
  if (data?.success && (data.url || data.base64)) {
    const b64 = (data.base64 || "").trim();
    const isJpeg = b64.startsWith("/9j/");
    const mime = isJpeg ? "image/jpeg" : "image/png";

    return [
      {
        id: crypto.randomUUID(),
        prompt: data.prompt || prompt || "(upscale)",
        createdAt: Date.now(),
        imageUrl: b64 ? `data:${mime};base64,${b64}` : undefined,
        base64: b64 || undefined,
      },
    ];
  }

  throw new Error(data?.error || "Failed to process image");
}
