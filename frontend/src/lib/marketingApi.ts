// src/lib/marketingApi.ts
export type MarketingOptionItem = { value: string; label?: string };

export type MarketingOptionsResponse =
  | {
      platforms: MarketingOptionItem[];
      contentTypes: MarketingOptionItem[];
      targetAudiences: MarketingOptionItem[];
    }
  // fallback kalau backend return string[]
  | {
      platforms: string[];
      contentTypes: string[];
      targetAudiences: string[];
    };

export type MarketingGenerateBody = {
  platform: string;
  contentType: string;
  targetAudience: string;
  product?: string;
  brand?: string;
  message?: string;
  image?: File | null;
};

export type MarketingGenerateResponse = any;

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getMarketingOptions() {
  const res = await fetch(`${API_BASE}/api/image/marketing/options`);
  if (!res.ok) throw new Error(`Options error: ${res.status}`);
  return (await safeJson(res)) as MarketingOptionsResponse;
}

export async function postMarketingGenerate(body: MarketingGenerateBody) {
  // kalau ada image → FormData; kalau tidak → JSON
  const hasImage = !!body.image;

  const res = await fetch(`${API_BASE}/api/image/marketing`, {
    method: "POST",
    headers: hasImage ? undefined : { "Content-Type": "application/json" },
    body: hasImage
      ? (() => {
          const fd = new FormData();
          fd.append("platform", body.platform);
          fd.append("contentType", body.contentType);
          fd.append("targetAudience", body.targetAudience);
          if (body.product) fd.append("product", body.product);
          if (body.brand) fd.append("brand", body.brand);
          if (body.message) fd.append("message", body.message);
          if (body.image) fd.append("image", body.image);
          return fd;
        })()
      : JSON.stringify({
          platform: body.platform,
          contentType: body.contentType,
          targetAudience: body.targetAudience,
          product: body.product,
          brand: body.brand,
          message: body.message,
        }),
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `Generate error: ${res.status}`;
    throw new Error(msg);
  }

  return data as MarketingGenerateResponse;
}
