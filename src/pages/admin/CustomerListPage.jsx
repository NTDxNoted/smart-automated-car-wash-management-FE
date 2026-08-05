import { useEffect, useState, useMemo } from 'react';
import Papa from 'papaparse';
import CustomerTable from '../../components/admin/CustomerTable';
import CustomerGrowthChart from '../../components/admin/CustomerGrowthChart';
import CustomerTypeRatioChart from '../../components/admin/CustomerTypeRatioChart';
import { getCustomers } from '../../services/adminCustomerService';
import './CustomerListPage.css';

const PAGE_SIZE = 10;

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;
const toIsoDate = (date) => date.toLocaleDateString('en-CA');
const isVipTier = (tier) => (tier || '').toUpperCase() === 'PLATINUM';

export default function CustomerListPage() {
  const [rawCustomers, setRawCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tier, setTier] = useState('');
  const [customerType, setCustomerType] = useState(''); // '', 'CUSTOMER', 'WALKIN'
  const [segment, setSegment] = useState(''); // '', 'NEW', 'RETURNING'
  const [vipOnly, setVipOnly] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers({ pageSize: 1000 });
      setRawCustomers(data.data || []);
    } catch (err) {
      console.error(err);
      setRawCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const allCustomers = useMemo(() => rawCustomers.map((c) => ({
    customerId: c.customerId,
    fullName: c.fullName || 'Khách hàng',
    phone: c.phone || '',
    tier: c.tier || 'Member',
    points: c.points ?? 0,
    totalSpending: Number(c.totalSpending || 0),
    isLocked: !!c.isLocked,
    suspendedUntil: c.suspendedUntil || null,
    status: c.status,
    createdAt: c.createdAt,
    isWalkIn: !!c.isWalkIn,
    bookingCount: c.bookingCount ?? 0,
    lastVisit: c.lastVisit || null,
    adminNotes: c.adminNotes || '',
  })), [rawCustomers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, tier, customerType, segment, vipOnly, startDate, endDate]);

  const filteredCustomers = useMemo(() => allCustomers.filter((customer) => {
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase().trim();
      const nameMatch = customer.fullName?.toLowerCase().includes(s);
      const phoneMatch = customer.phone?.includes(s);
      if (!nameMatch && !phoneMatch) return false;
    }

    if (status) {
      const isLocked = customer.isLocked || customer.status === 'LOCKED';
      const isSuspended = customer.status === 'SUSPENDED';
      if (status === 'LOCKED' && !isLocked) return false;
      if (status === 'ACTIVE' && (isLocked || isSuspended)) return false;
      if (status === 'SUSPENDED' && !isSuspended) return false;
    }

    if (tier && customer.tier?.toUpperCase() !== tier.toUpperCase()) return false;

    if (customerType === 'CUSTOMER' && customer.isWalkIn) return false;
    if (customerType === 'WALKIN' && !customer.isWalkIn) return false;

    if (segment === 'NEW' && customer.bookingCount > 1) return false;
    if (segment === 'RETURNING' && customer.bookingCount < 2) return false;

    if (vipOnly && !isVipTier(customer.tier)) return false;

    if (startDate || endDate) {
      if (!customer.createdAt) return false;
      const created = new Date(customer.createdAt);
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        if (created < s) return false;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        if (created > e) return false;
      }
    }

    return true;
  }), [allCustomers, debouncedSearch, status, tier, customerType, segment, vipOnly, startDate, endDate]);

  // Thống kê tổng quan — luôn tính trên TOÀN BỘ khách hàng (không phụ thuộc bộ lọc), để
  // "Tổng khách hàng = Tổng Customer + Tổng Khách vãng lai" luôn đúng và nhất quán.
  const overview = useMemo(() => {
    const today = new Date();
    const todayStr = toIsoDate(today);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    let totalCustomer = 0, totalWalkin = 0;
    let newCustomerToday = 0, newWalkinToday = 0;
    let newCustomerMonth = 0, newWalkinMonth = 0;

    allCustomers.forEach((c) => {
      const createdAt = c.createdAt ? new Date(c.createdAt) : null;
      const isToday = createdAt && toIsoDate(createdAt) === todayStr;
      const isThisMonth = createdAt && createdAt >= monthStart;

      if (c.isWalkIn) {
        totalWalkin++;
        if (isToday) newWalkinToday++;
        if (isThisMonth) newWalkinMonth++;
      } else {
        totalCustomer++;
        if (isToday) newCustomerToday++;
        if (isThisMonth) newCustomerMonth++;
      }
    });

    return {
      total: allCustomers.length,
      totalCustomer,
      totalWalkin,
      newCustomerToday,
      newWalkinToday,
      newCustomerMonth,
      newWalkinMonth,
    };
  }, [allCustomers]);

  const customerGroupStats = useMemo(() => {
    const registered = allCustomers.filter((c) => !c.isWalkIn);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const active = registered.filter((c) => c.lastVisit && new Date(c.lastVisit) >= thirtyDaysAgo).length;
    const inactive30 = registered.filter((c) => !c.lastVisit || new Date(c.lastVisit) < thirtyDaysAgo).length;
    const vip = registered.filter((c) => isVipTier(c.tier)).length;
    const topSpender = [...registered].sort((a, b) => b.totalSpending - a.totalSpending)[0];
    const topFrequency = [...registered].sort((a, b) => b.bookingCount - a.bookingCount)[0];

    return { total: registered.length, active, inactive30, vip, topSpender, topFrequency };
  }, [allCustomers]);

  const walkinGroupStats = useMemo(() => {
    const walkins = allCustomers.filter((c) => c.isWalkIn);
    const today = toIsoDate(new Date());
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const todayCount = walkins.filter((c) => c.createdAt && toIsoDate(new Date(c.createdAt)) === today).length;
    const monthCount = walkins.filter((c) => c.createdAt && new Date(c.createdAt) >= monthStart).length;
    const repeat = walkins.filter((c) => c.bookingCount >= 2).length;
    const topSpender = [...walkins].sort((a, b) => b.totalSpending - a.totalSpending)[0];

    return { total: walkins.length, today: todayCount, month: monthCount, repeat, topSpender };
  }, [allCustomers]);

  // Biểu đồ đăng ký theo ngày/tháng — bucket theo createdAt, tách Customer vs Khách vãng lai
  const growthChartData = useMemo(() => {
    if (allCustomers.length === 0) return [];

    const sorted = [...allCustomers].filter((c) => c.createdAt).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sorted.length === 0) return [];

    const earliest = new Date(sorted[0].createdAt);
    const now = new Date();
    const diffDays = Math.round((now - earliest) / (1000 * 60 * 60 * 24));
    const useMonth = diffDays > 45;

    const map = {};
    allCustomers.forEach((c) => {
      if (!c.createdAt) return;
      const d = new Date(c.createdAt);
      const key = useMonth
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        : toIsoDate(d);
      if (!map[key]) map[key] = { customer: 0, walkin: 0 };
      if (c.isWalkIn) map[key].walkin++;
      else map[key].customer++;
    });

    return Object.keys(map).sort().map((key) => {
      let label = key;
      if (useMonth) {
        const [y, m] = key.split('-');
        label = `${m}/${y}`;
      } else {
        const d = new Date(key);
        label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      }
      return { label, customer: map[key].customer, walkin: map[key].walkin };
    });
  }, [allCustomers]);

  const top10Spenders = useMemo(() =>
    [...allCustomers].sort((a, b) => b.totalSpending - a.totalSpending).slice(0, 10),
    [allCustomers]);

  const top10Frequency = useMemo(() =>
    [...allCustomers].sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 10),
    [allCustomers]);

  const maxSpending = Math.max(1, ...top10Spenders.map((c) => c.totalSpending));
  const maxFrequency = Math.max(1, ...top10Frequency.map((c) => c.bookingCount));

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const pagedCustomers = filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const rows = filteredCustomers.map((c) => ({
      'Mã KH': c.customerId,
      'Loại khách': c.isWalkIn ? 'Khách vãng lai' : 'Customer',
      'Họ tên': c.fullName,
      'SĐT': c.phone,
      'Hạng': c.tier,
      'Tổng lượt dùng': c.bookingCount,
      'Tổng chi tiêu (VNĐ)': c.totalSpending,
      'Dùng gần nhất': c.lastVisit ? new Date(c.lastVisit).toLocaleDateString('vi-VN') : '-',
      'Trạng thái': c.isLocked ? 'Bị khóa' : (c.status === 'SUSPENDED' ? 'Tạm đình chỉ' : 'Hoạt động'),
    }));
    const csv = "﻿" + Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'danh-sach-khach-hang.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSearchChange = (value) => setSearch(value);

  return (
    <div className="customer-page-container">
      <div className="customer-page-subtitle"></div>

      {/* 1. Thống kê tổng quan */}
      <div className="cust-overview-grid">
        <StatCard label="Tổng khách hàng" value={overview.total} accent />
        <StatCard label="Tổng Customer" value={overview.totalCustomer} />
        <StatCard label="Tổng Khách vãng lai" value={overview.totalWalkin} />
        <StatCard label="Customer mới hôm nay" value={overview.newCustomerToday} />
        <StatCard label="Khách vãng lai hôm nay" value={overview.newWalkinToday} />
        <StatCard label="Customer mới tháng này" value={overview.newCustomerMonth} />
        <StatCard label="Khách vãng lai tháng này" value={overview.newWalkinMonth} />
      </div>

      {/* 2. Phân loại khách hàng — 2 nhóm riêng biệt */}
      <div className="cust-group-grid">
        <div className="cust-group-card">
          <h3 className="cust-group-title">🟢 Customer (Có tài khoản)</h3>
          <div className="cust-group-stats">
            <GroupStat label="Tổng số Customer" value={customerGroupStats.total} />
            <GroupStat label="Đang hoạt động (30 ngày)" value={customerGroupStats.active} />
            <GroupStat label="Không quay lại > 30 ngày" value={customerGroupStats.inactive30} />
            <GroupStat label="Customer VIP" value={customerGroupStats.vip} />
          </div>
          <div className="cust-group-highlight">
            <span>Chi tiêu cao nhất: <b>{customerGroupStats.topSpender ? `${customerGroupStats.topSpender.fullName} (${formatVnd(customerGroupStats.topSpender.totalSpending)})` : '-'}</b></span>
            <span>Đặt lịch nhiều nhất: <b>{customerGroupStats.topFrequency ? `${customerGroupStats.topFrequency.fullName} (${customerGroupStats.topFrequency.bookingCount} lượt)` : '-'}</b></span>
          </div>
        </div>

        <div className="cust-group-card">
          <h3 className="cust-group-title">🟡 Khách vãng lai</h3>
          <div className="cust-group-stats">
            <GroupStat label="Tổng số khách vãng lai" value={walkinGroupStats.total} />
            <GroupStat label="Trong ngày" value={walkinGroupStats.today} />
            <GroupStat label="Trong tháng" value={walkinGroupStats.month} />
            <GroupStat label="Quay lại nhiều lần" value={walkinGroupStats.repeat} />
          </div>
          <div className="cust-group-highlight">
            <span>Chi tiêu cao nhất: <b>{walkinGroupStats.topSpender ? `${walkinGroupStats.topSpender.fullName} (${formatVnd(walkinGroupStats.topSpender.totalSpending)})` : '-'}</b></span>
          </div>
        </div>
      </div>

      {/* 5. Thống kê trực quan */}
      <div className="cust-charts-grid">
        <div className="cust-chart-card wide">
          <h3 className="cust-chart-title">Khách hàng đăng ký theo thời gian</h3>
          {growthChartData.length === 0 ? (
            <p className="cust-chart-empty">Chưa có dữ liệu</p>
          ) : (
            <CustomerGrowthChart data={growthChartData} />
          )}
        </div>

        <div className="cust-chart-card">
          <h3 className="cust-chart-title">Tỷ lệ Customer / Khách vãng lai</h3>
          <CustomerTypeRatioChart customerCount={overview.totalCustomer} walkinCount={overview.totalWalkin} />
        </div>

        <div className="cust-chart-card">
          <h3 className="cust-chart-title">Top 10 khách chi tiêu nhiều nhất</h3>
          {top10Spenders.length === 0 ? <p className="cust-chart-empty">Chưa có dữ liệu</p> : (
            <div className="cust-bar-list">
              {top10Spenders.map((c) => (
                <div key={c.customerId} className="cust-bar-row">
                  <span className="cust-bar-label">{c.fullName}</span>
                  <div className="cust-bar-track"><div className="cust-bar-fill" style={{ width: `${(c.totalSpending / maxSpending) * 100}%` }} /></div>
                  <span className="cust-bar-value">{formatVnd(c.totalSpending)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cust-chart-card">
          <h3 className="cust-chart-title">Top 10 khách dùng dịch vụ nhiều nhất</h3>
          {top10Frequency.length === 0 ? <p className="cust-chart-empty">Chưa có dữ liệu</p> : (
            <div className="cust-bar-list">
              {top10Frequency.map((c) => (
                <div key={c.customerId} className="cust-bar-row">
                  <span className="cust-bar-label">{c.fullName}</span>
                  <div className="cust-bar-track"><div className="cust-bar-fill amber" style={{ width: `${(c.bookingCount / maxFrequency) * 100}%` }} /></div>
                  <span className="cust-bar-value">{c.bookingCount} lượt</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3 & 4. Danh sách khách hàng + bộ lọc */}
      <div className="customer-data-panel">
        <div className="customer-panel-header">
          <div className="customer-panel-title">Quản lý khách hàng</div>

          <div className="customer-filters-row">
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

            <div className="customer-select-wrapper">
              <select value={customerType} onChange={(e) => setCustomerType(e.target.value)} className="customer-select">
                <option value="">Tất cả</option>
                <option value="CUSTOMER">Chỉ Customer</option>
                <option value="WALKIN">Chỉ Khách vãng lai</option>
              </select>
              <svg className="customer-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>

            <div className="customer-select-wrapper">
              <select value={segment} onChange={(e) => setSegment(e.target.value)} className="customer-select">
                <option value="">Mới / Quay lại</option>
                <option value="NEW">Khách mới</option>
                <option value="RETURNING">Khách quay lại</option>
              </select>
              <svg className="customer-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>

            <div className="customer-select-wrapper">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="customer-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động (Active)</option>
                <option value="LOCKED">Bị khóa (Locked)</option>
                <option value="SUSPENDED">Tạm đình chỉ (Suspended)</option>
              </select>
              <svg className="customer-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>

            <div className="customer-select-wrapper">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="customer-select"
              >
                <option value="">Tất cả hạng</option>
                <option value="Member">Hạng Member</option>
                <option value="Silver">Hạng Silver</option>
                <option value="Gold">Hạng Gold</option>
                <option value="Platinum">Hạng Platinum</option>
              </select>
              <svg className="customer-select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>

            <label className="customer-vip-checkbox">
              <input type="checkbox" checked={vipOnly} onChange={(e) => setVipOnly(e.target.checked)} />
              Chỉ VIP
            </label>

            <div className="customer-date-range">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="customer-date-input" />
              <span>đến</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="customer-date-input" />
            </div>

            <button type="button" className="customer-export-btn" onClick={exportCSV} disabled={filteredCustomers.length === 0}>
              Xuất CSV
            </button>
          </div>
        </div>

        <div className="customer-table-wrapper">
          {loading ? (
            <div className="py-12 text-center text-slate-500 w-full">
              <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
              <p className="text-sm font-medium">Đang tải danh sách khách hàng...</p>
            </div>
          ) : (
            <CustomerTable
              customers={pagedCustomers}
              onRefresh={loadCustomers}
              onToggleLock={(customerId, newLocked) => {
                setRawCustomers((prev) =>
                  prev.map((c) =>
                    c.customerId === customerId
                      ? { ...c, isLocked: newLocked, status: newLocked ? 'LOCKED' : 'ACTIVE' }
                      : c
                  )
                );
              }}
            />
          )}
        </div>

        <div className="customer-pagination-row">
          <div className="customer-pagination-info">
            Hiển thị {filteredCustomers.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} đến {Math.min(page * PAGE_SIZE, filteredCustomers.length)} trong {filteredCustomers.length} kết quả
          </div>
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
              Trang {page} / {totalPages}
            </div>
            <button
              type="button"
              disabled={page >= totalPages || loading}
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

function StatCard({ label, value, accent }) {
  return (
    <div className={`cust-stat-card ${accent ? 'accent' : ''}`}>
      <span className="cust-stat-label">{label}</span>
      <span className="cust-stat-value">{Number(value || 0).toLocaleString()}</span>
    </div>
  );
}

function GroupStat({ label, value }) {
  return (
    <div className="cust-group-stat-item">
      <span className="cust-group-stat-label">{label}</span>
      <span className="cust-group-stat-value">{Number(value || 0).toLocaleString()}</span>
    </div>
  );
}
