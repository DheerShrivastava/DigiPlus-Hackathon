import React, { useState } from 'react';
import { CalendarClock, AlertTriangle, Sparkles, Send, ChevronRight, Filter, DollarSign } from 'lucide-react';

export default function VacanciesView({ vacancies, onGeneratePitch, onSelectHoarding }) {
  const [filterDays, setFilterDays] = useState(90);

  const filteredVacancies = vacancies.filter(v => v.days_until_vacant <= filterDays);
  const totalRevenueAtRisk = filteredVacancies.reduce((sum, v) => sum + v.revenue_at_risk, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <CalendarClock size={24} color="#f59e0b" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Upcoming 90-Day Vacancy Pipeline
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Sites falling vacant within 90 days without follow-on bookings. Target these before sites go dark.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '10px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: '#f43f5e', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Revenue at Risk
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              ₹{(totalRevenueAtRisk / 100000).toFixed(2)} Lakhs
            </span>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Sites Vacant Soon
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              {filteredVacancies.length} Hoardings
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="#64748b" />
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Filter Timeframe:</span>
          {[30, 60, 90].map(days => (
            <button
              key={days}
              onClick={() => setFilterDays(days)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: filterDays === days ? '1px solid #0ea5e9' : '1px solid rgba(255,255,255,0.08)',
                background: filterDays === days ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.04)',
                color: filterDays === days ? '#38bdf8' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Next {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Vacancy Pipeline Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px' }}>Site Details</th>
                <th style={{ padding: '16px' }}>Free-From Date</th>
                <th style={{ padding: '16px' }}>Monthly Rate</th>
                <th style={{ padding: '16px' }}>Revenue at Risk</th>
                <th style={{ padding: '16px' }}>Top-3 Best Fit Clients (AI Ranked)</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVacancies.map((v) => {
                const daysBadgeColor = v.days_until_vacant <= 30 ? '#f43f5e' : '#f59e0b';
                return (
                  <tr key={v.site_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}>
                    {/* Site Info */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>{v.site_id}</span>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                          {v.size_sqft} sqft • Traffic {v.traffic_score}/10
                        </span>
                      </div>
                      <p style={{ color: '#f8fafc', fontWeight: 500, fontSize: '0.85rem', marginTop: '4px' }}>{v.location}</p>
                      <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Incumbent: {v.current_customer_name}</p>
                    </td>

                    {/* Vacant Date */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{v.vacant_from}</div>
                      <span style={{ fontSize: '0.72rem', color: daysBadgeColor, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <AlertTriangle size={12} /> {v.days_until_vacant <= 0 ? 'Vacant Now' : `In ${v.days_until_vacant} Days`}
                      </span>
                    </td>

                    {/* Monthly Rate */}
                    <td style={{ padding: '16px', fontWeight: 700, color: '#10b981' }}>
                      ₹{v.monthly_rate_inr.toLocaleString('en-IN')}/mo
                    </td>

                    {/* Revenue at risk */}
                    <td style={{ padding: '16px', fontWeight: 800, color: '#f43f5e' }}>
                      ₹{(v.revenue_at_risk / 100000).toFixed(2)} L
                    </td>

                    {/* Top 3 Leads */}
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {v.top_leads.map((lead, idx) => (
                          <div key={lead.customer_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', background: idx === 0 ? '#10b981' : '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                #{idx + 1}
                              </span>
                              <div>
                                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.8rem' }}>{lead.customer_name}</span>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '6px' }}>({lead.industry})</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                              {lead.match_score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => onGeneratePitch && onGeneratePitch(v.site_id, v.top_leads[0]?.customer_id, v.monthly_rate_inr)}
                        className="glass-button"
                        style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                      >
                        <Sparkles size={14} /> 1-Click Pitch
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
