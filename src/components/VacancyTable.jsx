import React, { useState, useEffect } from 'react';
import { 
  TableProperties, 
  Search, 
  Filter, 
  MapPin, 
  Maximize2, 
  Calendar, 
  Sparkles, 
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { getHoardings } from '../services/api';

export default function VacancyTable({ hoardings, selectedHoarding, onSelectHoarding, onOpenAddModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [tableData, setTableData] = useState(hoardings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHoardings() {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        const res = await getHoardings(params);
        if (res.success && res.data && res.data.length > 0) {
          setTableData(res.data);
        } else {
          setTableData(hoardings);
        }
      } catch (err) {
        console.warn("Using local table dataset:", err.message);
        setTableData(hoardings);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadHoardings, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, hoardings.length]);

  const filteredHoardings = tableData.filter((h) => {
    const matchesUrgency = urgencyFilter === 'all' || h.urgency === urgencyFilter || (urgencyFilter === 'critical' && h.status === 'EXPIRING');
    return matchesUrgency;
  });

  const getUrgencyBadge = (urgency, status) => {
    if (urgency === 'critical' || status === 'EXPIRING') {
      return <span className="badge badge-critical"><AlertCircle size={12} /> Expires &lt; 30 Days</span>;
    }
    if (urgency === 'high') {
      return <span className="badge badge-high"><ClockIcon size={12} /> Expires 30-60 Days</span>;
    }
    if (urgency === 'moderate') {
      return <span className="badge badge-moderate"><Calendar size={12} /> Expires 60-90 Days</span>;
    }
    return <span className="badge badge-success"><CheckCircle2 size={12} /> Stable</span>;
  };

  const ClockIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  return (
    <div className="dashboard-card vacancy-table-card">
      <div className="card-header">
        <div className="card-title">
          <TableProperties className="title-icon text-brand" size={20} />
          <span>Vacancy Management Panel</span>
          <span className="vacancy-count-tag">{filteredHoardings.length} Sites</span>
        </div>

        {/* Controls & Add Button */}
        <div className="table-controls">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search site, city, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-dropdown-wrapper">
            <Filter size={14} className="filter-icon" />
            <select 
              value={urgencyFilter} 
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Urgencies</option>
              <option value="critical">Critical (&lt;30 Days)</option>
              <option value="high">High (30-60 Days)</option>
              <option value="moderate">Moderate (60-90 Days)</option>
            </select>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={onOpenAddModal}
          >
            <PlusCircle size={14} />
            + Add Site
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="vacancy-table">
          <thead>
            <tr>
              <th>Hoarding ID</th>
              <th>Location & City</th>
              <th>Dimensions</th>
              <th>Traffic Score</th>
              <th>Monthly Rate</th>
              <th>Booking End</th>
              <th>Free From</th>
              <th>Revenue At Risk</th>
              <th>Urgency Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="empty-state">
                  <Loader2 size={20} className="spin text-brand" /> Loading live inventory...
                </td>
              </tr>
            ) : filteredHoardings.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-state">
                  No vacancy matching your filters.
                </td>
              </tr>
            ) : (
              filteredHoardings.map((h) => {
                const idToMatch = h.hoardingId || h.id;
                const selectedId = selectedHoarding?.hoardingId || selectedHoarding?.id;
                const isSelected = selectedId === idToMatch;

                const endDateStr = h.bookingEndDate ? new Date(h.bookingEndDate).toISOString().substring(0, 10) : '2026-08-22';
                const freeDateStr = h.freeFromDate ? new Date(h.freeFromDate).toISOString().substring(0, 10) : '2026-08-23';

                return (
                  <tr 
                    key={h._id || h.id || h.hoardingId} 
                    className={`table-row ${isSelected ? 'selected' : ''} urgency-${h.urgency || 'critical'}`}
                    onClick={() => onSelectHoarding(h)}
                  >
                    <td className="font-mono font-bold text-brand">
                      {h.hoardingId || h.id}
                      {isSelected && <span className="active-dot"></span>}
                    </td>

                    <td>
                      <div className="location-cell">
                        <MapPin size={14} className="location-icon" />
                        <div>
                          <div className="location-name">{h.location}</div>
                          <span className="city-pill">{h.city}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="size-cell">
                        <Maximize2 size={13} className="text-muted" />
                        <span>{h.size}</span>
                      </div>
                    </td>

                    <td>
                      <div className="traffic-cell">
                        <div className="traffic-bar-bg">
                          <div 
                            className="traffic-bar-fill" 
                            style={{ width: `${h.trafficScore || 80}%` }}
                          ></div>
                        </div>
                        <span className="traffic-num">{h.trafficScore || 80}/100</span>
                      </div>
                    </td>

                    <td className="font-bold">
                      ₹{(h.monthlyRate / 100000).toFixed(2)}L
                    </td>

                    <td>
                      <span className="date-cell">
                        <Calendar size={13} /> {endDateStr}
                      </span>
                    </td>

                    <td>
                      <span className="free-date-highlight">
                        {freeDateStr}
                      </span>
                    </td>

                    <td className="revenue-risk-cell">
                      ₹{((h.revenueAtRisk || (h.monthlyRate * 2)) / 100000).toFixed(2)}L
                    </td>

                    <td>
                      {getUrgencyBadge(h.urgency, h.status)}
                    </td>

                    <td>
                      <button 
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHoarding(h);
                        }}
                      >
                        <Sparkles size={13} />
                        {isSelected ? 'Selected' : 'Find Leads'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .vacancy-table-card {
          margin-bottom: 1.5rem;
        }

        .vacancy-count-tag {
          font-size: 0.75rem;
          background-color: var(--brand-light);
          color: var(--brand-primary);
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          margin-left: 0.5rem;
          font-weight: 600;
        }

        .table-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }

        .search-input {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.75rem 0.45rem 2.2rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
          width: 210px;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--brand-primary);
        }

        .filter-dropdown-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-icon {
          position: absolute;
          left: 0.65rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .filter-select {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.75rem 0.45rem 2rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .vacancy-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .vacancy-table th {
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border-color);
          white-space: nowrap;
        }

        .vacancy-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
          vertical-align: middle;
        }

        .table-row {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .table-row:hover {
          background-color: var(--bg-hover);
        }

        .table-row.selected {
          background-color: var(--brand-light) !important;
          border-left: 4px solid var(--brand-primary);
        }

        .table-row.urgency-critical {
          border-left: 3px solid var(--badge-critical-text);
        }

        .table-row.urgency-high {
          border-left: 3px solid var(--badge-high-text);
        }

        .table-row.urgency-moderate {
          border-left: 3px solid var(--badge-moderate-text);
        }

        .active-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: var(--brand-primary);
          border-radius: 50%;
          margin-left: 0.35rem;
        }

        .location-cell {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
        }

        .location-icon {
          color: var(--brand-primary);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .location-name {
          font-weight: 600;
          line-height: 1.25;
        }

        .city-pill {
          font-size: 0.7rem;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.2rem;
        }

        .size-cell {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-secondary);
        }

        .traffic-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .traffic-bar-bg {
          width: 50px;
          height: 6px;
          background-color: var(--bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
        }

        .traffic-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--brand-primary), var(--accent-emerald));
          border-radius: 999px;
        }

        .traffic-num {
          font-weight: 600;
          font-size: 0.78rem;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--text-secondary);
        }

        .free-date-highlight {
          font-weight: 700;
          color: var(--accent-emerald);
          background-color: var(--badge-success-bg);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .revenue-risk-cell {
          font-weight: 700;
          color: var(--accent-rose);
        }

        .empty-state {
          text-align: center;
          padding: 2rem !important;
          color: var(--text-muted);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .text-brand { color: var(--brand-primary); }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-bold { font-weight: 700; }
        .text-muted { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
