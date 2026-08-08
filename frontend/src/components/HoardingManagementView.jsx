import React, { useState } from 'react';
import { Building2, Plus, Trash2, Search, MapPin, Eye, DollarSign, Activity } from 'lucide-react';

export default function HoardingManagementView({ hoardings, onAddHoarding, onDeleteHoarding, onSelectHoarding }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new hoarding
  const [newSiteId, setNewSiteId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSize, setNewSize] = useState(800);
  const [newTraffic, setNewTraffic] = useState(8.5);
  const [newRate, setNewRate] = useState(200000);
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');

  const filteredHoardings = hoardings.filter(h => 
    h.site_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSiteId || !newLocation) return;
    onAddHoarding({
      site_id: newSiteId,
      location: newLocation,
      size_sqft: parseInt(newSize),
      traffic_score: parseFloat(newTraffic),
      monthly_rate_inr: parseFloat(newRate),
      latitude: newLat ? parseFloat(newLat) : undefined,
      longitude: newLng ? parseFloat(newLng) : undefined
    });
    setShowAddModal(false);
    setNewSiteId('');
    setNewLocation('');
    setNewLat('');
    setNewLng('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Building2 size={24} color="#38bdf8" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Hoarding Inventory & Site Management
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Add, update, or remove sites across Mumbai. Monitor hot-selling frequency and vacancy timelines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="glass-button"
          style={{ padding: '12px 20px', fontSize: '0.9rem' }}
        >
          <Plus size={18} /> Add New Billboard
        </button>
      </div>

      {/* Toolbar Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by Site ID or Location (e.g. Kandivali, BKC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>

        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Showing <b>{filteredHoardings.length}</b> of <b>{hoardings.length}</b> Mumbai Sites
        </span>
      </div>

      {/* Inventory Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px' }}>Site ID & Location</th>
                <th style={{ padding: '16px' }}>Size (sq.ft)</th>
                <th style={{ padding: '16px' }}>Traffic Score</th>
                <th style={{ padding: '16px' }}>Monthly Price</th>
                <th style={{ padding: '16px' }}>Active Client</th>
                <th style={{ padding: '16px' }}>Heatmap Status</th>
                <th style={{ padding: '16px' }}>Days Until Vacant</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoardings.map((h) => {
                const isVacantSoon = h.days_until_vacant <= 30;
                const isVacantNow = h.days_until_vacant <= 0;
                const statusColor = isVacantNow ? '#f43f5e' : (isVacantSoon ? '#f59e0b' : '#10b981');

                return (
                  <tr key={h.site_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>{h.site_id}</span>
                      <p style={{ color: '#f8fafc', fontWeight: 500, fontSize: '0.85rem', marginTop: '2px' }}>{h.location}</p>
                    </td>

                    <td style={{ padding: '16px', fontWeight: 600, color: '#cbd5e1' }}>
                      {h.size_sqft} sqft
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: 800, color: '#38bdf8' }}>{h.traffic_score}</span>/10
                    </td>

                    <td style={{ padding: '16px', fontWeight: 700, color: '#10b981' }}>
                      ₹{h.monthly_rate_inr.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '16px', color: '#f8fafc', fontWeight: 500 }}>
                      {h.current_customer || <span style={{ color: '#f43f5e', fontStyle: 'italic' }}>Unbooked</span>}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: `${statusColor}20`,
                        color: statusColor,
                        border: `1px solid ${statusColor}40`
                      }}>
                        {isVacantNow ? 'VACANT NOW' : (isVacantSoon ? 'VACANT SOON' : 'HOT SELLING')}
                      </span>
                    </td>

                    <td style={{ padding: '16px', fontWeight: 700, color: statusColor }}>
                      {h.days_until_vacant <= 0 ? '0 days' : `${h.days_until_vacant} days`}
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onSelectHoarding && onSelectHoarding(h)}
                          title="Inspect Details"
                          style={{ padding: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#38bdf8', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteHoarding && onDeleteHoarding(h.site_id)}
                          title="Remove Hoarding"
                          style={{ padding: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hoarding Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
              Add New Mumbai Billboard
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Site ID (e.g. HRD-125)</label>
                <input
                  type="text"
                  required
                  placeholder="HRD-125"
                  value={newSiteId}
                  onChange={(e) => setNewSiteId(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Location / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="Western Express Highway, Goregaon"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Size (sq.ft)</label>
                  <input
                    type="number"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Traffic Score (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTraffic}
                    onChange={(e) => setNewTraffic(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Monthly Rate (₹ INR)</label>
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Latitude (Optional)</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 19.1680"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Longitude (Optional)</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 72.8540"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="glass-button-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="glass-button"
                >
                  Save Billboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
