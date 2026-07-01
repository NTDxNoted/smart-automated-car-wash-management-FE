import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan', path: '/admin/dashboard', icon: '▦' },
    { label: 'Đặt lịch', path: '/admin/bookings', icon: '▣' },
    { label: 'Khách hàng', path: '/admin/customers', icon: '♙' },
    { label: 'Dịch vụ', path: '/admin/services', icon: '▭' },
    { label: 'Khuyến mãi', path: '/admin/promotions', icon: '◇' },
    { label: 'Cấu hình hạng', path: '/admin/tiers', icon: '⊛' },
    { label: 'Báo cáo & RFM', path: '/admin/reports', icon: '▮' },
  ];

   const pageTitle =
    navItems.find((item) => location.pathname === item.path)?.label || 'Overview';

  return (
    <div className="min-h-screen bg-[#F0F3FF] text-[#111C2C] flex font-sans">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[255px] bg-[#263142]
          text-[#AFC0DA] flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-[80px] px-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#007C95] flex items-center justify-center text-white text-lg">
            ♢
          </div>
          <span className="text-[#008BA7] font-extrabold text-lg tracking-wide">
            AUTOWASH
          </span>
        </div>

        {/* User */}
        <div className="px-6 mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#111C2C] border border-[#AFC0DA]/30 flex items-center justify-center text-white font-bold">
            {user?.fullName?.charAt(0) || 'A'}
          </div>

          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-5 truncate">
              {user?.fullName || 'Admin User'}
            </p>
            <p className="text-[#34C759] text-xs font-semibold">
              Administrator
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 mt-12">
          <p className="px-3 mb-2 text-xs font-bold tracking-widest text-[#7F91AD]">
            MENU
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    h-11 px-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition
                    ${
                      isActive
                        ? 'bg-[#007C95] text-[#DCEBFF]'
                        : 'text-[#AFC0DA] hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="w-5 text-lg text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto px-6 pb-8">
          <div className="border-t border-[#AFC0DA]/25 pt-5 space-y-4">
            <button className="flex items-center gap-3 text-sm font-semibold text-[#AFC0DA] hover:text-white transition">
              <span className="text-lg">?</span>
              Help Center
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sm font-semibold text-[#AFC0DA] hover:text-white transition"
            >
              <span className="text-lg">↪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 md:ml-[255px]">
        {/* Header */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-[#BCC8CE] px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#111C2C] text-2xl"
            >
              ☰
            </button>

            <h1 className="text-2xl font-bold text-[#111C2C]">
              {pageTitle === 'Tổng quan' ? 'Overview' : pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#3D494D]">
              Server:{' '}
              <span className="text-[#34C759] font-bold">
                ● Online
              </span>
            </span>

            <button className="w-10 h-10 rounded-full bg-[#E7EEFF] flex items-center justify-center text-[#3D494D]">
              ♢
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-[calc(100vh-80px)] bg-[#F0F3FF] p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
