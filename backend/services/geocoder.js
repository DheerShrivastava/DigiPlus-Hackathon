import { config } from '../config.js';

const cache = new Map();

export async function geocodeAddress(location) {
  const key = location.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key);

  const query = encodeURIComponent(`${location}, Mumbai, Maharashtra, India`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': config.nominatimUserAgent },
    });
    const data = await res.json();
    if (data && data.length > 0) {
      const result = { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      cache.set(key, result);
      return result;
    }
  } catch (err) {
    console.warn('Geocoding failed for', location, err.message);
  }

  return null;
}
