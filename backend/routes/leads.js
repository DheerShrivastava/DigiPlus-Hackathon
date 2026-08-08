import { Router } from 'express';
import { dataStore } from '../models/dataStore.js';
import { getLeadsForSite } from '../services/vacancyPipeline.js';

const router = Router();

router.get('/:site_id/leads', (req, res) => {
  const leads = getLeadsForSite(
    req.params.site_id,
    dataStore.hoardings,
    dataStore.bookings,
    dataStore.customers
  );
  if (!leads) return res.status(404).json({ detail: 'Site not found' });
  res.json({ site_id: req.params.site_id, leads, top_3: leads.slice(0, 3) });
});

export default router;
