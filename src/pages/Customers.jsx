import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Briefcase, 
  DollarSign, 
  Award, 
  ChevronRight, 
  Building2, 
  Mail, 
  Phone,
  Loader2
} from 'lucide-react';
import { getCustomers } from '../services/api';
import { CUSTOMER_DATA } from '../data/mockData';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(CUSTOMER_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (industryFilter !== 'all') params.industry = industryFilter;

        const res = await getCustomers(params);
        if (res.success && res.data && res.data.length > 0) {
          setCustomers(res.data);
        }
      } catch (err) {
        console.warn("Using local customers dataset:", err.message);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadCustomers, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, industryFilter]);

  return (
    <div className="customers-page">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <Users className="text-brand" size={24} />
          Corporate Advertiser Accounts ({customers.length} Clients)
        </h1>
        <p className="page-subtitle">Track enterprise brand accounts, budget allocations, relationship strength scores, and historical OOH campaign spend.</p>
      </div>

      {/* Filters Bar */}
      <div className="dashboard-card mb-4">
        <div className="card-body filter-bar-flex">
          <div className="search-input-wrapper flex-1">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search customer name, company, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <Filter size={14} className="text-muted" />
            <select 
              className="filter-select" 
              value={industryFilter} 
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industry Sectors</option>
              <option value="Quick Commerce">Quick Commerce & Retail</option>
              <option value="Automotive">Automotive & CleanTech</option>
              <option value="Fintech">Fintech & Banking</option>
              <option value="Consumer Electronics">Consumer Electronics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="dashboard-card">
        <div className="table-wrapper">
          <table className="vacancy-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Company & Contact</th>
                <th>Industry Sector</th>
                <th>Monthly Budget Band</th>
                <th>Relationship Strength</th>
                <th>Total Spend</th>
                <th>Total Bookings</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <Loader2 size={20} className="spin text-brand" /> Loading MongoDB customer records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">No corporate clients found matching criteria.</td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr 
                    key={c._id || c.id || c.customerId} 
                    className="table-row"
                    onClick={() => navigate(`/customers/${c.customerId || c.id}`)}
                  >
                    <td className="font-mono font-bold text-brand">{c.customerId || c.id}</td>
                    <td>
                      <div className="font-bold text-primary">{c.companyName || c.name}</div>
                      <div className="text-xs text-muted flex items-center gap-1">
                        <Mail size={11} /> {c.email || 'contact@brand.com'}
                      </div>
                    </td>
                    <td>{c.industry}</td>
                    <td className="font-semibold text-emerald">{c.budgetBand}</td>
                    <td>
                      <span className="font-bold text-cyan">{c.relationshipScore}/100</span>
                    </td>
                    <td className="font-bold">₹{((c.totalSpend || 8500000) / 100000).toFixed(1)}L</td>
                    <td className="font-mono font-bold">{c.totalBookings || 8} Campaigns</td>
                    <td>
                      <span className="badge badge-success">{c.customerStatus || 'ACTIVE'}</span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customers/${c.customerId || c.id}`);
                        }}
                      >
                        Profile <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
        .filter-bar-flex { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; padding: 1rem 1.25rem; }
        .filter-group { display: flex; align-items: center; gap: 0.5rem; }
        .flex-1 { flex: 1; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
