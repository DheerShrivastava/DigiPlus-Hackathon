import React from 'react';
import { X, Sparkles, MapPin, DollarSign, Calendar, Activity, CheckCircle } from 'lucide-react';

export default function HoardingDetailModal({ hoarding, vacancies, onClose, onGeneratePitch }) {
  if (!hoarding) return null;

  const matchedVacancy = vacancies.find(v => v.site_id === hoarding.site_id);
  const statusColor = hoarding.days_until_vacant <= 0 ? '#f43f5e' : (hoarding.days_until_vacant <= 30 ? '#f59e0b' : '#10b981');

  return (
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
      zIndex: 2500,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{hoarding.site_id}</span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: `${statusColor}20`,
                color: statusColor,
                border: `1px solid ${statusColor}40`
              }}>
                {hoarding.days_until_vacant <= 0 ? 'VACANT NOW' : `VACANT IN ${hoarding.days_until_vacant} DAYS`}
              </span>
            </div>
            <p style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>{hoarding.location}</p>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body Metrics */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Facts Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Rate</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                ₹{hoarding.monthly_rate_inr.toLocaleString('en-IN')}/mo
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Size & Traffic Score</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {hoarding.size_sqft} sqft • {hoarding.traffic_score}/10
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Currently Using Company</span>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {hoarding.current_customer || 'No active client'}
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Heatmap Occupancy Score</span>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
                {hoarding.occupancy_frequency}% High Demand
              </p>
            </div>
          </div>

          {/* AI Recommended Leads Section */}
          {matchedVacancy && matchedVacancy.top_leads && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#0ea5e9" /> Top 3 AI Recommended Customers for this Billboard:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {matchedVacancy.top_leads.map((lead, idx) => (
                  <div key={lead.customer_id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>#{idx + 1} {lead.customer_name}</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({lead.industry})</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>{lead.match_score}% Match</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                      {lead.reasons.slice(0, 2).map((r, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={12} color="#10b981" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onGeneratePitch(hoarding.site_id, lead.customer_id, hoarding.monthly_rate_inr);
                      }}
                      className="glass-button"
                      style={{ marginTop: '10px', width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.75rem' }}
                    >
                      <Sparkles size={14} /> Draft AI Pitch for {lead.customer_name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}