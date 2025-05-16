import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardPage from './pages/DashboardPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import LoanManagementPage from './pages/LoanManagementPage';
import CoolerMonitoringPage from './pages/CoolerMonitoringPage';
import ImpactMetricsPage from './pages/ImpactMetricsPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import Layout from './components/layout/Layout';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="apply" element={<LoanApplicationPage />} />
            <Route path="loans" element={<LoanManagementPage />} />
            <Route path="coolers" element={<CoolerMonitoringPage />} />
            <Route path="impact" element={<ImpactMetricsPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;