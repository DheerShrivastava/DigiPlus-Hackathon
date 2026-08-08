import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2, 
  Sparkles,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';
import { getHeatmapData } from '../services/api';

export default function DemandHeatmap({ hoardings, onSelectHoarding, onOpenOutreach }) {
  const navigate = useNavigate();
  const [mapSites, setMapSites] = useState(hoardings || []);
  const [selectedMapSite, setSelectedMapSite] = useState(hoardings?.[0] || null);
  const [activeCityFilter, setActiveCityFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      try {
        const res = await getHeatmapData();
        if (res.success && res.data && res.data.length > 0) {
          setMapSites(res.data);
          if (!selectedMapSite) setSelectedMapSite(res.data[0]);
        } else if (hoardings && hoardings.length > 0) {
          setMapSites(hoardings);
          if (!selectedMapSite) setSelectedMapSite(hoardings[0]);
        }
      } catch (err) {
        console.warn("Using props/fallback map dataset:", err.message);
        if (hoardings && hoardings.length > 0) {
          setMapSites(hoardings);
          if (!selectedMapSite) setSelectedMapSite(hoardings[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, [hoardings?.length]);

  const filteredHoardings = mapSites.filter(h => {
    if (activeCityFilter === 'All') return true;
    return h.city && h.city.toLowerCase().includes(activeCityFilter.toLowerCase());
  });

  const getMarkerIcon = (demandLevel, demandScore) => {
    let colorClass = 'marker-green';
    const lvl = (demandLevel || '').toLowerCase();
    const score = Number(demandScore) || 80;

    if (lvl === 'low' || score < 50) colorClass = 'marker-red';
    else if (lvl === 'medium' || (score >= 50 && score <= 79)) colorClass = 'marker-yellow';

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="marker-pin ${colorClass}"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
  };

  // Center position of India (Mumbai coordinates by default)
  const defaultCenter = [19.0760, 72.8777];

  return (
    <div className="dashboard-card heatmap-card">
      <div className="card-header">
        <div className="card-title">
          <MapPin size={20} className="text-brand-icon" />
          <span>Hoarding Demand Heatmap & Geo-Spatial Intelligence</span>
          <span className="live-count-badge font-mono">{filteredHoardings.length} Pins</span>
        </div>

        {/* City Filter Pills */}
        <div className="city-filters">
          {['All', 'Mumbai', 'NCR', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune'].map(city => (
            <button 
              key={city}
              className={`city-pill-btn ${activeCityFilter === city ? 'active' : ''}`}
              onClick={() => setActiveCityFilter(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body heatmap-body-grid">
        {/* Left: Interactive Map */}
        <div className="map-wrapper">
          {/* Map Demand Legend */}
          <div className="map-legend font-sans">
            <span className="legend-title">Demand Score:</span>
            <span className="legend-item"><span className="dot dot-green"></span> High (80-100)</span>
            <span className="legend-item"><span className="dot dot-yellow"></span> Medium (50-79)</span>
            <span className="legend-item"><span className="dot dot-red"></span> Low (0-49)</span>
          </div>

          <MapContainer 
            center={defaultCenter} 
            zoom={5} 
            scrollWheelZoom={true}
            className="leaflet-map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {filteredHoardings.map(h => {
              const lat = Number(h.latitude || h.lat) || 19.0760;
              const lng = Number(h.longitude || h.lng) || 72.8777;
              const id = h.hoardingId || h.id || h._id;

              return (
                <Marker 
                  key={h._id || id} 
                  position={[lat, lng]}
                  icon={getMarkerIcon(h.demandLevel, h.demandScore)}
                  eventHandlers={{
                    click: () => {
                      setSelectedMapSite(h);
                      if (onSelectHoarding) onSelectHoarding(h);
                    }
                  }}
                >
                  <Popup>
                    <div className="popup-card">
                      <div className="popup-title font-mono font-bold text-brand">{id}: {h.location}</div>
                      <div className="popup-meta">City: <strong>{h.city}</strong></div>
                      <div className="popup-meta">Monthly Rate: <strong>₹{((h.monthlyRate || 0) / 100000).toFixed(2)}L</strong></div>
                      <div className="popup-meta">Traffic Score: <strong>{h.trafficScore || 80}/100</strong></div>
                      <div className="popup-meta">Occupancy: <strong>{h.occupancyRate || 85}%</strong></div>
                      <div className="popup-meta">Revenue Generated: <strong>₹{((h.revenueGenerated || 0)/100000).toFixed(1)}L</strong></div>
                      <div className="popup-meta">Revenue At Risk: <strong className="text-rose">₹{((h.revenueAtRisk || h.monthlyRate || 0)/100000).toFixed(1)}L</strong></div>
                      <div className="popup-meta">Demand Score: <strong className="text-emerald">{h.demandScore || 85}/100 ({(h.demandLevel || 'medium').toUpperCase()})</strong></div>

                      <div className="popup-actions mt-2">
                        <button 
                          className="btn btn-sm btn-outline w-full mb-1"
                          onClick={() => navigate(`/hoardings/${id}`)}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary w-full mb-1"
                          onClick={() => navigate(`/leads?site=${id}`)}
                        >
                          Find Best Customers
                        </button>
                        <button 
                          className="btn btn-sm btn-primary w-full"
                          onClick={() => navigate(`/ai-copilot?site=${id}`)}
                        >
                          Generate AI Pitch
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Right: Selected Site Geo Panel */}
        <div className="site-details-panel">
          {selectedMapSite ? (
            <>
              <div className="details-header">
                <div className="site-id-badge">{selectedMapSite.hoardingId || selectedMapSite.id}</div>
                <div>
                  <h3 className="site-title">{selectedMapSite.location}</h3>
                  <span className="site-city">{selectedMapSite.city} • {selectedMapSite.size}</span>
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-box">
                  <span className="metric-lbl">Occupancy Rate</span>
                  <span className="metric-val text-emerald">{selectedMapSite.occupancyRate || 85}%</span>
                  <span className="metric-sub">{selectedMapSite.bookingFrequency || 20} campaigns/yr</span>
                </div>

                <div className="metric-box">
                  <span className="metric-lbl">Monthly Rate</span>
                  <span className="metric-val">₹{((selectedMapSite.monthlyRate || 650000) / 100000).toFixed(2)}L</span>
                  <span className="metric-sub">Demand Score: {selectedMapSite.demandScore || 85}/100</span>
                </div>
              </div>

              <div className="section-block">
                <div className="block-title">
                  <TrendingUp size={14} className="text-brand-icon" />
                  <span>Calculated Demand Intelligence</span>
                </div>

                <div className="demand-breakdown-box">
                  <div className="breakdown-row">
                    <span>Occupancy (40% Weight):</span>
                    <strong>{selectedMapSite.occupancyRate || 85}%</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Traffic Score (30% Weight):</span>
                    <strong>{selectedMapSite.trafficScore || 80}/100</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Booking Frequency (30% Weight):</span>
                    <strong>{selectedMapSite.bookingFrequency || 20} campaigns</strong>
                  </div>
                  <div className="breakdown-total mt-2">
                    <span>Total Calculated Demand Score:</span>
                    <span className="badge badge-success font-mono">{selectedMapSite.demandScore || 85}/100 ({(selectedMapSite.demandLevel || 'medium').toUpperCase()})</span>
                  </div>
                </div>
              </div>

              <div className="panel-footer-actions mt-3">
                <button 
                  className="btn btn-outline btn-full mb-2"
                  onClick={() => navigate(`/hoardings/${selectedMapSite.hoardingId || selectedMapSite.id}`)}
                >
                  View Full Site Specs
                </button>
                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => {
                    if (onOpenOutreach) onOpenOutreach(selectedMapSite);
                    else navigate(`/ai-outreach?site=${selectedMapSite.hoardingId || selectedMapSite.id}`);
                  }}
                >
                  <Sparkles size={15} /> Launch AI Lead Pitch
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted text-center p-4">Click a map pin to inspect site intelligence.</div>
          )}
        </div>
      </div>

      <style>{`
        .heatmap-card { margin-bottom: 1.5rem; }
        .live-count-badge { font-size: 0.72rem; background-color: var(--brand-light); color: var(--brand-primary); padding: 0.2rem 0.65rem; border-radius: 999px; font-weight: 700; margin-left: 0.5rem; }
        .city-filters { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .city-pill-btn { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
        .city-pill-btn.active { background-color: var(--brand-primary); color: #ffffff; border-color: var(--brand-primary); }
        .heatmap-body-grid { display: grid; grid-template-columns: 1.7fr 1fr; gap: 1.5rem; height: 550px; }
        .map-wrapper { position: relative; width: 100%; height: 100%; border-radius: var(--radius-md); overflow: hidden; }
        .leaflet-map-container { width: 100%; height: 100%; }
        .map-legend { position: absolute; top: 10px; right: 10px; background: var(--bg-glass); border: 1px solid var(--border-color); backdrop-filter: blur(8px); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.75rem; z-index: 1000; display: flex; align-items: center; gap: 0.75rem; box-shadow: var(--shadow-md); }
        .legend-title { font-weight: 700; color: var(--text-primary); }
        .legend-item { display: flex; align-items: center; gap: 0.3rem; color: var(--text-secondary); }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-green { background-color: #10b981; }
        .dot-yellow { background-color: #f59e0b; }
        .dot-red { background-color: #ef4444; }
        .site-details-panel { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto; }
        .details-header { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .site-id-badge { background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple)); color: #fff; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); height: fit-content; }
        .site-title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); line-height: 1.25; }
        .site-city { font-size: 0.75rem; color: var(--text-muted); }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
        .metric-box { background-color: var(--bg-card); border: 1px solid var(--border-color); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); }
        .metric-lbl { font-size: 0.7rem; color: var(--text-muted); display: block; }
        .metric-val { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); }
        .metric-sub { font-size: 0.68rem; color: var(--text-secondary); display: block; }
        .demand-breakdown-box { background-color: var(--bg-card); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.78rem; }
        .breakdown-row { display: flex; justify-content: space-between; color: var(--text-secondary); }
        .breakdown-total { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 0.5rem; font-weight: 700; color: var(--text-primary); }
        .popup-card { padding: 0.2rem; max-width: 240px; }
        .popup-title { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.3rem; }
        .popup-meta { font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.15rem; }
        .w-full { width: 100%; }
        .mb-1 { margin-bottom: 0.35rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .btn-full { width: 100%; padding: 0.65rem; font-size: 0.85rem; }
        .text-rose { color: var(--accent-rose); }
        .text-emerald { color: var(--accent-emerald); }

        @media (max-width: 1024px) {
          .heatmap-body-grid { grid-template-columns: 1fr; height: auto; }
          .map-wrapper { height: 380px; }
        }
      `}</style>
    </div>
  );
}
