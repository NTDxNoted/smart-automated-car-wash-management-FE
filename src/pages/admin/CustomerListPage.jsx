import { Link } from 'react-router-dom';

export default function CustomerListPage() {
  return (
    <div className="space-y-6">
      <div className="bg-[#0c0f24] border border-white/5 p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">Quản lý Khách hàng</h2>
        <p className="text-slate-400 text-sm mb-4">Tìm kiếm, lọc thành viên theo hạng, trạng thái hoạt động và khóa tài khoản (Placeholder)</p>
        <Link to="/admin/customers/cust-id-1" className="text-cyan-400 text-sm hover:underline">
          → Demo chi tiết khách hàng (ID: cust-id-1)
        </Link>
      </div>
    </div>
  );
}
