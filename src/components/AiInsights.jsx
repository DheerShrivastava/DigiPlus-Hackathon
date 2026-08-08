import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  AlertTriangle, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { AI_INSIGHTS } from '../data/mockData';

export default function AiInsights({ onSelectHoarding, hoardings }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp size={16} />;
      case 'Briefcase': return <Briefcase size={16} />;
      case 'AlertTriangle': return <AlertTriangle size={16} />;
      case 'DollarSign': return <DollarSign size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  return (
    <div className="dashboard-card ai-insights-card">
      <div className="card-header">
        <div className="card-title">
          <div className="sparkle-circle">
            <Sparkles size={16} className="sparkle-icon" />
          </div>
          <span>AI Automated Market Intelligence & Alerts</span>
        </div>
        <span className="live-pulse-badge">Live Market Telemetry</span>
      </div>

      <div className="card-body">
        <div className="insights-grid">
          {AI_INSIGHTS.map((item) => (
            <div key={item.id} className="insight-card-item">
              <div className="insight-top">
                <div className={`insight-icon-box bg-${item.badgeColor}`}>
                  {getIcon(item.icon)}
                </div>

                <span className="insight-category">{item.type}</span>
                <span className="insight-time"><Clock size={11} /> {item.timestamp}</span>
              </div>

              <h4 className="insight-title-text">{item.title}</h4>
              <p className="insight-content-text">{item.content}</p>

              <div className="insight-footer">
                <span className="insight-metric-tag">{item.metric}</span>
                
                <button 
                  className="insight-action-btn"
                  onClick={() => {
                    if (item.type === 'Expiry Alert') {
                      onSelectHoarding(hoardings[0]); // Worli Sea Link
                    } else if (item.type === 'Demand Surge') {
                      onSelectHoarding(hoardings[1]); // BKC
                    } else {
                      onSelectHoarding(hoardings[2]);
                    }
                  }}
                >
                  <span>Take Action</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ai-insights-card {
          margin-bottom: 1.5rem;
          background: linear-gradient(180deg, var(--bg-card), var(--bg-tertiary));
        }

        .sparkle-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sparkle-icon {
          animation: pulse 2s infinite;
        }

        .live-pulse-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-emerald);
          background-color: var(--badge-success-bg);
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .insight-card-item {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .insight-card-item:hover {
          transform: translateY(-2px);
          border-color: var(--brand-primary);
        }

        .insight-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }

        .insight-icon-box {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-emerald { background-color: var(--badge-success-bg); color: var(--badge-success-text); }
        .bg-indigo { background-color: var(--brand-light); color: var(--brand-primary); }
        .bg-amber { background-color: var(--badge-high-bg); color: var(--badge-high-text); }
        .bg-cyan { background-color: rgba(6, 182, 212, 0.12); color: var(--accent-cyan); }

        .insight-category {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .insight-time {
          margin-left: auto;
          font-size: 0.68rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .insight-title-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }

        .insight-content-text {
          font-size: 0.76rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 0.85rem;
        }

        .insight-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px dashed var(--border-color);
        }

        .insight-metric-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--brand-primary);
        }

        .insight-action-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s ease;
        }

        .insight-action-btn:hover {
          color: var(--brand-primary);
        }

        @media (max-width: 1200px) {
          .insights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
