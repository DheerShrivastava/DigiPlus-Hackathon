import express from "express";
import {
  getCopilotPitch,
  generateEmail,
  getPricingRecommendation,
  getMarketInsights
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/copilot", getCopilotPitch);
router.post("/email", generateEmail);
router.post("/pricing", getPricingRecommendation);
router.get("/insights", getMarketInsights);

export default router;
