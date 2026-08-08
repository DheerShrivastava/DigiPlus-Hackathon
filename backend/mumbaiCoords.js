// Precise Mumbai Neighborhood Coordinates Lookup Table
const MUMBAI_LOCATIONS = [
  // South Mumbai
  { keywords: ['byculla', 'chinchpokli', 'raniya', 'zoo', 'khadaparsi'], lat: 18.9750, lng: 72.8333 },
  { keywords: ['colaba', 'cuffe parade', 'gateway'], lat: 18.9067, lng: 72.8147 },
  { keywords: ['fort', 'csmt', 'vt', 'churchgate', 'fountain'], lat: 18.9400, lng: 72.8353 },
  { keywords: ['marine drive', 'nariman point', 'chowpatty'], lat: 18.9438, lng: 72.8228 },
  { keywords: ['girgaon', 'charni road', 'opera house'], lat: 18.9554, lng: 72.8188 },
  { keywords: ['tardeo', 'mahalaxmi', 'haji ali', 'grant road'], lat: 18.9700, lng: 72.8180 },
  { keywords: ['lower parel', 'worli', 'prabhadevi', 'phoenix mills'], lat: 19.0000, lng: 72.8258 },
  { keywords: ['dadar', 'matunga', 'wadala', 'sion', 'chambur'], lat: 19.0178, lng: 72.8478 },

  // Western Suburbs
  { keywords: ['bkc', 'bandra kurla', 'kurla complex'], lat: 19.0657, lng: 72.8686 },
  { keywords: ['bandra', 'carter road', 'pali hill', 'bandra west', 'bandra east', 'turner road'], lat: 19.0596, lng: 72.8295 },
  { keywords: ['khar', 'santacruz'], lat: 19.0800, lng: 72.8400 },
  { keywords: ['vile parle', 'juhu'], lat: 19.1000, lng: 72.8300 },
  { keywords: ['andheri', 'weh andheri', 'lokhandwala', 'jb nagar', 'marol'], lat: 19.1197, lng: 72.8464 },
  { keywords: ['jogeshwari'], lat: 19.1350, lng: 72.8500 },
  { keywords: ['goregaon', 'weh goregaon', 'hub mall', 'oberoi'], lat: 19.1680, lng: 72.8540 },
  { keywords: ['malad', 'mindspace', 'inorbit'], lat: 19.1860, lng: 72.8480 },
  { keywords: ['kandivali', 'growel'], lat: 19.2070, lng: 72.8540 },
  { keywords: ['borivali', 'gorai'], lat: 19.2300, lng: 72.8560 },
  { keywords: ['dahisar'], lat: 19.2500, lng: 72.8590 },
  { keywords: ['mira road', 'bhayandar'], lat: 19.2800, lng: 72.8550 },

  // Central Suburbs & Eastern Corridor
  { keywords: ['kurla', 'phoenix marketcity'], lat: 19.0840, lng: 72.8850 },
  { keywords: ['chembur', 'tilak nagar'], lat: 19.0600, lng: 72.8900 },
  { keywords: ['ghatkopar', 'vikhroli'], lat: 19.0860, lng: 72.9080 },
  { keywords: ['powai', 'hiranandani'], lat: 19.1176, lng: 72.9060 },
  { keywords: ['bhandup', 'mulund'], lat: 19.1500, lng: 72.9500 },
  { keywords: ['thane', 'ghodbunder'], lat: 19.2183, lng: 72.9781 },

  // Navi Mumbai
  { keywords: ['vashi', 'nerul', 'belapur', 'sanpada', 'khargar'], lat: 19.0330, lng: 73.0297 }
];

export function getCoordsForSite(site_id, locationStr = '') {
  const locLower = (locationStr || '').toLowerCase();

  for (const item of MUMBAI_LOCATIONS) {
    if (item.keywords.some(kw => locLower.includes(kw))) {
      // Add slight jitter so multiple billboards in the same area don't overlap completely
      const jitterLat = (Math.random() - 0.5) * 0.004;
      const jitterLng = (Math.random() - 0.5) * 0.004;
      return [item.lat + jitterLat, item.lng + jitterLng];
    }
  }

  // Default fallback near Mumbai center if no keyword matched
  return [19.0760, 72.8777];
}
