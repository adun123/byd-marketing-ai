module.exports = function handler(req, res) {
  res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "BYD Content Marketing AI API"
  });
}