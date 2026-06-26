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

  // Handle smooth scroll for hash links on navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTierDetails = (tier) => {
    const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toLowerCase();
    if (tStr === '4' || tStr === 'platinum') {
      return { 
        name: 'Platinum', 
        color: 'from-cyan-500 to-blue-600 text-white border-cyan-400/20 shadow-cyan-500/10' 
      };
    }
    if (tStr === '3' || tStr === 'gold') {
      return { 
        name: 'Gold', 
        color: 'from-amber-400 to-yellow-500 text-white border-amber-300/20 shadow-amber-500/10' 
      };
    }
    if (tStr === '2' || tStr === 'silver') {
      return { 
        name: 'Silver', 
        color: 'from-slate-300 to-slate-400 text-slate-800 border-slate-200/20 shadow-slate-300/5' 
      };
    }
    return { 
      name: 'Member', 
      color: 'from-slate-400 to-slate-500 text-white border-slate-300/20 shadow-slate-500/5' 
    };
  };

  const isLinkActive = (path, hash = '') => {
    if (hash) {
      return location.pathname === path && location.hash === hash;
    }
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    return location.pathname === path;
  };

  const handleHashLinkClick = (hashId) => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    if (location.pathname === '/' && location.hash === hashId) {
      const element = document.getElementById(hashId.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

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
              isLinkActive('/')
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
              isLinkActive('/booking')
                ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">local_car_wash</span>
            <span className="text-sm font-medium">{t('navBooking')}</span>
          </Link>

          <Link
            to="/#services"
            onClick={() => handleHashLinkClick('#services')}
            className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
              isLinkActive('/', '#services')
                ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">auto_awesome</span>
            <span className="text-sm font-medium">{t('navServices')}</span>
          </Link>

          <Link
            to="/#results"
            onClick={() => handleHashLinkClick('#results')}
            className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
              isLinkActive('/', '#results')
                ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">image</span>
            <span className="text-sm font-medium">{t('navResults')}</span>
          </Link>

          <Link
            to="/#membership"
            onClick={() => handleHashLinkClick('#membership')}
            className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
              isLinkActive('/', '#membership')
                ? 'bg-cyan-50 text-cyan-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] w-6 h-6 flex items-center justify-center">workspace_premium</span>
            <span className="text-sm font-medium">{t('navMembership')}</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/bookings"
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isLinkActive('/bookings')
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
                  isLinkActive('/loyalty')
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
                isLinkActive('/profile')
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
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2.5 p-1 pr-3 rounded-full border border-slate-100 hover:border-cyan-200/80 bg-slate-50/50 hover:bg-cyan-50/30 transition-all duration-300 shadow-xs group"
                  >
                    {/* Glowing Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center font-black text-sm text-white shadow-sm ring-2 ring-cyan-500/10 group-hover:ring-cyan-500/20 transition-all">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <div className="hidden sm:flex flex-col items-start justify-center min-w-0">
                      <div className="text-[12px] font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-cyan-600 transition-colors">
                        {user?.fullName}
                      </div>
                      {user?.tier !== undefined && user?.tier !== null && user?.tier !== '' && (
                        <span 
                          className={`inline-flex items-center gap-0.5 text-[8px] font-black uppercase rounded-full bg-gradient-to-r border shadow-2xs ${getTierDetails(user.tier).color}`}
                          style={{ 
                            letterSpacing: '0.05em',
                            padding: '3px 8px',
                            marginTop: '2px',
                            lineHeight: '1'
                          }}
                        >
                          <span className="opacity-75 text-[7px]">✦</span>
                          {getTierDetails(user.tier).name}
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center text-xs font-bold text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50/30 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer active:scale-95"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                  >
                    {t('navLogout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-5">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center text-base font-semibold text-slate-600 hover:text-cyan-600 transition-all py-3 rounded-xl hover:bg-slate-100/60"
                    style={{ paddingLeft: '24px', paddingRight: '24px' }}
                  >
                    {t('navLogin')}
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center text-base font-extrabold text-white bg-cyan-600 hover:bg-cyan-500 py-3.5 rounded-full shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.23)] whitespace-nowrap transition-all hover:-translate-y-0.5 active:translate-y-0"
                    style={{ paddingLeft: '32px', paddingRight: '32px' }}
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
            isLinkActive('/') ? 'text-cyan-600 scale-110' : 'text-slate-500'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[9px] font-bold mt-0.5">{t('navHome')}</span>
        </Link>

        <Link
          to="/booking"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            isLinkActive('/booking') ? 'text-cyan-600 scale-110' : 'text-slate-500'
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
                isLinkActive('/bookings') ? 'text-cyan-600 scale-110' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">history</span>
              <span className="text-[9px] font-bold mt-0.5">{t('navHistory')}</span>
            </Link>

            <Link
              to="/loyalty"
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isLinkActive('/loyalty') ? 'text-cyan-600 scale-110' : 'text-slate-500'
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
