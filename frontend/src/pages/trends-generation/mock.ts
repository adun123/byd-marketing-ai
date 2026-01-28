// src/pages/trends-generation/mock.ts
import type { TrendsForm, TrendsIdeas } from "./types";

export function generateMockIdeas(form: TrendsForm): TrendsIdeas {
  
  const p = form.product?.trim() || "produk kamu";
  const b = form.brand?.trim() || "Brand";

  const platformHint =
    form.platform === "tiktok-reels" || form.platform === "youtube-shorts"
      ? "short, cepat, punchy"
      : form.platform === "instagram-post"
      ? "rapi, visual-first"
      : "profesional, value-driven";


  const campaignHint = form.contentType === "soft-campaign" ? "soft selling" : "edu-ent";

  return {
    updatedAtLabel: "Last updated: 5 mins ago",
  trendTopics: [
    { title: "Electric Range Anxiety" },
    { title: "Eco-Drive" },
    { title: "Charging Infrastructure" },
    { title: "Government EV Subsidy" },
    { title: "Competitor Recalls" },
  ],

  hookPatterns: [
    { pattern: "Viral Hook" },
    { pattern: "Smart Cabin" },
    { pattern: "EV Lifestyle" },
  ],

  anglePatterns: [
    { angle: "Charging Hub" },
    { angle: "Price Hike" },
    { angle: "Jakarta Roads" },
    { angle: "Auto Show" },
    { angle: "Charging Delay" },
  ],

  // dipakai kalau kamu upgrade komponen snapshot supaya lebih presisi
  termsCloud: [
    { term: "Electric Range", sentiment: "Positive", weight: 10 },
    { term: "Range Anxiety", sentiment: "Negative", weight: 7 },
    { term: "Auto Show", sentiment: "Neutral", weight: 5 },
    { term: "Eco-Drive", sentiment: "Positive", weight: 9 },
    { term: "Charging Delay", sentiment: "Negative", weight: 4 },
    { term: "Smart Cabin", sentiment: "Positive", weight: 6 },
    { term: "Jakarta Roads", sentiment: "Neutral", weight: 4 },
    { term: "Viral Hook", sentiment: "Positive", weight: 10 },
    { term: "Price Hike", sentiment: "Negative", weight: 5 },
    { term: "EV Lifestyle", sentiment: "Positive", weight: 8 },
    { term: "Sustainability", sentiment: "Neutral", weight: 4 },
    { term: "Charging Hub", sentiment: "Positive", weight: 6 },
  ],

  topSentiment: [
    { name: "Electric Range Anxiety", sentiment: "Negative", score: 68 },
    { name: "Haka Concept Design", sentiment: "Positive", score: 92 },
    { name: "Charging Infrastructure", sentiment: "Neutral", score: 50 },
    { name: "Government EV Subsidy", sentiment: "Positive", score: 74 },
    { name: "Competitor Recalls", sentiment: "Negative", score: 85 },
  ],
    hooks: [
      `POV: kamu baru sadar ${p} bisa bikin hidup lebih gampang (${platformHint})`,
      // `Kalau ${p} punya 1 fitur yang harus kamu coba hari ini…`,
      // `Stop scroll! Ini alasan ${p} makin banyak dipakai orang (${toneHint})`,
      // `${b} challenge: coba ini 3 hari dan lihat bedanya`,
      // `Kamu tim “hemat waktu” atau “hemat uang”? ${p} jawabannya.`,
    ],
    angles: [
      `Before vs After: pakai ${p} selama 7 hari (storytelling ${campaignHint})`,
    //   `3 kesalahan orang saat memilih ${p} (format listicle)`,
    //   `Myth vs Fact tentang ${p} (edukasi + ringan)`,
    ],
    captions: [
      `${b} hadir buat bikin ${p} terasa lebih simple. Kamu paling butuh yang mana: cepat, rapi, atau hemat?`,
    //   `Lagi cari ${p} yang cocok buat daily? Ini versi yang ${toneHint} dan gampang dipakai.`,
    //   `Satu langkah kecil, impact besar. ${p} + rutinitas baru kamu ✨`,
     ],
    ctas: [
      "Mau versi template-nya? Comment “MAU”.",
      "Save dulu biar nggak lupa.",
      "Share ke temen yang butuh ini.",
    ],
    hashtags: [
      "#contentideas",
      "#marketingtips",
      "#socialmediamarketing",
      "#brandbuilding",
      "#creativebrief",
    ],
  };
}


