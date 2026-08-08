import express from "express";
import { getBookings, getBookingById } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);

export default router;
