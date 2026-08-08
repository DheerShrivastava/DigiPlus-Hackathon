import Booking from "../models/Booking.js";

export async function getBookings(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase();
    }
    if (req.query.industry) {
      filter.industry = new RegExp(req.query.industry, "i");
    }

    const bookings = await Booking.find(filter)
      .populate("hoardingId", "hoardingId location city monthlyRate size")
      .populate("customerId", "name companyName industry email phone relationshipScore")
      .sort({ startDate: -1 })
      .limit(100);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("hoardingId")
      .populate("customerId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking record not found" });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
}
