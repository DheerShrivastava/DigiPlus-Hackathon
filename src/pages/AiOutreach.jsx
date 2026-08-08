import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmailModal from '../components/EmailModal';
import { HOARDING_DATA, LEAD_RECOMMENDATIONS, INITIAL_OUTREACH_LIST } from '../data/mockData';
import { Mail, Sparkles, Send, Clock, Save } from 'lucide-react';

export default function AiOutreach() {
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('site');
  const clientName = searchParams.get('client');

  const selectedHoarding = HOARDING_DATA.find(h => h.id === siteId || h.hoardingId === siteId) || HOARDING_DATA[0];
  const selectedLead = LEAD_RECOMMENDATIONS["H-101"].find(l => l.customerName === clientName) || LEAD_RECOMMENDATIONS["H-101"][0];

  const [outreachList, setOutreachList] = useState(INITIAL_OUTREACH_LIST);

  return (
    <div className="ai-outreach-page">
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <Mail className="text-brand" size={24} />
          AI Cold Email Sales Outreach Hub
        </h1>
        <p className="page-subtitle">Generate personalized corporate cold outreach emails via Gemini AI, switch tones on the fly, schedule dispatches, and track campaign statuses.</p>
      </div>

      <EmailModal 
        selectedLead={selectedLead}
        selectedHoarding={selectedHoarding}
        outreachList={outreachList}
        setOutreachList={setOutreachList}
        onClose={null}
      />

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
        .ai-outreach-page .email-modal-overlay {
          position: relative;
          background: transparent;
          backdrop-filter: none;
          padding: 0;
          z-index: 1;
        }
        .ai-outreach-page .email-modal-container {
          max-width: 100%;
          max-height: none;
        }
        .ai-outreach-page .close-btn { display: none; }
      `}</style>
    </div>
  );
}
