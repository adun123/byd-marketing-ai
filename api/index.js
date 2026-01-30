// api/index.js
export default function handler(req, res) {
  res.status(200).json({
    name: "BYD Content Marketing AI API",
    version: "1.0.3",
    description: "AI-powered content marketing API (Vercel serverless routes)",
    endpoints: {
      "GET /api": "API information",
      "GET /api/health": "Basic health check",

      // trends
      "POST /api/trends/insights": "Generate Trend Snapshot (Gemini JSON)",
      "POST /api/trends/search": "Search real-time viral trends",
      "GET /api/trends/options": "Get available options",

      // image (kalau memang kamu sudah punya filesnya di api/image/*)
      "POST /api/image/generate": "Generate image from text prompt",
      "POST /api/image/edit": "Edit image based on instructions",
      "POST /api/image/elements": "Add/remove elements from image",
      "POST /api/image/mask-edit": "Edit specific area with mask",
      "POST /api/image/combine": "Combine multiple images",
      "POST /api/image/360-view": "Generate 360 view / multiple angles",
      "POST /api/image/upscale": "Upscale image resolution",
      "POST /api/image/chat": "Conversational image editing",
      "POST /api/image/marketing": "Generate marketing content",
    },
  });
}
