# Smart Leads Agent for Hoardings — API Documentation

Comprehensive REST API reference for the Out-of-Home (OOH) Sales Intelligence Platform.

**Base URL**: `http://localhost:5000/api`

---

## 1. System & Health

### `GET /health`
Returns system health, MongoDB Atlas connection status, and Gemini AI status.

**Response**:
```json
{
  "success": true,
  "message": "Backend is healthy",
  "database": "connected",
  "ai": "configured"
}
```

---

## 2. Executive Dashboard & Metrics

### `GET /dashboard/summary`
Calculates portfolio KPI statistics from MongoDB.

**Response**:
```json
{
  "success": true,
  "data": {
    "totalHoardings": 300,
    "vacanciesNext90Days": 42,
    "revenueAtRisk": 5820000,
    "activeCustomers": 84,
    "leadConversionPotential": 91.4
  }
}
```

---

## 3. Hoarding Site Inventory

### `GET /hoardings`
Fetch paginated billboard inventory with live city, status, and text search filters.

**Query Parameters**:
- `page`: Page number (default `1`)
- `limit`: Items per page (default `50`)
- `city`: Filter by city (e.g. `Mumbai`, `Delhi`)
- `status`: Filter status (`AVAILABLE`, `BOOKED`, `EXPIRING`, `MAINTENANCE`)
- `search`: Keyword search across location, city, area, or ID

**Response**:
```json
{
  "success": true,
  "count": 50,
  "total": 300,
  "page": 1,
  "pages": 6,
  "data": [...]
}
```

### `GET /hoardings/vacancies/90-days`
Fetch sites expiring within the next 90 days.

### `GET /hoardings/heatmap`
Geo-spatial demand markers for Leaflet map integration.

---

## 4. Deterministic Lead Recommendation Engine

### `GET /leads/recommendations/:hoardingId`
Calculates top 3 matching corporate advertisers using a deterministic scoring engine:
- **Industry Fit**: 25%
- **Budget Fit**: 25%
- **Historical Booking Match**: 25%
- **Relationship Strength**: 25%

**Response**:
```json
{
  "success": true,
  "hoardingId": "H-101",
  "location": "Worli Sea Link Flyover",
  "count": 3,
  "data": [
    {
      "id": "CUST-001",
      "customerName": "Swiggy Instamart",
      "industry": "Quick Commerce & Retail",
      "budgetBand": "₹10L - ₹25L / mo",
      "relationshipScore": 96,
      "leadScore": 97,
      "matchGrade": "A+",
      "reasoning": {
        "industryFit": "High-density residential & office commute corridor targets 15-minute Grocery Delivery demographic.",
        "budgetFit": "Client's Q3 OOH expansion budget accommodates monthly ask.",
        "historicalMatch": "Previously booked Worli & Lower Parel sites with 4.1x app conversion lift.",
        "relationshipStrength": "Active Master Services Agreement with priority status."
      },
      "scoreBreakdown": {
        "industryFitScore": 98,
        "budgetFitScore": 94,
        "historicalMatchScore": 97,
        "relationshipScoreVal": 99
      },
      "suggestedPricing": "₹8,15,000 / mo"
    }
  ]
}
```

---

## 5. Gemini AI Services

### `POST /ai/copilot`
Generates personalized sales pitches, why-match bullet points, and pricing recommendations.

### `POST /ai/email`
Generates cold outreach email with selectable tones (`professional`, `friendly`, `urgent`, `premium`).

### `POST /ai/pricing`
Generates AI dynamic pricing recommendations with floor & ceiling limits.

### `GET /ai/insights`
Synthesizes portfolio database aggregations into natural language market alerts (Cached for 30 minutes).

---

## 6. Outreach Management

### `POST /outreach`
Save draft or schedule cold outreach.

### `POST /outreach/:id/send`
Dispatches email or simulates dispatch in `DEMO_EMAIL_MODE=true`.

---

## 7. Executive Analytics

- `GET /analytics/revenue-risk`
- `GET /analytics/vacancy-forecast`
- `GET /analytics/occupancy`
- `GET /analytics/top-locations`
- `GET /analytics/customer-industries`
