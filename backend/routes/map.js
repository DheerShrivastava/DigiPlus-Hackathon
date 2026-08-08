import { Router } from 'express';
import { fetchLiveSupabasePipeline } from '../services/supabaseService.js';

const router = Router();

router.get('/heatmap', async (req, res) => {
  try {
    const { hoardingStatuses } = await fetchLiveSupabasePipeline();
    const points = hoardingStatuses.map((h) => ({
      site_id: h.site_id,
      location: h.location,
      latitude: h.latitude,
      longitude: h.longitude,
      status: h.status,
      days_until_vacant: h.days_until_vacant,
      monthly_rate_inr: h.monthly_rate_inr,
      traffic_score: h.traffic_score,
      size_sqft: h.size_sqft,
      current_customer: h.current_customer,
    }));
    res.json({ city: 'Mumbai', points, total: points.length });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
