import { useEffect, useState } from 'react';
import CustomerTable from '../../components/admin/CustomerTable';
import { getCustomers } from '../../services/adminCustomerService';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tier, setTier] = useState('');

  useEffect(() => {
    loadCustomers();
  }, [search, status, tier]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers({
        search,
        status,
        tier,
      });

      setCustomers(data.items || []);
    } catch (err) {
      console.error(err);
    }
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
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#070913] border border-white/10 rounded-lg px-3 py-2"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#070913] border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Active</option>
            <option value="LOCKED">Locked</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="bg-[#070913] border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="">Tất cả hạng</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
          </select>
        </div>

        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
