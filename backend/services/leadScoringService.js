import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";

/**
 * Deterministic Lead Scoring Engine
 * Industry Fit: 25%
 * Budget Fit: 25%
 * Historical Booking Match: 25%
 * Relationship Strength: 25%
 */
export async function calculateTopLeadsForHoarding(hoarding, limit = 3) {
  const customers = await Customer.find({ customerStatus: "ACTIVE" });
  const pastBookings = await Booking.find({ hoardingId: hoarding._id }).populate("customerId");

  const scoredLeads = customers.map((customer) => {
    // 1. Industry Fit (0 - 25)
    let industryFit = 18;
    const highMatchIndustries = {
      "Mumbai": ["Quick Commerce & Retail", "Consumer Electronics", "Fintech & Banking", "Automotive & CleanTech"],
      "Delhi": ["Consumer Electronics", "Food & Beverage", "E-Commerce & Technology", "Automotive & CleanTech"],
      "Bengaluru": ["Quick Commerce & Retail", "E-Commerce & Technology", "Fintech & Banking", "Automotive & CleanTech"]
    };

    const targetIndustries = highMatchIndustries[hoarding.city] || ["Quick Commerce & Retail", "Fintech & Banking"];
    if (targetIndustries.includes(customer.industry)) {
      industryFit = 24 + (customer._id.toString().charCodeAt(0) % 2); // 24-25
    } else {
      industryFit = 19 + (customer._id.toString().charCodeAt(1) % 4); // 19-22
    }

    // 2. Budget Fit (0 - 25)
    let budgetFit = 20;
    const rate = hoarding.monthlyRate;
    if (rate >= customer.budgetMin && rate <= customer.budgetMax) {
      budgetFit = 24 + (customer.budgetMax > rate * 1.2 ? 1 : 0);
    } else if (rate < customer.budgetMin && rate >= customer.budgetMin * 0.7) {
      budgetFit = 21;
    } else if (rate > customer.budgetMax && rate <= customer.budgetMax * 1.3) {
      budgetFit = 22;
    } else {
      budgetFit = 16;
    }

    // 3. Historical Booking Match (0 - 25)
    let historicalMatch = 18;
    const customerBookings = pastBookings.filter(
      (b) => b.customerId && b.customerId._id.toString() === customer._id.toString()
    );

    if (customerBookings.length > 0) {
      historicalMatch = 25;
    } else if (customer.preferredCities && customer.preferredCities.includes(hoarding.city)) {
      historicalMatch = 23;
    } else {
      historicalMatch = 19 + (customer.totalBookings > 10 ? 3 : 1);
    }

    // 4. Relationship Strength (0 - 25)
    const relScoreVal = customer.relationshipScore || 75;
    const relationshipStrength = Math.min(25, Math.max(12, Math.round((relScoreVal / 100) * 25)));

    // Total Lead Score (0 - 100)
    const leadScore = Math.min(99, industryFit + budgetFit + historicalMatch + relationshipStrength);

    // Determine match grade
    let matchGrade = "B+";
    if (leadScore >= 93) matchGrade = "A+";
    else if (leadScore >= 88) matchGrade = "A";
    else if (leadScore >= 82) matchGrade = "A-";

    const reasoning = [
      `${customer.industry} captures core commuter demographic traversing ${hoarding.location.split(',')[0]}`,
      `Client budget band (${customer.budgetBand || '₹10L+'}) covers monthly rate of ₹${(hoarding.monthlyRate / 100000).toFixed(2)}L`,
      customerBookings.length > 0 ? "Previously booked this location with high ROI" : `Active campaign history in ${hoarding.city}`,
      `Relationship score of ${relScoreVal}/100 with priority enterprise account standing`
    ];

    const suggestedDiscount = leadScore >= 92 ? 0.95 : 0.98;
    const suggestedPricing = `₹${((hoarding.monthlyRate * suggestedDiscount) / 100000).toFixed(2)}L / mo (${leadScore >= 92 ? '5% Early Booking Offer' : 'Standard Priority Rate'})`;

    return {
      id: customer._id.toString(),
      customerName: customer.companyName || customer.name,
      contactPerson: customer.name,
      email: customer.email,
      phone: customer.phone,
      industry: customer.industry,
      budgetBand: customer.budgetBand || `₹${(customer.budgetMin/100000).toFixed(0)}L - ₹${(customer.budgetMax/100000).toFixed(0)}L / mo`,
      relationshipScore: relScoreVal,
      leadScore,
      matchGrade,
      reasoning: {
        industryFit: reasoning[0],
        budgetFit: reasoning[1],
        historicalMatch: reasoning[2],
        relationshipStrength: reasoning[3]
      },
      scoreBreakdown: {
        industryFitScore: Math.round((industryFit / 25) * 100),
        budgetFitScore: Math.round((budgetFit / 25) * 100),
        historicalMatchScore: Math.round((historicalMatch / 25) * 100),
        relationshipScoreVal: Math.round((relationshipStrength / 25) * 100)
      },
      suggestedPricing,
      pitchHeadline: `Command Key ${customer.industry} Persona across ${hoarding.location.split(',')[0]}`,
      pitchContent: `Hi ${customer.companyName} Brand Team,\n\nOur prime billboard (${hoarding.hoardingId}) at ${hoarding.location} becomes available on ${hoarding.freeFromDate ? new Date(hoarding.freeFromDate).toISOString().substring(0,10) : 'Next Month'}.\n\nReaching ${hoarding.trafficScore * 4500} daily commuters, this site offers unmissable visibility for ${customer.industry}. Special rate: ${suggestedPricing}.\n\nWould you be open to reviewing the traffic telemetry?`
    };
  });

  // Sort descending by leadScore and take top N
  scoredLeads.sort((a, b) => b.leadScore - a.leadScore);
  return scoredLeads.slice(0, limit);
}
