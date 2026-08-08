import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

export const config = {
  port: Number(process.env.PORT) || 8000,
  jwtSecret: process.env.JWT_SECRET || 'digiplus-secret-key-2026',
  referenceDate: process.env.REFERENCE_DATE || '2026-08-01',
  vacancyWindowDays: Number(process.env.VACANCY_WINDOW_DAYS) || 90,
  rateMarkupFactor: Number(process.env.RATE_MARKUP_FACTOR) || 1.0,
  dataDir: path.join(__dirname, '..', 'data'),
  storePath: path.join(__dirname, 'data', 'store.json'),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'digiplus@example.com',
  },
  nominatimUserAgent: process.env.NOMINATIM_USER_AGENT || 'DigiPlus-SmartLeads/1.0',
};
