import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function CustomerLayout() {
  const { isMember, auth, logout } = useAuth();
  const isAuthenticated = isMember;
  const user = auth;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* ── Sticky Header (Light Theme) ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 transition-all duration-300 shadow-sm">
        <div className="w-full px-8 h-16 flex items-center justify-between">

          {/* KHỐI TRÁI: LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-wider uppercase text-cyan-600">
              <span className="text-cyan-500">⟡</span>
              AutoWash <span className="text-slate-800 font-medium">Pro</span>
            </Link>
          </div>

          {/* KHỐI GIỮA: MENU ĐIỀU HƯỚNG */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-cyan-600 transition-colors">Trang chủ</Link>
            <Link to="/booking" className="hover:text-cyan-600 transition-colors">Đặt lịch rửa xe</Link>
            {isAuthenticated && (
              <>
                <Link to="/bookings" className="hover:text-cyan-600 transition-colors">Lịch sử</Link>
                <Link to="/loyalty" className="hover:text-cyan-600 transition-colors">Ví điểm</Link>
              </>
            )}
          </nav>

          {/* KHỐI PHẢI: NÚT BẤM */}
          <div className="flex items-center gap-4 justify-end">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left leading-none">
                    <div className="text-xs font-semibold text-slate-800">{user?.fullName}</div>
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-xs font-medium text-slate-500 hover:text-red-500 border border-slate-300 hover:border-red-500 px-3 py-1.5 rounded-full transition-all">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full shadow-md whitespace-nowrap transition-all">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer (Light Theme) */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-lg tracking-wider uppercase text-cyan-600">
              <span className="text-cyan-500">⟡</span>
              AutoWash <span className="text-slate-800 font-medium">Pro</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Hệ thống rửa xe tự động thông minh hàng đầu. Tích điểm nâng hạng, chăm sóc xế yêu của bạn một cách tối ưu nhất.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-cyan-600 transition-colors">Trang chủ</Link></li>
              <li><Link to="/booking" className="hover:text-cyan-600 transition-colors">Đặt lịch rửa xe</Link></li>
              {isAuthenticated && (
                <li><Link to="/profile" className="hover:text-cyan-600 transition-colors">Thông tin tài khoản</Link></li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">Liên hệ</h4>
            <p className="text-slate-500 leading-relaxed">
              Trụ sở: Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội<br />
              Hotline: 1900 6000<br />
              Email: support@autowashpro.com
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AutoWash Pro · FPT University — SWP391 Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
