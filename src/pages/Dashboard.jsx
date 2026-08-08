import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KpiCards from '../components/KpiCards';
import VacancyTable from '../components/VacancyTable';
import AiInsights from '../components/AiInsights';
import AnalyticsSection from '../components/AnalyticsSection';
import AddHoardingModal from '../components/AddHoardingModal';
import { HOARDING_DATA } from '../data/mockData';
import { ArrowRight, MapPin, Sparkles, BarChart3, Mail, PlusCircle } from 'lucide-react';

export default function Dashboard({ theme }) {
  const navigate = useNavigate();
  const [hoardings, setHoardings] = useState(HOARDING_DATA);
  const [selectedHoarding, setSelectedHoarding] = useState(HOARDING_DATA[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSelectHoarding = (h) => {
    setSelectedHoarding(h);
    navigate(`/hoardings/${h.hoardingId || h.id}`);
  };

  return (
    <div className="dashboard-page">
      {/* Top Banner Header */}
      <div className="page-intro-banner dashboard-card mb-4">
        <div>
          <h1 className="page-title">Executive Sales Intelligence Dashboard</h1>
          <p className="page-subtitle">Real-time occupancy metrics, 90-day revenue at risk, and AI lead recommendations across 300+ billboard sites.</p>
        </div>

        <div className="quick-nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/vacancies')}>
            <TablePropertiesIcon size={14} /> View Vacancies
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/heatmap')}>
            <MapPin size={14} /> Demand Heatmap
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/ai-copilot')}>
            <Sparkles size={14} /> AI Sales Copilot
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={14} /> + Add Site
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards hoardings={hoardings} />

      {/* AI Market Insights Ticker */}
      <AiInsights 
        onSelectHoarding={handleSelectHoarding} 
        hoardings={hoardings} 
      />

      {/* Vacancy Table */}
      <VacancyTable 
        hoardings={hoardings}
        selectedHoarding={selectedHoarding}
        onSelectHoarding={handleSelectHoarding}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Analytics Preview */}
      <AnalyticsSection theme={theme} />

      {/* Add Hoarding Modal */}
      {isAddModalOpen && (
        <AddHoardingModal 
          onAddHoarding={(newH) => setHoardings([newH, ...hoardings])} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }

        .page-intro-banner {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-tertiary));
          border-left: 4px solid var(--brand-primary);
        }

        .page-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .page-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .quick-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}

function TablePropertiesIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  );
}
