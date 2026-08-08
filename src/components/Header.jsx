import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  TableProperties, 
  Sparkles, 
  MapPin, 
  Mail, 
  BarChart3, 
  Sun, 
  Moon,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, theme, toggleTheme, vacancyCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vacancies', label: 'Vacancies', icon: TableProperties, badge: vacancyCount },
    { id: 'leads', label: 'Leads AI', icon: Sparkles },
    { id: 'heatmap', label: 'Demand Heatmap', icon: MapPin },
    { id: 'outreach', label: 'AI Outreach', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="header-nav">
      <div className="header-content">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
          <div className="logo-icon-wrapper">
            <Building2 className="logo-icon" size={22} />
            <span className="logo-pulse"></span>
          </div>
          <div className="brand-text">
            <span className="brand-title">SmartLeads <span className="highlight">OOH</span></span>
            <span className="brand-subtitle">AI Sales Intelligence</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* AI Engine Status Badge */}
          <div className="ai-status-pill">
            <Zap size={14} className="zap-icon" />
            <span className="status-text">AI Copilot: <strong>READY</strong></span>
            <CheckCircle2 size={12} className="check-icon" />
          </div>

          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          </button>
        </div>
      </div>

      <style>{`
        .header-nav {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .header-content {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .logo-icon-wrapper {
          position: relative;
          background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple));
          color: #ffffff;
          padding: 0.55rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .logo-pulse {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: var(--accent-emerald);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent-emerald);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .brand-title .highlight {
          color: var(--brand-primary);
        }

        .brand-subtitle {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: var(--bg-tertiary);
          padding: 0.3rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }

        .nav-item.active {
          color: var(--brand-primary);
          background-color: var(--bg-card);
          box-shadow: var(--shadow-sm);
        }

        .nav-badge {
          background-color: var(--badge-critical-bg);
          color: var(--badge-critical-text);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 999px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ai-status-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--brand-light);
          color: var(--brand-primary);
          border: 1px solid rgba(99, 102, 241, 0.25);
          padding: 0.4rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .zap-icon {
          color: var(--accent-amber);
          animation: pulse 2s infinite;
        }

        .check-icon {
          color: var(--accent-emerald);
        }

        .theme-toggle-btn {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          background-color: var(--bg-hover);
          color: var(--brand-primary);
          transform: rotate(15deg);
        }

        @media (max-width: 1024px) {
          .header-content {
            padding: 0.75rem 1rem;
            flex-wrap: wrap;
          }
          .nav-menu {
            order: 3;
            width: 100%;
            overflow-x: auto;
            justify-content: flex-start;
          }
        }
      `}</style>
    </header>
  );
}
