import { useEffect, useState } from 'react';
import CustomerTable from '../../components/admin/CustomerTable';
import { getCustomers } from '../../services/adminCustomerService';
import './CustomerListPage.css';

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

  const filteredCustomers = customers.filter((customer) => {
    // 1. Search filter: matches name or phone (case-insensitive)
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase().trim();
      const nameMatch = customer.fullName?.toLowerCase().includes(s);
      const phoneMatch = customer.phone?.includes(s);
      if (!nameMatch && !phoneMatch) return false;
    }
    // 2. Status filter
    if (status) {
      const isLocked = customer.isLocked || customer.status === 'LOCKED';
      const isSuspended = customer.status === 'SUSPENDED';
      if (status === 'LOCKED' && !isLocked) return false;
      if (status === 'ACTIVE' && (isLocked || isSuspended)) return false;
      if (status === 'SUSPENDED' && !isSuspended) return false;
    }
    // 3. Tier filter
    if (tier) {
      if (customer.tier?.toUpperCase() !== tier.toUpperCase()) return false;
    }
    return true;
  });

  return (
    <div className="customer-page-container">
      <div className="customer-page-subtitle"></div>
      {/* CustomerDataPanel */}
      <div className="customer-data-panel">

        {/* HorizontalBorder (Header + Filters) */}
        <div className="customer-panel-header">
          <div className="customer-panel-title">Quản lý khách hàng</div>

          {/* Filters Row */}
          <div className="customer-filters-row">
            {/* Search Input */}
            <div className="customer-search-input-wrapper">
              <input
                placeholder="Tên hoặc SĐT"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="customer-search-input"
              />
              <svg className="customer-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Status Select */}
            <div className="customer-select-wrapper">
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="customer-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động (Active)</option>
                <option value="LOCKED">Bị khóa (Locked)</option>
                <option value="SUSPENDED">Tạm đình chỉ (Suspended)</option>
              </select>
              <svg className="customer-select-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Tier Select */}
            <div className="customer-select-wrapper">
              <select
                value={tier}
                onChange={(e) => handleTierChange(e.target.value)}
                className="customer-select"
              >
                <option value="">Tất cả hạng</option>
                <option value="Member">Hạng Member</option>
                <option value="Silver">Hạng Silver</option>
                <option value="Gold">Hạng Gold</option>
                <option value="Platinum">Hạng Platinum</option>
              </select>
              <svg className="customer-select-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* DataTable Table */}
        <div className="customer-table-wrapper">
          {loading ? (
            <div className="py-12 text-center text-slate-500 w-full">
              <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
              <p className="text-sm font-medium">Đang tải danh sách khách hàng...</p>
            </div>
          ) : (
            <CustomerTable
              customers={filteredCustomers}
              onRefresh={loadCustomers}
              onToggleLock={(customerId, newLocked) => {
                setCustomers((prev) =>
                  prev.map((c) =>
                    c.customerId === customerId
                      ? {
                          ...c,
                          isLocked: newLocked,
                          status: newLocked ? "LOCKED" : "ACTIVE",
                        }
                      : c
                  )
                );
              }}
            />
          )}
        </div>

        {/* Pagination Panel */}
        <div className="customer-pagination-row">
          <div className="customer-pagination-nav">
            <button
              type="button"
              disabled={page === 1 || loading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="customer-page-btn"
            >
              Trước
            </button>
            <div className="customer-page-indicator">
              Trang {page}
            </div>
            <button
              type="button"
              disabled={customers.length === 0 || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="customer-page-btn next"
            >
              Sau
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}