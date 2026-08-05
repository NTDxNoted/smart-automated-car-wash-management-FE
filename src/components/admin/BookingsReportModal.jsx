import { useState, useEffect, useMemo, useRef } from "react";
import Papa from "papaparse";
import adminBookingService from "../../services/adminBookingService";
import BookingDetailDrawer from "./BookingDetailDrawer";
import "./BookingsReportModal.css";

const PAGE_SIZE = 10;

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString("vi-VN")}đ`;

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString("vi-VN")}`;
};

const toIsoDate = (date) => date.toLocaleDateString("en-CA");

const computeDateRange = (dateRangeType, customStartDate, customEndDate) => {
  const today = new Date();

  if (dateRangeType === "today") {
    const iso = toIsoDate(today);
    return { startDate: iso, endDate: iso };
  }
  if (dateRangeType === "7days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }
  if (dateRangeType === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }
  if (dateRangeType === "quarter") {
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
    const start = new Date(today.getFullYear(), quarterStartMonth, 1);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }
  if (dateRangeType === "year") {
    const start = new Date(today.getFullYear(), 0, 1);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }
  // custom
  if (customStartDate && customEndDate) {
    return { startDate: customStartDate, endDate: customEndDate };
  }
  return null;
};

// Backend chỉ có 5 status thật (Pending/Completed/Failed/Cancelled/NoShow) — "Đang thực hiện"
// suy ra từ Pending đã check-in, giống logic LPR Queue ở DashboardPage.jsx.
const classifyStatus = (b) => {
  const s = (b.status || "").toUpperCase();
  if (s === "COMPLETED") return "COMPLETED";
  if (s === "CANCELLED" || s === "FAILED") return "CANCELLED";
  if (["NOSHOW", "NO-SHOW", "NO_SHOW"].includes(s)) return "NOSHOW";
  if (s === "PENDING") return b.checkInTime ? "PROCESSING" : "PENDING";
  return "PENDING";
};

const STATUS_LABELS = {
  COMPLETED: "Hoàn thành",
  PENDING: "Đang chờ xác nhận",
  PROCESSING: "Đang thực hiện",
  CANCELLED: "Đã hủy",
  NOSHOW: "No-show",
};

const STATUS_BADGE_CLASS = {
  COMPLETED: "completed",
  PENDING: "pending",
  PROCESSING: "processing",
  CANCELLED: "cancelled",
  NOSHOW: "noshow",
};

const paymentLabel = (method) => {
  const upper = (method || "").toUpperCase();
  if (upper === "CASH") return "Tiền mặt";
  if (upper === "TRANSFER") return "Chuyển khoản";
  return "Chưa thanh toán";
};

const formatBookingId = (id) => {
  if (!id) return "#AW-0000";
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, "");
  return `#AW-${(clean.length > 4 ? clean.slice(-4) : clean).toUpperCase()}`;
};

