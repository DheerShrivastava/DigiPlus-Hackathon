import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import VacancyTable from './components/VacancyTable';
import LeadRecommendations from './components/LeadRecommendations';
import AiCopilot from './components/AiCopilot';
import EmailModal from './components/EmailModal';
import AddHoardingModal from './components/AddHoardingModal';
import DemandHeatmap from './components/DemandHeatmap';
import AnalyticsSection from './components/AnalyticsSection';
import AiInsights from './components/AiInsights';

import { HOARDING_DATA, LEAD_RECOMMENDATIONS, INITIAL_OUTREACH_LIST, getRecommendationsForHoarding } from './data/mockData';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [hoardingsList, setHoardingsList] = useState(HOARDING_DATA);
  const [selectedHoarding, setSelectedHoarding] = useState(HOARDING_DATA[0]);
  const [selectedLead, setSelectedLead] = useState(LEAD_RECOMMENDATIONS["H-101"][0]);
  
  const [outreachList, setOutreachList] = useState(INITIAL_OUTREACH_LIST);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Synchronized Selection Handler
  const handleSelectHoarding = (hoarding) => {
    setSelectedHoarding(hoarding);
    const recs = getRecommendationsForHoarding(hoarding);
    if (recs && recs.length > 0) {
      setSelectedLead(recs[0]);
    }
  };

  const handleAddHoarding = (newHoarding) => {
    const updated = [newHoarding, ...hoardingsList];
    setHoardingsList(updated);
    handleSelectHoarding(newHoarding);
  };

  const handleOpenEmailModal = (lead, pitch) => {
    if (lead) setSelectedLead(lead);
    setIsEmailModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        vacancyCount={hoardingsList.length}
      />

      <main className="main-content">
        {/* Top KPI Metrics Bar */}
        <KpiCards hoardings={hoardingsList} />

        {/* AI Market Insights Ticker / Cards */}
        <AiInsights 
          onSelectHoarding={handleSelectHoarding}
          hoardings={hoardingsList}
        />

        {/* Tab 1: Dashboard Overview (All panels in structured layout) */}
        {(activeTab === 'dashboard' || activeTab === 'vacancies') && (
          <VacancyTable 
            hoardings={hoardingsList}
            selectedHoarding={selectedHoarding}
            onSelectHoarding={handleSelectHoarding}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {(activeTab === 'dashboard' || activeTab === 'leads') && (
          <div className="grid-main-section">
            <LeadRecommendations 
              selectedHoarding={selectedHoarding}
              selectedLead={selectedLead}
              onSelectLead={setSelectedLead}
              onOpenOutreach={handleOpenEmailModal}
            />

            <AiCopilot 
              selectedHoarding={selectedHoarding}
              selectedLead={selectedLead}
              onOpenEmailPreview={handleOpenEmailModal}
            />
          </div>
        )}

        {(activeTab === 'dashboard' || activeTab === 'heatmap') && (
          <DemandHeatmap 
            hoardings={hoardingsList}
            onSelectHoarding={handleSelectHoarding}
            onOpenOutreach={handleOpenEmailModal}
          />
        )}

        {(activeTab === 'dashboard' || activeTab === 'analytics') && (
          <AnalyticsSection theme={theme} />
        )}

        {/* Tab 5: Outreach Hub Direct View */}
        {activeTab === 'outreach' && (
          <div className="outreach-hub-view dashboard-card">
            <div className="card-header">
              <div className="card-title">AI Sales Outreach Management</div>
              <button 
                className="btn btn-primary"
                onClick={() => setIsEmailModalOpen(true)}
              >
                + Launch New Campaign
              </button>
            </div>
            <div className="card-body">
              <p className="mb-4 text-secondary">Manage cold outreach pitches, email schedules, and track corporate advertiser responses.</p>
              
              <div className="table-wrapper">
                <table className="vacancy-table">
                  <thead>
                    <tr>
                      <th>Outreach ID</th>
                      <th>Client Name</th>
                      <th>Location / Site</th>
                      <th>Subject Line</th>
                      <th>Offer Rate</th>
                      <th>Status</th>
                      <th>Date / Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outreachList.map(item => (
                      <tr key={item.id}>
                        <td className="font-mono font-bold">{item.id}</td>
                        <td className="font-bold">{item.clientName}</td>
                        <td>{item.location}</td>
                        <td className="text-muted">{item.subject}</td>
                        <td className="text-emerald font-bold">{item.offer}</td>
                        <td>
                          <span className={`badge badge-${item.status.toLowerCase() === 'sent' ? 'success' : item.status.toLowerCase() === 'scheduled' ? 'high' : 'moderate'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">{item.dateSent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dedicated Email Outreach Modal */}
      {isEmailModalOpen && (
        <EmailModal 
          selectedLead={selectedLead}
          selectedHoarding={selectedHoarding}
          outreachList={outreachList}
          setOutreachList={setOutreachList}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}

      {/* Add Hoarding Site Modal */}
      {isAddModalOpen && (
        <AddHoardingModal 
          onAddHoarding={handleAddHoarding}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      <style>{`
        .grid-main-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .outreach-hub-view {
          margin-bottom: 2rem;
        }

        .text-secondary { color: var(--text-secondary); }
        .text-emerald { color: var(--accent-emerald); }
        .mb-4 { margin-bottom: 1rem; }

        @media (max-width: 1200px) {
          .grid-main-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
