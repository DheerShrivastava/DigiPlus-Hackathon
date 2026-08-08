export async function generateAiPitch(hoarding, customer, rate, reasons = []) {
  const siteId = hoarding.site_id;
  const location = hoarding.location;
  const size = hoarding.size_sqft;
  const traffic = hoarding.traffic_score;
  const custName = customer.name;
  const offerRate = rate ? Number(rate).toLocaleString('en-IN') : Number(hoarding.monthly_rate_inr).toLocaleString('en-IN');

  const reasonBullets = reasons.map(r => `• ${r}`).join('\n');

  return `Dear ${custName} Team,

We are pleased to offer you an exclusive booking opportunity for high-impact OOH advertising in Mumbai.

📍 Billboard Site: ${siteId} - ${location}
📐 Dimensions: ${size} sq.ft Prime Display
🚗 Commuter Traffic Score: ${traffic}/10
💰 Priority Monthly Rate: ₹${offerRate}/month

Why this site is perfect for ${custName}:
${reasonBullets}

This high-visibility site is available starting next month. Please reply to lock in this priority placement.

Best regards,
DigiPlus Smart Leads Team
Mumbai OOH Network`;
}
