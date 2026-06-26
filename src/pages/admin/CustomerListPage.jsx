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

      setCustomers(data.items || []);
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
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
        <h2 className="text-xl font-bold mb-4">
          Quản lý khách hàng
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <input
            placeholder="Tên hoặc SĐT"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-[#070913] border border-white/10 rounded-lg px-3 py-2"
          />

          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#070913] border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Active</option>
            <option value="LOCKED">Locked</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            value={tier}
            onChange={(e) => handleTierChange(e.target.value)}
            className="bg-[#070913] border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="">Tất cả hạng</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
          </select>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-400">
            Đang tải danh sách khách hàng...
          </div>
        ) : (
          <CustomerTable customers={customers} />
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-2 rounded-lg bg-[#070913] border border-white/10 disabled:opacity-50"
          >
            Trước
          </button>

          <span className="px-3 py-2 text-slate-300">
            Trang {page}
          </span>

          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-2 rounded-lg bg-[#070913] border border-white/10"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}