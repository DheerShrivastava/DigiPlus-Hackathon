import { Router } from 'express';
import { fetchLiveSupabasePipeline } from '../services/supabaseService.js';

const router = Router();

router.get('/summary', async (req, res) => {
  try {
    const { hoardings, customers, bookings, vacancies, hoardingStatuses } = await fetchLiveSupabasePipeline();

    const totalRisk = vacancies.reduce((sum, v) => sum + v.revenue_at_risk, 0);
    const occupiedCount = hoardingStatuses.filter((h) => h.status !== 'vacant').length;
    const occupancyRate =
      hoardingStatuses.length > 0
        ? Number(((occupiedCount / hoardingStatuses.length) * 100).toFixed(1))
        : 0;

    res.json({
      total_hoardings: hoardings.length,
      total_customers: customers.length,
      total_bookings: bookings.length,
      upcoming_vacancies_count: vacancies.length,
      total_revenue_at_risk: totalRisk,
      city: 'Mumbai',
      average_occupancy_rate: occupancyRate,
      pipeline_last_run: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
