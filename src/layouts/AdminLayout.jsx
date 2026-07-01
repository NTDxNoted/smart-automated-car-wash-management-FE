import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan', path: '/admin/dashboard', icon: 'grid_view' },
    { label: 'Đặt lịch', path: '/admin/bookings', icon: 'calendar_month' },
    { label: 'Khách hàng', path: '/admin/customers', icon: 'group' },
    { label: 'Dịch vụ', path: '/admin/services', icon: 'directions_car' },
    { label: 'Khuyến mãi', path: '/admin/promotions', icon: 'local_offer' },
    { label: 'Cấu hình hạng', path: '/admin/tiers', icon: 'stars' },
    { label: 'Báo cáo & RFM', path: '/admin/reports', icon: 'bar_chart' },
  ];

  const pageTitle = navItems.find((item) => location.pathname === item.path)?.label || 'Tổng quan';

  return (
    <div 
      className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative flex transition-all duration-300"
      style={{ paddingLeft: window.innerWidth >= 768 ? (isDesktopCollapsed ? '80px' : '240px') : '0px' }}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - FIXED */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#263140] text-slate-300 shadow-xl transition-all duration-300 flex flex-col flex-shrink-0 ${
          isDesktopCollapsed ? 'w-[80px]' : 'w-[240px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className={`flex h-[80px] flex-shrink-0 items-center border-b border-white/5 overflow-hidden ${isDesktopCollapsed ? 'justify-center' : 'gap-4 px-6'}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#09748e] text-white shadow-lg flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">water_drop</span>
          </div>
          {!isDesktopCollapsed && (
            <p className="text-[22px] font-black tracking-widest text-[#09748e] uppercase drop-shadow-md whitespace-nowrap">AUTOWASH</p>
          )}
        </div>

        <div className={`py-6 border-b border-white/5 overflow-hidden ${isDesktopCollapsed ? 'px-2' : 'px-6'}`}>
          <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'gap-4'}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-white shadow-md ring-2 ring-slate-700/50 flex-shrink-0 overflow-hidden font-bold text-xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>A</span>
              )}
            </div>
            {!isDesktopCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-white">{user?.fullName || 'Alex Turner'}</p>
                <p className="text-[13px] font-semibold text-emerald-500 mt-0.5">Administrator</p>
              </div>
            )}
          </div>
        </div>

        <nav className={`flex-1 py-6 flex flex-col gap-6 overflow-y-auto overflow-x-hidden ${isDesktopCollapsed ? 'px-3' : 'px-4'}`}>
          {!isDesktopCollapsed && (
            <p className="px-2 mb-1 text-[13px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">MENU</p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isDesktopCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl transition-all duration-200 ${
                  isDesktopCollapsed ? 'w-14 h-14 justify-center mx-auto' : 'w-full gap-4 px-4 py-4'
                } ${isActive ? 'bg-[#09748e] text-white shadow-md' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-[28px] opacity-90 shrink-0">{item.icon}</span>
                {!isDesktopCollapsed && (
                  <span className="text-[17px] font-bold whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`pb-6 pt-6 border-t border-slate-600/50 flex flex-col gap-4 ${isDesktopCollapsed ? 'px-0 items-center' : 'px-4'}`}>
          <button 
            title={isDesktopCollapsed ? "Help Center" : undefined}
            className={`flex items-center transition-all ${
              isDesktopCollapsed 
                ? 'w-14 h-14 justify-center rounded-xl hover:bg-slate-700/50 text-slate-300 hover:text-white' 
                : 'w-full gap-4 rounded-xl px-4 py-4 text-left text-[17px] font-bold text-slate-300 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[28px] opacity-90 shrink-0">help_center</span>
            {!isDesktopCollapsed && <span className="whitespace-nowrap">Help Center</span>}
          </button>
          <button
            onClick={handleLogout}
            title={isDesktopCollapsed ? "Logout" : undefined}
            className={`flex items-center transition-all ${
              isDesktopCollapsed 
                ? 'w-14 h-14 justify-center rounded-xl hover:bg-rose-500/20 text-slate-300 hover:text-rose-400' 
                : 'w-full gap-4 rounded-xl px-4 py-4 text-left text-[17px] font-bold text-slate-300 hover:text-rose-400'
            }`}
          >
            <span className="material-symbols-outlined text-[28px] opacity-90 shrink-0">logout</span>
            {!isDesktopCollapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-[80px] flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 box-border px-4 md:px-8 lg:px-10 flex items-center justify-between shadow-sm z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-500 hover:text-slate-700 p-2 -ml-2 rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <button
              className="hidden md:flex items-center justify-center text-slate-500 hover:text-cyan-600 bg-slate-50 border border-slate-200 hover:border-cyan-200 hover:bg-cyan-50 p-2 rounded-lg transition-all shadow-sm"
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              title={isDesktopCollapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
            >
              <span className="material-symbols-outlined text-2xl">
                {isDesktopCollapsed ? 'menu' : 'menu_open'}
              </span>
            </button>
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-slate-800">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                System Online
              </span>
            </div>
            <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden bg-[#f0f3ff] box-border px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
