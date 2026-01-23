// backend/src/routes/trendsRoutes.js
import express from "express";
import { getTrendInsights } from "../controllers/trendsController.js";

const router = express.Router();

// POST /api/trends/insights
router.post("/insights", getTrendInsights);

export default router;
