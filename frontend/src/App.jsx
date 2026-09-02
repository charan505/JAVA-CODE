import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateAlertPage from './pages/CreateAlertPage';
import ManageAlertsPage from './pages/ManageAlertsPage';
import AlertDetailsPage from './pages/AlertDetailsPage';
import UserDashboard from './pages/UserDashboard';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';
import CommunityManagementPage from './pages/CommunityManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

// Route Guard Component
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (userOnly && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// Redirect logged-in users away from /login and /register
const PublicOnlyRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/safety-guidelines" element={<SafetyGuidelinesPage />} />
        <Route path="/alerts/:id" element={<AlertDetailsPage />} />

        {/* Guest Only Routes */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        {/* Administrator Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateAlertPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute adminOnly>
              <ManageAlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <CommunityManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute adminOnly>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Community User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute userOnly>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Common Authenticated Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
