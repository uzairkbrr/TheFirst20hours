import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/store';

// Layout
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserOverview from './pages/UserOverview'; // New
import SkillDetails from './pages/SkillDetails'; // Was Dashboard
import SkillSetup from './pages/SkillSetup';
import FocusSession from './pages/FocusSession';
import SkillCompletion from './pages/SkillCompletion';
import Portfolio from './pages/Portfolio';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useStore();
  if (isAuthenticated) return <Navigate to="/app" replace />;
  // Navigate to dashboard if authenticated
  return children;
};

function App() {
  const { isAuthenticated } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<UserOverview />} />
          <Route path="skill/:skillId" element={<SkillDetails />} />
          <Route path="setup" element={<SkillSetup />} />
          <Route path="session" element={<FocusSession />} />
          <Route path="completion" element={<SkillCompletion />} />
          <Route path="portfolio" element={<Portfolio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
