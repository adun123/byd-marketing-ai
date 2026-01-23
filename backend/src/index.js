import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.js";
import imageRoutes from "./routes/imageRoutes.js";
import { checkGeminiHealth } from "./config/gemini.js";
import trendsRoutes from "./routes/trendsRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/outputs", express.static(path.join(__dirname, "../outputs")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

app.get("/health/gemini", async (req, res) => {
  const health = await checkGeminiHealth();
  res.status(health.status === "ok" ? 200 : 503).json(health);
});

app.use("/api/image", imageRoutes);
app.use("/api/trends", trendsRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api", (req, res) => {
  res.json({
    name: "BYD Content Marketing AI API",
    version: "1.0.0",
    endpoints: {
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
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// For Vercel serverless deployment, export the app
// For local development, start the server directly
const PORT = process.env.PORT || 4000;

// When running on Vercel, the VERCEL environment variable is set
// In local development, it's not set, so we start the server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/docs`);
  });
}

export default app;
