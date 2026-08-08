import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Maximize2, 
  Calendar, 
  Sparkles, 
  PlusCircle, 
  ChevronRight, 
  Trash2,
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { getHoardings, deleteHoarding } from '../services/api';
import AddHoardingModal from '../components/AddHoardingModal';
import { HOARDING_DATA } from '../data/mockData';

export default function Hoardings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [hoardings, setHoardings] = useState(HOARDING_DATA);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [demandFilter, setDemandFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (cityFilter !== 'all') params.city = cityFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await getHoardings(params);
      if (res.success && res.data && res.data.length > 0) {
        setHoardings(res.data);
      }
    } catch (err) {
      console.warn("Using local dataset fallback:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchInventory, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, cityFilter, statusFilter]);

  const handleAddedHoarding = (newH) => {
    setHoardings(prev => [newH, ...prev]);
    setNotification(`Hoarding '${newH.hoardingId}' created successfully in MongoDB Atlas!`);
    fetchInventory();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    const idToDelete = item._id || item.hoardingId || item.id;
    if (!window.confirm(`Are you sure you want to delete hoarding site '${item.hoardingId || idToDelete}' from MongoDB?`)) {
      return;
    }

    try {
      await deleteHoarding(idToDelete);
      setHoardings(prev => prev.filter(h => (h._id || h.hoardingId || h.id) !== idToDelete));
      setNotification(`Hoarding '${item.hoardingId || idToDelete}' deleted from MongoDB.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert(`Failed to delete hoarding: ${err.message}`);
    }
  };

  const filteredHoardings = hoardings.filter(h => {
    const lvl = (h.demandLevel || 'High').toLowerCase();
    if (demandFilter === 'all') return true;
    return lvl === demandFilter.toLowerCase();
  });

  return (
    <div className="hoardings-page">
      {/* Header Bar */}
      <div className="page-header-row mb-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Building2 className="text-brand" size={24} />
            Billboard Inventory Catalog ({filteredHoardings.length} Sites)
          </h1>
          <p className="page-subtitle">Manage nationwide OOH billboard inventory, dimensions, rates, and occupancy status in MongoDB.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle size={16} /> + Add New Hoarding
        </button>
      </div>

      {notification && (
        <div className="toast-notification mb-4">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="dashboard-card filters-card mb-4">
        <div className="card-body filter-bar-flex">
          <div className="search-input-wrapper flex-1">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by ID, location, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <Filter size={14} className="text-muted" />
            <select className="filter-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              <option value="all">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="NCR">Delhi NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>

            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="expiring">Expiring Soon</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select className="filter-select" value={demandFilter} onChange={(e) => setDemandFilter(e.target.value)}>
              <option value="all">All Demand Levels</option>
              <option value="high">High Demand (Green)</option>
              <option value="medium">Medium Demand (Yellow)</option>
              <option value="low">Low Demand (Red)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hoardings Data Table */}
      <div className="dashboard-card">
        <div className="table-wrapper">
          <table className="vacancy-table">
            <thead>
              <tr>
                <th>Hoarding ID</th>
                <th>Location & City</th>
                <th>Dimensions</th>
                <th>Traffic Score</th>
                <th>Occupancy</th>
                <th>Monthly Rate</th>
                <th>Free From</th>
                <th>Demand Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="empty-state">
                    <Loader2 size={20} className="spin text-brand" /> Querying MongoDB inventory...
                  </td>
                </tr>
              ) : filteredHoardings.length === 0 ? (
                <tr>
                  <td colSpan="10" className="empty-state">No billboard sites matched your filter query.</td>
                </tr>
              ) : (
                filteredHoardings.map(h => (
                  <tr key={h._id || h.id || h.hoardingId} className="table-row" onClick={() => navigate(`/hoardings/${h.hoardingId || h.id}`)}>
                    <td className="font-mono font-bold text-brand">{h.hoardingId || h.id}</td>
                    <td>
                      <div className="location-cell">
                        <MapPin size={14} className="location-icon" />
                        <div>
                          <div className="location-name">{h.location}</div>
                          <span className="city-pill">{h.city}</span>
                        </div>
                      </div>
                    </td>
                    <td>{h.size}</td>
                    <td>
                      <div className="traffic-num font-bold">{h.trafficScore || 80}/100</div>
                    </td>
                    <td>
                      <span className="font-bold text-emerald">{h.occupancyRate || 85}%</span>
                    </td>
                    <td className="font-bold">₹{((h.monthlyRate || 0) / 100000).toFixed(2)}L</td>
                    <td>{h.freeFromDate ? new Date(h.freeFromDate).toISOString().substring(0, 10) : '2026-08-23'}</td>
                    <td>
                      <span className={`badge badge-${(h.demandLevel || 'high').toLowerCase() === 'high' ? 'success' : (h.demandLevel || '').toLowerCase() === 'medium' ? 'high' : 'critical'}`}>
                        {(h.demandLevel || 'medium').toUpperCase()} ({h.demandScore || 85}/100)
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${(h.status || 'available').toLowerCase() === 'expiring' ? 'critical' : (h.status || '').toLowerCase() === 'available' ? 'success' : 'high'}`}>
                        {(h.status || 'AVAILABLE').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="table-action-btn-group">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/hoardings/${h.hoardingId || h.id}`);
                          }}
                        >
                          Details <ChevronRight size={13} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline text-rose"
                          title="Delete Hoarding Site"
                          onClick={(e) => handleDelete(e, h)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddHoardingModal 
          onAddHoarding={handleAddedHoarding}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .filter-bar-flex { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; padding: 1rem 1.25rem; }
        .filter-group { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .flex-1 { flex: 1; }
        .toast-notification { background-color: var(--badge-success-bg); color: var(--badge-success-text); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; border: 1px solid rgba(16, 185, 129, 0.3); }
        .table-action-btn-group { display: flex; gap: 0.35rem; align-items: center; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-rose { color: var(--accent-rose); }
      `}</style>
    </div>
  );
}
