import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemandHeatmap from '../components/DemandHeatmap';
import { HOARDING_DATA } from '../data/mockData';

export default function Heatmap() {
  const navigate = useNavigate();
  const [hoardings, setHoardings] = useState(HOARDING_DATA);

  const handleSelectHoarding = (h) => {
    navigate(`/hoardings/${h.hoardingId || h.id}`);
  };

  const handleOpenOutreach = (h) => {
    navigate(`/ai-outreach?site=${h.hoardingId || h.id}`);
  };

  return (
    <div className="heatmap-page">
      <div className="page-header mb-4">
        <h1 className="page-title">Geo-Spatial Demand Heatmap</h1>
        <p className="page-subtitle">Interactive Leaflet map illustrating calculated Demand Scores (Frequency × 0.30 + Revenue × 0.30 + Occupancy × 0.40).</p>
      </div>

      <DemandHeatmap 
        hoardings={hoardings}
        onSelectHoarding={handleSelectHoarding}
        onOpenOutreach={handleOpenOutreach}
      />

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
      `}</style>
    </div>
  );
}
