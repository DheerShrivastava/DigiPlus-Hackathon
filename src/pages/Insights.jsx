import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Briefcase, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { getAIInsights } from '../services/api';
import { AI_INSIGHTS } from '../data/mockData';

export default function Insights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(AI_INSIGHTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await getAIInsights();
        if (res.success && res.data && res.data.length > 0) {
          setInsights(res.data);
        }
      } catch (err) {
        console.warn("Using fallback local insights:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  return (
    <div className="insights-page">
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <BrainCircuit className="text-purple" size={24} />
          Automated Market Intelligence & Strategic Signals
        </h1>
        <p className="page-subtitle">Gemini AI synthesizes portfolio occupancy telemetry, upcoming lease end dates, and industry demand surges into actionable sales recommendations.</p>
      </div>

      {loading ? (
        <div className="loading-box">
          <Loader2 size={24} className="spin text-brand" />
          <span>Synthesizing MongoDB Telemetry Signals...</span>
        </div>
      ) : (
        <div className="grid-2">
          {insights.map((item, idx) => (
            <div key={item.id || idx} className="dashboard-card insight-full-card">
              <div className="card-header">
                <div className="card-title">
                  <Sparkles size={16} className="text-purple" />
                  <span>{item.title}</span>
                </div>
                <span className="badge badge-high">{item.type || 'SIGNAL'}</span>
              </div>

              <div className="card-body">
                <p className="text-sm text-secondary mb-3">{item.content}</p>

                <div className="evidence-box mb-3">
                  <div className="text-xs font-bold text-muted uppercase">Data Evidence:</div>
                  <div className="text-xs text-primary font-mono mt-1">{item.metric || 'Calculated from 300+ database records'}</div>
                </div>

                <div className="action-box">
                  <div className="text-xs font-bold text-emerald flex items-center gap-1 mb-2">
                    <CheckCircle2 size={13} /> Recommended Sales Action:
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/vacancies')}>
                    Execute Strategy <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .evidence-box { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); }
        .action-box { background-color: var(--brand-light); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.75rem 0.85rem; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; }
        .loading-box { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 4rem 1rem; color: var(--text-secondary); font-weight: 600; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-purple { color: var(--accent-purple); }

        @media (max-width: 1024px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
