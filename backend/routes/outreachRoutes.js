import express from "express";
import {
  createOutreach,
  sendOutreachEmail,
  getOutreachList
} from "../controllers/outreachController.js";

const router = express.Router();

router.get("/", getOutreachList);
router.post("/", createOutreach);
router.post("/:id/send", sendOutreachEmail);
router.post("/:id/schedule", createOutreach);

export default router;
