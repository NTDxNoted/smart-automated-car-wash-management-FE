import { useEffect, useState } from 'react';
import CustomerTable from '../../components/admin/CustomerTable';
import { getCustomers } from '../../services/adminCustomerService';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [status, setStatus] = useState('');
  const [tier, setTier] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

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
        pageSize,
      });

      const items = data?.items || data?.data?.items || data?.data || data || [];
      const total = data?.total || data?.data?.total || items.length;
      
      setCustomers(Array.isArray(items) ? items : []);
      setTotalItems(total);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Quản lý khách hàng
              </h2>
              <p className="text-sm text-slate-500 mt-1">Customer database and tier management</p>
            </div>
            <button className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
                <span className="material-symbols-outlined text-lg">download</span>
                Export CSV
            </button>
        </div>

        <div className="flex gap-4 mb-6">
            <div className="relative w-64 md:w-80">
                <input
                    placeholder="Tên hoặc SĐT"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
                    <span className="material-symbols-outlined text-xl">search</span>
                </button>
            </div>

            <div className="relative">
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium text-sm"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="LOCKED">Bị khóa</option>
                    <option value="SUSPENDED">Đình chỉ</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
            </div>

            <div className="relative">
                <select
                    value={tier}
                    onChange={(e) => handleTierChange(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium text-sm"
                >
                    <option value="">Tất cả hạng</option>
                    <option value="MEMBER">Member</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="PLATINUM">Platinum</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
            </div>
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden mb-6">
            <CustomerTable customers={customers} loading={loading} />
        </div>

        <div className="pt-2 flex items-center justify-between text-sm text-slate-500">
          <div>
            Hiển thị <span className="font-medium text-slate-700">{(page - 1) * pageSize + (customers.length > 0 ? 1 : 0)}</span> đến <span className="font-medium text-slate-700">{Math.min(page * pageSize, totalItems)}</span> trong <span className="font-medium text-slate-700">{totalItems}</span> kết quả
          </div>
          
          <div className="flex items-center gap-4">
            <span>Trang {page} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="material-symbols-outlined text-sm mr-1">chevron_left</span> Trước
              </button>
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}