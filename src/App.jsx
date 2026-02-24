
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Survey from './pages/Survey';
import Results from './pages/Results';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Experts from './pages/Experts';
import Subscription from './pages/Subscription';
import Progress from './pages/Progress';
import Chatbot from './components/common/Chatbot';
import Header from './components/common/Header';
import { useCodeProtection } from './hooks/useCodeProtection';

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

function App() {
  useCodeProtection();

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/results" element={<Results />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/subscription" element={<Subscription />} />
        </Route>
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
