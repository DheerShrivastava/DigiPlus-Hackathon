import Hoarding from "../models/Hoarding.js";
import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";

export async function getRevenueAtRisk(req, res, next) {
  try {
    const data = await Hoarding.aggregate([
      { $match: { $or: [{ status: "EXPIRING" }, { status: "AVAILABLE" }] } },
      { $group: { _id: { $month: "$freeFromDate" }, totalRevenueAtRisk: { $sum: "$monthlyRate" } } },
      { $sort: { "_id": 1 } }
    ]);

    const months = ["Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027"];
    const fallbackData = [49.0, 57.6, 23.4, 13.8, 8.5, 5.0];

    const values = data.length > 0
      ? data.map(d => Number((d.totalRevenueAtRisk / 100000).toFixed(1)))
      : fallbackData;

    res.json({
      success: true,
      data: {
        labels: months,
        datasets: [
          {
            label: "Revenue at Risk (₹ Lakhs)",
            data: values,
            backgroundColor: "rgba(239, 68, 68, 0.7)",
            borderColor: "#ef4444",
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getVacancyForecast(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
        datasets: [
          {
            label: "Expiring Hoardings Count",
            data: [2, 3, 1, 3, 2, 2, 1, 1],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            fill: true,
            tension: 0.35,
            pointBackgroundColor: "#3b82f6",
            pointRadius: 5
          }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getOccupancyTrend(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep (F)", "Oct (F)"],
        datasets: [
          {
            label: "Occupancy Rate (%)",
            data: [82, 85, 88, 91, 94, 89, 92, 95],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#10b981",
            pointRadius: 5
          }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getTopLocations(req, res, next) {
  try {
    const topLocations = await Hoarding.find().sort({ monthlyRate: -1 }).limit(6);
    const labels = topLocations.length > 0
      ? topLocations.map(h => h.area || h.location.split(',')[0])
      : ["BKC Junction", "Lower Parel", "Worli Sea Link", "Cyber Hub", "Anna Salai", "CP Delhi"];

    const values = topLocations.length > 0
      ? topLocations.map(h => Number((h.monthlyRate / 100000).toFixed(1)))
      : [12.0, 9.8, 8.5, 7.2, 6.2, 6.9];

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{ label: "Monthly Yield (₹ Lakhs)", data: values, backgroundColor: "rgba(99, 102, 241, 0.75)", borderColor: "#6366f1", borderRadius: 6 }]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getCustomerIndustries(req, res, next) {
  try {
    const distribution = await Customer.aggregate([
      { $group: { _id: "$industry", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const labels = distribution.length > 0
      ? distribution.map(d => d._id)
      : ["Quick Commerce", "Automotive", "Fintech", "Consumer Electronics", "Retail & FMCG", "Entertainment"];

    const data = distribution.length > 0 ? distribution.map(d => d.count) : [32, 22, 18, 14, 8, 6];

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{ data, backgroundColor: ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#64748b"], borderWidth: 2 }]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getCitiesAnalytics(req, res, next) {
  try {
    const citiesData = await Hoarding.aggregate([
      { $group: { _id: "$city", totalRevenue: { $sum: "$monthlyRate" } } },
      { $sort: { totalRevenue: -1 } }
    ]);

    const labels = citiesData.length > 0 ? citiesData.map(c => c._id) : ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune"];
    const values = citiesData.length > 0 ? citiesData.map(c => Number((c.totalRevenue / 100000).toFixed(1))) : [185.0, 142.0, 110.0, 85.0, 68.0];

    res.json({
      success: true,
      data: {
        labels,
        datasets: [{ label: "Monthly Portfolio Revenue (₹ Lakhs)", data: values, backgroundColor: "rgba(6, 182, 212, 0.75)", borderRadius: 6 }]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getBookingFrequencyAnalytics(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        labels: ["1-5 Campaigns", "6-12 Campaigns", "13-20 Campaigns", "21-30 Campaigns", "30+ Campaigns"],
        datasets: [{ label: "Hoarding Count", data: [45, 95, 110, 38, 12], backgroundColor: "rgba(147, 51, 234, 0.75)", borderRadius: 6 }]
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAverageRatesAnalytics(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        labels: ["Static Gantry", "Illuminated Unipole", "Frontlit Board", "Digital 4K Screen", "Dual LED Unipole"],
        datasets: [{ label: "Avg Rate (₹ Lakhs)", data: [5.2, 7.8, 6.5, 12.0, 9.8], backgroundColor: "rgba(245, 158, 11, 0.75)", borderRadius: 6 }]
      }
    });
  } catch (err) {
    next(err);
  }
}
