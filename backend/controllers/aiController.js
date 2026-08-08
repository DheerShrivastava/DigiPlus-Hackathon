import Hoarding from "../models/Hoarding.js";
import Customer from "../models/Customer.js";
import { 
  generateCopilotPitch, 
  generateOutreachEmail, 
  generatePricingRecommendation, 
  generateMarketInsights 
} from "../ai/geminiService.js";

export async function getCopilotPitch(req, res, next) {
  try {
    const { hoarding, customer, leadScore } = req.body;
    
    const h = hoarding || { location: "Worli Sea Link, Mumbai", size: "60ft x 30ft", monthlyRate: 850000, trafficScore: 98 };
    const c = customer || { customerName: "Swiggy Instamart", industry: "Quick Commerce & Retail", budgetBand: "₹10L - ₹25L/mo" };
    const score = leadScore || 96;

    const result = await generateCopilotPitch(h, c, score);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function generateEmail(req, res, next) {
  try {
    const { hoarding, customer, lead, tone } = req.body;

    const h = hoarding || { location: "BKC G-Block, Mumbai", size: "80ft x 40ft LED", monthlyRate: 1200000 };
    const c = customer || { customerName: "Tata EV", industry: "Automotive & CleanTech" };

    const result = await generateOutreachEmail(h, c, lead, tone || "professional");
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPricingRecommendation(req, res, next) {
  try {
    const { hoarding, customer } = req.body;
    const h = hoarding || { monthlyRate: 850000, trafficScore: 95, occupancyRate: 92, location: "Lower Parel, Mumbai" };
    const c = customer || { customerName: "CRED", budgetBand: "₹8L - ₹18L/mo" };

    const result = await generatePricingRecommendation(h, c);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getMarketInsights(req, res, next) {
  try {
    const totalHoardings = await Hoarding.countDocuments();
    const vacanciesNext90Days = await Hoarding.countDocuments({ status: "EXPIRING" });
    
    const expiring = await Hoarding.find({ status: "EXPIRING" });
    const revenueAtRisk = expiring.reduce((sum, h) => sum + (h.monthlyRate * 2 || 0), 0);

    const stats = {
      totalHoardings: totalHoardings || 300,
      vacanciesNext90Days: vacanciesNext90Days || 42,
      revenueAtRisk: revenueAtRisk || 5800000,
      topCity: "Mumbai",
      topIndustry: "Quick Commerce"
    };

    const result = await generateMarketInsights(stats);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
