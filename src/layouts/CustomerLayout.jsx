import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

export default function CustomerLayout() {
  const { isMember, auth, logout } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const isAuthenticated = isMember;
  const user = auth;
  const navigate = useNavigate();
  const location = useLocation();

  // Track desktop status to prevent zoom resizing from overriding manual sidebar toggle
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

  // Track page size to dynamically adjust sidebar visibility on mobile/desktop crossing
  useEffect(() => {
    const handleResize = () => {
      const currentlyDesktop = window.innerWidth >= 1024;
      if (currentlyDesktop !== isDesktop) {
        setIsDesktop(currentlyDesktop);
        // Auto-open is removed so zooming doesn't trigger unwanted sidebar popups
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktop]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'from-cyan-500 to-blue-600 text-white';
      case 'gold': return 'from-yellow-500 to-amber-600 text-white font-semibold';
      case 'silver': return 'from-slate-400 to-slate-500 text-white font-semibold';
      default: return 'from-slate-500 to-slate-600 text-white';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* ── Mobile Backdrop Overlay ── */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300"
        />
      )}

      {/* Left Sidebar Panel (Fixed Position, styled for Light Theme) */}
      <aside className={`sidebar-panel ${sidebarOpen ? "active shadow-lg" : "collapsed"}`}>
        
        {/* Sidebar Brand/Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-wider uppercase text-cyan-600">
            <span className="text-cyan-500">⟡</span>
            AutoWash <span className="text-slate-800 font-medium">Pro</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <Link
            to="/"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
              isActive('/')
                ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">home</span>
            <span className="text-sm font-medium">{t('navHome')}</span>
          </Link>

          <Link
            to="/booking"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
              isActive('/booking')
                ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">local_car_wash</span>
            <span className="text-sm font-medium">{t('navBooking')}</span>
          </Link>

          <a
            href="/#services"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">auto_awesome</span>
            <span className="text-sm font-medium">{t('navServices')}</span>
          </a>

          <a
            href="/#results"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">image</span>
            <span className="text-sm font-medium">{t('navResults')}</span>
          </a>

          <a
            href="/#membership"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className="flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">workspace_premium</span>
            <span className="text-sm font-medium">{t('navMembership')}</span>
          </a>

          {isAuthenticated && (
            <>
              <Link
                to="/bookings"
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive('/bookings')
                    ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">history</span>
                <span className="text-sm font-medium">{t('navHistory')}</span>
              </Link>

              <Link
                to="/loyalty"
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive('/loyalty')
                    ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">stars</span>
                <span className="text-sm font-medium">{t('navLoyalty')}</span>
              </Link>
            </>
          )}

          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                isActive('/profile')
                  ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">person</span>
              <span className="text-sm font-medium">{t('navProfile')}</span>
            </Link>
          )}
        </nav>

        {/* Gold Upgrade Membership Banner in Sidebar */}
        <div className="p-4 mt-auto border-t border-slate-100 space-y-2 bg-slate-50/50">
          <a
            href="tel:19006000"
            className="flex items-center gap-4 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center text-slate-400">help</span>
            <span className="text-sm font-medium">{t('navSupport')}</span>
          </a>
        </div>
      </aside>

      {/* Main Right Area Column wrapper */}
      <div className="flex-grow flex flex-col min-h-screen">
        
        {/* ── Fixed Header (Light Theme) ── */}
        <header className={`fixed top-0 right-0 z-30 backdrop-blur-md bg-white/95 border-b border-slate-200 transition-all duration-300 shadow-sm header-area ${sidebarOpen ? "shifted" : ""}`}>
          <div className="w-full px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Left: Hamburger Toggle & Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 active:scale-95 transition-all flex items-center justify-center mr-1"
                aria-label="Toggle Sidebar Menu"
              >
                <span className="material-symbols-outlined text-xl font-bold">
                  {sidebarOpen ? 'menu_open' : 'menu'}
                </span>
              </button>
              {!sidebarOpen && (
                <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-wider uppercase text-cyan-600">
                  <span className="text-cyan-500">⟡</span>
                  AutoWash <span className="text-slate-800 font-medium">Pro</span>
                </Link>
              )}
            </div>

            {/* Right Area: Language Switcher, Notifications, Auth actions */}
            <div className="flex items-center gap-4">
              
              {/* Pill-shaped Language Selector Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full p-1 shadow-inner">
                <button
                  onClick={() => setLocale('vi')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-90 ${
                    locale === 'vi'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-90 ${
                    locale === 'en'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left leading-none">
                      <div className="text-xs font-semibold text-slate-800">{user?.fullName}</div>
                      {user?.tier && (
                        <span className={`inline-block text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r mt-0.5 ${getTierColor(user.tier)}`}>
                          {user.tier}
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-slate-500 hover:text-red-500 border border-slate-300 hover:border-red-500 px-3 py-1.5 rounded-full transition-all"
                  >
                    {t('navLogout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-all px-3 py-2 rounded-lg hover:bg-slate-50">
                    {t('navLogin')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] whitespace-nowrap transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {t('navRegister')}
                  </Link>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content Outlet */}
        <main className={`main-content-area ${sidebarOpen ? "shifted" : ""} pb-20 lg:pb-0`}>
          <Outlet />
        </main>

        {/* Footer (Light Theme) */}
        <footer className={`bg-slate-100 border-t border-slate-200 py-12 text-slate-600 text-sm footer-area ${sidebarOpen ? "shifted" : ""} relative z-10`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-black text-lg tracking-wider uppercase text-cyan-600">
                <span className="text-cyan-500">⟡</span>
                AutoWash <span className="text-slate-800 font-medium">Pro</span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-xs">
                {t('footerBrandDesc')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">{t('footerPlatform')}</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-cyan-600 transition-colors">{t('navHome')}</Link></li>
                <li><Link to="/booking" className="hover:text-cyan-600 transition-colors">{t('navBooking')}</Link></li>
                {isAuthenticated && (
                  <li><Link to="/profile" className="hover:text-cyan-600 transition-colors">{t('navProfile')}</Link></li>
                )}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">{t('footerCompany')}</h4>
              <p className="text-slate-500 leading-relaxed">
                Trụ sở: Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội<br />
                Hotline: 1900 6000<br />
                Email: support@autowashpro.com
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {t('footerRights')}
          </div>
        </footer>

      </div>

      {/* ── Mobile Bottom Navigation (Visible only on Mobile) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg rounded-t-2xl">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            isActive('/') ? 'text-cyan-600 scale-110' : 'text-slate-500'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[9px] font-bold mt-0.5">{t('navHome')}</span>
        </Link>

        <Link
          to="/booking"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            isActive('/booking') ? 'text-cyan-600 scale-110' : 'text-slate-500'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">local_car_wash</span>
          <span className="text-[9px] font-bold mt-0.5">{t('navBooking')}</span>
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/bookings"
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive('/bookings') ? 'text-cyan-600 scale-110' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">history</span>
              <span className="text-[9px] font-bold mt-0.5">{t('navHistory')}</span>
            </Link>

            <Link
              to="/loyalty"
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive('/loyalty') ? 'text-cyan-600 scale-110' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">stars</span>
              <span className="text-[9px] font-bold mt-0.5">{t('navLoyalty')}</span>
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-slate-500"
          >
            <span className="material-symbols-outlined text-2xl">login</span>
            <span className="text-[9px] font-bold mt-0.5">{t('navLogin')}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
