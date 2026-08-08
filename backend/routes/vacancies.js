import { Router } from 'express';
import { fetchLiveSupabasePipeline } from '../services/supabaseService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { vacancies } = await fetchLiveSupabasePipeline();
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.get('/:site_id', async (req, res) => {
  try {
    const { vacancies } = await fetchLiveSupabasePipeline();
    const v = vacancies.find((item) => item.site_id === req.params.site_id);
    if (!v) return res.status(404).json({ detail: 'No upcoming vacancy for this site' });
    res.json(v);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
