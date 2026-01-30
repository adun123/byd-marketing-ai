// api/trends/options.js
export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  res.status(200).json({
    platforms: ["instagram-post", "tiktok", "youtube", "linkedin"],
    contentTypes: ["edu-ent", "promo", "review", "ugc"],
    targetAudiences: ["genz-balanced", "millennial", "family", "business"],
    languages: ["id", "en"],
  });
}
