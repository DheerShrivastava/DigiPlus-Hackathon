import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) return res.status(500).json({ detail: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.get('/:customer_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_id', req.params.customer_id)
      .single();

    if (error || !data) return res.status(404).json({ detail: 'Customer not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
