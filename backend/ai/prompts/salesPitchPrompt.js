export function buildSalesPitchPrompt(hoarding, customer, leadScore) {
  return `You are a Senior OOH Media Sales Executive.
Write a highly persuasive, personalized sales pitch for the following deal:

BILLBOARD: ${hoarding.location} (${hoarding.size}, ₹${hoarding.monthlyRate}/mo, Free from ${hoarding.freeFromDate})
CLIENT: ${customer.customerName || customer.companyName} (${customer.industry})
MATCH SCORE: ${leadScore}%

Return strict JSON:
{
  "headline": "Catchy 6-8 word pitch headline",
  "pitch": "Concise 3-paragraph outreach pitch text",
  "suggestedPricing": "Suggested rate with discount rationale",
  "whyMatch": "2-sentence strategic rationale",
  "strategy": "Recommended negotiation tactic",
  "nextAction": "Suggested immediate CTA"
}`;
}
