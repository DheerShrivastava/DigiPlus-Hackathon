export function buildPricingPrompt(hoarding, customer) {
  return `You are a dynamic pricing revenue management AI for billboard advertising.

SITE METRICS:
- Base Rate: ₹${hoarding.monthlyRate}
- Location: ${hoarding.location}
- Traffic Score: ${hoarding.trafficScore}/100
- Occupancy Rate: ${hoarding.occupancyRate}%

CLIENT: ${customer.customerName || customer.companyName} (${customer.budgetBand})

INSTRUCTIONS:
Calculate recommended pricing strategy. Return JSON:
{
  "recommendedPrice": "₹X,XX,XXX / mo",
  "minimumNegotiationPrice": "₹X,XX,XXX / mo",
  "premiumPrice": "₹X,XX,XXX / mo",
  "reasoning": "Detailed pricing rationale based on occupancy demand and client budget",
  "expectedImpact": "+X% Revenue lift"
}`;
}
