// backend/src/routes/trendsRoutes.js
import express from "express";
import { getTrendInsights } from "../controllers/trendsController.js";
import { getViralSnippets } from "../controllers/viralSnippetsController.js";
const router = express.Router();

// POST /api/trends/insights
router.post("/snapshot", getTrendInsights);
router.post("/viral-snippets", getViralSnippets);


export default router;
