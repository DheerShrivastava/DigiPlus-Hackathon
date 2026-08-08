export function buildLeadReasoningPrompt(hoarding, customer, scores) {
  return `You are an expert Out-of-Home (OOH) advertising strategist.
Analyze the following billboard site and corporate customer data and provide structured sales match reasoning.

BILLBOARD SITE:
- Location: ${hoarding.location} (${hoarding.city})
- Dimensions: ${hoarding.size}
- Monthly Rate: ₹${hoarding.monthlyRate}
- Traffic Score: ${hoarding.trafficScore}/100
- Occupancy Rate: ${hoarding.occupancyRate}%

CUSTOMER PROFILE:
- Brand/Company: ${customer.customerName || customer.companyName}
- Industry: ${customer.industry}
- Budget Band: ${customer.budgetBand}
- Relationship Score: ${customer.relationshipScore}/100

DETERMINISTIC SCORES:
- Total Lead Score: ${scores.leadScore}/100
- Industry Fit: ${scores.scoreBreakdown?.industryFitScore}%
- Budget Fit: ${scores.scoreBreakdown?.budgetFitScore}%
- Historical Match: ${scores.scoreBreakdown?.historicalMatchScore}%
- Relationship Strength: ${scores.scoreBreakdown?.relationshipScoreVal}%

INSTRUCTIONS:
Provide a 3-bullet point executive summary explaining why this customer is a top-tier candidate for this site. Do not invent unsupplied data. Return concise JSON format:
{
  "whyMatch": "Executive summary paragraph",
  "keyDrivers": ["Bullet 1", "Bullet 2", "Bullet 3"]
}`;
}
