import { Router } from 'express';
import { sendPitchEmail } from '../services/emailService.js';

const router = Router();

router.post('/send', async (req, res) => {
  try {
    const { to_email, subject, body, customer_name, site_id } = req.body;
    if (!to_email || !subject || !body) {
      return res.status(400).json({ detail: 'to_email, subject, and body are required' });
    }
    const result = await sendPitchEmail({ to_email, subject, body, customer_name, site_id });
    res.json({ status: 'success', ...result });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ detail: 'Failed to send email', error: err.message });
  }
});

export default router;
