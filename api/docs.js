module.exports = function handler(req, res) {
  res.status(200).json({
    message: "API Documentation",
    note: "Swagger UI not available in serverless function",
    endpoints: {
      "GET /api": "API information",
      "GET /api/health": "Health check",
      "GET /api/health/gemini": "Gemini API status",
      "POST /api/image/*": "Image processing endpoints"
    }
  });
}