export default function BookingsReportModal({ open, onClose }) {
  const [dateRangeType, setDateRangeType] = useState("7days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("scheduledTime");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const requestIdRef = useRef(0);

  // Reset every filter when the modal transitions to open — adjusted during render (React's
  // documented pattern for "resetting state when a prop changes", see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // instead of an effect, so it happens before the first paint rather than after.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDateRangeType("7days");
      setCustomStartDate("");
      setCustomEndDate("");
      setStatusFilter("all");
      setServiceFilter("all");
      setPaymentFilter("all");
      setSearch("");
      setSortKey("scheduledTime");
      setSortDir("desc");
      setPage(1);
      setError("");
    }
  }

  useEffect(() => {
    if (!open) return;

    const requestId = ++requestIdRef.current;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await adminBookingService.getAll({ pageSize: 1000 });
        if (requestIdRef.current !== requestId) return;
        const list = res.data?.data || res.data || [];
        setRawData(list);
      } catch (err) {
        if (requestIdRef.current === requestId) {
          setError(err?.response?.data?.message || "Không thể tải dữ liệu booking");
        }
      } finally {
        if (requestIdRef.current === requestId) setLoading(false);
      }
    };

    load();
  }, [open]);

  const mappedData = useMemo(() => rawData.map((b) => ({
    id: b.bookingID ?? b.bookingId ?? b.id,
    customerName: b.customerName ?? b.phone ?? "Khách vãng lai",
    phone: b.phone ?? "",
    serviceName: b.serviceName ?? "Dịch vụ không xác định",
    scheduledTime: b.scheduledTime,
    completedAt: b.completedAt ?? null,
    checkInTime: b.checkInTime ?? b.checkinTime ?? null,
    status: b.status || "Pending",
    paymentMethod: b.paymentMethod ?? null,
    promotionApplied: b.promotionApplied ?? null,
    invoiceCode: b.invoiceCode ?? null,
    discountApplied: Number(b.discountApplied ?? 0),
    finalAmount: Number(b.finalAmount ?? b.totalPrice ?? 0),
  })), [rawData]);

  const dateFiltered = useMemo(() => {
    const range = computeDateRange(dateRangeType, customStartDate, customEndDate);
    if (!range) return [];
    const start = new Date(range.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(range.endDate);
    end.setHours(23, 59, 59, 999);
    return mappedData.filter((b) => {
      if (!b.scheduledTime) return false;
      const d = new Date(b.scheduledTime);
      return d >= start && d <= end;
    });
  }, [mappedData, dateRangeType, customStartDate, customEndDate]);

  const serviceOptions = useMemo(() => {
    const set = new Set(mappedData.map((b) => b.serviceName).filter(Boolean));
    return Array.from(set).sort();
  }, [mappedData]);

  const filteredData = useMemo(() => dateFiltered.filter((b) => {
    if (statusFilter !== "all" && classifyStatus(b) !== statusFilter) return false;
    if (serviceFilter !== "all" && b.serviceName !== serviceFilter) return false;
    if (paymentFilter !== "all") {
      const pm = (b.paymentMethod || "").toUpperCase();
      if (paymentFilter === "unpaid" && pm) return false;
      if (paymentFilter === "cash" && pm !== "CASH") return false;
      if (paymentFilter === "transfer" && pm !== "TRANSFER") return false;
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const haystack = `${b.customerName} ${b.phone} ${b.invoiceCode || ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }), [dateFiltered, statusFilter, serviceFilter, paymentFilter, search]);

  const summary = useMemo(() => {
    const counts = { total: filteredData.length, completed: 0, pending: 0, processing: 0, cancelled: 0, noshow: 0 };
    let revenue = 0, discount = 0, cash = 0, transfer = 0;
    filteredData.forEach((b) => {
      const cls = classifyStatus(b);
      if (cls === "COMPLETED") counts.completed++;
      else if (cls === "PENDING") counts.pending++;
      else if (cls === "PROCESSING") counts.processing++;
      else if (cls === "CANCELLED") counts.cancelled++;
      else if (cls === "NOSHOW") counts.noshow++;

      if (cls === "COMPLETED") {
        revenue += b.finalAmount;
        discount += b.discountApplied;
        const pm = (b.paymentMethod || "").toUpperCase();
        if (pm === "CASH") cash += b.finalAmount;
        else if (pm === "TRANSFER") transfer += b.finalAmount;
      }
    });
    return { ...counts, revenue, discount, cash, transfer };
  }, [filteredData]);

  const sortedData = useMemo(() => {
    const arr = [...filteredData];
    arr.sort((a, b) => {
      let av, bv;
      if (sortKey === "revenue") {
        av = a.finalAmount;
        bv = b.finalAmount;
      } else {
        av = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
        bv = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [filteredData, sortKey, sortDir]);

  // Same render-time reset pattern as above: jump back to page 1 whenever any filter changes.
  const filterSignature = `${statusFilter}|${serviceFilter}|${paymentFilter}|${search}|${dateRangeType}|${customStartDate}|${customEndDate}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
  const pagedData = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const exportCSV = () => {
    const rows = sortedData.map((b) => ({
      "Mã hóa đơn": b.invoiceCode || "-",
      "Mã booking": formatBookingId(b.id),
      "Khách hàng": b.customerName,
      "SĐT": b.phone,
      "Dịch vụ": b.serviceName,
      "Thời gian đặt": formatDateTime(b.scheduledTime),
      "Thời gian hoàn thành": formatDateTime(b.completedAt),
      "Trạng thái": STATUS_LABELS[classifyStatus(b)],
      "Thanh toán": paymentLabel(b.paymentMethod),
      "Khuyến mãi": b.promotionApplied || "-",
      "Thành tiền (VNĐ)": b.finalAmount,
    }));
    const csv = "﻿" + Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chi-tiet-booking-${dateRangeType}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="bkd-modal-overlay" onClick={onClose}>
      <div className="bkd-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="bkd-modal-header">
          <h2 className="bkd-modal-title">Chi tiết Bookings</h2>
          <button type="button" className="bkd-modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <div className="bkd-modal-sticky-top">
          <div className="bkd-modal-filters">
            <div className="bkd-filter-group">
              <label className="bkd-filter-label">Thời gian</label>
              <select value={dateRangeType} onChange={(e) => setDateRangeType(e.target.value)} className="bkd-select">
                <option value="today">Hôm nay</option>
                <option value="7days">7 ngày gần đây</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chọn</option>
              </select>
            </div>

            {dateRangeType === "custom" && (
              <div className="bkd-custom-dates">
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="bkd-date-input" />
                <span className="bkd-date-divider">đến</span>
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="bkd-date-input" />
              </div>
            )}

            <div className="bkd-filter-group">
              <label className="bkd-filter-label">Trạng thái</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bkd-select">
                <option value="all">Tất cả</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="PENDING">Đang chờ xác nhận</option>
                <option value="PROCESSING">Đang thực hiện</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="NOSHOW">No-show</option>
              </select>
            </div>

            <div className="bkd-filter-group">
              <label className="bkd-filter-label">Dịch vụ</label>
              <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="bkd-select">
                <option value="all">Tất cả</option>
                {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="bkd-filter-group">
              <label className="bkd-filter-label">Thanh toán</label>
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="bkd-select">
                <option value="all">Tất cả</option>
                <option value="cash">Tiền mặt</option>
                <option value="transfer">Chuyển khoản</option>
                <option value="unpaid">Chưa thanh toán</option>
              </select>
            </div>

            <div className="bkd-filter-group bkd-search-group">
              <label className="bkd-filter-label">Tìm kiếm</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên khách, SĐT hoặc mã hóa đơn..."
                className="bkd-search-input"
              />
            </div>

            <button type="button" className="bkd-export-btn" onClick={exportCSV} disabled={sortedData.length === 0}>
              Xuất CSV
            </button>
          </div>

          {!error && (
            <div className="bkd-summary-bar">
              <div className="bkd-summary-item"><span className="bkd-summary-label">Tổng số</span><span className="bkd-summary-value">{summary.total}</span></div>
              <div className="bkd-summary-item"><span className="bkd-summary-label">Hoàn thành</span><span className="bkd-summary-value ok">{summary.completed}</span></div>
              <div className="bkd-summary-item"><span className="bkd-summary-label">Chờ xác nhận</span><span className="bkd-summary-value">{summary.pending}</span></div>
              <div className="bkd-summary-item"><span className="bkd-summary-label">Đang thực hiện</span><span className="bkd-summary-value">{summary.processing}</span></div>
              <div className="bkd-summary-item"><span className="bkd-summary-label">Đã hủy</span><span className="bkd-summary-value danger">{summary.cancelled}</span></div>
              <div className="bkd-summary-item"><span className="bkd-summary-label">No-show</span><span className="bkd-summary-value danger">{summary.noshow}</span></div>
            </div>
          )}
        </div>

        <div className="bkd-modal-body">
          {loading ? (
            <div className="bkd-loading"><div className="bkd-spinner"></div><p>Đang tải dữ liệu booking...</p></div>
          ) : error ? (
            <div className="bkd-error">{error}</div>
          ) : (
            <>
              <div className="bkd-table-wrapper">
                <table className="bkd-table">
                  <thead>
                    <tr>
                      <th>Mã hóa đơn</th>
                      <th>Mã booking</th>
                      <th>Khách hàng</th>
                      <th>SĐT</th>
                      <th>Dịch vụ</th>
                      <th onClick={() => handleSort("scheduledTime")} className="bkd-th-sortable">
                        Thời gian đặt {sortKey === "scheduledTime" && (sortDir === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Thời gian hoàn thành</th>
                      <th>Trạng thái</th>
                      <th>Thanh toán</th>
                      <th>Khuyến mãi</th>
                      <th onClick={() => handleSort("revenue")} className="bkd-th-sortable">
                        Thành tiền {sortKey === "revenue" && (sortDir === "asc" ? "▲" : "▼")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedData.length === 0 ? (
                      <tr><td colSpan={11} className="bkd-table-empty">Không có booking nào trong khoảng thời gian/bộ lọc đã chọn</td></tr>
                    ) : pagedData.map((b) => {
                      const cls = classifyStatus(b);
                      return (
                        <tr key={b.id} className="bkd-table-row" onClick={() => setSelectedBooking({ id: b.id })}>
                          <td>{b.invoiceCode || "-"}</td>
                          <td>{formatBookingId(b.id)}</td>
                          <td>{b.customerName}</td>
                          <td>{b.phone}</td>
                          <td>{b.serviceName}</td>
                          <td>{formatDateTime(b.scheduledTime)}</td>
                          <td>{formatDateTime(b.completedAt)}</td>
                          <td><span className={`bkd-badge ${STATUS_BADGE_CLASS[cls]}`}>{STATUS_LABELS[cls]}</span></td>
                          <td>{paymentLabel(b.paymentMethod)}</td>
                          <td>{b.promotionApplied || "-"}</td>
                          <td className="bkd-table-amount">{formatVnd(b.finalAmount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bkd-pagination-row">
                <div className="bkd-pagination-info">
                  Hiển thị {sortedData.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} đến {Math.min(page * PAGE_SIZE, sortedData.length)} trong {sortedData.length} kết quả
                </div>
                <div className="bkd-pagination-nav">
                  <span className="bkd-pagination-label">Trang {page} / {totalPages}</span>
                  <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))} className="bkd-pagination-btn">Trước</button>
                  <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="bkd-pagination-btn">Sau</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* stopPropagation: BookingDetailDrawer clicking its own backdrop calls onClose without
          stopping propagation — without this wrapper that click would bubble up and close this
          modal too (Drawer is normally mounted at page root, not nested in another overlay). */}
      <div onClick={(e) => e.stopPropagation()}>
        <BookingDetailDrawer
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onRefresh={() => setSelectedBooking(null)}
        />
      </div>
    </div>
  );
}
