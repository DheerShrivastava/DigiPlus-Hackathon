import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  BarChart2, 
  Zap, 
  BrainCircuit,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { getRecommendationsForHoarding } from '../data/mockData';

export default function LeadRecommendations({ 
  selectedHoarding, 
  selectedLead, 
  onSelectLead,
  onOpenOutreach 
}) {
  const recommendations = getRecommendationsForHoarding(selectedHoarding);
  const activeLead = selectedLead || recommendations[0];

  return (
    <div className="lead-recommendations-wrapper grid-2">
      {/* Left: Top 3 Recommended Clients Cards */}
      <div className="dashboard-card leads-card">
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={20} className="text-brand-icon" />
            <span>AI Lead Match Recommendations</span>
          </div>
          <div className="site-context-pill">
            Site: <strong>{selectedHoarding.id}</strong> ({selectedHoarding.city})
          </div>
        </div>

        <div className="card-body">
          <p className="leads-intro">
            Top 3 high-probability corporate advertisers recommended by AI for <strong>{selectedHoarding.location}</strong>:
          </p>

          <div className="leads-list">
            {recommendations.map((lead, idx) => {
              const isSelected = activeLead.id === lead.id;
              return (
                <div 
                  key={lead.id}
                  className={`lead-item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectLead(lead)}
                >
                  <div className="lead-rank-badge">#{idx + 1}</div>

                  <div className="lead-main-info">
                    <div className="lead-header-row">
                      <h4 className="lead-name">{lead.customerName}</h4>
                      <span className="match-grade">{lead.matchGrade} Match</span>
                    </div>

                    <div className="lead-meta-row">
                      <span className="meta-tag"><Briefcase size={12} /> {lead.industry}</span>
                      <span className="meta-tag"><DollarSign size={12} /> {lead.budgetBand}</span>
                    </div>
                  </div>

                  <div className="lead-scores-column">
                    <div className="score-box lead-score-box">
                      <span className="score-val">{lead.leadScore}%</span>
                      <span className="score-lbl">AI Lead Score</span>
                    </div>

                    <div className="score-box rel-score-box">
                      <span className="score-val">{lead.relationshipScore}/100</span>
                      <span className="score-lbl">Rel. Strength</span>
                    </div>
                  </div>

                  <ChevronRight size={18} className="arrow-icon" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Transparent AI Reasoning & Score Breakdown Panel */}
      <div className="dashboard-card reasoning-card">
        <div className="card-header">
          <div className="card-title">
            <BrainCircuit size={20} className="text-purple-icon" />
            <span>Match Reasoning & Score Breakdown</span>
          </div>
          <span className="lead-active-name">{activeLead.customerName}</span>
        </div>

        <div className="card-body">
          {/* Pitch Headline Callout */}
          <div className="pitch-callout">
            <Zap size={16} className="zap-icon" />
            <div>
              <div className="pitch-callout-title">{activeLead.pitchHeadline}</div>
              <div className="pitch-callout-sub">Suggested Price: <strong>{activeLead.suggestedPricing}</strong></div>
            </div>
          </div>

          {/* 4 Reasoning Dimension Cards */}
          <div className="reasoning-grid">
            <div className="reasoning-box">
              <div className="reasoning-box-head">
                <Briefcase size={15} className="box-icon" />
                <span>Industry Fit</span>
                <span className="score-badge">{activeLead.scoreBreakdown.industryFitScore}%</span>
              </div>
              <p className="reasoning-text">{activeLead.reasoning.industryFit}</p>
            </div>

            <div className="reasoning-box">
              <div className="reasoning-box-head">
                <DollarSign size={15} className="box-icon" />
                <span>Budget Fit</span>
                <span className="score-badge">{activeLead.scoreBreakdown.budgetFitScore}%</span>
              </div>
              <p className="reasoning-text">{activeLead.reasoning.budgetFit}</p>
            </div>

            <div className="reasoning-box">
              <div className="reasoning-box-head">
                <BarChart2 size={15} className="box-icon" />
                <span>Historical Booking Match</span>
                <span className="score-badge">{activeLead.scoreBreakdown.historicalMatchScore}%</span>
              </div>
              <p className="reasoning-text">{activeLead.reasoning.historicalMatch}</p>
            </div>

            <div className="reasoning-box">
              <div className="reasoning-box-head">
                <Award size={15} className="box-icon" />
                <span>Relationship Strength</span>
                <span className="score-badge">{activeLead.scoreBreakdown.relationshipScoreVal}%</span>
              </div>
              <p className="reasoning-text">{activeLead.reasoning.relationshipStrength}</p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="reasoning-actions">
            <button 
              className="btn btn-primary btn-full"
              onClick={() => onOpenOutreach(activeLead)}
            >
              <Send size={16} />
              Launch AI Email Outreach for {activeLead.customerName}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .lead-recommendations-wrapper {
          margin-bottom: 1.5rem;
        }

        .text-brand-icon { color: var(--brand-primary); }
        .text-purple-icon { color: var(--accent-purple); }

        .site-context-pill {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background-color: var(--bg-tertiary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
        }

        .leads-intro {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .leads-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .lead-item-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .lead-item-card:hover {
          border-color: var(--brand-primary);
          transform: translateX(4px);
        }

        .lead-item-card.selected {
          background-color: var(--bg-card);
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 2px var(--brand-light), var(--shadow-md);
        }

        .lead-rank-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple));
          color: #ffffff;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lead-main-info {
          flex: 1;
        }

        .lead-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .lead-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .match-grade {
          font-size: 0.7rem;
          font-weight: 700;
          background-color: var(--badge-success-bg);
          color: var(--badge-success-text);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .lead-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .meta-tag {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .lead-scores-column {
          display: flex;
          gap: 0.6rem;
        }

        .score-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          min-width: 60px;
        }

        .lead-score-box {
          background-color: var(--brand-light);
          color: var(--brand-primary);
        }

        .rel-score-box {
          background-color: rgba(6, 182, 212, 0.08);
          color: var(--accent-cyan);
        }

        .score-val {
          font-weight: 800;
          font-size: 0.95rem;
          line-height: 1;
        }

        .score-lbl {
          font-size: 0.65rem;
          font-weight: 600;
          margin-top: 0.15rem;
          text-transform: uppercase;
        }

        .arrow-icon {
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }

        .lead-item-card:hover .arrow-icon {
          transform: translateX(3px);
          color: var(--brand-primary);
        }

        .lead-active-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-purple);
          background-color: rgba(147, 51, 234, 0.1);
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
        }

        .pitch-callout {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background-color: var(--brand-light);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
        }

        .zap-icon {
          color: var(--accent-amber);
          margin-top: 0.15rem;
          flex-shrink: 0;
        }

        .pitch-callout-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pitch-callout-sub {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
        }

        .reasoning-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .reasoning-box {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
        }

        .reasoning-box-head {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }

        .box-icon {
          color: var(--brand-primary);
        }

        .score-badge {
          margin-left: auto;
          font-size: 0.7rem;
          font-weight: 800;
          background-color: var(--bg-hover);
          color: var(--brand-primary);
          padding: 0.05rem 0.35rem;
          border-radius: 4px;
        }

        .reasoning-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .btn-full {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
