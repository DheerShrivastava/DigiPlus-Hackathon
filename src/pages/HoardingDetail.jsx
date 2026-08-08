import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Maximize2, 
  Calendar, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  DollarSign,
  Send,
  Loader2
} from 'lucide-react';
import { getHoardingById, getLeadRecommendations } from '../services/api';
import { HOARDING_DATA, getRecommendationsForHoarding } from '../data/mockData';

export default function HoardingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hoarding, setHoarding] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHoardingDetails() {
      setLoading(true);
      try {
        const res = await getHoardingById(id);
        if (res.success && res.data) {
          setHoarding(res.data);
          const leadRes = await getLeadRecommendations(res.data.hoardingId || res.data._id);
          if (leadRes.success && leadRes.data) setLeads(leadRes.data);
        } else {
          const match = HOARDING_DATA.find(h => h.id === id || h.hoardingId === id) || HOARDING_DATA[0];
          setHoarding(match);
          setLeads(getRecommendationsForHoarding(match));
        }
      } catch (err) {
        console.warn("Using fallback local hoarding:", err.message);
        const match = HOARDING_DATA.find(h => h.id === id || h.hoardingId === id) || HOARDING_DATA[0];
        setHoarding(match);
        setLeads(getRecommendationsForHoarding(match));
      } finally {
        setLoading(false);
      }
    }

    loadHoardingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-detail-page">
        <Loader2 size={28} className="spin text-brand" />
        <span>Loading Billboard Site Intelligence...</span>
      </div>
    );
  }

  const h = hoarding || HOARDING_DATA[0];

  return (
    <div className="hoarding-detail-page">
      {/* Top Back Nav */}
      <button className="btn btn-outline btn-sm mb-3" onClick={() => navigate('/hoardings')}>
        <ArrowLeft size={14} /> Back to Inventory Catalog
      </button>

      {/* Main Header Card */}
      <div className="dashboard-card mb-4">
        <div className="card-body detail-header-flex">
          <div className="site-badge font-mono">{h.hoardingId || h.id}</div>
          <div className="flex-1">
            <h1 className="detail-title">{h.location}</h1>
            <span className="detail-sub">{h.city} • {h.size} • Traffic Score: {h.trafficScore || 90}/100</span>
          </div>

          <div className="detail-header-actions">
            <button className="btn btn-secondary" onClick={() => navigate(`/ai-copilot?site=${h.hoardingId || h.id}`)}>
              <Sparkles size={15} /> Launch Sales Copilot
            </button>
            <button className="btn btn-primary" onClick={() => navigate(`/ai-outreach?site=${h.hoardingId || h.id}`)}>
              <Send size={15} /> Create Outreach Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid-4 mb-4">
        <div className="dashboard-card metric-detail-card">
          <span className="lbl">Monthly Rate</span>
          <span className="val text-emerald">₹{((h.monthlyRate || 850000) / 100000).toFixed(2)}L</span>
          <span className="sub">{h.dailyImpressions || '450k impressions/day'}</span>
        </div>

        <div className="dashboard-card metric-detail-card">
          <span className="lbl">Occupancy Rate</span>
          <span className="val">{h.occupancyRate || 92}%</span>
          <span className="sub">{h.bookingFrequency || '24 campaigns/yr'}</span>
        </div>

        <div className="dashboard-card metric-detail-card">
          <span className="lbl">Free From Date</span>
          <span className="val text-amber">{h.freeFromDate ? new Date(h.freeFromDate).toISOString().substring(0, 10) : '2026-08-23'}</span>
          <span className="sub">Upcoming Expiration Window</span>
        </div>

        <div className="dashboard-card metric-detail-card">
          <span className="lbl">Revenue At Risk</span>
          <span className="val text-rose">₹{(((h.revenueAtRisk || (h.monthlyRate * 2))) / 100000).toFixed(2)}L</span>
          <span className="sub">Requires Proactive Renewal</span>
        </div>
      </div>

      {/* Deep Specs & AI Recommendations */}
      <div className="grid-2 mb-4">
        {/* Left: Deep Specs */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={18} className="text-brand" />
              <span>Technical & Regulatory Specs</span>
            </div>
          </div>
          <div className="card-body">
            <ul className="specs-list">
              <li><strong>Permit Status:</strong> {h.permitStatus || 'MCGM Approved Commercial License'}</li>
              <li><strong>Lighting:</strong> {h.lighting || 'High Intensity Dual LED Floodlights'}</li>
              <li><strong>Peak Commute Hours:</strong> {h.peakHours || '08:30 AM - 11:30 AM & 05:30 PM - 09:00 PM'}</li>
              <li><strong>Demand Score:</strong> {h.demandScore || 94}/100 ({h.demandLevel || 'High'} Demand)</li>
              <li><strong>Total Lifetime Revenue:</strong> ₹{(((h.revenueGenerated || 8500000)) / 100000).toFixed(1)} Lakhs</li>
            </ul>

            <div className="mt-4">
              <h4 className="font-bold text-sm mb-2">Historical 6-Month Occupancy:</h4>
              <div className="bar-flex">
                {(h.historicalOccupancy || [92, 95, 98, 94, 96, 96]).map((val, idx) => (
                  <div key={idx} className="bar-col">
                    <div className="bar-wrapper">
                      <div className="bar-fill" style={{ height: `${val}%` }}></div>
                    </div>
                    <span className="bar-lbl">M{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Lead Matches for Site */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={18} className="text-brand" />
              <span>Top Recommended Corporate Advertisers</span>
            </div>
          </div>

          <div className="card-body">
            <div className="leads-mini-list">
              {leads.map((lead, idx) => (
                <div key={idx} className="mini-lead-card">
                  <div className="mini-head">
                    <span className="font-bold">{lead.customerName}</span>
                    <span className="badge badge-success">{lead.matchGrade || 'A+'} Match</span>
                  </div>
                  <div className="text-xs text-secondary mt-1">{lead.industry} • Budget: {lead.budgetBand}</div>
                  <div className="text-xs text-muted mt-1">{lead.reasoning?.industryFit || 'High category fit for site traffic demographic.'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .detail-header-flex { display: flex; align-items: center; gap: 1.25rem; }
        .site-badge { background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple)); color: #fff; font-weight: 800; font-size: 1.1rem; padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); }
        .detail-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); line-height: 1.2; }
        .detail-sub { font-size: 0.85rem; color: var(--text-muted); }
        .detail-header-actions { display: flex; gap: 0.75rem; }
        .metric-detail-card { padding: 1rem 1.25rem; display: flex; flex-direction: column; }
        .metric-detail-card .lbl { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .metric-detail-card .val { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0; }
        .metric-detail-card .sub { font-size: 0.72rem; color: var(--text-secondary); }
        .specs-list { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.85rem; color: var(--text-secondary); }
        .bar-flex { display: flex; align-items: flex-end; gap: 0.6rem; height: 80px; background-color: var(--bg-tertiary); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); }
        .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .bar-wrapper { flex: 1; width: 100%; background-color: var(--bg-card); border-radius: 3px; display: flex; align-items: flex-end; overflow: hidden; }
        .bar-fill { width: 100%; background: linear-gradient(180deg, var(--brand-primary), var(--accent-cyan)); border-radius: 3px; }
        .bar-lbl { font-size: 0.65rem; color: var(--text-muted); margin-top: 0.2rem; }
        .leads-mini-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .mini-lead-card { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.85rem; }
        .mini-head { display: flex; justify-content: space-between; align-items: center; }
        .loading-detail-page { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 1rem; color: var(--text-secondary); font-weight: 600; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-emerald { color: var(--accent-emerald); }
        .text-amber { color: var(--accent-amber); }
        .text-rose { color: var(--accent-rose); }
        .text-brand { color: var(--brand-primary); }

        @media (max-width: 1024px) {
          .grid-4, .grid-2 { grid-template-columns: 1fr; }
          .detail-header-flex { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
