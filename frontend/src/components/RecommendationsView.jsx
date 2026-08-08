import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Send, User, Building, DollarSign, HeartHandshake, FileText } from 'lucide-react';

export default function RecommendationsView({ vacancies = [], onGeneratePitch }) {
  const [selectedSiteId, setSelectedSiteId] = useState('');

  useEffect(() => {
    if (vacancies.length > 0 && (!selectedSiteId || !vacancies.some(v => v.site_id === selectedSiteId))) {
      setSelectedSiteId(vacancies[0].site_id);
    }
  }, [vacancies, selectedSiteId]);

  const activeVacancy = vacancies.find(v => v.site_id === selectedSiteId) || vacancies[0];

  if (!activeVacancy) {
    return <div style={{ padding: '40px', color: '#94a3b8' }}>No active vacancies detected in pipeline.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Sparkles size={24} color="#0ea5e9" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              AI Lead Ranking & Explicit Match Reasoning
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Every lead carries detailed justification derived from past bookings, budget band, industry fit & relationship score.
          </p>
        </div>

        {/* Site Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Select Vacant Site:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid #0ea5e9',
              borderRadius: '10px',
              color: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {vacancies.map(v => (
              <option key={v.site_id} value={v.site_id}>
                {v.site_id} - {v.location} (Free {v.vacant_from})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Hoarding Summary Banner */}
      <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Site ID & Location</span>
            <h3 style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 800, marginTop: '2px' }}>{activeVacancy.site_id}</h3>
            <p style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{activeVacancy.location}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Size & Traffic Score</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {activeVacancy.size_sqft} sq.ft • <span style={{ color: '#38bdf8' }}>{activeVacancy.traffic_score}/10 Traffic</span>
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Rate Card</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              ₹{activeVacancy.monthly_rate_inr.toLocaleString('en-IN')}/month
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Vacancy Date</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
              {activeVacancy.vacant_from} ({activeVacancy.days_until_vacant} days left)
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Leads Cards Grid */}
      <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700 }}>
        Top-3 Ranked Customer Matches for {activeVacancy.site_id}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {activeVacancy.top_leads.map((lead, rankIdx) => {
          const rankColors = ['#10b981', '#3b82f6', '#8b5cf6'];
          const rankColor = rankColors[rankIdx] || '#38bdf8';

          return (
            <div
              key={lead.customer_id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${rankColor}`
              }}
            >
              <div>
                {/* Header Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: rankColor,
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      #{rankIdx + 1}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
                      Ranked Match
                    </span>
                  </div>

                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: rankColor,
                    background: 'rgba(255,255,255,0.06)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {lead.match_score}% Fit
                  </span>
                </div>

                {/* Customer Title */}
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  {lead.customer_name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
                  ID: {lead.customer_id} • Industry: <b style={{ color: '#cbd5e1' }}>{lead.industry ? lead.industry.toUpperCase() : ''}</b>
                </p>

                {/* Attributes Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '0.78rem'
                }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Budget Band:</span>
                    <p style={{ color: '#f8fafc', fontWeight: 700, textTransform: 'uppercase' }}>{lead.budget_band}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Relationship Score:</span>
                    <p style={{ color: lead.relationship_score >= 7 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                      {lead.relationship_score}/10
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Churn Risk:</span>
                    <p style={{ color: lead.churn_risk === 'High' ? '#f43f5e' : '#10b981', fontWeight: 700 }}>
                      {lead.churn_risk} ({(lead.churn_probability * 100).toFixed(0)}%)
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Suggested Rate:</span>
                    <p style={{ color: '#10b981', fontWeight: 700 }}>
                      ₹{activeVacancy.monthly_rate_inr.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Explicit Reasons List */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Explicit Ranking Justification:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {lead.reasons.map((reason, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                        <CheckCircle2 size={14} color={rankColor} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onGeneratePitch && onGeneratePitch(activeVacancy.site_id, lead.customer_id, activeVacancy.monthly_rate_inr)}
                className="glass-button"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <Sparkles size={16} /> Draft AI Pitch for {lead.customer_name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
