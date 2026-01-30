import { checkGeminiHealth } from "../../../lib/gemini.js";

export default async function handler(req, res) {
  const health = await checkGeminiHealth();
  res.status(health.status === "ok" ? 200 : 503).json(health);
}