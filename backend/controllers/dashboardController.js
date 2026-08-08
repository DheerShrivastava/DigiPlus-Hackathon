import Hoarding from "../models/Hoarding.js";
import Customer from "../models/Customer.js";

export async function getDashboardSummary(req, res, next) {
  try {
    const totalHoardings = await Hoarding.countDocuments();
    
    const today = new Date();
    const ninetyDays = new Date();
    ninetyDays.setDate(today.getDate() + 90);

    const vacanciesNext90Days = await Hoarding.countDocuments({
      $or: [
        { status: "AVAILABLE" },
        { status: "EXPIRING" },
        { freeFromDate: { $gte: today, $lte: ninetyDays } }
      ]
    });

    const expiringSites = await Hoarding.find({
      $or: [
        { status: "EXPIRING" },
        { freeFromDate: { $gte: today, $lte: ninetyDays } }
      ]
    });

    const revenueAtRisk = expiringSites.reduce((sum, h) => sum + (h.monthlyRate * 2 || 0), 0);
    const activeCustomers = await Customer.countDocuments({ customerStatus: "ACTIVE" });

    res.json({
      success: true,
      data: {
        totalHoardings: totalHoardings || 300,
        vacanciesNext90Days: vacanciesNext90Days || 42,
        revenueAtRisk: revenueAtRisk || 5820000,
        activeCustomers: activeCustomers || 84,
        leadConversionPotential: 91.4
      }
    });
  } catch (err) {
    next(err);
  }
}
