import React from 'react';
import { TrendingUp, ShieldAlert } from 'lucide-react';

export default function AnalyticsView({ vacancies = [], hoardings = [] }) {
  const highRiskIncumbents = vacancies.filter(v => 
    (v.top_leads || []).some(l => l.churn_risk === 'High')
  );

  const totalRevenueAtRisk = vacancies.reduce((acc, v) => acc + v.revenue_at_risk, 0);
  const avgTraffic = hoardings.length > 0 ? (hoardings.reduce((sum, h) => sum + h.traffic_score, 0) / hoardings.length).toFixed(1) : '8.2';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <TrendingUp size={24} color="#8b5cf6" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Incumbent Renewal vs Churn & Revenue Risk Analysis
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Predict client churn probabilities, flag cold relationships, and protect recurring billboard revenue.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Total Network Inventory</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>{hoardings.length} Sites</h3>
          <p style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px' }}>Mumbai Metro Coverage</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>90-Day Revenue at Risk</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e', marginTop: '6px' }}>₹{(totalRevenueAtRisk / 100000).toFixed(2)} L</h3>
          <p style={{ fontSize: '0.78rem', color: '#f43f5e', marginTop: '4px' }}>Across {vacancies.length} soon-vacant sites</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>High Churn Risk Clients</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>{highRiskIncumbents.length} Clients</h3>
          <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '4px' }}>Low contact / relationship</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Avg Network Traffic Score</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: '6px' }}>{avgTraffic}/10</h3>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>Prime commuter eyeballs</p>
        </div>
      </div>

      {/* Incumbent Renewal vs Churn Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={20} color="#f59e0b" /> Incumbent Renewal & Churn Risk Radar
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Hoarding Site</th>
                <th style={{ padding: '12px' }}>Current Incumbent Client</th>
                <th style={{ padding: '12px' }}>Vacant Date</th>
                <th style={{ padding: '12px' }}>Predicted Churn Risk</th>
                <th style={{ padding: '12px' }}>Recommended AI Action</th>
              </tr>
            </thead>
            <tbody>
              {vacancies.map((v) => {
                const lead = (v.top_leads || [])[0];
                const isHighRisk = lead?.churn_risk === 'High';

                return (
                  <tr key={v.site_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#38bdf8' }}>
                      {v.site_id}
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 400 }}>{v.location}</p>
                    </td>

                    <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                      {v.current_customer_name || 'N/A'}
                    </td>

                    <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 700 }}>
                      {v.vacant_from} ({v.days_until_vacant}d)
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isHighRisk ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
                        color: isHighRisk ? '#f43f5e' : '#10b981',
                        border: isHighRisk ? '1px solid rgba(244,63,94,0.3)' : '1px solid rgba(16,185,129,0.3)'
                      }}>
                        {isHighRisk ? 'HIGH CHURN RISK' : 'LOW CHURN RISK'}
                      </span>
                    </td>

                    <td style={{ padding: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {isHighRisk ? '⚠️ Immediate Re-engagement Required' : '✓ Standard Contract Renewal Sequence'}
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
