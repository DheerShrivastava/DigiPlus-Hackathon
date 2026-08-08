import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ detail: 'Email is required' });
  }
  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '24h' });
  return res.json({ access_token: token, token_type: 'bearer', email });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required' });
  }
  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '24h' });
  return res.status(201).json({ access_token: token, token_type: 'bearer', email });
});

export default router;
