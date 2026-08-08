import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './config/supabaseClient.js';
import { getCoordsForSite } from './mumbaiCoords.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
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

async function seedSupabaseDatabase() {
  console.log('🚀 Starting Supabase Database Migration & Seeding...');

  // 1. Seed Hoardings Table
  const rawH = parseCSV(path.join(dataDir, 'hoardings.csv'));
  const hoardingRows = rawH.map(h => {
    const site_id = h.site_id;
    const location = h.location;
    const [lat, lng] = getCoordsForSite(site_id, location);
    return {
      site_id: site_id,
      location: location,
      size_sqft: Number(h.size_sqft),
      traffic_score: Number(h.traffic_score),
      monthly_rate_inr: Number(h.monthly_rate_inr_inr || h.monthly_rate_inr),
      latitude: lat,
      longitude: lng
    };
  });

  const { data: hData, error: hErr } = await supabase
    .from('hoardings')
    .upsert(hoardingRows, { onConflict: 'site_id' });

  if (hErr) {
    console.error('❌ Error seeding hoardings:', hErr.message);
  } else {
    console.log(`✅ Uploaded ${hoardingRows.length} hoardings to Supabase!`);
  }

  // 2. Seed Customers Table
  const rawC = parseCSV(path.join(dataDir, 'customers.csv'));
  const customerRows = rawC.map(c => ({
    customer_id: c.customer_id,
    name: c.name,
    industry: c.industry,
    budget_band: c.budget_band,
    relationship_score: Number(c.relationship_score),
    last_contact_date: c.last_contact_date
  }));

  const { data: cData, error: cErr } = await supabase
    .from('customers')
    .upsert(customerRows, { onConflict: 'customer_id' });

  if (cErr) {
    console.error('❌ Error seeding customers:', cErr.message);
  } else {
    console.log(`✅ Uploaded ${customerRows.length} customers to Supabase!`);
  }

  // 3. Seed Bookings Table
  const rawB = parseCSV(path.join(dataDir, 'bookings.csv'));
  const bookingRows = rawB.map(b => ({
    booking_id: b.booking_id,
    site_id: b.site_id,
    customer_id: b.customer_id,
    start_date: b.start_date,
    end_date: b.end_date,
    value_inr: Number(b.value_inr)
  }));

  const { data: bData, error: bErr } = await supabase
    .from('bookings')
    .upsert(bookingRows, { onConflict: 'booking_id' });

  if (bErr) {
    console.error('❌ Error seeding bookings:', bErr.message);
  } else {
    console.log(`✅ Uploaded ${bookingRows.length} bookings to Supabase!`);
  }

  console.log('🎉 Supabase Database Migration Completed Successfully!');
}

seedSupabaseDatabase();
