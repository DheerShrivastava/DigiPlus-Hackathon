import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AiCopilotComponent from '../components/AiCopilot';
import { HOARDING_DATA, LEAD_RECOMMENDATIONS } from '../data/mockData';
import { Bot, Sparkles, Send } from 'lucide-react';

export default function AiCopilot() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const siteId = searchParams.get('site');
  const clientName = searchParams.get('client');

  const selectedHoarding = HOARDING_DATA.find(h => h.id === siteId || h.hoardingId === siteId) || HOARDING_DATA[0];
  const selectedLead = LEAD_RECOMMENDATIONS["H-101"].find(l => l.customerName === clientName) || LEAD_RECOMMENDATIONS["H-101"][0];

  const handleOpenEmailPreview = (lead, pitch) => {
    navigate(`/ai-outreach?site=${selectedHoarding.hoardingId || selectedHoarding.id}&client=${lead?.customerName || selectedLead.customerName}`);
  };

  return (
    <div className="ai-copilot-page">
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <Bot className="text-purple" size={24} />
          AI Sales Copilot Workspace
        </h1>
        <p className="page-subtitle">Interactive Gemini AI workspace generating high-converting sales pitches, dynamic pricing recommendations, and strategic value propositions.</p>
      </div>

      <div className="grid-main-section">
        <AiCopilotComponent 
          selectedHoarding={selectedHoarding}
          selectedLead={selectedLead}
          onOpenEmailPreview={handleOpenEmailPreview}
        />
      </div>

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
        .text-purple { color: var(--accent-purple); }
      `}</style>
    </div>
  );
}
