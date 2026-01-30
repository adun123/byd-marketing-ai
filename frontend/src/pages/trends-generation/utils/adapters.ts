import type { SearchTrend, ViralSnippetItem } from "../types";

function toSource(p?: string): ViralSnippetItem["source"] {
  const s = (p || "").toLowerCase();
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("linkedin")) return "linkedin";
  return "instagram";
}

function seedMetrics(level?: "high" | "medium" | "low") {
  if (level === "high") return { likes: 45000, comments: 9100, shares: 18000 };
  if (level === "medium") return { likes: 8900, comments: 320, shares: 1200 };
  return { likes: 2100, comments: 340, shares: 512 };
}

function placeholderThumb(src: ViralSnippetItem["source"]) {
  // beda placeholder per source biar UI variatif
  if (src === "tiktok")
    return "https://images.unsplash.com/photo-1520975993491-2f99c0b5f2a0?auto=format&fit=crop&w=1200&q=60";
  if (src === "youtube")
    return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60";
  if (src === "linkedin")
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60";
  return "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=60";
}

function hostHandle(url?: string, fallback = "@trend_source") {
  if (!url) return fallback;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    const name = host.split(".")[0] || "source";
    return `@${name}`;
  } catch {
    return fallback;
  }
}

export function mapSearchTrendsToViralSnippets(trends: SearchTrend[]): ViralSnippetItem[] {
  return (trends || []).slice(0, 8).map((t, idx) => {
    const src0 = t.sources?.[0];
    const source = toSource(src0?.platform);
    const metrics = seedMetrics(t.engagement?.estimated);

    return {
      id: `${t.keyTopic || "trend"}_${idx}`,
      source,
      title: t.topic || src0?.title || "Viral trend",
      href: src0?.url,
      authorHandle: hostHandle(src0?.url, source === "linkedin" ? "Tech Today" : "@daily_driver"),
      thumbUrl: placeholderThumb(source),
      ...metrics,
    };
  });
}
