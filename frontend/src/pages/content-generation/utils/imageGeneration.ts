import type { GeneratedOutput } from "../types";
import { isTextOverlayIntent } from "./imageIntens";

export async function generateImage({
  prompt,
  workflow,
  attachments,
  visualStyle,
  aspect,
  API_BASE,
}: {
  prompt: string;
  workflow: string;
  attachments: any[];
  visualStyle: string;
  aspect: string;
  API_BASE: string;
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

    if (isTextOverlayIntent(prompt)) {
      fd.append("action", "add");
      fd.append("element", prompt);
      fd.append("position", "bottom center");
      fd.append(
        "description",
        "Overlay text only. Do not change background."
      );

      response = await fetch(`${API_BASE}/image/elements`, {
        method: "POST",
        body: fd,
      });
    } else {
      fd.append("prompt", prompt);
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

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  return (data.images || []).map((img: any) => {
    const b64 = (img.base64 || "").trim();
    const mime = b64.startsWith("/9j/") ? "image/jpeg" : "image/png";

    return {
      id: crypto.randomUUID(),
      prompt: data.prompt || prompt,
      createdAt: Date.now(),
      imageUrl: b64 ? `data:${mime};base64,${b64}` : undefined,
      base64: b64 || undefined,
    };
  });
}
