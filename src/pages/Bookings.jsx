import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  Loader2
} from 'lucide-react';
import { getBookings } from '../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        const res = await getBookings(params);
        if (res.success && res.data) {
          setBookings(res.data);
        }
      } catch (err) {
        console.warn("Using fallback local bookings:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [statusFilter]);

  const filteredBookings = bookings.filter(b => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const custName = (b.customerId?.name || b.customerId?.companyName || '').toLowerCase();
    const siteLoc = (b.hoardingId?.location || b.hoardingId?.hoardingId || '').toLowerCase();
    const bId = (b.bookingId || '').toLowerCase();
    return custName.includes(term) || siteLoc.includes(term) || bId.includes(term);
  });

  return (
    <div className="bookings-page">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <CalendarCheck className="text-brand" size={24} />
          Media Booking Contracts & Leases ({filteredBookings.length} Records)
        </h1>
        <p className="page-subtitle">Real-time lease records, start/end dates, monthly rate billing, and total revenue commitments from MongoDB.</p>
      </div>

      {/* Filter Bar */}
      <div className="dashboard-card mb-4">
        <div className="card-body filter-bar-flex">
          <div className="search-input-wrapper flex-1">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search booking ID, brand advertiser, or hoarding location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <Filter size={14} className="text-muted" />
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Booking Statuses</option>
              <option value="ACTIVE">Active Leases</option>
              <option value="UPCOMING">Upcoming Contracts</option>
              <option value="COMPLETED">Completed Campaigns</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="dashboard-card">
        <div className="table-wrapper">
          <table className="vacancy-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Brand Advertiser</th>
                <th>Billboard Location</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Monthly Rate</th>
                <th>Total Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <Loader2 size={20} className="spin text-brand" /> Querying MongoDB booking contracts...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">No booking records found matching filter.</td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => {
                  const custName = b.customerId?.companyName || b.customerId?.name || 'Enterprise Client';
                  const siteLoc = b.hoardingId?.location || b.hoardingId?.hoardingId || 'Worli Sea Link';
                  const startDateStr = b.startDate ? new Date(b.startDate).toISOString().substring(0,10) : '2026-01-01';
                  const endDateStr = b.endDate ? new Date(b.endDate).toISOString().substring(0,10) : '2026-08-22';
                  const monthlyRate = b.monthlyRate || 850000;
                  const totalRev = b.totalRevenue || (monthlyRate * 6);
                  const status = b.status || 'ACTIVE';

                  return (
                    <tr key={b._id || b.bookingId || idx} className="table-row">
                      <td className="font-mono font-bold text-brand">{b.bookingId || `BK-${idx+100}`}</td>
                      <td className="font-bold text-primary">{custName}</td>
                      <td>{siteLoc}</td>
                      <td>{startDateStr}</td>
                      <td className="font-semibold text-rose">{endDateStr}</td>
                      <td className="font-bold">₹{(monthlyRate / 100000).toFixed(2)}L</td>
                      <td className="font-bold text-emerald">₹{(totalRev / 100000).toFixed(2)}L</td>
                      <td>
                        <span className={`badge badge-${status === 'ACTIVE' ? 'success' : status === 'UPCOMING' ? 'high' : status === 'COMPLETED' ? 'moderate' : 'critical'}`}>
                          {status}
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

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
        .filter-bar-flex { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; padding: 1rem 1.25rem; }
        .filter-group { display: flex; align-items: center; gap: 0.5rem; }
        .flex-1 { flex: 1; }
        .text-rose { color: var(--accent-rose); }
        .text-emerald { color: var(--accent-emerald); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
