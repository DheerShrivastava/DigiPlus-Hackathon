const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message || `API Request Failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`⚠️ API Request Failed [${endpoint}]:`, error.message);
    throw error;
  }
}

// 1. Health Check
export async function getHealth() {
  return request("/health");
}

// 2. Dashboard KPI Summary
export async function getDashboardSummary() {
  return request("/dashboard/summary");
}

// 3. Hoarding Site APIs
export async function getHoardings(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/hoardings${query ? `?${query}` : ''}`);
}

export async function getHoardingById(id) {
  return request(`/hoardings/${id}`);
}

export async function createHoarding(data) {
  return request("/hoardings", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateHoarding(id, data) {
  return request(`/hoardings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export async function deleteHoarding(id) {
  return request(`/hoardings/${id}`, {
    method: "DELETE"
  });
}

export async function getVacancies90Days() {
  return request("/hoardings/vacancies/90-days");
}

export async function getHeatmapData() {
  return request("/hoardings/heatmap");
}

// 4. Customer APIs
export async function getCustomers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/customers${query ? `?${query}` : ''}`);
}

export async function getCustomerById(id) {
  return request(`/customers/${id}`);
}

// 5. Booking APIs
export async function getBookings(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/bookings${query ? `?${query}` : ''}`);
}

export async function getBookingById(id) {
  return request(`/bookings/${id}`);
}

// 6. Lead Recommendations API
export async function getLeadRecommendations(hoardingId) {
  return request(`/leads/recommendations/${hoardingId}`);
}

// 7. AI Features
export async function fetchCopilotPitch(hoarding, customer, leadScore) {
  return request("/ai/copilot", {
    method: "POST",
    body: JSON.stringify({ hoarding, customer, leadScore })
  });
}

export async function fetchGeneratedEmail(hoarding, customer, lead, tone = "professional") {
  return request("/ai/email", {
    method: "POST",
    body: JSON.stringify({ hoarding, customer, lead, tone })
  });
}

export async function fetchPricingRecommendation(hoarding, customer) {
  return request("/ai/pricing", {
    method: "POST",
    body: JSON.stringify({ hoarding, customer })
  });
}

export async function getAIInsights() {
  return request("/ai/insights");
}

// 8. Outreach APIs
export async function fetchOutreachList() {
  return request("/outreach");
}

export async function sendOutreachAction(payload) {
  return request("/outreach", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

// 9. Analytics APIs
export async function getAnalyticsRevenueRisk() {
  return request("/analytics/revenue-risk");
}

export async function getAnalyticsVacancyForecast() {
  return request("/analytics/vacancy-forecast");
}

export async function getAnalyticsOccupancy() {
  return request("/analytics/occupancy");
}

export async function getAnalyticsTopLocations() {
  return request("/analytics/top-locations");
}

export async function getAnalyticsCustomerIndustries() {
  return request("/analytics/customer-industries");
}

export async function getAnalyticsCities() {
  return request("/analytics/cities");
}

export async function getAnalyticsBookingFrequency() {
  return request("/analytics/booking-frequency");
}

export async function getAnalyticsAverageRates() {
  return request("/analytics/average-rates");
}

// 10. CSV Import APIs
export async function importCsvHoardings(items) {
  return request("/import/hoardings", {
    method: "POST",
    body: JSON.stringify({ items })
  });
}

export async function importCsvCustomers(items) {
  return request("/import/customers", {
    method: "POST",
    body: JSON.stringify({ items })
  });
}

export async function importCsvBookings(items) {
  return request("/import/bookings", {
    method: "POST",
    body: JSON.stringify({ items })
  });
}