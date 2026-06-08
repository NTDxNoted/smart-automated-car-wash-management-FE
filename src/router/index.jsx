import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Hiển thị fallback trong lúc tải code
const GlobalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-sm text-slate-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  </div>
);

// Auth pages (Lazy)
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

// Customer pages (Lazy)
const HomePage = lazy(() => import('../pages/customer/HomePage'));
const BookingPage = lazy(() => import('../pages/customer/BookingPage'));
const BookingHistoryPage = lazy(() => import('../pages/customer/BookingHistoryPage'));
const ProfilePage = lazy(() => import('../pages/customer/ProfilePage'));
const LoyaltyPage = lazy(() => import('../pages/customer/LoyaltyPage'));

// Admin pages (Lazy)
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const BookingManagementPage = lazy(() => import('../pages/admin/BookingManagementPage'));
const CustomerListPage = lazy(() => import('../pages/admin/CustomerListPage'));
const CustomerDetailPage = lazy(() => import('../pages/admin/CustomerDetailPage'));
const ServiceManagementPage = lazy(() => import('../pages/admin/ServiceManagementPage'));
const PromotionManagementPage = lazy(() => import('../pages/admin/PromotionManagementPage'));
const TierConfigPage = lazy(() => import('../pages/admin/TierConfigPage'));
const ReportPage = lazy(() => import('../pages/admin/ReportPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <CustomerLayout />
      </Suspense>
    ),
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
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <LoginPage />
      </Suspense>
    )
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<GlobalLoader />}>
        <RegisterPage />
      </Suspense>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <Suspense fallback={<GlobalLoader />}>
          <AdminLayout />
        </Suspense>
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
