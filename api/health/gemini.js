module.exports = async function handler(req, res) {
  try {
    // Simple Gemini health check
    res.status(200).json({
      status: "unknown",
      message: "Gemini health check not implemented in serverless function",
      note: "This endpoint requires full backend integration"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
}