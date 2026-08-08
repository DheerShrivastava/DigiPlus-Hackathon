import express from "express";
import {
  importHoardingsApi,
  importCustomersApi,
  importBookingsApi
} from "../controllers/importController.js";

const router = express.Router();

router.post("/hoardings", importHoardingsApi);
router.post("/customers", importCustomersApi);
router.post("/bookings", importBookingsApi);

export default router;
