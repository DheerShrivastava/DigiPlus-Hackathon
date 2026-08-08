import { config } from './config.js';

function buildTemplatePitch(hoarding, customer, suggestedRate, reasons) {
  const rate = suggestedRate || hoarding.monthly_rate_inr;
  const reasonsList = (reasons || []).map((r) => `- ${r}`).join('\n');

  return `Dear ${customer.name} Team,

I hope this email finds you well.

We wanted to reach out regarding a prime outdoor advertising opportunity at ${hoarding.location}, Mumbai (${hoarding.site_id}). This high-impact billboard (${hoarding.size_sqft} sq.ft) boasts an impressive daily traffic score of ${hoarding.traffic_score}/10, delivering massive visibility for brands in the ${customer.industry} sector.

Based on our recent data analysis, this location perfectly aligns with your brand's target regional demographic. Given our strong relationship (Score: ${customer.relationship_score}/10), we are pleased to offer you an exclusive priority rate of ₹${Number(rate).toLocaleString('en-IN')}/month (Card Rate: ₹${Number(hoarding.monthly_rate_inr).toLocaleString('en-IN')}).

Key Reasons to Book Now:
${reasonsList}

This premium site is coming vacant shortly. Please let us know if you would like to reserve this spot or schedule a quick 5-minute call to discuss campaign customization.

Best regards,

Sales Team | DigiPlus Hoarding Network
Mumbai, Maharashtra`;
}

export async function generateAiPitch(hoarding, customer, suggestedRate, reasons) {
  const rate = suggestedRate || hoarding.monthly_rate_inr;

  if (!config.geminiApiKey) {
    return buildTemplatePitch(hoarding, customer, rate, reasons);
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a sales executive at DigiPlus, a Mumbai billboard advertising company.
Write a professional, personalized sales email pitch (150-200 words) to ${customer.name} (${customer.industry} industry, budget: ${customer.budget_band}, relationship score: ${customer.relationship_score}/10).

Site details:
- Location: ${hoarding.location}, Mumbai
- Site ID: ${hoarding.site_id}
- Size: ${hoarding.size_sqft} sq.ft
- Traffic score: ${hoarding.traffic_score}/10
- Offered rate: ₹${Number(rate).toLocaleString('en-IN')}/month (card rate: ₹${Number(hoarding.monthly_rate_inr).toLocaleString('en-IN')})

Key match reasons:
${(reasons || []).map((r) => `- ${r}`).join('\n')}

Write only the email body. Start with "Dear ${customer.name} Team," and end with "Sales Team | DigiPlus Hoarding Network". Use ₹ for currency.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (err) {
    console.warn('Gemini API failed, using template pitch:', err.message);
    return buildTemplatePitch(hoarding, customer, rate, reasons);
  }
}

export { buildTemplatePitch as generateAiPitchSync };
