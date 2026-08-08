import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  TrendingUp, 
  IndianRupee, 
  Users, 
  Building2, 
  Layers, 
  Sparkles, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function DemandHeatmap({ hoardings, onSelectHoarding, onOpenOutreach }) {
  const [selectedMapSite, setSelectedMapSite] = useState(hoardings[0]);
  const [activeCityFilter, setActiveCityFilter] = useState('All');

  const filteredHoardings = activeCityFilter === 'All' 
    ? hoardings 
    : hoardings.filter(h => h.city === activeCityFilter);

  // Center of India (Mumbai default)
  const centerPos = [19.0760, 72.8777];

  const getMarkerIcon = (demandLevel) => {
    let colorClass = 'marker-green';
    if (demandLevel === 'Medium') colorClass = 'marker-yellow';
    if (demandLevel === 'Low') colorClass = 'marker-red';

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div class="marker-pin ${colorClass}"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
  };

  return (
    <div className="dashboard-card heatmap-card">
      <div className="card-header">
        <div className="card-title">
          <MapPin size={20} className="text-brand-icon" />
          <span>Hoarding Demand Heatmap & Geo-Spatial Intelligence</span>
        </div>

        {/* City Filter Pills */}
        <div className="city-filters">
          {['All', 'Mumbai', 'NCR', 'Bengaluru', 'Hyderabad', 'Pune'].map(city => (
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
            <span className="legend-title">Demand Scale:</span>
            <span className="legend-item"><span className="dot dot-green"></span> High (&gt;85% Occupancy)</span>
            <span className="legend-item"><span className="dot dot-yellow"></span> Medium (65-85%)</span>
            <span className="legend-item"><span className="dot dot-red"></span> Low (&lt;65%)</span>
          </div>

          <MapContainer 
            center={centerPos} 
            zoom={5} 
            scrollWheelZoom={true}
            className="leaflet-map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {filteredHoardings.map(h => (
              <Marker 
                key={h.id} 
                position={[h.lat, h.lng]}
                icon={getMarkerIcon(h.demandLevel)}
                eventHandlers={{
                  click: () => {
                    setSelectedMapSite(h);
                    onSelectHoarding(h);
                  }
                }}
              >
                <Popup>
                  <div className="popup-card">
                    <div className="popup-title">{h.id}: {h.location}</div>
                    <div className="popup-meta">Monthly Rate: ₹{(h.monthlyRate / 100000).toFixed(2)}L</div>
                    <div className="popup-meta">Demand: <strong>{h.demandLevel}</strong> ({h.occupancyRate}% Occupancy)</div>
                    <button 
                      className="btn btn-sm btn-primary mt-2 w-full"
                      onClick={() => {
                        setSelectedMapSite(h);
                        onSelectHoarding(h);
                      }}
                    >
                      View Deep Insights
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right: Site Geo Insights Panel */}
        <div className="site-details-panel">
          <div className="details-header">
            <div className="site-id-badge">{selectedMapSite.id}</div>
            <div>
              <h3 className="site-title">{selectedMapSite.location}</h3>
              <span className="site-city">{selectedMapSite.city} • {selectedMapSite.size}</span>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-lbl">Occupancy Rate</span>
              <span className="metric-val text-emerald">{selectedMapSite.occupancyRate}%</span>
              <span className="metric-sub">{selectedMapSite.bookingFrequency}</span>
            </div>

            <div className="metric-box">
              <span className="metric-lbl">Monthly Rate</span>
              <span className="metric-val">₹{(selectedMapSite.monthlyRate / 100000).toFixed(2)}L</span>
              <span className="metric-sub">{selectedMapSite.dailyImpressions}</span>
            </div>
          </div>

          {/* Historical Occupancy Bar Trend */}
          <div className="section-block">
            <div className="block-title">
              <TrendingUp size={14} className="text-brand-icon" />
              <span>Historical Occupancy Trend (Last 6 Months)</span>
            </div>

            <div className="trend-bars">
              {selectedMapSite.historicalOccupancy.map((val, idx) => (
                <div key={idx} className="bar-col">
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ height: `${val}%` }}></div>
                  </div>
                  <span className="bar-lbl">M{idx+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Performance & Top Interested Clients */}
          <div className="section-block">
            <div className="block-title">
              <Users size={14} className="text-purple-icon" />
              <span>Top Interested Corporate Clients</span>
            </div>

            <div className="interested-clients-list">
              {selectedMapSite.topInterestedCustomers.map((client, i) => (
                <div key={i} className="client-chip">
                  <Building2 size={12} />
                  <span>{client}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-primary btn-full mt-3"
            onClick={() => onOpenOutreach(selectedMapSite)}
          >
            <Sparkles size={15} />
            Generate AI Lead Pitch for {selectedMapSite.id}
          </button>
        </div>
      </div>

      <style>{`
        .heatmap-card {
          margin-bottom: 1.5rem;
        }

        .text-purple-icon { color: var(--accent-purple); }

        .city-filters {
          display: flex;
          gap: 0.35rem;
        }

        .city-pill-btn {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .city-pill-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }

        .city-pill-btn.active {
          background-color: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
        }

        .heatmap-body-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 1.5rem;
          height: 520px;
        }

        .map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .leaflet-map-container {
          width: 100%;
          height: 100%;
        }

        .map-legend {
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--bg-glass);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(8px);
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-md);
        }

        .legend-title {
          font-weight: 700;
          color: var(--text-primary);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--text-secondary);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-green { background-color: #10b981; }
        .dot-yellow { background-color: #f59e0b; }
        .dot-red { background-color: #ef4444; }

        .site-details-panel {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
        }

        .details-header {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .site-id-badge {
          background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple));
          color: #fff;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
          height: fit-content;
        }

        .site-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .site-city {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .metric-box {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
        }

        .metric-lbl {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: block;
        }

        .metric-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .metric-sub {
          font-size: 0.68rem;
          color: var(--text-secondary);
          display: block;
        }

        .section-block {
          margin-bottom: 1rem;
        }

        .block-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.6rem;
        }

        .trend-bars {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          height: 60px;
          background-color: var(--bg-card);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .bar-wrapper {
          flex: 1;
          width: 100%;
          background-color: var(--bg-tertiary);
          border-radius: 3px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, var(--brand-primary), var(--accent-cyan));
          border-radius: 3px;
        }

        .bar-lbl {
          font-size: 0.62rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .interested-clients-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .client-chip {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
          font-size: 0.75rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
        }

        .popup-card {
          padding: 0.2rem;
        }

        .popup-title {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-bottom: 0.3rem;
        }

        .popup-meta {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .w-full { width: 100%; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }

        @media (max-width: 1024px) {
          .heatmap-body-grid {
            grid-template-columns: 1fr;
            height: auto;
          }
          .map-wrapper {
            height: 380px;
          }
        }
      `}</style>
    </div>
  );
}
