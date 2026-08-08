import React from 'react';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Sparkles, 
  MapPin, 
  Building2, 
  TrendingUp, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onLogout, userEmail }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'vacancies', label: '90-Day Vacancies', icon: CalendarClock, badge: '90d' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, highlight: true },
    { id: 'heatmap', label: 'Mumbai Heat Map', icon: MapPin },
    { id: 'management', label: 'Manage Hoardings', icon: Building2 },
    { id: 'analytics', label: 'Churn & Risk Analysis', icon: TrendingUp },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)'
    }}>
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(90deg, #38bdf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DigiPlus AI
            </h2>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.5px' }}>Smart Leads Agent • Mumbai</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', padding: '0 12px 8px 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Main Cockpit
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.18), rgba(139, 92, 246, 0.08))' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '12px', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
              {item.highlight && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '12px', fontWeight: 700 }}>
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Employee Profile Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(11, 15, 25, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#10b981" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }}>
                {userEmail || 'admin@digiplus.com'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#10b981' }}>Sales Officer</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
