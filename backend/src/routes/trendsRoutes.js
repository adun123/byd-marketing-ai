import express from "express";

import {
  searchTrends,
  generateTrendContent,
  regenerateHeadlines,
  polishContent,
  getTrendOptions,
  getTrendInsights,
} from "../controllers/trendsController.js";



const router = express.Router();

router.post("/search", searchTrends);
router.post("/generate-content", generateTrendContent);
router.post("/regenerate-headlines", regenerateHeadlines);
router.post("/polish", polishContent);
router.get("/options", getTrendOptions);
router.post("/insights", getTrendInsights);

export default router;
