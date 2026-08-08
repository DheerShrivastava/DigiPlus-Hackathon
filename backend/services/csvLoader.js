import fs from 'fs';
import path from 'path';
import { getCoordsForSite } from '../mumbaiCoords.js';

export function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    if (values.length === headers.length) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx];
      });
      rows.push(obj);
    }
  }
  return rows;
}

export function loadFromCSV(dataDir) {
  const rawH = parseCSV(path.join(dataDir, 'hoardings.csv'));
  const hoardings = rawH.map((h, idx) => {
    const site_id = h.site_id;
    const location = h.location;
    const [lat, lng] = getCoordsForSite(site_id, location);
    return {
      id: idx + 1,
      site_id,
      location,
      size_sqft: Number(h.size_sqft),
      traffic_score: Number(h.traffic_score),
      monthly_rate_inr: Number(h.monthly_rate_inr_inr || h.monthly_rate_inr),
      latitude: lat,
      longitude: lng,
    };
  });

  const rawC = parseCSV(path.join(dataDir, 'customers.csv'));
  const customers = rawC.map((c, idx) => ({
    id: idx + 1,
    customer_id: c.customer_id,
    name: c.name,
    industry: c.industry,
    budget_band: c.budget_band,
    relationship_score: Number(c.relationship_score),
    last_contact_date: c.last_contact_date,
  }));

  const rawB = parseCSV(path.join(dataDir, 'bookings.csv'));
  const bookings = rawB.map((b, idx) => ({
    id: idx + 1,
    booking_id: b.booking_id,
    site_id: b.site_id,
    customer_id: b.customer_id,
    start_date: b.start_date,
    end_date: b.end_date,
    value_inr: Number(b.value_inr),
  }));

  return { hoardings, customers, bookings };
}
