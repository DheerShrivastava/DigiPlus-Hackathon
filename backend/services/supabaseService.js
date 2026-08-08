import { supabase } from '../config/supabaseClient.js';
import { runVacancyPipeline } from '../services/vacancyPipeline.js';
import { getCoordsForSite } from '../mumbaiCoords.js';

export async function fetchLiveSupabasePipeline() {
  const [{ data: hoardings, error: hErr }, { data: bookings, error: bErr }, { data: customers, error: cErr }] = await Promise.all([
    supabase.from('hoardings').select('*'),
    supabase.from('bookings').select('*'),
    supabase.from('customers').select('*')
  ]);

  if (hErr || bErr || cErr) {
    console.error('Supabase Fetch Error:', hErr || bErr || cErr);
  }

  const rawH = hoardings || [];

  const cleanH = rawH.map(h => {
    let lat = Number(h.latitude);
    let lng = Number(h.longitude);

    // Auto-heal Byculla or un-geocoded coordinates
    const locLower = (h.location || '').toLowerCase();
    if (locLower.includes('byculla') || locLower.includes('byceulla')) {
      if (lat > 19.04) { // If lat is in Bandra / Northern Mumbai, fix it to Byculla South Mumbai
        const [correctLat, correctLng] = getCoordsForSite(h.site_id, h.location);
        lat = correctLat;
        lng = correctLng;
      }
    }

    return {
      ...h,
      size_sqft: Number(h.size_sqft),
      traffic_score: Number(h.traffic_score),
      monthly_rate_inr: Number(h.monthly_rate_inr),
      latitude: lat,
      longitude: lng
    };
  });

  const cleanB = (bookings || []).map(b => ({
    ...b,
    value_inr: Number(b.value_inr)
  }));

  const cleanC = (customers || []).map(c => ({
    ...c,
    relationship_score: Number(c.relationship_score)
  }));

  const pipeline = runVacancyPipeline(cleanH, cleanB, cleanC);

  return {
    hoardings: cleanH,
    bookings: cleanB,
    customers: cleanC,
    vacancies: pipeline.vacancies,
    hoardingStatuses: pipeline.hoardingStatuses
  };
}
