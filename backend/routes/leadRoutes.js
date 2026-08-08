import express from "express";
import { getLeadRecommendations } from "../controllers/leadController.js";

const router = express.Router();

router.get("/recommendations/:hoardingId", getLeadRecommendations);

export default router;
