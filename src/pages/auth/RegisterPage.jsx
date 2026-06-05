import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111827] border border-white/5 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block text-cyan-400 text-3xl font-black">⟡</Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">Đăng ký thành viên</h2>
          <p className="text-slate-400 text-sm">Trải nghiệm dịch vụ rửa xe thông minh vượt trội</p>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-400">Trang đăng ký (Placeholder)</p>
          <Link to="/login" className="block text-cyan-400 text-sm hover:underline">Đã có tài khoản? Đăng nhập ngay</Link>
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
