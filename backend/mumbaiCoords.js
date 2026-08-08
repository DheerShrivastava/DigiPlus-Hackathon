export const MUMBAI_COORDINATES = {
  "HRD-100": { lat: 19.2065, lng: 72.8524, area: "Kandivali WEB" },
  "HRD-101": { lat: 19.1197, lng: 72.8464, area: "Andheri Metro Facing" },
  "HRD-102": { lat: 19.2307, lng: 72.8567, area: "SV Road Junction Borivali" },
  "HRD-103": { lat: 19.1663, lng: 72.8526, area: "WEH Goregaon North" },
  "HRD-104": { lat: 19.1860, lng: 72.8350, area: "Link Road Malad" },
  "HRD-105": { lat: 19.2638, lng: 72.8576, area: "Dahisar Toll Naka" },
  "HRD-106": { lat: 19.2183, lng: 72.9781, area: "Thane Ghodbunder Rd" },
  "HRD-107": { lat: 19.0657, lng: 72.8686, area: "BKC Approach" },
  "HRD-108": { lat: 19.0402, lng: 72.8644, area: "Sion Circle" },
  "HRD-109": { lat: 19.1176, lng: 72.9060, area: "Powai Hiranandani" },
  "HRD-110": { lat: 19.2080, lng: 72.8530, area: "Kandivali Flyover WEB #2" },
  "HRD-111": { lat: 19.1210, lng: 72.8475, area: "Andheri Metro Facing #2" },
  "HRD-112": { lat: 19.2320, lng: 72.8580, area: "SV Road Junction Borivali #2" },
  "HRD-113": { lat: 19.1680, lng: 72.8540, area: "WEH Goregaon North #2" },
  "HRD-114": { lat: 19.1880, lng: 72.8365, area: "Link Road Malad #2" },
  "HRD-115": { lat: 19.2650, lng: 72.8590, area: "Dahisar Toll Naka #2" },
  "HRD-116": { lat: 19.2200, lng: 72.9795, area: "Thane Ghodbunder Rd #2" },
  "HRD-117": { lat: 19.0670, lng: 72.8700, area: "BKC Approach #2" },
  "HRD-118": { lat: 19.0415, lng: 72.8655, area: "Sion Circle #2" },
  "HRD-119": { lat: 19.1190, lng: 72.9075, area: "Powai Hiranandani #2" },
  "HRD-120": { lat: 19.2095, lng: 72.8545, area: "Kandivali Flyover WEB #3" },
  "HRD-121": { lat: 19.1225, lng: 72.8490, area: "Andheri Metro Facing #3" },
  "HRD-122": { lat: 19.2335, lng: 72.8595, area: "SV Road Junction Borivali #3" },
  "HRD-123": { lat: 19.1695, lng: 72.8555, area: "WEH Goregaon North #3" },
  "HRD-124": { lat: 19.1895, lng: 72.8380, area: "Link Road Malad #3" }
};

export function getCoordsForSite(site_id, location) {
  if (MUMBAI_COORDINATES[site_id]) {
    return [MUMBAI_COORDINATES[site_id].lat, MUMBAI_COORDINATES[site_id].lng];
  }
  return [19.0760 + (Math.random() - 0.5) * 0.1, 72.8777 + (Math.random() - 0.5) * 0.1];
}
