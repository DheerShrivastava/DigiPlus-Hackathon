import { supabase } from '../config/supabaseClient.js';
import { runVacancyPipeline } from './vacancyPipeline.js';

export async function fetchLiveSupabasePipeline() {
  const [{ data: hoardings, error: hErr }, { data: bookings, error: bErr }, { data: customers, error: cErr }] = await Promise.all([
    supabase.from('hoardings').select('*'),
    supabase.from('bookings').select('*'),
    supabase.from('customers').select('*')
  ]);

  if (hErr || bErr || cErr) {
    console.error('Supabase Fetch Error:', hErr || bErr || cErr);
  }

  const cleanH = (hoardings || []).map(h => ({
    ...h,
    size_sqft: Number(h.size_sqft),
    traffic_score: Number(h.traffic_score),
    monthly_rate_inr: Number(h.monthly_rate_inr),
    latitude: Number(h.latitude),
    longitude: Number(h.longitude)
  }));

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
