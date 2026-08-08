import { scoreLead } from '../leadScorer.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(from, to) {
  return Math.ceil((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function buildLeads(hoarding, siteBookings, incumbentCustomerId, allBookings, allCustomers) {
  const leads = [];
  for (const cust of allCustomers) {
    const totalCustBookings = allBookings.filter((b) => b.customer_id === cust.customer_id).length;
    const siteCustBookings = siteBookings.filter((b) => b.customer_id === cust.customer_id).length;
    const leadData = scoreLead(hoarding, cust, totalCustBookings, siteCustBookings, incumbentCustomerId);
    if (leadData) leads.push(leadData);
  }
  leads.sort((a, b) => b.match_score - a.match_score);
  return leads;
}

function buildVacancyRecord(hoarding, booking, daysUntilVacant, siteBookings, allBookings, allCustomers) {
  const incumbentId = booking ? booking.customer_id : null;
  const currentCust = incumbentId ? allCustomers.find((c) => c.customer_id === incumbentId) : null;
  const leads = buildLeads(hoarding, siteBookings, incumbentId, allBookings, allCustomers);

  return {
    site_id: hoarding.site_id,
    location: hoarding.location,
    size_sqft: hoarding.size_sqft,
    traffic_score: hoarding.traffic_score,
    monthly_rate_inr: hoarding.monthly_rate_inr,
    suggested_rate_inr: hoarding.monthly_rate_inr,
    vacant_from: booking ? booking.end_date : new Date().toISOString().slice(0, 10),
    days_until_vacant: Math.max(0, daysUntilVacant),
    revenue_at_risk: hoarding.monthly_rate_inr * 3.0,
    current_customer_name: currentCust ? currentCust.name : 'N/A',
    current_customer_id: incumbentId,
    latitude: hoarding.latitude,
    longitude: hoarding.longitude,
    top_leads: leads.slice(0, 3),
    all_leads: leads,
  };
}

export function computeHoardingStatus(hoarding, siteBookings, referenceDate, allCustomers) {
  let currentCustomer = null;
  let daysUntilVacant = 120;
  let vacancyDate = null;
  let statusStr = 'occupied_long';

  if (siteBookings.length === 0) {
    return {
      ...hoarding,
      status: 'vacant',
      days_until_vacant: 0,
      vacancy_date: null,
      current_customer: null,
      current_customer_name: null,
      occupancy_frequency: Number((80.0 + hoarding.traffic_score * 1.8).toFixed(1)),
    };
  }

  const activeBooking = siteBookings.find(
    (b) => new Date(b.start_date) <= referenceDate && new Date(b.end_date) >= referenceDate
  );

  const latestBooking = siteBookings.reduce((latest, b) =>
    new Date(b.end_date) > new Date(latest.end_date) ? b : latest
  );

  const anchorBooking = activeBooking || latestBooking;
  vacancyDate = anchorBooking.end_date;
  const cust = allCustomers.find((c) => c.customer_id === anchorBooking.customer_id);
  if (cust) currentCustomer = cust.name;

  const endDate = new Date(anchorBooking.end_date);
  daysUntilVacant = Math.max(0, daysBetween(referenceDate, endDate));

  if (daysUntilVacant <= 0) statusStr = 'vacant';
  else if (daysUntilVacant <= 30) statusStr = 'vacant_soon';
  else if (daysUntilVacant <= 90) statusStr = 'occupied_medium';
  else statusStr = 'occupied_long';

  return {
    ...hoarding,
    status: statusStr,
    days_until_vacant: daysUntilVacant,
    vacancy_date: vacancyDate,
    current_customer: currentCustomer,
    current_customer_name: currentCustomer,
    occupancy_frequency: Number((80.0 + hoarding.traffic_score * 1.8).toFixed(1)),
  };
}

export function runVacancyPipeline(hoardings, bookings, customers) {
  const referenceDate = new Date('2026-08-01');
  const windowDays = 90;
  const vacancies = [];
  const hoardingStatuses = [];

  for (const hoarding of hoardings) {
    const siteBookings = bookings
      .filter((b) => b.site_id === hoarding.site_id)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    hoardingStatuses.push(computeHoardingStatus(hoarding, siteBookings, referenceDate, customers));

    if (siteBookings.length === 0) {
      vacancies.push(buildVacancyRecord(hoarding, null, 0, siteBookings, bookings, customers));
      continue;
    }

    const activeBooking = siteBookings.find(
      (b) => new Date(b.start_date) <= referenceDate && new Date(b.end_date) >= referenceDate
    );

    if (activeBooking) {
      const endDate = new Date(activeBooking.end_date);
      const daysUntil = daysBetween(referenceDate, endDate);
      if (daysUntil <= windowDays && daysUntil >= -30) {
        vacancies.push(
          buildVacancyRecord(hoarding, activeBooking, daysUntil, siteBookings, bookings, customers)
        );
      }
      continue;
    }

    const pastBookings = siteBookings.filter((b) => new Date(b.end_date) < referenceDate);
    if (pastBookings.length > 0) {
      const lastBooking = pastBookings[pastBookings.length - 1];
      const daysSinceVacant = daysBetween(new Date(lastBooking.end_date), referenceDate);
      if (daysSinceVacant <= windowDays) {
        vacancies.push(
          buildVacancyRecord(hoarding, lastBooking, -daysSinceVacant, siteBookings, bookings, customers)
        );
      }
    }
  }

  vacancies.sort((a, b) => a.days_until_vacant - b.days_until_vacant);

  return { vacancies, hoardingStatuses };
}
