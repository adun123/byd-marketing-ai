// api/trends/trendsCore.js
import { GoogleGenerativeAI } from "@google/generative-ai";

/** Ambil object JSON pertama dari output model */
export function extractJson(text = "") {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

/** Samain logic normalizePlatform dengan backend kamu */
export function normalizePlatform(p) {
  const s = (p || "").toLowerCase();
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("instagram")) return "instagram";
  return null;
}

/** Samain logic normalizeTopic dengan backend kamu */
export function normalizeTopic(t) {
  const s = (t || "").toLowerCase().trim();
  if (!s) return null;
  return s;
}

/**
 * TODO: Copy dari backend kamu:
 * - allowedDomainsForPlatform
 * - urlMatchesDomains
 * - isTikTokVideoUrl
 */
function allowedDomainsForPlatform(platformNorm) {
  const p = (platformNorm || "").toLowerCase();
  if (p === "instagram") return ["instagram.com"];
  if (p === "tiktok") return ["tiktok.com", "vt.tiktok.com", "vm.tiktok.com"];
  if (p === "youtube") return ["youtube.com", "youtu.be"];
  if (p === "linkedin") return ["linkedin.com"];
  return [];
}
function urlMatchesDomains(url, domains) {
  if (!url) return false;
  const u = String(url).toLowerCase();
  return domains.some((d) => u.includes(d));
}
function isTikTokVideoUrl(url) {
  const u = (url || "").toLowerCase();
  return u.includes("tiktok.com/@") && u.includes("/video/");
}

/** Ini sama seperti enforcePlatformSources yang kamu kirim kemarin */
export function enforcePlatformSources(trendsData, platformNorm) {
  const domains = allowedDomainsForPlatform(platformNorm);
  if (!domains.length) return trendsData;

  const p = (platformNorm || "").toLowerCase();
  const trends = Array.isArray(trendsData?.trends) ? trendsData.trends : [];

  return {
    ...trendsData,
    trends: trends.map((t) => {
      const sources = Array.isArray(t?.sources) ? t.sources : [];
      let kept = sources.filter((s) => urlMatchesDomains(s?.url, domains));

      if (p.includes("tiktok")) {
        const videoFirst = kept.filter((s) => isTikTokVideoUrl(s?.url));
        kept = videoFirst.length ? videoFirst : kept;
      }

      return { ...t, sources: kept };
    }),
  };
}

/** Hitung jumlah URL platform tertentu (untuk retry TikTok) */
export function countPlatformUrls(trendsData, platformNorm) {
  const trends = Array.isArray(trendsData?.trends) ? trendsData.trends : [];
  const domains = allowedDomainsForPlatform(platformNorm);
  if (!domains.length) return 0;

  let c = 0;
  for (const t of trends) {
    const sources = Array.isArray(t?.sources) ? t.sources : [];
    for (const s of sources) {
      if (urlMatchesDomains(s?.url, domains)) c++;
    }
  }
  return c;
}

/**
 * OPTIONAL: kalau backend kamu punya resolve redirect / resolve grounding sources
 * kamu bisa copy kesini.
 * Untuk versi awal, kita NO-OP dulu biar minimal jalan.
 */
export async function resolveTrendSourcesUrls(trendsData) {
  return trendsData;
}
export async function resolveGroundingSources(rawSources) {
  return rawSources;
}

/**
 * Model “grounded” versi serverless.
 * Kalau kamu di backend pakai model khusus (grounding), samain disini.
 */
export function getGroundedModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY (set in Vercel env)");

  const genAI = new GoogleGenerativeAI(key);

  // Samakan dengan yang kamu pakai di backend kalau beda.
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}
