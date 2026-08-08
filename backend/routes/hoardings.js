import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { fetchLiveSupabasePipeline } from '../services/supabaseService.js';
import { getCoordsForSite } from '../mumbaiCoords.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { hoardingStatuses } = await fetchLiveSupabasePipeline();
    res.json(hoardingStatuses);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.get('/:site_id', async (req, res) => {
  try {
    const { hoardingStatuses } = await fetchLiveSupabasePipeline();
    const site = hoardingStatuses.find(h => h.site_id === req.params.site_id);
    if (!site) return res.status(404).json({ detail: 'Hoarding not found' });
    res.json(site);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { site_id, location, size_sqft, traffic_score, monthly_rate_inr, latitude, longitude } = req.body;

    let lat = latitude;
    let lng = longitude;
    if (!lat || !lng) {
      [lat, lng] = getCoordsForSite(site_id, location);
    }

    const newRow = {
      site_id,
      location,
      size_sqft: Number(size_sqft),
      traffic_score: Number(traffic_score),
      monthly_rate_inr: Number(monthly_rate_inr),
      latitude: Number(lat),
      longitude: Number(lng)
    };

    const { data, error } = await supabase
      .from('hoardings')
      .insert([newRow])
      .select();

    if (error) {
      return res.status(400).json({ detail: error.message });
    }

    res.status(201).json(data[0] || newRow);
  } catch (err) {
    res.status(400).json({ detail: err.message });
  }
});

router.delete('/:site_id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('hoardings')
      .delete()
      .eq('site_id', req.params.site_id);

    if (error) {
      return res.status(400).json({ detail: error.message });
    }

    res.json({ message: 'Hoarding removed successfully' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
