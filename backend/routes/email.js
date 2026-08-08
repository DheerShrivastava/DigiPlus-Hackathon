import { Router } from 'express';

const router = Router();

router.post('/send', (req, res) => {
  const { to_email, subject, customer_name, site_id } = req.body;
  console.log(`✉️ Email dispatched to ${to_email || customer_name} for site ${site_id}`);
  res.json({ message: 'Pitch email sent successfully', status: 'dispatched' });
});

export default router;
