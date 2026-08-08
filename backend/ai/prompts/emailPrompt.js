export function buildEmailPrompt(hoarding, customer, lead, tone = "professional") {
  return `Write a B2B sales email for an OOH billboard inventory release.

TONE: ${tone} (Options: professional, friendly, urgent, premium)
BILLBOARD: ${hoarding.location} (${hoarding.size}, Rate: ₹${hoarding.monthlyRate}/mo, Free from ${hoarding.freeFromDate})
CLIENT: ${customer.customerName || customer.companyName} (${customer.industry})

Return JSON:
{
  "subject": "Compelling subject line",
  "body": "Well structured email body with greeting, value prop, site stats, and signoff",
  "offer": "Recommended rate/discount badge text",
  "cta": "Clear call to action button text"
}`;
}
