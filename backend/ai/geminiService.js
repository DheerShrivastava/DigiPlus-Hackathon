import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { buildLeadReasoningPrompt } from "./prompts/leadReasoningPrompt.js";
import { buildSalesPitchPrompt } from "./prompts/salesPitchPrompt.js";
import { buildEmailPrompt } from "./prompts/emailPrompt.js";
import { buildPricingPrompt } from "./prompts/pricingPrompt.js";
import { buildMarketInsightPrompt } from "./prompts/marketInsightPrompt.js";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let aiClient = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("⚠️ Gemini AI Client Init Warning:", e.message);
  }
}

// In-Memory Insight Cache
let insightsCache = {
  data: null,
  timestamp: 0
};

// Helper: Call Gemini or Fallback
async function callGemini(promptText, fallbackData) {
  if (!aiClient || !apiKey) {
    console.log("ℹ️ GEMINI_API_KEY not configured. Returning fallback AI response.");
    return fallbackData;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: promptText,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return fallbackData;

    try {
      return JSON.parse(text);
    } catch {
      // Regex clean if JSON wrapping has markdown codeblocks
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("⚠️ Gemini API Call Failed/Timed Out. Using Fallback:", err.message);
    return fallbackData;
  }
}

/**
 * 1. AI Copilot Sales Pitch Generator
 */
export async function generateCopilotPitch(hoarding, customer, leadScore) {
  const prompt = buildSalesPitchPrompt(hoarding, customer, leadScore);
  const fallback = {
    headline: `Drive High-Intent ${customer.industry || 'Brand'} Conversions across ${hoarding.location.split(',')[0]}`,
    pitch: `Hi ${customer.customerName || customer.companyName} Leadership,\n\nOur premium billboard site (${hoarding.hoardingId}) at ${hoarding.location} is freeing up on ${hoarding.freeFromDate ? new Date(hoarding.freeFromDate).toISOString().substring(0,10) : 'upcoming cycle'}.\n\nReaching over ${hoarding.trafficScore * 4500} daily commuters in ${hoarding.city}, this location aligns perfectly with your campaign targets. We have reserved an exclusive rate of ₹${((hoarding.monthlyRate * 0.95)/100000).toFixed(2)}L/mo.\n\nShould we lock in dates for your team?`,
    suggestedPricing: `₹${((hoarding.monthlyRate * 0.95)/100000).toFixed(2)}L / mo (5% Early Booking Offer)`,
    whyMatch: `High commuter density in ${hoarding.city} aligns 100% with ${customer.industry} consumer demographics and budget allocation.`,
    strategy: "Propose 3-month commitment with complimentary night lighting illumination.",
    nextAction: "Send AI Outreach Pitch"
  };

  return await callGemini(prompt, fallback);
}

/**
 * 2. AI Email Generator with Tone Support
 */
export async function generateOutreachEmail(hoarding, customer, lead, tone = "professional") {
  const prompt = buildEmailPrompt(hoarding, customer, lead, tone);
  const fallback = {
    subject: `Exclusive Billboard Availability: ${hoarding.location.split(',')[0]}`,
    body: `Dear ${customer.customerName || customer.companyName} Team,\n\nWe wanted to share advance notification that our premium site (${hoarding.hoardingId}) at ${hoarding.location} is freeing up on ${hoarding.freeFromDate ? new Date(hoarding.freeFromDate).toISOString().substring(0,10) : 'upcoming dates'}.\n\nWith an AI Match Score of ${lead?.leadScore || 94}%, this site offers unmissable visibility for ${customer.industry}.\n\nBest regards,\nOOH Enterprise Media Team`,
    offer: `₹${((hoarding.monthlyRate * 0.95)/100000).toFixed(2)}L / mo`,
    cta: "Lock 3-Month Exclusive Booking"
  };

  return await callGemini(prompt, fallback);
}

/**
 * 3. AI Dynamic Pricing Recommendation
 */
export async function generatePricingRecommendation(hoarding, customer) {
  const prompt = buildPricingPrompt(hoarding, customer);
  const baseL = (hoarding.monthlyRate / 100000).toFixed(2);
  const fallback = {
    recommendedPrice: `₹${(baseL * 0.96).toFixed(2)}L / mo`,
    minimumNegotiationPrice: `₹${(baseL * 0.90).toFixed(2)}L / mo`,
    premiumPrice: `₹${(baseL * 1.05).toFixed(2)}L / mo`,
    reasoning: `Based on current occupancy rate of ${hoarding.occupancyRate}% and traffic score of ${hoarding.trafficScore}/100, a 4% early booking discount optimizes conversion probability while maintaining margin.`,
    expectedImpact: "+12.5% Conversion Lift"
  };

  return await callGemini(prompt, fallback);
}

/**
 * 4. AI Market Insights Generator (With 30 min Cache)
 */
export async function generateMarketInsights(stats) {
  const cacheMinutes = parseInt(process.env.AI_INSIGHT_CACHE_MINUTES) || 30;
  const now = Date.now();

  if (insightsCache.data && (now - insightsCache.timestamp) < cacheMinutes * 60 * 1000) {
    return insightsCache.data;
  }

  const prompt = buildMarketInsightPrompt(stats);
  const fallback = [
    {
      id: 1,
      type: "Demand Surge",
      icon: "TrendingUp",
      badgeColor: "emerald",
      title: "South Mumbai Corridor Occupancy Peak",
      content: `South Mumbai hoardings currently enjoy 35% higher occupancy than regional averages due to Q3 corporate campaign pushes.`,
      metric: "+35% Occupancy",
      timestamp: "Just now"
    },
    {
      id: 2,
      type: "Category Intelligence",
      icon: "Briefcase",
      badgeColor: "indigo",
      title: "Quick Commerce Advertising Spurt",
      content: "Quick Commerce brands (Swiggy Instamart, Zepto, Blinkit) account for 32% of total OOH expenditure this quarter.",
      metric: "32% Market Share",
      timestamp: "10 mins ago"
    },
    {
      id: 3,
      type: "Expiry Alert",
      icon: "AlertTriangle",
      badgeColor: "amber",
      title: `${stats.vacanciesNext90Days || 42} Sites Expiring in 90 Days`,
      content: `Upcoming vacancies represent ₹${((stats.revenueAtRisk || 5800000) / 100000).toFixed(1)} Lakhs in revenue requiring proactive AI lead outreach.`,
      metric: `₹${((stats.revenueAtRisk || 5800000) / 100000).toFixed(1)}L at Risk`,
      timestamp: "15 mins ago"
    },
    {
      id: 4,
      type: "Pricing Opportunity",
      icon: "DollarSign",
      badgeColor: "cyan",
      title: "Digital 4K LED Screen Yield Uplift",
      content: "Digital screens in BKC & Cyber Hub can command a 12% rate premium when bundled with real-time impression telemetry.",
      metric: "+12% Revenue Lift",
      timestamp: "30 mins ago"
    }
  ];

  const result = await callGemini(prompt, fallback);
  insightsCache = { data: result, timestamp: now };
  return result;
}
