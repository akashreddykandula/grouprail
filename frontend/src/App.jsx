import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import { connectSocket, disconnectSocket } from './services/socket';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';

// Pages — stubs for Phase 1; full implementation per phase
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/app/DashboardPage';
import CreateTripPage from './pages/app/CreateTripPage';
import JoinTripPage from './pages/app/JoinTripPage';
import TripDetailPage from './pages/app/TripDetailPage';
import ProfilePage from './pages/app/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      connectSocket(user._id);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, user]);

  // Handle forced logout from api interceptor
  useEffect(() => {
    const handleLogout = () => {
      useAuthStore.getState().logout();
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join/:inviteCode" element={<JoinTripPage />} />
      </Route>

      {/* Guest-only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips/create" element={<CreateTripPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
