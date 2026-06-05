import { createBrowserRouter, Navigate } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Customer pages
import HomePage from '../pages/customer/HomePage';
import BookingPage from '../pages/customer/BookingPage';
import BookingHistoryPage from '../pages/customer/BookingHistoryPage';
import ProfilePage from '../pages/customer/ProfilePage';
import LoyaltyPage from '../pages/customer/LoyaltyPage';

// Admin pages
import DashboardPage from '../pages/admin/DashboardPage';
import BookingManagementPage from '../pages/admin/BookingManagementPage';
import CustomerListPage from '../pages/admin/CustomerListPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import ServiceManagementPage from '../pages/admin/ServiceManagementPage';
import PromotionManagementPage from '../pages/admin/PromotionManagementPage';
import TierConfigPage from '../pages/admin/TierConfigPage';
import ReportPage from '../pages/admin/ReportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { path: '', element: <HomePage /> },
      {
        path: 'booking',
        element: <BookingPage />
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute>
            <BookingHistoryPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: 'loyalty',
        element: (
          <ProtectedRoute>
            <LoyaltyPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'bookings', element: <BookingManagementPage /> },
      {
        path: 'customers',
        children: [
          { path: '', element: <CustomerListPage /> },
          { path: ':id', element: <CustomerDetailPage /> }
        ]
      },
      { path: 'services', element: <ServiceManagementPage /> },
      { path: 'promotions', element: <PromotionManagementPage /> },
      { path: 'tiers', element: <TierConfigPage /> },
      { path: 'reports', element: <ReportPage /> }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
