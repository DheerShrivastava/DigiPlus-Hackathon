export function buildMarketInsightPrompt(aggregatedStats) {
  return `You are an AI market intelligence analyst for OOH advertising in India.
Analyze these aggregated database statistics:

STATS:
- Total Inventory: ${aggregatedStats.totalHoardings} sites
- Expiring in 90 Days: ${aggregatedStats.vacanciesNext90Days} sites
- Revenue At Risk: ₹${aggregatedStats.revenueAtRisk}
- Highest Occupancy City: ${aggregatedStats.topCity || 'Mumbai'}
- Top Ad Category: ${aggregatedStats.topIndustry || 'Quick Commerce'}

Generate 4 strategic market insights. Return strict JSON array:
[
  {
    "id": 1,
    "type": "Demand Surge",
    "icon": "TrendingUp",
    "badgeColor": "emerald",
    "title": "Short title",
    "content": "Description of insight grounded in data",
    "metric": "Key metric badge",
    "timestamp": "Just now"
  }
]`;
}
