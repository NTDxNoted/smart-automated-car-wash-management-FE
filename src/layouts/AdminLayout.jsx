import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function AdminLayout() {
  const { auth, logout } = useAuth();
  const user = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan', path: '/admin/dashboard', icon: '📊' },
    { label: 'Đặt lịch', path: '/admin/bookings', icon: '📅' },
    { label: 'Khách hàng', path: '/admin/customers', icon: '👥' },
    { label: 'Dịch vụ', path: '/admin/services', icon: '🛠️' },
    { label: 'Khuyến mãi', path: '/admin/promotions', icon: '🏷️' },
    { label: 'Cấu hình hạng', path: '/admin/tiers', icon: '👑' },
    { label: 'Báo cáo & RFM', path: '/admin/reports', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0c0f24] border-r border-white/5 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-0'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5 gap-2">
          <span className="text-cyan-400 text-lg">⟡</span>
          <span className="font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AutoWash Admin</span>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.fullName || 'Administrator'}</p>
              <span className="inline-block text-[9px] uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold border border-red-500/10 mt-0.5">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border border-white/5 hover:border-red-500/20 hover:text-red-400 transition-all bg-white/[0.02] hover:bg-red-500/5"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Side */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-16 bg-[#0c0f24]/60 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white md:hidden focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-slate-200">
              {navItems.find((item) => location.pathname === item.path)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Server: <span className="text-emerald-400 font-semibold">Online</span></span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 pt-20 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Backdrop on Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </div>
  );
}
