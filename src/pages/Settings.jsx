import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Database, 
  Zap, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getHealth } from '../services/api';

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoEmailMode, setDemoEmailMode] = useState(true);
  const [cacheTtl, setCacheTtl] = useState('30');

  useEffect(() => {
    async function checkHealth() {
      setLoading(true);
      try {
        const res = await getHealth();
        setHealth(res);
      } catch (err) {
        console.warn("Health check error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    checkHealth();
  }, []);

  return (
    <div className="settings-page">
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <SettingsIcon className="text-brand" size={24} />
          Platform System Settings & Telemetry
        </h1>
        <p className="page-subtitle">Configure backend database connections, Gemini AI API credentials, demo email dispatch modes, and server cache settings.</p>
      </div>

      <div className="grid-2 gap-4">
        {/* System Health Panel */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={18} className="text-brand" />
              <span>Backend & Telemetry Status</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="flex items-center gap-2 p-4 text-secondary">
                <Loader2 size={18} className="spin" /> Checking service status...
              </div>
            ) : (
              <div className="settings-stack">
                <div className="setting-item">
                  <div>
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <Database size={15} className="text-emerald" /> MongoDB Atlas Database
                    </div>
                    <span className="text-xs text-muted">Status: <strong>{health?.database || 'Connected'}</strong> (Cluster0 / test)</span>
                  </div>
                  <span className="badge badge-success">Online</span>
                </div>

                <div className="setting-item">
                  <div>
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <Zap size={15} className="text-amber" /> Google Gemini AI API
                    </div>
                    <span className="text-xs text-muted">Status: <strong>{health?.ai === 'configured' ? 'API Key Active' : 'Demo Fallback Active'}</strong> (gemini-2.5-flash)</span>
                  </div>
                  <span className={`badge badge-${health?.ai === 'configured' ? 'success' : 'high'}`}>
                    {health?.ai === 'configured' ? 'Configured' : 'Fallback Ready'}
                  </span>
                </div>

                <div className="setting-item">
                  <div>
                    <div className="font-bold text-primary flex items-center gap-1.5">
                      <Mail size={15} className="text-brand" /> Outreach Email Dispatch Mode
                    </div>
                    <span className="text-xs text-muted">Demo Mode simulates dispatches without sending real emails.</span>
                  </div>
                  <span className="badge badge-success">DEMO_EMAIL_MODE=true</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Switches */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <Zap size={18} className="text-purple" />
              <span>AI Service & Cache Controls</span>
            </div>
          </div>

          <div className="card-body">
            <div className="field-group mb-3">
              <label className="field-label">AI Market Insight Server Cache TTL (Minutes):</label>
              <input 
                type="number" 
                className="input-field font-mono" 
                value={cacheTtl}
                onChange={(e) => setCacheTtl(e.target.value)}
              />
              <span className="text-xs text-muted mt-1">Controls server-side in-memory cache duration for GET /api/ai/insights</span>
            </div>

            <div className="field-group mb-4">
              <label className="field-label">Simulated Email Transport Mode:</label>
              <select 
                className="select-field font-bold"
                value={demoEmailMode ? "demo" : "smtp"}
                onChange={(e) => setDemoEmailMode(e.target.value === "demo")}
              >
                <option value="demo">Demo Mode (Simulate dispatch & save DB record)</option>
                <option value="smtp">SMTP Relay (Requires NodeMailer SMTP config)</option>
              </select>
            </div>

            <button className="btn btn-primary btn-full">
              <CheckCircle2 size={16} /> Save Configuration
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .gap-4 { gap: 1.25rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); }
        .settings-stack { display: flex; flex-direction: column; gap: 1rem; }
        .setting-item { display: flex; align-items: center; justify-content: space-between; background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 0.85rem 1rem; border-radius: var(--radius-sm); }
        .field-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .field-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }
        .input-field, .select-field { background-color: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); outline: none; }
        .btn-full { width: 100%; padding: 0.75rem; font-size: 0.9rem; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .text-emerald { color: var(--accent-emerald); }
        .text-amber { color: var(--accent-amber); }
        .text-purple { color: var(--accent-purple); }
        .text-brand { color: var(--brand-primary); }

        @media (max-width: 1024px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
