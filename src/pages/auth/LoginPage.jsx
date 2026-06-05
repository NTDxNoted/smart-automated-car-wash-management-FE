import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSimulateLogin = (role) => {
    const mockToken = 'mock-jwt-token-12345';
    const mockUser = role === 'admin' 
      ? { customerId: 'admin-id', fullName: 'Admin User', role: 'admin', tier: 'Gold' }
      : { customerId: 'cust-id-1', fullName: 'John Doe', role: 'member', tier: 'Platinum' };
    
    login(mockToken, mockUser);
    
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111827] border border-white/5 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block text-cyan-400 text-3xl font-black">⟡</Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">Đăng nhập tài khoản</h2>
          <p className="text-slate-400 text-sm">Chào mừng bạn quay lại với AutoWash Pro</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSimulateLogin('member')}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/15"
          >
            Simulate Customer Login (Platinum)
          </button>
          <button
            onClick={() => handleSimulateLogin('admin')}
            className="w-full py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400 transition-all shadow-lg shadow-red-500/15"
          >
            Simulate Admin Login (Admin)
          </button>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Quay lại Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
