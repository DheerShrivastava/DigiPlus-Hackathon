import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'digiplus-secret-key-2026';

router.post('/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email: email || 'admin@digiplus.com' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ access_token: token, token_type: 'bearer' });
});

export default router;
