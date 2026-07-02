import { useEffect, useState } from 'react';
import CustomerTable from '../../components/admin/CustomerTable';
import { getCustomers } from '../../services/adminCustomerService';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [status, setStatus] = useState('');
  const [tier, setTier] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCustomers();
  }, [debouncedSearch, status, tier, page]);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getCustomers({
        search: debouncedSearch,
        status,
        tier,
        page,
      });

      setCustomers(data.data || []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleTierChange = (value) => {
    setTier(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quản lý khách hàng</h2>
          <p className="text-slate-400 text-sm mt-1">
            Tra cứu thông tin khách hàng, phân hạng thành viên và quản lý trạng thái tài khoản
          </p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="grid md:grid-cols-3 gap-4 bg-[#0c0f24] p-5 rounded-2xl border border-white/5 shadow-xl">
        <div className="relative">
          <input
            placeholder="Tìm theo tên hoặc SĐT..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[#070913] border border-white/10 text-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/35 transition"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="h-4.5 w-4.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full bg-[#070913] border border-white/10 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/35 transition cursor-pointer appearance-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động (Active)</option>
            <option value="LOCKED">Bị khóa (Locked)</option>
            <option value="SUSPENDED">Tạm đình chỉ (Suspended)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={tier}
            onChange={(e) => handleTierChange(e.target.value)}
            className="w-full bg-[#070913] border border-white/10 text-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/35 transition cursor-pointer appearance-none"
          >
            <option value="">Tất cả hạng thành viên</option>
            <option value="Member">Hạng Member</option>
            <option value="Silver">Hạng Silver</option>
            <option value="Gold">Hạng Gold</option>
            <option value="Platinum">Hạng Platinum</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
            <p className="text-sm font-medium">Đang tải danh sách khách hàng...</p>
          </div>
        ) : (
          <CustomerTable customers={customers} />
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center bg-[#0c0f24] px-6 py-4 rounded-2xl border border-white/5 shadow-md">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Trang {page}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-[#070913] border border-white/5 text-slate-350 hover:bg-white/[0.04] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          >
            ← Trước
          </button>

          <button
            type="button"
            disabled={customers.length === 0 || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4.5 py-2 text-xs font-bold rounded-xl bg-[#070913] border border-white/5 text-slate-350 hover:bg-white/[0.04] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}