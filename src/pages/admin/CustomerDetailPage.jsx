import { useParams, Link } from 'react-router-dom';

export default function CustomerDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="bg-[#0c0f24] border border-white/5 p-8 rounded-2xl">
        <div className="mb-4">
          <Link to="/admin/customers" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Quay lại danh sách khách hàng
          </Link>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Chi tiết Khách hàng: {id}</h2>
        <p className="text-slate-400 text-sm">Hồ sơ cá nhân, lịch sử đặt lịch và tùy chọn khóa/mở khóa tài khoản (Placeholder)</p>
      </div>
    </div>
  );
}
