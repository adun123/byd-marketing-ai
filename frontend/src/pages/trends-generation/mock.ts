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
