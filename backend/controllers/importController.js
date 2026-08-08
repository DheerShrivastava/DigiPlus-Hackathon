import Hoarding from "../models/Hoarding.js";
import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";

export async function importHoardingsApi(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No hoarding items provided for import" });
    }

    let inserted = 0;
    let updated = 0;
    let invalid = 0;

    for (const item of items) {
      if (!item.location || !item.monthlyRate) {
        invalid++;
        continue;
      }

      const hoardingId = item.hoardingId || `H-${Math.floor(100 + Math.random() * 900)}`;

      const data = {
        hoardingId,
        location: item.location,
        city: item.city || "Mumbai",
        area: item.area || item.city || "Urban",
        latitude: parseFloat(item.latitude) || 19.0760,
        longitude: parseFloat(item.longitude) || 72.8777,
        size: item.size || "60ft x 30ft",
        trafficScore: parseInt(item.trafficScore) || 85,
        monthlyRate: parseFloat(item.monthlyRate),
        occupancyRate: parseInt(item.occupancyRate) || 85,
        demandScore: parseInt(item.demandScore) || 88,
        demandLevel: item.demandLevel || "High",
        status: item.status || "EXPIRING",
        revenueAtRisk: parseFloat(item.monthlyRate) * 2
      };

      const result = await Hoarding.findOneAndUpdate(
        { hoardingId },
        { $set: data },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) updated++;
      else inserted++;
    }

    res.json({
      success: true,
      summary: {
        totalRows: items.length,
        inserted,
        updated,
        invalid
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function importCustomersApi(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No customer items provided for import" });
    }

    let inserted = 0;
    let updated = 0;
    let invalid = 0;

    for (const item of items) {
      if (!item.companyName || !item.industry) {
        invalid++;
        continue;
      }

      const customerData = {
        customerId: item.customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`,
        name: item.name || item.companyName,
        companyName: item.companyName,
        industry: item.industry,
        email: item.email || `contact@${item.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: item.phone || "+91 98200 00000",
        budgetMin: parseFloat(item.budgetMin) || 500000,
        budgetMax: parseFloat(item.budgetMax) || 2000000,
        budgetBand: item.budgetBand || "₹5L - ₹20L / mo",
        relationshipScore: parseInt(item.relationshipScore) || 80,
        customerStatus: item.customerStatus || "ACTIVE"
      };

      const result = await Customer.findOneAndUpdate(
        { companyName: item.companyName },
        { $set: customerData },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) updated++;
      else inserted++;
    }

    res.json({
      success: true,
      summary: {
        totalRows: items.length,
        inserted,
        updated,
        invalid
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function importBookingsApi(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No booking items provided for import" });
    }

    let inserted = 0;
    let updated = 0;
    let invalid = 0;

    for (const item of items) {
      if (!item.bookingId || !item.hoardingId || !item.customerId) {
        invalid++;
        continue;
      }

      const hoardingDoc = await Hoarding.findOne({ hoardingId: item.hoardingId });
      const customerDoc = await Customer.findOne({ customerId: item.customerId });

      if (!hoardingDoc || !customerDoc) {
        invalid++;
        continue;
      }

      const bookingData = {
        bookingId: item.bookingId,
        hoardingId: hoardingDoc._id,
        customerId: customerDoc._id,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        monthlyRate: parseFloat(item.monthlyRate) || hoardingDoc.monthlyRate,
        totalRevenue: parseFloat(item.totalRevenue) || (hoardingDoc.monthlyRate * 3),
        status: item.status || "ACTIVE",
        campaignName: item.campaignName || "OOH Brand Push",
        industry: item.industry || customerDoc.industry
      };

      const result = await Booking.findOneAndUpdate(
        { bookingId: item.bookingId },
        { $set: bookingData },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) updated++;
      else inserted++;
    }

    res.json({
      success: true,
      summary: {
        totalRows: items.length,
        inserted,
        updated,
        invalid
      }
    });
  } catch (err) {
    next(err);
  }
}
