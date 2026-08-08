import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-card dashboard-card">
        <AlertTriangle size={48} className="text-rose mb-3" />
        <h1 className="text-2xl font-bold text-primary">404 - Route Not Found</h1>
        <p className="text-sm text-secondary mt-1 mb-4">The requested page URL does not exist or has been relocated in the SaaS navigation system.</p>
        
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          <Home size={16} /> Return to Executive Dashboard
        </button>
      </div>

      <style>{`
        .not-found-page {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 1rem;
        }

        .not-found-card {
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 480px;
        }

        .text-rose { color: var(--accent-rose); }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1.25rem; }
        .mt-1 { margin-top: 0.25rem; }
        .text-2xl { font-size: 1.5rem; }
      `}</style>
    </div>
  );
}
