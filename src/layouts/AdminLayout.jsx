import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 SVG NAVIGATION ICONS
// ─────────────────────────────────────────────────────────────────────────────
function OverviewIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function BookingIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// Sidebar Car Icon representing Services
function ServicesIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M13 17H9" />
    </svg>
  );
}

// Sidebar Tag Icon representing Promotions
function PromotionsIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41L12 2z" />
      <circle cx="5" cy="5" r="1" />
    </svg>
  );
}

// Sidebar Star Badge representing Tiers Configuration
function TiersIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 8 13.9 11.9 18.2 12.5 15.1 15.6 15.8 19.9 12 17.9 8.2 19.9 8.9 15.6 5.8 12.5 10.1 11.9" />
    </svg>
  );
}

function CustomersIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ReportsIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function BellIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function AdminLayout() {
  const { auth, logout } = useAuth();
  const user = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan', path: '/admin/dashboard', icon: OverviewIcon },
    { label: 'Đặt lịch', path: '/admin/bookings', icon: BookingIcon },
    { label: 'Khách hàng', path: '/admin/customers', icon: CustomersIcon },
    { label: 'Dịch vụ', path: '/admin/services', icon: ServicesIcon },
    { label: 'Khuyến mãi', path: '/admin/promotions', icon: PromotionsIcon },
    { label: 'Cấu hình hạng', path: '/admin/tiers', icon: TiersIcon },
    { label: 'Báo cáo & RFM', path: '/admin/reports', icon: ReportsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex font-sans overflow-x-hidden">

      {/* Sidebar Panel - Fixed overlay on mobile, relative flex column on desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0c0f24] border-r border-white/5 transition-all duration-300 transform md:relative md:translate-x-0 ${sidebarOpen
          ? 'translate-x-0 w-64 md:w-64'
          : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 overflow-hidden'
        } flex flex-col shrink-0`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            {/* Water droplet SVG */}
            <svg className="w-4.5 h-4.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <span className="font-black tracking-wider uppercase text-cyan-400 text-sm">
            AUTOWASH
          </span>
        </div>

        {/* User Profile - Top aligned */}
        <div className="p-5 border-b border-white/5 bg-[#0a0d20]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.fullName || 'Alex Turner'}</p>
              <p className="text-xs font-semibold text-emerald-500 mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            MENU
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5 space-y-1 bg-[#0a0d20] shrink-0">
          <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 transition-all cursor-pointer">
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Help Center</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Side - Flex column layout */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-16 bg-[#0c0f24]/60 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none cursor-pointer flex items-center justify-center rounded-lg hover:bg-white/5 transition-all"
              title="Toggle Sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {location.pathname === '/admin/dashboard'
                ? 'Overview'
                : (navItems.find((item) => location.pathname === item.path)?.label || 'Dashboard')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Server: <span className="text-emerald-400 font-bold">• Online</span></span>
            </div>
            <button className="p-2.5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 text-slate-350 hover:text-white rounded-xl transition-all relative cursor-pointer shadow-sm">
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Backdrop on Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
}
