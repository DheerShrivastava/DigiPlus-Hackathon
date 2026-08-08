import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

import Dashboard from '../pages/Dashboard';
import Hoardings from '../pages/Hoardings';
import HoardingDetail from '../pages/HoardingDetail';
import Vacancies from '../pages/Vacancies';
import Leads from '../pages/Leads';
import Customers from '../pages/Customers';
import CustomerDetail from '../pages/CustomerDetail';
import Bookings from '../pages/Bookings';
import Heatmap from '../pages/Heatmap';
import Analytics from '../pages/Analytics';
import AiOutreach from '../pages/AiOutreach';
import AiCopilot from '../pages/AiCopilot';
import Insights from '../pages/Insights';
import ImportData from '../pages/ImportData';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export default function AppRoutes({ theme, toggleTheme }) {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard theme={theme} />} />
        <Route path="hoardings" element={<Hoardings />} />
        <Route path="hoardings/:id" element={<HoardingDetail />} />
        <Route path="vacancies" element={<Vacancies />} />
        <Route path="leads" element={<Leads />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="heatmap" element={<Heatmap />} />
        <Route path="analytics" element={<Analytics theme={theme} />} />
        <Route path="ai-outreach" element={<AiOutreach />} />
        <Route path="ai-copilot" element={<AiCopilot />} />
        <Route path="insights" element={<Insights />} />
        <Route path="import-data" element={<ImportData />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
