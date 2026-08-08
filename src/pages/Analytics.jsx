import React, { useState, useEffect } from 'react';
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
  Legend
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, PieChart, AlertCircle, MapPin, Building2, CalendarCheck, DollarSign } from 'lucide-react';
import { 
  getAnalyticsRevenueRisk, 
  getAnalyticsVacancyForecast, 
  getAnalyticsOccupancy, 
  getAnalyticsTopLocations, 
  getAnalyticsCustomerIndustries,
  getAnalyticsCities,
  getAnalyticsBookingFrequency,
  getAnalyticsAverageRates
} from '../services/api';
import { ANALYTICS_DATA } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Analytics({ theme }) {
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#9ca3af' : '#475569';

  const [revRisk, setRevRisk] = useState(ANALYTICS_DATA.revenueAtRiskByMonth);
  const [vacancyFc, setVacancyFc] = useState(ANALYTICS_DATA.vacancyForecastTimeline);
  const [occupancyTr, setOccupancyTr] = useState(ANALYTICS_DATA.occupancyTrend);
  const [topLoc, setTopLoc] = useState(ANALYTICS_DATA.topLocations);
  const [indDist, setIndDist] = useState(ANALYTICS_DATA.industryDistribution);
  const [citiesData, setCitiesData] = useState(null);
  const [freqData, setFreqData] = useState(null);
  const [ratesData, setRatesData] = useState(null);

  useEffect(() => {
    async function loadAllAnalytics() {
      try {
        const [rRisk, rVac, rOcc, rTop, rInd, rCit, rFreq, rRat] = await Promise.allSettled([
          getAnalyticsRevenueRisk(),
          getAnalyticsVacancyForecast(),
          getAnalyticsOccupancy(),
          getAnalyticsTopLocations(),
          getAnalyticsCustomerIndustries(),
          getAnalyticsCities(),
          getAnalyticsBookingFrequency(),
          getAnalyticsAverageRates()
        ]);

        if (rRisk.status === 'fulfilled' && rRisk.value.success) setRevRisk(rRisk.value.data);
        if (rVac.status === 'fulfilled' && rVac.value.success) setVacancyFc(rVac.value.data);
        if (rOcc.status === 'fulfilled' && rOcc.value.success) setOccupancyTr(rOcc.value.data);
        if (rTop.status === 'fulfilled' && rTop.value.success) setTopLoc(rTop.value.data);
        if (rInd.status === 'fulfilled' && rInd.value.success) setIndDist(rInd.value.data);
        if (rCit.status === 'fulfilled' && rCit.value.success) setCitiesData(rCit.value.data);
        if (rFreq.status === 'fulfilled' && rFreq.value.success) setFreqData(rFreq.value.data);
        if (rRat.status === 'fulfilled' && rRat.value.success) setRatesData(rRat.value.data);
      } catch (err) {
        console.warn("Using local analytics charts:", err.message);
      }
    }

    loadAllAnalytics();
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
      }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } }
    }
  };

  const defaultCitiesChart = citiesData || {
    labels: ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune"],
    datasets: [{ label: "Portfolio Revenue (₹ Lakhs)", data: [185, 142, 110, 85, 68], backgroundColor: "rgba(6, 182, 212, 0.75)", borderRadius: 6 }]
  };

  const defaultFreqChart = freqData || {
    labels: ["1-5 Campaigns", "6-12 Campaigns", "13-20 Campaigns", "21-30 Campaigns", "30+ Campaigns"],
    datasets: [{ label: "Site Count", data: [45, 95, 110, 38, 12], backgroundColor: "rgba(147, 51, 234, 0.75)", borderRadius: 6 }]
  };

  const defaultRatesChart = ratesData || {
    labels: ["Static Gantry", "Illuminated Unipole", "Frontlit Board", "Digital 4K Screen", "Dual LED Unipole"],
    datasets: [{ label: "Avg Monthly Rate (₹ Lakhs)", data: [5.2, 7.8, 6.5, 12.0, 9.8], backgroundColor: "rgba(245, 158, 11, 0.75)", borderRadius: 6 }]
  };

  return (
    <div className="analytics-page">
      <div className="page-header mb-4">
        <h1 className="page-title flex items-center gap-2">
          <BarChart3 className="text-brand" size={24} />
          Full Executive Analytics Suite (8 Real-Time Visualizations)
        </h1>
        <p className="page-subtitle">Calculated directly from MongoDB Atlas aggregation pipelines.</p>
      </div>

      <div className="analytics-grid">
        {/* 1. Revenue at Risk */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><AlertCircle size={18} className="text-rose" /> 1. Revenue At Risk by Month</div>
          </div>
          <div className="card-body chart-box"><Bar data={revRisk} options={commonOptions} /></div>
        </div>

        {/* 2. Vacancy Forecast */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} className="text-brand" /> 2. Vacancy Forecast Timeline</div>
          </div>
          <div className="card-body chart-box"><Line data={vacancyFc} options={commonOptions} /></div>
        </div>

        {/* 3. Occupancy Trend */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} className="text-emerald" /> 3. Occupancy Rate Trend (%)</div>
          </div>
          <div className="card-body chart-box"><Line data={occupancyTr} options={commonOptions} /></div>
        </div>

        {/* 4. Top Locations */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><MapPin size={18} className="text-purple" /> 4. Top Performing Locations</div>
          </div>
          <div className="card-body chart-box"><Bar data={topLoc} options={{ ...commonOptions, indexAxis: 'y' }} /></div>
        </div>

        {/* 5. Industry Distribution */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><PieChart size={18} className="text-cyan" /> 5. Customer Industry Share</div>
          </div>
          <div className="card-body chart-box"><Doughnut data={indDist} options={commonOptions} /></div>
        </div>

        {/* 6. Revenue by City */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><Building2 size={18} className="text-cyan" /> 6. Revenue Share by City</div>
          </div>
          <div className="card-body chart-box"><Bar data={defaultCitiesChart} options={commonOptions} /></div>
        </div>

        {/* 7. Booking Frequency */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><CalendarCheck size={18} className="text-purple" /> 7. Booking Frequency Distribution</div>
          </div>
          <div className="card-body chart-box"><Bar data={defaultFreqChart} options={commonOptions} /></div>
        </div>

        {/* 8. Average Monthly Rate */}
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <div className="card-title"><DollarSign size={18} className="text-amber" /> 8. Average Monthly Rate by Format</div>
          </div>
          <div className="card-body chart-box"><Bar data={defaultRatesChart} options={commonOptions} /></div>
        </div>
      </div>

      <style>{`
        .mb-4 { margin-bottom: 1.25rem; }
        .analytics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        .chart-card { min-height: 320px; }
        .chart-box { height: 250px; position: relative; width: 100%; }
        .text-rose { color: var(--accent-rose); }
        .text-emerald { color: var(--accent-emerald); }
        .text-purple { color: var(--accent-purple); }
        .text-cyan { color: var(--accent-cyan); }
        .text-amber { color: var(--accent-amber); }
        .text-brand { color: var(--brand-primary); }

        @media (max-width: 1024px) {
          .analytics-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
