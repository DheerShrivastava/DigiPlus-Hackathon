export function scoreLead(hoarding, customer, totalCustomerBookings, siteCustomerBookings, incumbentCustomerId) {
  // Start with a lower base score so it doesn't artificially cap at 99 easily
  let score = 20.0;
  const reasons = [];

  const monthlyRate = Number(hoarding.monthly_rate_inr);
  const budgetBand = (customer.budget_band || '').toLowerCase();

  // 1. Budget Fit Rule
  if (budgetBand === 'low' && monthlyRate > 200000) {
    // Low budget cannot afford premium site - exclude!
    return null;
  } else if (budgetBand === 'high') {
    score += 15.0;
    reasons.push(`High budget band (${customer.budget_band}) easily affords rate of ₹${monthlyRate.toLocaleString('en-IN')}/mo`);
  } else if (budgetBand === 'mid' && monthlyRate <= 250000) {
    score += 10.0;
    reasons.push(`Mid budget band aligns well with site rate of ₹${monthlyRate.toLocaleString('en-IN')}/mo`);
  } else if (budgetBand === 'low' && monthlyRate <= 180000) {
    score += 5.0;
    reasons.push(`Low budget band matches affordable site rate card`);
  }

  // 2. Relationship Score
  const relScore = Number(customer.relationship_score) || 5;
  score += relScore * 2.0; // Max +20
  if (relScore >= 7) {
    reasons.push(`Strong client relationship (Score: ${relScore}/10)`);
  } else if (relScore <= 3) {
    reasons.push(`⚠️ Cold relationship (Score: ${relScore}/10) - Needs re-engagement pitch`);
  }

  // 3. Past Booking History
  if (siteCustomerBookings > 0) {
    score += 20.0;
    reasons.push(`Repeat customer: Previously booked this exact site ${siteCustomerBookings} time(s)`);
  } else if (totalCustomerBookings > 0) {
    score += 10.0;
    reasons.push(`Established network client: Has booked ${totalCustomerBookings} total campaign(s) across network`);
  } else {
    score += 2.0;
    reasons.push(`New prospective client for site based on regional strategy`);
  }

  // 4. Industry Fit
  const industry = (customer.industry || '').toLowerCase();
  const location = (hoarding.location || '').toLowerCase();

  if (location.includes('bkc') && ['finance', 'real_estate', 'jewellery', 'electronics'].includes(industry)) {
    score += 20.0;
    reasons.push(`Prime industry match: ${customer.industry} targeted at BKC financial hub footfall`);
  } else if (location.includes('andheri') && ['fmcg', 'retail', 'automotive', 'jewellery'].includes(industry)) {
    score += 15.0;
    reasons.push(`High conversion area for ${customer.industry} near metro commuter flows`);
  } else if ((location.includes('hiranandani') || location.includes('powai')) && ['real_estate', 'healthcare', 'education'].includes(industry)) {
    score += 18.0;
    reasons.push(`Affluent residential demographic fit for ${customer.industry}`);
  } else {
    score += 5.0;
    reasons.push(`Good regional exposure for ${customer.industry} brand campaign`);
  }

  // 5. Churn Prediction
  const isIncumbent = (customer.customer_id === incumbentCustomerId);
  let churnRisk = 'Low';
  let churnProb = 0.15;
  if (isIncumbent) {
    score += 4.0; // Small bonus for being incumbent
    if (relScore >= 7) {
      churnRisk = 'Low';
      churnProb = 0.20;
      reasons.push('Incumbent client with high renewal likelihood due to strong relationship');
    } else {
      churnRisk = 'High';
      churnProb = 0.75;
      reasons.push('⚠️ Incumbent client at risk of churn (Low contact/relationship score)');
    }
  }

  // Add some slight dynamic variation based on traffic score just to differentiate ties
  score += (Number(hoarding.traffic_score) || 5) * 0.5;

  const matchScore = Math.min(99.0, Math.max(10.0, score));

  return {
    customer_id: customer.customer_id,
    customer_name: customer.name,
    industry: customer.industry,
    budget_band: customer.budget_band,
    relationship_score: Number(customer.relationship_score),
    match_score: Number(matchScore.toFixed(1)),
    reasons,
    churn_risk: churnRisk,
    churn_probability: churnProb
  };
}
