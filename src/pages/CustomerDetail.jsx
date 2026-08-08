import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Award, 
  CalendarCheck, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  Phone,
  Send,
  Loader2
} from 'lucide-react';
import { getCustomerById, getBookings } from '../services/api';
import { CUSTOMER_DATA, HOARDING_DATA } from '../data/mockData';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomerProfile() {
      setLoading(true);
      try {
        const res = await getCustomerById(id);
        if (res.success && res.data) {
          setCustomer(res.data);
          const bRes = await getBookings({ industry: res.data.industry });
          if (bRes.success && bRes.data) setBookings(bRes.data);
        } else {
          const match = CUSTOMER_DATA.find(c => c.id === id || c.customerId === id) || CUSTOMER_DATA[0];
          setCustomer(match);
        }
      } catch (err) {
        console.warn("Using fallback local customer:", err.message);
        const match = CUSTOMER_DATA.find(c => c.id === id || c.customerId === id) || CUSTOMER_DATA[0];
        setCustomer(match);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-detail-page">
        <Loader2 size={28} className="spin text-brand" />
        <span>Loading Brand Advertiser Account Profile...</span>
      </div>
    );
  }

  const c = customer || CUSTOMER_DATA[0];
  const recHoarding = HOARDING_DATA[0];

  return (
    <div className="customer-detail-page">
      {/* Back Button */}
      <button className="btn btn-outline btn-sm mb-3" onClick={() => navigate('/customers')}>
        <ArrowLeft size={14} /> Back to Advertiser Portfolio
      </button>

      {/* Header Profile Card */}
      <div className="dashboard-card mb-4">
        <div className="card-body customer-header-flex">
          <div className="cust-avatar">
            <Users size={28} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="cust-title">{c.companyName || c.name}</h1>
              <span className="badge badge-success">{c.customerStatus || 'ACTIVE ACCOUNT'}</span>
            </div>
            <p className="cust-sub">{c.industry} • Account ID: {c.customerId || c.id}</p>
            <div className="cust-contacts mt-2">
              <span><Mail size={13} /> {c.email || 'marketing@brand.com'}</span>
              <span><Phone size={13} /> {c.phone || '+91 98200 00000'}</span>
            </div>
          </div>

          <div className="cust-header-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/ai-copilot?client=${c.companyName || c.name}`)}>
              <Sparkles size={15} /> Generate AI Sales Opportunity
            </button>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid-4 mb-4">
        <div className="dashboard-card stat-card">
          <span className="lbl">Relationship Strength</span>
          <span className="val text-cyan">{c.relationshipScore || 95}/100</span>
          <span className="sub">Tier-1 Priority Account</span>
        </div>

        <div className="dashboard-card stat-card">
          <span className="lbl">Monthly Budget Band</span>
          <span className="val text-emerald">{c.budgetBand || '₹10L - ₹25L / mo'}</span>
          <span className="sub">Approved Quarterly Allocation</span>
        </div>

        <div className="dashboard-card stat-card">
          <span className="lbl">Total OOH Lifetime Spend</span>
          <span className="val">₹{((c.totalSpend || 14500000) / 100000).toFixed(1)}L</span>
          <span className="sub">Across {c.totalBookings || 12} Billboard Campaigns</span>
        </div>

        <div className="dashboard-card stat-card">
          <span className="lbl">Preferred Locations</span>
          <span className="val text-brand text-base font-bold">{c.preferredLocations ? c.preferredLocations.slice(0,2).join(', ') : 'Worli, Lower Parel'}</span>
          <span className="sub">High-Density Commuter Corridors</span>
        </div>
      </div>

      {/* Booking History & Recommended New Opportunities */}
      <div className="grid-2 mb-4">
        {/* Booking History */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <CalendarCheck size={18} className="text-brand" />
              <span>Historical Campaign Bookings</span>
            </div>
          </div>
          <div className="card-body">
            {bookings.length === 0 ? (
              <div className="text-sm text-muted">No historical bookings logged in database yet.</div>
            ) : (
              <div className="history-stack">
                {bookings.map((b, idx) => (
                  <div key={b._id || idx} className="history-item">
                    <div className="font-bold text-primary">{b.campaignName || 'OOH Brand Drive'}</div>
                    <div className="text-xs text-secondary">Start: {b.startDate?.substring(0,10)} • Rate: ₹{((b.monthlyRate || 500000)/100000).toFixed(2)}L</div>
                    <span className="badge badge-success text-xs mt-1">{b.status || 'ACTIVE'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommended New Opportunities */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <Sparkles size={18} className="text-purple" />
              <span>AI Recommended Site Opportunities</span>
            </div>
          </div>
          <div className="card-body">
            <div className="opp-card">
              <div className="opp-head">
                <span className="font-bold">{recHoarding.hoardingId}: {recHoarding.location}</span>
                <span className="text-emerald font-bold font-mono">97% Match</span>
              </div>
              <p className="text-xs text-secondary mt-1">Prime billboard site matching {c.companyName}'s preferred demographic corridor.</p>
              <button 
                className="btn btn-primary btn-sm mt-3 w-full"
                onClick={() => navigate(`/ai-outreach?site=${recHoarding.hoardingId}&client=${c.companyName || c.name}`)}
              >
                <Send size={14} /> Send AI Outreach Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .customer-header-flex { display: flex; align-items: center; gap: 1.25rem; }
        .cust-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple)); color: #fff; display: flex; align-items: center; justify-content: center; }
        .cust-title { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
        .cust-sub { font-size: 0.85rem; color: var(--text-muted); }
        .cust-contacts { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-secondary); }
        .stat-card { padding: 1rem; display: flex; flex-direction: column; }
        .stat-card .lbl { font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
        .stat-card .val { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0.2rem 0; }
        .stat-card .sub { font-size: 0.7rem; color: var(--text-secondary); }
        .history-stack { display: flex; flex-direction: column; gap: 0.75rem; }
        .history-item { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-sm); }
        .opp-card { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-sm); }
        .opp-head { display: flex; justify-content: space-between; align-items: center; }
        .loading-detail-page { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 1rem; color: var(--text-secondary); font-weight: 600; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-cyan { color: var(--accent-cyan); }
        .text-emerald { color: var(--accent-emerald); }
        .text-purple { color: var(--accent-purple); }
        .text-brand { color: var(--brand-primary); }
        .w-full { width: 100%; }
        .mt-3 { margin-top: 0.75rem; }

        @media (max-width: 1024px) {
          .grid-4, .grid-2 { grid-template-columns: 1fr; }
          .customer-header-flex { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
