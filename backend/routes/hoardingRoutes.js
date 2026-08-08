import express from "express";
import {
  getHoardings,
  getHoardingById,
  createHoarding,
  updateHoarding,
  deleteHoarding,
  getVacanciesNext90Days,
  getHeatmapData
} from "../controllers/hoardingController.js";

const router = express.Router();

router.get("/", getHoardings);
router.get("/vacancies/90-days", getVacanciesNext90Days);
router.get("/heatmap", getHeatmapData);
router.get("/:id", getHoardingById);
router.post("/", createHoarding);
router.put("/:id", updateHoarding);
router.delete("/:id", deleteHoarding);

export default router;