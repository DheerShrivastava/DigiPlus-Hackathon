import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TableProperties, 
  Search, 
  Filter, 
  Calendar, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  MapPin, 
  Send,
  Loader2
} from 'lucide-react';
import { getVacancies90Days, getLeadRecommendations } from '../services/api';
import { HOARDING_DATA, getRecommendationsForHoarding } from '../data/mockData';

export default function Vacancies() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [recs, setRecs] = useState([]);
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVacancies() {
      setLoading(true);
      try {
        const res = await getVacancies90Days();
        if (res.success && res.data && res.data.length > 0) {
          setVacancies(res.data);
          setSelectedSite(res.data[0]);
        } else {
          setVacancies(HOARDING_DATA);
          setSelectedSite(HOARDING_DATA[0]);
        }
      } catch (err) {
        console.warn("Using local vacancies dataset:", err.message);
        setVacancies(HOARDING_DATA);
        setSelectedSite(HOARDING_DATA[0]);
      } finally {
        setLoading(false);
      }
    }

    loadVacancies();
  }, []);

  useEffect(() => {
    async function fetchSiteLeads() {
      if (!selectedSite) return;
      try {
        const res = await getLeadRecommendations(selectedSite.hoardingId || selectedSite.id || selectedSite._id);
        if (res.success && res.data) {
          setRecs(res.data);
        } else {
          setRecs(getRecommendationsForHoarding(selectedSite));
        }
      } catch {
        setRecs(getRecommendationsForHoarding(selectedSite));
      }
    }

    fetchSiteLeads();
  }, [selectedSite?.id, selectedSite?.hoardingId]);

  const filteredVacancies = vacancies.filter(v => {
    if (urgencyFilter === 'all') return true;
    return v.urgency === urgencyFilter || (urgencyFilter === 'critical' && v.status === 'EXPIRING');
  });

  const activeSite = selectedSite || vacancies[0] || HOARDING_DATA[0];

  return (
    <div className="vacancies-page">
      {/* Header */}
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <TableProperties className="text-rose" size={24} />
          Upcoming Vacancies Intelligence (Next 90 Days)
        </h1>
        <p className="page-subtitle">Track expiring leases, calculate revenue at risk, and launch targeted AI advertiser outreach before open market release.</p>
      </div>

      {/* Filter Tabs */}
      <div className="dashboard-card filters-card mb-4">
        <div className="card-body filter-tabs-flex">
          <button 
            className={`filter-tab-btn ${urgencyFilter === 'all' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('all')}
          >
            All Expiring ({vacancies.length})
          </button>
          <button 
            className={`filter-tab-btn critical ${urgencyFilter === 'critical' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('critical')}
          >
            CRITICAL (&lt;30 Days)
          </button>
          <button 
            className={`filter-tab-btn high ${urgencyFilter === 'high' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('high')}
          >
            HIGH (30-60 Days)
          </button>
          <button 
            className={`filter-tab-btn moderate ${urgencyFilter === 'moderate' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('moderate')}
          >
            MODERATE (60-90 Days)
          </button>
        </div>
      </div>

      {/* Vacancy Table & Right Intelligence Drawer */}
      <div className="grid-main-section">
        {/* Table */}
        <div className="dashboard-card">
          <div className="table-wrapper">
            <table className="vacancy-table">
              <thead>
                <tr>
                  <th>Hoarding ID</th>
                  <th>Location</th>
                  <th>Booking End</th>
                  <th>Free From</th>
                  <th>Monthly Rate</th>
                  <th>Revenue At Risk</th>
                  <th>Urgency Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <Loader2 size={20} className="spin text-brand" /> Querying MongoDB expirations...
                    </td>
                  </tr>
                ) : filteredVacancies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">No vacancies matching filter.</td>
                  </tr>
                ) : (
                  filteredVacancies.map(v => {
                    const isSelected = activeSite?.id === v.id || activeSite?.hoardingId === v.hoardingId;
                    const endDateStr = v.bookingEndDate ? new Date(v.bookingEndDate).toISOString().substring(0, 10) : '2026-08-22';
                    const freeDateStr = v.freeFromDate ? new Date(v.freeFromDate).toISOString().substring(0, 10) : '2026-08-23';

                    return (
                      <tr 
                        key={v._id || v.id || v.hoardingId} 
                        className={`table-row ${isSelected ? 'selected' : ''} urgency-${v.urgency || 'critical'}`}
                        onClick={() => setSelectedSite(v)}
                      >
                        <td className="font-mono font-bold text-brand">{v.hoardingId || v.id}</td>
                        <td>
                          <div className="location-name font-semibold">{v.location}</div>
                          <span className="city-pill">{v.city}</span>
                        </td>
                        <td>{endDateStr}</td>
                        <td className="font-bold text-emerald">{freeDateStr}</td>
                        <td className="font-bold">₹{(v.monthlyRate / 100000).toFixed(2)}L</td>
                        <td className="revenue-risk-cell">₹{((v.revenueAtRisk || (v.monthlyRate * 2)) / 100000).toFixed(2)}L</td>
                        <td>
                          <span className={`badge badge-${(v.urgency || 'critical') === 'critical' ? 'critical' : (v.urgency || '') === 'high' ? 'high' : 'moderate'}`}>
                            {(v.urgency || 'critical').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Vacancy Intelligence Drawer */}
        <div className="dashboard-card drawer-card">
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={18} className="text-brand" />
              <span>Vacancy Sales Strategy</span>
            </div>
            <span className="font-mono font-bold text-brand">{activeSite?.hoardingId || activeSite?.id}</span>
          </div>

          <div className="card-body">
            <div className="site-box mb-3">
              <h3 className="text-base font-bold text-primary">{activeSite?.location}</h3>
              <p className="text-xs text-muted mt-1">{activeSite?.size} • Rate: ₹{((activeSite?.monthlyRate || 850000)/100000).toFixed(2)}L/mo</p>
              <div className="text-xs text-rose font-bold mt-2">Revenue At Risk: ₹{(((activeSite?.revenueAtRisk || (activeSite?.monthlyRate * 2)))/100000).toFixed(2)} Lakhs</div>
            </div>

            <h4 className="text-sm font-bold text-primary mb-2">Top 3 Recommended Advertisers:</h4>
            <div className="recs-mini-stack mb-4">
              {recs.map((rec, i) => (
                <div key={i} className="mini-rec-row">
                  <span className="rank font-bold">#{i+1}</span>
                  <div className="info">
                    <span className="name font-bold">{rec.customerName}</span>
                    <span className="ind text-xs text-secondary">{rec.industry}</span>
                  </div>
                  <span className="score font-mono font-bold text-brand">{rec.leadScore}%</span>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary btn-full"
              onClick={() => navigate(`/ai-outreach?site=${activeSite?.hoardingId || activeSite?.id}`)}
            >
              <Send size={15} /> Launch AI Cold Email Outreach
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .filter-tabs-flex { display: flex; gap: 0.5rem; flex-wrap: wrap; padding: 0.75rem 1rem; }
        .filter-tab-btn { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
        .filter-tab-btn.active { background-color: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
        .filter-tab-btn.critical.active { background-color: var(--badge-critical-text); }
        .filter-tab-btn.high.active { background-color: var(--badge-high-text); }
        .filter-tab-btn.moderate.active { background-color: var(--badge-moderate-text); }
        .grid-main-section { display: grid; grid-template-columns: 2.2fr 1fr; gap: 1.25rem; }
        .site-box { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--radius-md); }
        .recs-mini-stack { display: flex; flex-direction: column; gap: 0.5rem; }
        .mini-rec-row { display: flex; align-items: center; gap: 0.65rem; background-color: var(--bg-tertiary); padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); }
        .mini-rec-row .rank { font-size: 0.8rem; color: var(--brand-primary); }
        .mini-rec-row .info { flex: 1; display: flex; flex-direction: column; line-height: 1.2; }
        .mini-rec-row .name { font-size: 0.82rem; color: var(--text-primary); }
        .mini-rec-row .ind { font-size: 0.7rem; }
        .mini-rec-row .score { font-size: 0.85rem; }
        .btn-full { width: 100%; padding: 0.75rem; font-size: 0.9rem; }
        .text-rose { color: var(--accent-rose); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .grid-main-section { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
