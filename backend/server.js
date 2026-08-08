import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import hoardingsRoutes from './routes/hoardings.js';
import vacanciesRoutes from './routes/vacancies.js';
import leadsRoutes from './routes/leads.js';
import pitchRoutes from './routes/pitch.js';
import emailRoutes from './routes/email.js';
import analyticsRoutes from './routes/analytics.js';
import mapRoutes from './routes/map.js';
import customersRoutes from './routes/customers.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'DigiPlus Smart Leads Real-Time Supabase API',
    version: '1.0.0',
    status: 'online',
    database: 'Supabase PostgreSQL (Live)',
    endpoints: {
      auth: '/auth/login',
      hoardings: '/hoardings',
      vacancies: '/vacancies',
      pitch: '/pitch/generate',
      email: '/email/send',
      analytics: '/analytics/summary',
      map: '/map/heatmap',
      customers: '/customers',
    },
  });
});

app.use('/auth', authRoutes);
app.use('/hoardings', hoardingsRoutes);
app.use('/vacancies', vacanciesRoutes);
app.use('/vacancies', leadsRoutes);
app.use('/pitch', pitchRoutes);
app.use('/email', emailRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/map', mapRoutes);
app.use('/customers', customersRoutes);

console.log('═══════════════════════════════════════════════════════');
console.log('  🚀 DigiPlus Smart Leads Real-Time Supabase API');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Database: Live Supabase PostgreSQL`);
console.log(`  Reference date: ${config.referenceDate}`);
console.log('═══════════════════════════════════════════════════════');

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});
