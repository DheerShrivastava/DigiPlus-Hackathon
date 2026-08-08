export function scoreLead(hoarding, customer, totalCustBookings = 0, siteCustBookings = 0, incumbentCustomerId = null) {
  if (!hoarding || !customer) return null;

  // Strict budget exclusion rule
  if (hoarding.monthly_rate_inr > 200000 && customer.budget_band === 'Low') {
    return null;
  }

  let score = 55;
  const reasons = [];

  // Budget fit
  if (customer.budget_band === 'High' && hoarding.monthly_rate_inr >= 200000) {
    score += 18;
    reasons.push('High budget capacity aligns with premium rate card');
  } else if (customer.budget_band === 'Medium') {
    score += 10;
    reasons.push('Budget band matches monthly rate target');
  }

  // Relationship score
  const relScore = Number(customer.relationship_score || 5);
  if (relScore >= 8) {
    score += 15;
    reasons.push(`Strong relationship score (${relScore}/10)`);
  } else if (relScore <= 3) {
    reasons.push(`⚠️ Cold relationship (${relScore}/10) - Needs re-engagement`);
  }

  // Past bookings history
  if (siteCustBookings > 0) {
    score += 16;
    reasons.push(`Previously booked this exact site (${siteCustBookings} times)`);
  } else if (totalCustBookings > 0) {
    score += 10;
    reasons.push(`Active repeat advertiser across network (${totalCustBookings} bookings)`);
  }

  // Industry fit & location matching
  const locLower = (hoarding.location || '').toLowerCase();
  const indLower = (customer.industry || '').toLowerCase();

  if (locLower.includes('bkc') && (indLower.includes('finance') || indLower.includes('jewel') || indLower.includes('real estate'))) {
    score += 15;
    reasons.push(`High conversion zone for ${customer.industry} in BKC commercial hub`);
  } else if (locLower.includes('andheri') && (indLower.includes('fmcg') || indLower.includes('retail') || indLower.includes('auto'))) {
    score += 12;
    reasons.push(`High traffic footprint fit for ${customer.industry} in Andheri`);
  } else {
    reasons.push(`Target demographic alignment for ${customer.industry} sector`);
  }

  // Cap score realistically
  const finalScore = Math.min(96, Math.max(45, Math.round(score)));
  const churnRisk = relScore <= 4 ? 'High' : 'Low';
  const churnProb = relScore <= 4 ? 0.65 : 0.15;

  return {
    customer_id: customer.customer_id,
    customer_name: customer.name,
    industry: customer.industry,
    budget_band: customer.budget_band,
    relationship_score: relScore,
    match_score: finalScore,
    churn_risk: churnRisk,
    churn_probability: churnProb,
    reasons
  };
}
