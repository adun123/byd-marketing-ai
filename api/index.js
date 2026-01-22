module.exports = function handler(req, res) {
  res.status(200).json({
    name: "BYD Content Marketing AI API",
    version: "1.0.0",
    description: "AI-powered image generation and editing for content marketing",
    endpoints: {
      "GET /api": "API information",
      "GET /api/health": "Basic health check",
      "GET /api/health/gemini": "Gemini API status",
      "GET /api/docs": "API documentation",
      "POST /api/image/generate": "Generate image from text prompt",
      "POST /api/image/edit": "Edit image based on instructions",
      "POST /api/image/elements": "Add/remove elements from image",
      "POST /api/image/mask-edit": "Edit specific area with mask",
      "POST /api/image/combine": "Combine multiple images",
      "POST /api/image/360-view": "Generate 360 view / multiple angles",
      "POST /api/image/upscale": "Upscale image resolution",
      "POST /api/image/chat": "Conversational image editing",
      "POST /api/image/marketing": "Generate marketing content"
    },
    note: "Endpoints currently return placeholder responses. Full backend integration pending."
  });
}