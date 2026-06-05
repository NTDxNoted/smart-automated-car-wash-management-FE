import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function CustomerLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'from-cyan-400 to-blue-500 text-white';
      case 'gold': return 'from-yellow-400 to-amber-500 text-black font-semibold';
      case 'silver': return 'from-gray-300 to-gray-400 text-black font-semibold';
      default: return 'from-slate-500 to-slate-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex flex-col font-sans">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0e1a]/85 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              <span className="text-cyan-400 text-2xl font-bold animate-pulse">⟡</span>
              AutoWash <span className="text-white font-medium">Pro</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <Link to="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link>
              <Link to="/booking" className="hover:text-cyan-400 transition-colors">Đặt lịch</Link>
              {isAuthenticated && (
                <>
                  <Link to="/bookings" className="hover:text-cyan-400 transition-colors">Lịch sử</Link>
                  <Link to="/loyalty" className="hover:text-cyan-400 transition-colors">Ví điểm</Link>
                </>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left leading-none">
                    <div className="text-xs font-semibold text-slate-200">{user?.fullName}</div>
                    {user?.tier && (
                      <span className={`inline-block text-[9px] uppercase px-1.5 py-0.5 rounded bg-gradient-to-r ${getTierColor(user.tier)} mt-0.5`}>
                        {user.tier}
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 px-3 py-1.5 rounded-full transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 px-4 py-2 rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0e1a] px-4 pt-2 pb-4 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Trang chủ</Link>
            <Link to="/booking" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Đặt lịch</Link>
            {isAuthenticated ? (
              <>
                <Link to="/bookings" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Lịch sử</Link>
                <Link to="/loyalty" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Ví điểm</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Hồ sơ cá nhân</Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Đăng nhập</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-center block px-3 py-2.5 rounded-md text-base font-bold text-slate-900 bg-cyan-400">Đăng ký</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#05070d] border-t border-white/5 py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-lg tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              <span className="text-cyan-400">⟡</span>
              AutoWash <span className="text-white font-medium">Pro</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              Hệ thống rửa xe tự động thông minh hàng đầu. Tích điểm nâng hạng, chăm sóc xế yêu của bạn một cách tối ưu nhất.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-xs">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link></li>
              <li><Link to="/booking" className="hover:text-cyan-400 transition-colors">Đặt lịch rửa xe</Link></li>
              {isAuthenticated && (
                <li><Link to="/profile" className="hover:text-cyan-400 transition-colors">Thông tin tài khoản</Link></li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-xs">Liên hệ</h4>
            <p className="text-slate-400 leading-relaxed">
              Trụ sở: Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội<br />
              Hotline: 1900 6000<br />
              Email: support@autowashpro.com
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 text-center text-xs">
          © {new Date().getFullYear()} AutoWash Pro · FPT University — SWP391 Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
