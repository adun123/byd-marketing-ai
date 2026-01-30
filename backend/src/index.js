import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs"; // Tambahkan fs untuk memastikan folder ada
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.js";
import imageRoutes from "./routes/imageRoutes.js";
import { checkGeminiHealth } from "./config/gemini.js";
import trendRoutes from "./routes/trendsRoutes.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
// Limit besar diperlukan jika ada upload image base64, 
// tapi video kita pakai URL jadi aman. Tetap set 50mb untuk aman.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- STATIC FILES CONFIGURATION ---

// 1. Serve folder 'outputs' (Existing)
app.use("/outputs", express.static(path.join(__dirname, "../outputs")));

// 2. Serve folder 'uploads' (Existing)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 3. [BARU] Serve folder 'public/videos' 
// Ini WAJIB agar URL video '/videos/...' dari controller bisa dibuka browser
const videoDir = path.join(process.cwd(), "public/videos");
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}
app.use("/videos", express.static(videoDir));

// ----------------------------------

app.get("/health", (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

app.get("/health/gemini", async (req, res) => {
  const health = await checkGeminiHealth();
  res.status(health.status === "ok" ? 200 : 503).json(health);
});


app.use("/api/image", imageRoutes);
app.use("/api/trends", trendRoutes);


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api", (req, res) => {
  res.json({
    name: "BYD Content Marketing AI API",
    version: "1.0.3",
    endpoints: {
      image: {
        "POST /api/image/generate": "Generate image from text prompt",
        "POST /api/image/edit": "Edit image based on instructions",
        "POST /api/image/elements": "Add/remove elements from image",
        "POST /api/image/mask-edit": "Edit specific area with mask",
        "POST /api/image/combine": "Combine multiple images",
        "POST /api/image/360-view": "Generate 360 view / multiple angles",
        "POST /api/image/upscale": "Upscale image resolution",
        "POST /api/image/chat": "Conversational image editing",
        "POST /api/image/marketing": "Generate marketing content",
        "POST /api/image/analyze": "Analyze image and get suggestions",
        "POST /api/image/enhance-prompt": "Enhance prompt with AI",
      },
      trends: {
        "POST /api/trends/search": "Search real-time viral trends",
        "POST /api/trends/generate-content": "Generate content from trend",
        "POST /api/trends/regenerate-headlines": "Regenerate headlines",
        "POST /api/trends/polish": "Polish and improve content",
        "GET /api/trends/options": "Get available options",
      },
      video: {
        "POST /api/video/enhance-prompt": "Enhance video prompt for Veo",
        "POST /api/video/generate": "Generate video using Google Veo (MP4)",
      }
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

const PORT = process.env.PORT || 4000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/docs`);
    console.log(`Video storage ready at http://localhost:${PORT}/videos/`);
  });
}
const outputsDir = process.env.VERCEL
  ? "/tmp/outputs"
  : path.resolve(__dirname, "../outputs"); // backend/src -> backend/outputs

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

app.use("/outputs", express.static(outputsDir));

export default app;