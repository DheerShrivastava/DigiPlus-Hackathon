import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Briefcase, 
  DollarSign, 
  Award, 
  ChevronRight, 
  BrainCircuit, 
  Send,
  Loader2
} from 'lucide-react';
import { getLeadRecommendations, getHoardings } from '../services/api';
import { HOARDING_DATA, LEAD_RECOMMENDATIONS } from '../data/mockData';

export default function Leads() {
  const navigate = useNavigate();
  const [selectedHoarding, setSelectedHoarding] = useState(HOARDING_DATA[0]);
  const [hoardings, setHoardings] = useState(HOARDING_DATA);
  const [leads, setLeads] = useState(LEAD_RECOMMENDATIONS["H-101"]);
  const [activeLead, setActiveLead] = useState(LEAD_RECOMMENDATIONS["H-101"][0]);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHoardingsAndLeads() {
      setLoading(true);
      try {
        const hRes = await getHoardings({ limit: 10 });
        if (hRes.success && hRes.data && hRes.data.length > 0) {
          setHoardings(hRes.data);
          const firstH = hRes.data[0];
          setSelectedHoarding(firstH);
          const lRes = await getLeadRecommendations(firstH.hoardingId || firstH._id);
          if (lRes.success && lRes.data) {
            setLeads(lRes.data);
            setActiveLead(lRes.data[0]);
          }
        }
      } catch (err) {
        console.warn("Using local leads dataset:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadHoardingsAndLeads();
  }, []);

  const handleSiteChange = async (h) => {
    setSelectedHoarding(h);
    setLoading(true);
    try {
      const lRes = await getLeadRecommendations(h.hoardingId || h.id || h._id);
      if (lRes.success && lRes.data) {
        setLeads(lRes.data);
        setActiveLead(lRes.data[0]);
      }
    } catch {
      setLeads(LEAD_RECOMMENDATIONS["H-101"]);
      setActiveLead(LEAD_RECOMMENDATIONS["H-101"][0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(l => {
    return industryFilter === 'all' || l.industry.toLowerCase().includes(industryFilter.toLowerCase());
  });

  return (
    <div className="leads-page">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <Sparkles className="text-brand" size={24} />
          AI Lead Recommendation & Match Intelligence
        </h1>
        <p className="page-subtitle">Deterministic scoring model combining Industry Fit (25%), Budget Fit (25%), Historical Match (25%), and Relationship Strength (25%).</p>
      </div>

      {/* Selector & Filters */}
      <div className="dashboard-card mb-4">
        <div className="card-body selector-flex">
          <div className="field-block flex-1">
            <label className="text-xs font-bold text-muted uppercase">Selected Hoarding Site Target:</label>
            <select 
              className="select-field font-bold"
              value={selectedHoarding?.hoardingId || selectedHoarding?.id}
              onChange={(e) => {
                const found = hoardings.find(h => (h.hoardingId || h.id) === e.target.value);
                if (found) handleSiteChange(found);
              }}
            >
              {hoardings.map(h => (
                <option key={h._id || h.id || h.hoardingId} value={h.hoardingId || h.id}>
                  {h.hoardingId || h.id}: {h.location} ({h.city} • ₹{(h.monthlyRate/100000).toFixed(2)}L/mo)
                </option>
              ))}
            </select>
          </div>

          <div className="field-block">
            <label className="text-xs font-bold text-muted uppercase">Filter Industry:</label>
            <select 
              className="select-field"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              <option value="Quick Commerce">Quick Commerce & Retail</option>
              <option value="Consumer Electronics">Consumer Electronics</option>
              <option value="Automotive">Automotive & CleanTech</option>
              <option value="Fintech">Fintech & Banking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Leads Table + Active Lead Score Inspector */}
      <div className="grid-main-section">
        {/* Table */}
        <div className="dashboard-card">
          <div className="table-wrapper">
            <table className="vacancy-table">
              <thead>
                <tr>
                  <th>Rank & Client</th>
                  <th>Industry Sector</th>
                  <th>Budget Band</th>
                  <th>Rel. Score</th>
                  <th>Lead Score</th>
                  <th>Primary Match Rationale</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <Loader2 size={20} className="spin text-brand" /> Running Lead Match Engine...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">No matching advertiser leads found.</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => {
                    const isSelected = activeLead?.id === lead.id || activeLead?.customerName === lead.customerName;
                    return (
                      <tr 
                        key={lead.id || idx}
                        className={`table-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => setActiveLead(lead)}
                      >
                        <td>
                          <div className="client-cell">
                            <span className="rank-num font-bold">#{idx + 1}</span>
                            <div>
                              <div className="font-bold text-primary">{lead.customerName}</div>
                              <span className="badge badge-success text-xs">{lead.matchGrade || 'A+'} Match</span>
                            </div>
                          </div>
                        </td>
                        <td>{lead.industry}</td>
                        <td className="font-semibold">{lead.budgetBand}</td>
                        <td className="font-bold text-cyan">{lead.relationshipScore}/100</td>
                        <td>
                          <span className="lead-score-pill font-mono font-bold">{lead.leadScore}%</span>
                        </td>
                        <td className="text-xs text-secondary max-w-xs">
                          {lead.reasoning?.industryFit || 'High category alignment with commuter footfalls.'}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLead(lead);
                            }}
                          >
                            Inspect <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Match Reasoning Panel */}
        <div className="dashboard-card inspector-card">
          <div className="card-header">
            <div className="card-title">
              <BrainCircuit size={18} className="text-purple" />
              <span>Score Breakdown Inspector</span>
            </div>
          </div>

          <div className="card-body">
            <div className="client-header mb-3">
              <h3 className="text-lg font-bold text-primary">{activeLead?.customerName || 'Select Client'}</h3>
              <span className="text-xs text-muted">{activeLead?.industry} • Budget: {activeLead?.budgetBand}</span>
            </div>

            {/* Score Breakdown Sliders */}
            <div className="score-sliders-stack mb-4">
              <div className="slider-row">
                <span className="lbl">Industry Fit (25%)</span>
                <div className="bar-bg"><div className="bar-fill bg-brand" style={{ width: `${(activeLead?.scoreBreakdown?.industryFitScore || 95)}%` }}></div></div>
                <span className="num">{activeLead?.scoreBreakdown?.industryFitScore || 95}%</span>
              </div>

              <div className="slider-row">
                <span className="lbl">Budget Fit (25%)</span>
                <div className="bar-bg"><div className="bar-fill bg-emerald" style={{ width: `${(activeLead?.scoreBreakdown?.budgetFitScore || 92)}%` }}></div></div>
                <span className="num">{activeLead?.scoreBreakdown?.budgetFitScore || 92}%</span>
              </div>

              <div className="slider-row">
                <span className="lbl">Historical Match (25%)</span>
                <div className="bar-bg"><div className="bar-fill bg-amber" style={{ width: `${(activeLead?.scoreBreakdown?.historicalMatchScore || 94)}%` }}></div></div>
                <span className="num">{activeLead?.scoreBreakdown?.historicalMatchScore || 94}%</span>
              </div>

              <div className="slider-row">
                <span className="lbl">Relationship (25%)</span>
                <div className="bar-bg"><div className="bar-fill bg-purple" style={{ width: `${(activeLead?.scoreBreakdown?.relationshipScoreVal || 95)}%` }}></div></div>
                <span className="num">{activeLead?.scoreBreakdown?.relationshipScoreVal || 95}%</span>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-full mb-2"
              onClick={() => navigate(`/ai-copilot?site=${selectedHoarding?.hoardingId || selectedHoarding?.id}&client=${activeLead?.customerName}`)}
            >
              <Sparkles size={15} /> Open AI Sales Copilot
            </button>

            <button 
              className="btn btn-secondary btn-full"
              onClick={() => navigate(`/ai-outreach?site=${selectedHoarding?.hoardingId || selectedHoarding?.id}&client=${activeLead?.customerName}`)}
            >
              <Send size={15} /> Launch Cold Email Campaign
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .selector-flex { display: flex; align-items: center; gap: 1.25rem; padding: 1rem 1.25rem; flex-wrap: wrap; }
        .field-block { display: flex; flex-direction: column; gap: 0.3rem; }
        .select-field { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); outline: none; }
        .grid-main-section { display: grid; grid-template-columns: 2.2fr 1fr; gap: 1.25rem; }
        .client-cell { display: flex; align-items: center; gap: 0.65rem; }
        .client-cell .rank-num { color: var(--brand-primary); }
        .lead-score-pill { background-color: var(--brand-light); color: var(--brand-primary); padding: 0.2rem 0.55rem; border-radius: 999px; }
        .max-w-xs { max-width: 200px; white-space: normal; line-height: 1.25; }
        .score-sliders-stack { display: flex; flex-direction: column; gap: 0.75rem; }
        .slider-row { display: flex; align-items: center; gap: 0.65rem; font-size: 0.75rem; color: var(--text-secondary); }
        .slider-row .lbl { width: 130px; font-weight: 600; }
        .slider-row .bar-bg { flex: 1; height: 6px; background-color: var(--bg-tertiary); border-radius: 999px; overflow: hidden; }
        .slider-row .bar-fill { height: 100%; border-radius: 999px; }
        .slider-row .num { width: 35px; text-align: right; font-weight: 800; color: var(--text-primary); }
        .bg-brand { background-color: var(--brand-primary); }
        .bg-emerald { background-color: var(--accent-emerald); }
        .bg-amber { background-color: var(--accent-amber); }
        .bg-purple { background-color: var(--accent-purple); }
        .btn-full { width: 100%; padding: 0.75rem; font-size: 0.88rem; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .grid-main-section { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
