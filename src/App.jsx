
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Survey from './pages/Survey';
import Results from './pages/Results';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Experts from './pages/Experts';
import Subscription from './pages/Subscription';
import Progress from './pages/Progress';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
