import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import MumbaiMap from './components/MumbaiMap';
import VacanciesView from './components/VacanciesView';
import RecommendationsView from './components/RecommendationsView';
import HoardingManagementView from './components/HoardingManagementView';
import AnalyticsView from './components/AnalyticsView';
import PitchModal from './components/PitchModal';
import HoardingDetailModal from './components/HoardingDetailModal';

import { authAPI, hoardingsAPI, vacanciesAPI, analyticsAPI, pipelineAPI } from './api/apiClient';
import { Sparkles, CalendarClock, TrendingUp, AlertTriangle, Building2, MapPin, RefreshCw } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('digiplus_jwt_token'));
  const [userEmail, setUserEmail] = useState('admin@digiplus.com');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [hoardings, setHoardings] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modals state
  const [pitchModalData, setPitchModalData] = useState(null); // { siteId, customerId, rate }
  const [selectedHoarding, setSelectedHoarding] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hData, vData, aData] = await Promise.all([
        hoardingsAPI.getAll(),
        vacanciesAPI.getUpcoming(),
        analyticsAPI.getSummary()
      ]);
      setHoardings(hData);
      setVacancies(vData);
      setAnalytics(aData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error loading cockpit data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshPipeline = async (reloadCsv = false) => {
    setRefreshing(true);
    try {
      await pipelineAPI.refresh(reloadCsv);
      await fetchData();
    } catch (err) {
      console.error("Pipeline refresh failed:", err);
      alert("Pipeline refresh failed – is the backend running?");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoginSuccess = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('digiplus_jwt_token', data.access_token);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('digiplus_jwt_token');
    setIsAuthenticated(false);
  };

  const handleAddHoarding = async (newHoardingData) => {
    try {
      await hoardingsAPI.create(newHoardingData);
      fetchData();
    } catch (err) {
      alert("Failed to add hoarding");
    }
  };

  const handleDeleteHoarding = async (site_id) => {
    if (!window.confirm(`Are you sure you want to remove hoarding ${site_id}?`)) return;
    try {
      await hoardingsAPI.delete(site_id);
      fetchData();
    } catch (err) {
      alert("Failed to delete hoarding");
    }
  };

  const handleOpenPitch = (siteId, customerId, rate) => {
    setPitchModalData({ siteId, customerId, rate });
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const totalRevenueRisk = vacancies.reduce((sum, v) => sum + v.revenue_at_risk, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090d16', color: '#f8fafc' }}>
      {/* Left Vertical Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userEmail={userEmail}
      />

      {/* Main Content Dashboard */}
      <main style={{ flex: 1, padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Top Header Bar */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DigiPlus Smart Leads Cockpit
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Real-time Mumbai Billboard Inventory • 300 Sites • Proactive Vacancy Pipeline
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastUpdated && (
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => handleRefreshPipeline(false)}
              disabled={refreshing || loading}
              className="glass-button-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Pipeline'}
            </button>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700 }}>
              ● LIVE SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Mumbai Inventory</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>{hoardings.length} Sites</h3>
                <p style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '2px' }}>{analytics?.average_occupancy_rate || 88.4}% Average Occupancy</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Vacancies Next 90 Days</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>{vacancies.length} Sites</h3>
                <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '2px' }}>Action needed before vacancy</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Revenue at Risk (90d)</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f43f5e', marginTop: '4px' }}>₹{(totalRevenueRisk / 100000).toFixed(2)} L</h3>
                <p style={{ fontSize: '0.78rem', color: '#f43f5e', marginTop: '2px' }}>Potential empty site loss</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>AI Lead Matches Ready</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>{vacancies.length * 3} Leads</h3>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>Top-3 explicit reasons</p>
              </div>
            </div>

            {/* Split Screen: Left Analysis, Right Mumbai Map */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '620px' }}>
              {/* Left Side: Quick Vacancies & Recommendation Widget */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarClock size={20} color="#f59e0b" /> Critical Upcoming Vacancies
                  </h3>
                  <button onClick={() => setActiveTab('vacancies')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                    View All Pipeline →
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  {vacancies.slice(0, 5).map((v) => (
                    <div
                      key={v.site_id}
                      onClick={() => setSelectedHoarding(v)}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>{v.site_id}</span>
                        <span style={{ fontSize: '0.72rem', color: v.days_until_vacant <= 30 ? '#f43f5e' : '#f59e0b', fontWeight: 700 }}>
                          Free {v.vacant_from} ({v.days_until_vacant}d)
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 500 }}>{v.location}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem' }}>
                        <span style={{ color: '#cbd5e1' }}>Top Fit: <b style={{ color: '#10b981' }}>{v.top_leads[0]?.customer_name}</b> ({v.top_leads[0]?.match_score}%)</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPitch(v.site_id, v.top_leads[0]?.customer_id, v.monthly_rate_inr);
                          }}
                          className="glass-button"
                          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        >
                          <Sparkles size={12} /> Pitch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Interactive Mumbai Map */}
              <div className="glass-panel" style={{ padding: '8px', height: '100%' }}>
                <MumbaiMap
                  hoardings={hoardings}
                  onSelectHoarding={(h) => setSelectedHoarding(h)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vacancies' && (
          <VacanciesView
            vacancies={vacancies}
            onGeneratePitch={handleOpenPitch}
            onSelectHoarding={(h) => setSelectedHoarding(h)}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            vacancies={vacancies}
            onGeneratePitch={handleOpenPitch}
          />
        )}

        {activeTab === 'heatmap' && (
          <div style={{ height: '700px' }} className="glass-panel">
            <MumbaiMap
              hoardings={hoardings}
              onSelectHoarding={(h) => setSelectedHoarding(h)}
            />
          </div>
        )}

        {activeTab === 'management' && (
          <HoardingManagementView
            hoardings={hoardings}
            onAddHoarding={handleAddHoarding}
            onDeleteHoarding={handleDeleteHoarding}
            onSelectHoarding={(h) => setSelectedHoarding(h)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            vacancies={vacancies}
            hoardings={hoardings}
          />
        )}
      </main>

      {/* Modals */}
      {pitchModalData && (
        <PitchModal
          siteId={pitchModalData.siteId}
          customerId={pitchModalData.customerId}
          monthlyRate={pitchModalData.rate}
          onClose={() => setPitchModalData(null)}
        />
      )}

      {selectedHoarding && (
        <HoardingDetailModal
          hoarding={selectedHoarding}
          vacancies={vacancies}
          onClose={() => setSelectedHoarding(null)}
          onGeneratePitch={handleOpenPitch}
        />
      )}
    </div>
  );
}
