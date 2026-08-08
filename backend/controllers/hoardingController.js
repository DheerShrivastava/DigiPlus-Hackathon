import Hoarding from "../models/Hoarding.js";

// Helper for automatic demand score & level calculation
function computeDemandMetrics(body) {
  const occ = Number(body.occupancyRate) >= 0 ? Number(body.occupancyRate) : 85;
  const traf = Number(body.trafficScore) >= 0 ? Number(body.trafficScore) : 80;
  const freqRaw = Number(body.bookingFrequency) >= 0 ? Number(body.bookingFrequency) : 20;

  // Normalize frequency to 0-100 scale (assuming 30 campaigns/yr max benchmark)
  const freqNorm = Math.min(100, Math.max(0, freqRaw > 100 ? freqRaw : Math.round((freqRaw / 30) * 100)));

  const demandScore = Math.min(100, Math.max(0, Math.round(
    (occ * 0.4) + (traf * 0.3) + (freqNorm * 0.3)
  )));

  let demandLevel = "medium";
  if (demandScore >= 80) demandLevel = "high";
  else if (demandScore <= 49) demandLevel = "low";

  const monthlyRate = Number(body.monthlyRate) || 0;
  const revenueAtRisk = body.revenueAtRisk !== undefined ? Number(body.revenueAtRisk) : monthlyRate;

  return {
    ...body,
    trafficScore: traf,
    occupancyRate: occ,
    bookingFrequency: freqRaw,
    revenueAtRisk,
    demandScore,
    demandLevel,
    status: (body.status || "available").toLowerCase()
  };
}

export async function getHoardings(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.city && req.query.city !== 'all') {
      filter.city = new RegExp(req.query.city, "i");
    }

    if (req.query.status && req.query.status !== 'all') {
      filter.status = new RegExp(req.query.status, "i");
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { hoardingId: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
        { area: searchRegex }
      ];
    }

    const total = await Hoarding.countDocuments(filter);
    const hoardings = await Hoarding.find(filter)
      .sort({ createdAt: -1, demandScore: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: hoardings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: hoardings
    });
  } catch (err) {
    next(err);
  }
}

export async function getHoardingById(req, res, next) {
  try {
    const hoarding = await Hoarding.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { hoardingId: req.params.id }]
    });

    if (!hoarding) {
      return res.status(404).json({ success: false, message: "Hoarding site not found" });
    }
    res.json({ success: true, data: hoarding });
  } catch (err) {
    next(err);
  }
}

export async function createHoarding(req, res, next) {
  try {
    const { hoardingId, location, city, latitude, longitude, size, monthlyRate, trafficScore, visibilityScore, occupancyRate } = req.body;

    // 1. Required fields validation
    if (!hoardingId || !location || !city || latitude === undefined || longitude === undefined || !size || monthlyRate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: hoardingId, location, city, latitude, longitude, size, and monthlyRate are required."
      });
    }

    // 2. Latitude and Longitude validation
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Valid latitude (-90 to 90) and longitude (-180 to 180) are required for map placement."
      });
    }

    // 3. Numeric ranges validation
    const rate = Number(monthlyRate);
    if (isNaN(rate) || rate < 0) {
      return res.status(400).json({ success: false, message: "Validation Error: Monthly rate must be >= 0." });
    }

    if (trafficScore !== undefined && (Number(trafficScore) < 0 || Number(trafficScore) > 100)) {
      return res.status(400).json({ success: false, message: "Validation Error: Traffic score must be between 0 and 100." });
    }

    if (visibilityScore !== undefined && (Number(visibilityScore) < 0 || Number(visibilityScore) > 100)) {
      return res.status(400).json({ success: false, message: "Validation Error: Visibility score must be between 0 and 100." });
    }

    if (occupancyRate !== undefined && (Number(occupancyRate) < 0 || Number(occupancyRate) > 100)) {
      return res.status(400).json({ success: false, message: "Validation Error: Occupancy rate must be between 0 and 100." });
    }

    // 4. Check duplicate hoardingId
    const existing = await Hoarding.findOne({ hoardingId: hoardingId.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Hoarding ID '${hoardingId}' already exists in MongoDB database. Please use a unique Hoarding ID.`
      });
    }

    // 5. Automatic calculations
    const processedData = computeDemandMetrics({
      ...req.body,
      hoardingId: hoardingId.trim(),
      latitude: lat,
      longitude: lng,
      monthlyRate: rate
    });

    // 6. Save document
    const newHoarding = await Hoarding.create(processedData);

    // 7. Return created MongoDB document
    res.status(201).json({
      success: true,
      message: "Hoarding created successfully",
      data: newHoarding
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map(e => e.message).join(", ")
      });
    }
    next(err);
  }
}

export async function updateHoarding(req, res, next) {
  try {
    const id = req.params.id;

    // Validate coordinates if updating them
    if (req.body.latitude !== undefined || req.body.longitude !== undefined) {
      const lat = Number(req.body.latitude);
      const lng = Number(req.body.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({
          success: false,
          message: "Validation Error: Valid latitude (-90 to 90) and longitude (-180 to 180) are required."
        });
      }
    }

    const updateData = computeDemandMetrics(req.body);

    const updated = await Hoarding.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { hoardingId: id }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Hoarding site not found" });
    }

    res.json({
      success: true,
      message: "Hoarding updated successfully",
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteHoarding(req, res, next) {
  try {
    const id = req.params.id;
    const deleted = await Hoarding.findOneAndDelete({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { hoardingId: id }]
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Hoarding site not found" });
    }

    res.json({
      success: true,
      message: "Hoarding deleted successfully",
      data: deleted
    });
  } catch (err) {
    next(err);
  }
}

export async function getVacanciesNext90Days(req, res, next) {
  try {
    const today = new Date();
    const ninetyDays = new Date();
    ninetyDays.setDate(today.getDate() + 90);

    const vacancies = await Hoarding.find({
      $or: [
        { status: "available" },
        { status: "AVAILABLE" },
        { status: "expiring" },
        { status: "EXPIRING" },
        { freeFromDate: { $gte: today, $lte: ninetyDays } }
      ]
    }).sort({ freeFromDate: 1 });

    res.json({ success: true, count: vacancies.length, data: vacancies });
  } catch (err) {
    next(err);
  }
}

export async function getHeatmapData(req, res, next) {
  try {
    const hoardings = await Hoarding.find().select(
      "hoardingId location city area latitude longitude size trafficScore visibilityScore monthlyRate occupancyRate bookingFrequency demandScore demandLevel revenueGenerated revenueAtRisk status"
    );

    const mapPoints = hoardings.map((h) => ({
      id: h._id,
      hoardingId: h.hoardingId,
      location: h.location,
      city: h.city,
      area: h.area,
      latitude: h.latitude,
      longitude: h.longitude,
      size: h.size,
      format: h.format || "Billboard",
      trafficScore: h.trafficScore || 80,
      visibilityScore: h.visibilityScore || 80,
      monthlyRate: h.monthlyRate,
      occupancyRate: h.occupancyRate || 85,
      bookingFrequency: h.bookingFrequency || 20,
      demandScore: h.demandScore || 80,
      demandLevel: (h.demandLevel || "medium").toLowerCase(),
      revenueGenerated: h.revenueGenerated || 0,
      revenueAtRisk: h.revenueAtRisk || h.monthlyRate || 0,
      status: h.status || "available"
    }));

    res.json({ success: true, count: mapPoints.length, data: mapPoints });
  } catch (err) {
    next(err);
  }
}
