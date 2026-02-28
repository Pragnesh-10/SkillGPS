import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Chatbot from './components/common/Chatbot';
import InstallBanner from './components/common/InstallBanner'; // ← NEW
import { useCodeProtection } from './hooks/useCodeProtection';

const Welcome = lazy(() => import('./pages/Welcome'));
const Survey = lazy(() => import('./pages/Survey'));
const Results = lazy(() => import('./pages/Results'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Experts = lazy(() => import('./pages/Experts'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Progress = lazy(() => import('./pages/Progress'));
const CareerLanding = lazy(() => import('./pages/CareerLanding'));

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Simple loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'rgba(255,255,255,0.7)' }}>
    <div className="spinner">Loading...</div>
  </div>
);

function App() {
  useCodeProtection();

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className="app-main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/results" element={<Results />} />
            <Route path="/careers/:domainSlug" element={<CareerLanding />} />

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/subscription" element={<Subscription />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Chatbot />
      <InstallBanner /> {/* ← NEW: Shows "Install App" banner on mobile */}
    </Router>
  );
}

export default App;
