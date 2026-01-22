import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// For Vercel serverless functions, export the app
// For local development, start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
}

export default app;