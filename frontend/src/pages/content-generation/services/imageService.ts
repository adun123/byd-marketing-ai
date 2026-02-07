import type { GeneratedOutput } from "../types";
import { isTextOverlayIntent } from "../utils/imageIntens";


export async function generateImageService({
  API_BASE,
  workflow,
  prompt,
  attachments,
  visualStyle,
  aspect,
  numberOfResults = 1,
}: {
  API_BASE: string;
  workflow: "text_to_image" | "image_to_image" | "upscale";
  prompt: string;
  attachments: any[];
  visualStyle: string;
  aspect: string;
  numberOfResults?: number; // ✅ NEW
}): Promise<GeneratedOutput[]> {
  let response: Response;

  if (workflow === "text_to_image") {
    // ✅ clamp 1..10 (biar aman)
    const n = Math.max(1, Math.min(Number(numberOfResults) || 1, 10));

    response = await fetch(`${API_BASE}/image/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        style: visualStyle,
        aspectRatio: aspect,
        numberOfResults: n, // ✅ NEW
      }),
    });
  } else if (workflow === "image_to_image") {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) throw new Error("Prompt is required");

    // MULTI: 2–5 images => combine
    if (attachments.length >= 2) {
      const fd = new FormData();
      const base = cleanPrompt;
      const combineGuard =
        "Create ONE cohesive advertising image (not a collage). " +
        "Match lighting, color, shadows, perspective, and scale. " +
        "Seamless blending, photorealistic, premium commercial quality.";

      // ✅ jangan append prompt dua kali (yang terakhir bisa override)
      fd.append("prompt", `${combineGuard} ${base}`);

      attachments.slice(0, 5).forEach((a) => fd.append("images", a.file));

      response = await fetch(`${API_BASE}/image/combine`, {
        method: "POST",
        body: fd,
      });
    } else {
      // SINGLE: 1 image => edit / elements
      const fd = new FormData();
      fd.append("image", attachments[0].file);

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
    }
  } else {
    // upscale
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
    return data.images.map((image: any, idx: number) => {
      const b64 = (image.base64 || "").trim();
      const isJpeg = b64.startsWith("/9j/");
      const mime = isJpeg ? "image/jpeg" : "image/png";

      return {
        id: crypto.randomUUID(),
        prompt: data.prompt || prompt,
        createdAt: Date.now(),
        imageUrl: b64 ? `data:${mime};base64,${b64}` : undefined,
        base64: b64 || undefined,
        // opsional biar gampang urut carousel
        // @ts-ignore
        carouselIndex: image.variant ?? idx + 1,
      } as any;
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

