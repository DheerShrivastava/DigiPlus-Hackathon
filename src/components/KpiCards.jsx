import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Clock, 
  AlertOctagon, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { getDashboardSummary } from '../services/api';

export default function KpiCards({ hoardings }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getDashboardSummary();
        if (res.success) {
          setSummaryData(res.data);
        }
      } catch (err) {
        console.warn("Using fallback local KPI stats:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalHoardings = summaryData?.totalHoardings || hoardings.length || 300;
  const vacanciesIn90Days = summaryData?.vacanciesNext90Days || hoardings.filter(h => h.urgency === 'critical' || h.urgency === 'high' || h.urgency === 'moderate').length || 42;
  const totalRevenueAtRisk = summaryData?.revenueAtRisk || hoardings.reduce((sum, h) => sum + h.revenueAtRisk, 0) || 5820000;
  const formattedRevenueAtRisk = `₹${(totalRevenueAtRisk / 100000).toFixed(1)} Lakhs`;

  const activeCustomers = summaryData?.activeCustomers || 84;
  const leadConversionPotential = summaryData?.leadConversionPotential || 91.4;

  const cards = [
    {
      title: "Total Hoardings",
      value: totalHoardings,
      subtitle: "Across 5 tier-1 metro cities",
      change: "+4 this month",
      isPositive: true,
      icon: Building2,
      color: "var(--brand-primary)",
      bg: "rgba(79, 70, 229, 0.08)"
    },
    {
      title: "Vacancies in Next 90 Days",
      value: vacanciesIn90Days,
      subtitle: "Requires AI Lead Outreach",
      change: `${((vacanciesIn90Days / Math.max(1, totalHoardings)) * 100).toFixed(0)}% of total inventory`,
      isPositive: false,
      icon: Clock,
      color: "var(--accent-rose)",
      bg: "rgba(244, 63, 94, 0.08)"
    },
    {
      title: "Revenue At Risk",
      value: formattedRevenueAtRisk,
      subtitle: "Upcoming lease expirations",
      change: "₹60.6L expiring < 30 days",
      isPositive: false,
      icon: AlertOctagon,
      color: "var(--accent-amber)",
      bg: "rgba(245, 158, 11, 0.08)"
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      subtitle: "Enterprise brand retainers",
      change: "+12% YoY growth",
      isPositive: true,
      icon: Users,
      color: "var(--accent-cyan)",
      bg: "rgba(6, 182, 212, 0.08)"
    },
    {
      title: "Lead Conversion Potential",
      value: `${leadConversionPotential}%`,
      subtitle: "AI Lead Match Accuracy",
      change: "+5.2% vs previous quarter",
      isPositive: true,
      icon: TrendingUp,
      color: "var(--accent-emerald)",
      bg: "rgba(16, 185, 129, 0.08)"
    }
  ];

  return (
    <div className="kpi-cards-grid grid-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="dashboard-card kpi-card">
            <div className="kpi-top">
              <div className="kpi-title">{card.title}</div>
              <div className="kpi-icon-badge" style={{ color: card.color, backgroundColor: card.bg }}>
                <Icon size={20} />
              </div>
            </div>
            
            <div className="kpi-value-row">
              {loading ? (
                <Loader2 size={24} className="spin text-muted" />
              ) : (
                <span className="kpi-value">{card.value}</span>
              )}
            </div>

            <div className="kpi-footer">
              <span className={`kpi-change ${card.isPositive ? 'positive' : 'negative'}`}>
                {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.change}
              </span>
              <span className="kpi-subtitle">{card.subtitle}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        .kpi-cards-grid {
          margin-bottom: 1.5rem;
        }

        .kpi-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--border-color), transparent);
          transition: background 0.3s ease;
        }

        .kpi-card:hover::before {
          background: linear-gradient(90deg, var(--brand-primary), var(--accent-purple));
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .kpi-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .kpi-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-value-row {
          margin-bottom: 0.5rem;
          min-height: 2.2rem;
          display: flex;
          align-items: center;
        }

        .kpi-value {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .kpi-footer {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .kpi-change {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .kpi-change.positive { color: var(--accent-emerald); }
        .kpi-change.negative { color: var(--accent-rose); }

        .kpi-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}