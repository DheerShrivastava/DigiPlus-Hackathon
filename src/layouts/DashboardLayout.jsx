import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  Users, 
  CalendarCheck, 
  BrainCircuit, 
  UploadCloud, 
  Settings as SettingsIcon, 
  Search, 
  Bell, 
  User, 
  CheckCircle2, 
  Zap, 
  Database,
  Menu,
  X
} from 'lucide-react';
import { getHealth } from '../services/api';

export default function DashboardLayout({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    async function checkSystemHealth() {
      try {
        const res = await getHealth();
        setHealth(res);
      } catch (err) {
        console.warn("Backend health check failed:", err.message);
      }
    }
    checkSystemHealth();
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hoardings', label: 'Hoardings', icon: Building2 },
    { path: '/vacancies', label: 'Vacancies', icon: TableProperties, badge: '42' },
    { path: '/leads', label: 'Leads AI', icon: Sparkles },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/bookings', label: 'Bookings', icon: CalendarCheck },
    { path: '/heatmap', label: 'Demand Heatmap', icon: MapPin },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/ai-outreach', label: 'AI Outreach', icon: Mail },
    { path: '/ai-copilot', label: 'AI Copilot', icon: Zap },
    { path: '/insights', label: 'AI Insights', icon: BrainCircuit },
    { path: '/import-data', label: 'CSV Import', icon: UploadCloud },
    { path: '/settings', label: 'Settings', icon: SettingsIcon }
  ];

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate(`/hoardings?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div className="layout-wrapper">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo" onClick={() => navigate('/dashboard')}>
            <div className="logo-icon-wrapper">
              <Building2 className="logo-icon" size={20} />
              <span className="logo-pulse"></span>
            </div>
            <div className="brand-text">
              <span className="brand-title">SmartLeads <span className="highlight">OOH</span></span>
              <span className="brand-subtitle">AI Enterprise SaaS</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* System Telemetry Footer */}
        <div className="sidebar-telemetry font-mono">
          <div className="telemetry-item">
            <Database size={12} className="text-emerald" />
            <span>MongoDB: <strong>{health?.database || 'Connected'}</strong></span>
          </div>
          <div className="telemetry-item">
            <Zap size={12} className="text-amber" />
            <span>AI Status: <strong>{health?.ai === 'configured' ? 'Gemini 2.5' : 'Ready'}</strong></span>
          </div>
          <div className="telemetry-item">
            <CheckCircle2 size={12} className="text-brand" />
            <span>API: <strong>:5000 Active</strong></span>
          </div>
        </div>
      </aside>

      {/* Main Right Body */}
      <div className="main-viewport">
        {/* Topbar Navigation */}
        <header className="topbar">
          <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={22} />
          </button>

          {/* Global Search Bar */}
          <div className="topbar-search">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              placeholder="Global Search (Hoarding ID, Location, Brand)..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <div className="topbar-actions">
            {/* Notification Badge */}
            <div className="icon-action-btn" title="4 Urgent Vacancies">
              <Bell size={18} />
              <span className="notif-dot"></span>
            </div>

            {/* Theme Switcher */}
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? <Sun size={18} className="sun-icon" /> : <Moon size={18} className="moon-icon" />}
            </button>

            {/* User Profile Pill */}
            <div className="user-profile-pill">
              <div className="avatar">
                <User size={16} />
              </div>
              <div className="user-info">
                <span className="user-name">Aditya Sharma</span>
                <span className="user-role">Head of OOH Sales</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .layout-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .sidebar {
          width: 250px;
          background-color: var(--bg-card);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 150;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 1.25rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
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

        .brand-title {
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .brand-title .highlight { color: var(--brand-primary); }

        .brand-subtitle {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          display: block;
        }

        .mobile-close-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.85rem 0.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }

        .sidebar-link.active {
          color: var(--brand-primary);
          background-color: var(--brand-light);
          font-weight: 700;
        }

        .sidebar-link.active .nav-icon {
          color: var(--brand-primary);
        }

        .nav-badge {
          margin-left: auto;
          font-size: 0.68rem;
          font-weight: 800;
          background-color: var(--badge-critical-bg);
          color: var(--badge-critical-text);
          padding: 0.1rem 0.45rem;
          border-radius: 999px;
        }

        .sidebar-telemetry {
          padding: 0.85rem 1rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
          font-size: 0.68rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .telemetry-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
        }

        .main-viewport {
          flex: 1;
          margin-left: 250px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .topbar {
          height: 64px;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .mobile-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .topbar-search {
          position: relative;
          display: flex;
          align-items: center;
          width: 380px;
        }

        .topbar-search .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
        }

        .topbar-search input {
          width: 100%;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.85rem 0.5rem 2.4rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .topbar-search input:focus {
          border-color: var(--brand-primary);
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-action-btn {
          position: relative;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notif-dot {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 7px;
          height: 7px;
          background-color: var(--accent-rose);
          border-radius: 50%;
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
        }

        .user-profile-pill {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.75rem 0.35rem 0.4rem;
          border-radius: 999px;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary), var(--accent-purple));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .user-name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .page-content {
          flex: 1;
          padding: 1.5rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .text-emerald { color: var(--accent-emerald); }
        .text-amber { color: var(--accent-amber); }
        .text-brand { color: var(--brand-primary); }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .mobile-close-btn, .mobile-hamburger {
            display: flex;
          }
          .main-viewport {
            margin-left: 0;
          }
          .topbar {
            padding: 0 1rem;
          }
          .topbar-search {
            width: 220px;
          }
          .user-info {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
