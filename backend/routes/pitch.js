import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';
import { scoreLead } from '../leadScorer.js';
import { generateAiPitch } from '../aiPitch.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { site_id, customer_id, suggested_rate } = req.body;

    const [{ data: hoardings }, { data: customers }, { data: bookings }] = await Promise.all([
      supabase.from('hoardings').select('*').eq('site_id', site_id),
      supabase.from('customers').select('*').eq('customer_id', customer_id),
      supabase.from('bookings').select('*')
    ]);

    const h = (hoardings || [])[0];
    const c = (customers || [])[0];

    if (!h || !c) {
      return res.status(404).json({ detail: 'Site or Customer not found' });
    }

    const allB = bookings || [];
    const siteBookings = allB.filter(b => b.site_id === h.site_id);
    const totalCustBookings = allB.filter(b => b.customer_id === c.customer_id).length;
    const siteCustBookings = siteBookings.filter(b => b.customer_id === c.customer_id).length;

    const leadData = scoreLead(h, c, totalCustBookings, siteCustBookings, null);
    const reasons = leadData ? leadData.reasons : ['High conversion area for industry footfall'];

    const rate = suggested_rate || h.monthly_rate_inr;
    const pitchText = await generateAiPitch(h, c, rate, reasons);

    res.json({
      site_id: h.site_id,
      customer_id: c.customer_id,
      customer_name: c.name,
      suggested_rate: rate,
      card_rate: h.monthly_rate_inr,
      pitch_text: pitchText,
      reasons
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
