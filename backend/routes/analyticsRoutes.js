import express from "express";
import {
  getRevenueAtRisk,
  getVacancyForecast,
  getOccupancyTrend,
  getTopLocations,
  getCustomerIndustries,
  getCitiesAnalytics,
  getBookingFrequencyAnalytics,
  getAverageRatesAnalytics
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/revenue-risk", getRevenueAtRisk);
router.get("/vacancy-forecast", getVacancyForecast);
router.get("/occupancy", getOccupancyTrend);
router.get("/top-locations", getTopLocations);
router.get("/customer-industries", getCustomerIndustries);
router.get("/industries", getCustomerIndustries);
router.get("/cities", getCitiesAnalytics);
router.get("/booking-frequency", getBookingFrequencyAnalytics);
router.get("/average-rates", getAverageRatesAnalytics);

export default router;
