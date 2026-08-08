import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, PieChart, AlertCircle, MapPin } from 'lucide-react';
import { ANALYTICS_DATA } from '../data/mockData';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsSection({ theme }) {
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#9ca3af' : '#475569';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          boxWidth: 12
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f9fafb' : '#0f172a',
        bodyColor: isDark ? '#d1d5db' : '#334155',
        borderColor: isDark ? '#374151' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { size: 10 } }
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor, font: { size: 10 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          boxWidth: 12,
          padding: 15
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="analytics-section-wrapper">
      <div className="section-header">
        <h2 className="section-title">
          <BarChart3 className="text-brand-icon" size={24} />
          Executive Analytics & Inventory Intelligence
        </h2>
        <span className="section-subtitle">Real-time performance forecasting across nationwide billboards</span>
      </div>

      <div className="analytics-grid">
        {/* 1. Revenue at Risk by Month */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title">
              <AlertCircle size={18} className="text-rose" />
              <span>1. Revenue At Risk by Month</span>
            </div>
            <span className="chart-badge bg-rose-light text-rose">Upcoming Expirations</span>
          </div>
          <div className="card-body chart-box">
            <Bar data={ANALYTICS_DATA.revenueAtRiskByMonth} options={commonOptions} />
          </div>
        </div>

        {/* 2. Vacancy Forecast Timeline */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} className="text-brand-icon" />
              <span>2. Vacancy Forecast Timeline (Next 8 Weeks)</span>
            </div>
            <span className="chart-badge bg-brand-light text-brand">Forecasting</span>
          </div>
          <div className="card-body chart-box">
            <Line data={ANALYTICS_DATA.vacancyForecastTimeline} options={commonOptions} />
          </div>
        </div>

        {/* 3. Occupancy Rate Trend */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} className="text-emerald" />
              <span>3. Occupancy Rate Trend (%)</span>
            </div>
            <span className="chart-badge bg-emerald-light text-emerald">94% Target</span>
          </div>
          <div className="card-body chart-box">
            <Line data={ANALYTICS_DATA.occupancyTrend} options={commonOptions} />
          </div>
        </div>

        {/* 4. Top Performing Locations */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={18} className="text-purple" />
              <span>4. Top Performing Locations by Yield</span>
            </div>
            <span className="chart-badge bg-purple-light text-purple">Highest eCPM</span>
          </div>
          <div className="card-body chart-box">
            <Bar 
              data={ANALYTICS_DATA.topLocations} 
              options={{
                ...commonOptions,
                indexAxis: 'y'
              }} 
            />
          </div>
        </div>

        {/* 5. Customer Industry Distribution */}
        <div className="dashboard-card chart-card span-2">
          <div className="card-header">
            <div className="card-title">
              <PieChart size={18} className="text-cyan" />
              <span>5. Customer Industry Ad Spend Distribution</span>
            </div>
            <span className="chart-badge bg-cyan-light text-cyan">Market Sector Share</span>
          </div>
          <div className="card-body chart-box donut-container">
            <Doughnut data={ANALYTICS_DATA.industryDistribution} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <style>{`
        .analytics-section-wrapper {
          margin-bottom: 2rem;
        }

        .section-header {
          margin-bottom: 1.25rem;
        }

        .section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .chart-card {
          min-height: 320px;
        }

        .span-2 {
          grid-column: span 2;
        }

        .chart-box {
          height: 250px;
          position: relative;
          width: 100%;
        }

        .chart-badge {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .text-rose { color: var(--accent-rose); }
        .bg-rose-light { background-color: var(--badge-critical-bg); }

        .text-brand { color: var(--brand-primary); }
        .bg-brand-light { background-color: var(--brand-light); }

        .text-emerald { color: var(--accent-emerald); }
        .bg-emerald-light { background-color: var(--badge-success-bg); }

        .text-purple { color: var(--accent-purple); }
        .bg-purple-light { background-color: rgba(147, 51, 234, 0.1); }

        .text-cyan { color: var(--accent-cyan); }
        .bg-cyan-light { background-color: rgba(6, 182, 212, 0.1); }

        @media (max-width: 1024px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
          .span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
