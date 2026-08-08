import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Eye } from 'lucide-react';

// Force map to recalculate container size after render
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MumbaiMap({ hoardings = [], onSelectHoarding }) {
  const centerMumbai = [19.1400, 72.8600];

  const getMarkerColor = (status, daysUntilVacant) => {
    if (status === 'vacant' || daysUntilVacant <= 0) return '#f43f5e';
    if (status === 'vacant_soon' || daysUntilVacant <= 30) return '#f59e0b';
    if (daysUntilVacant <= 90) return '#eab308';
    return '#10b981';
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '480px', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Legend Header Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Mumbai Hoarding Heatmap Status
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span style={{ color: '#cbd5e1' }}>Occupied (Hot)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ color: '#f59e0b' }}>Vacant in 30d</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }}></span>
            <span style={{ color: '#f43f5e' }}>Vacant / Risk</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={centerMumbai}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '480px' }}
      >
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {hoardings.map((h) => {
          const lat = h.latitude || 19.14;
          const lng = h.longitude || 72.86;
          const color = getMarkerColor(h.status, h.days_until_vacant);
          const radius = Math.max(10, Math.min(18, (h.size_sqft / 100)));
          const clientName = h.current_customer || h.current_customer_name || 'Unbooked';

          return (
            <CircleMarker
              key={h.site_id}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 2
              }}
              eventHandlers={{
                click: () => onSelectHoarding && onSelectHoarding(h)
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <div style={{ fontWeight: 800, fontSize: '0.78rem' }}>
                  {h.site_id} - {clientName}
                </div>
              </Tooltip>

              <Popup>
                <div style={{ padding: '6px 4px', minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>{h.site_id}</span>
                    <span style={{ fontSize: '0.7rem', color: color, fontWeight: 700, textTransform: 'uppercase' }}>
                      {h.days_until_vacant <= 0 ? 'Vacant Now' : `Vacant in ${h.days_until_vacant}d`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>{h.location}</p>
                  <p style={{ fontSize: '0.76rem', fontWeight: 600, color: '#38bdf8', marginBottom: '8px' }}>
                    Holding Client: {clientName}
                  </p>
                  
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}>
                    <div>Rate: <b style={{ color: '#10b981' }}>Rs.{(h.monthly_rate_inr/1000).toFixed(0)}k/mo</b></div>
                    <div>Traffic: <b style={{ color: '#38bdf8' }}>{h.traffic_score}/10</b></div>
                    <div>Size: <b>{h.size_sqft} sqft</b></div>
                    <div>Free On: <b>{h.vacant_from || h.vacancy_date || 'N/A'}</b></div>
                  </div>

                  <button
                    onClick={() => onSelectHoarding && onSelectHoarding(h)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={12} /> Inspect Site and AI Leads
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}