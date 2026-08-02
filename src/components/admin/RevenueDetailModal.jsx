import { useEffect, useState } from "react";
import { getRevenueDetail } from "../../services/adminReportService";
import "./RevenueDetailModal.css";

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

// Số âm chỉ hiển thị dấu "-" khi thực sự có giảm giá (>0) — tránh hiện "-0đ" khi không có khuyến mãi nào.
const formatDiscount = (value) => (value > 0 ? `-${formatVnd(value)}` : formatVnd(0));

const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${d.toLocaleDateString('vi-VN')}`;
};

const toIsoDate = (date) => date.toLocaleDateString('en-CA');

const computeDateRange = (dateRangeType, customStartDate, customEndDate) => {
  const today = new Date();

  if (dateRangeType === 'today') {
    const iso = toIsoDate(today);
    return { startDate: iso, endDate: iso };
  }

  if (dateRangeType === '7days') {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }

  if (dateRangeType === '30days') {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }

  if (dateRangeType === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
  }

  // custom
  if (customStartDate && customEndDate) {
    return { startDate: customStartDate, endDate: customEndDate };
  }
  return null;
};

const paymentMethodLabel = (method) => {
  const upper = (method || '').toUpperCase();
  if (upper === 'CASH') return 'Tiền mặt';
  if (upper === 'TRANSFER') return 'Chuyển khoản';
  return method || '';
};

export default function RevenueDetailModal({ open, onClose, initialDateRangeType = 'today' }) {
  const [dateRangeType, setDateRangeType] = useState(initialDateRangeType);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    const range = computeDateRange(dateRangeType, customStartDate, customEndDate);
    if (!range) return;

    const controller = new AbortController();
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getRevenueDetail(range.startDate, range.endDate, paymentMethod, { signal: controller.signal });
        if (isMounted) setData(result);
      } catch (err) {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError' && isMounted) {
          setError(err.response?.data?.message || 'Không thể tải dữ liệu doanh thu');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [open, dateRangeType, customStartDate, customEndDate, paymentMethod]);

  useEffect(() => {
    if (open) {
      setDateRangeType(initialDateRangeType);
      setCustomStartDate('');
      setCustomEndDate('');
      setPaymentMethod('all');
      setData(null);
      setError('');
    }
  }, [open, initialDateRangeType]);

  if (!open) return null;

  const transactions = data?.transactions ?? [];

  return (
    <div className="revenue-modal-overlay" onClick={onClose}>
      <div className="revenue-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="revenue-modal-header">
          <h2 className="revenue-modal-title">Chi tiết doanh thu</h2>
          <button type="button" className="revenue-modal-close-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Sticky: bộ lọc + thống kê tóm tắt — luôn hiển thị, không cuộn */}
        <div className="revenue-modal-sticky-top">
          <div className="revenue-modal-filters">
            <div className="revenue-modal-filter-group">
              <label className="revenue-modal-filter-label">Thời gian</label>
              <div className="revenue-modal-select-wrapper">
                <select
                  value={dateRangeType}
                  onChange={(e) => setDateRangeType(e.target.value)}
                  className="revenue-modal-select"
                >
                  <option value="today">Hôm nay</option>
                  <option value="7days">7 ngày</option>
                  <option value="30days">30 ngày</option>
                  <option value="month">Tháng này</option>
                  <option value="custom">Tùy chọn ngày</option>
                </select>
              </div>
            </div>

            {dateRangeType === 'custom' && (
              <div className="revenue-modal-custom-dates">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="revenue-modal-date-input"
                />
                <span className="revenue-modal-date-divider">đến</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="revenue-modal-date-input"
                />
              </div>
            )}

            <div className="revenue-modal-filter-group">
              <label className="revenue-modal-filter-label">Thanh toán</label>
              <div className="revenue-modal-select-wrapper">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="revenue-modal-select"
                >
                  <option value="all">Tất cả</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                </select>
              </div>
            </div>
          </div>

          {data && !error && (
            <div className="revenue-summary-bar">
              <div className="revenue-summary-item">
                <span className="revenue-summary-item-label">💰 Doanh thu gốc</span>
                <span className="revenue-summary-item-value">{formatVnd(data.grossRevenue)}</span>
              </div>
              <div className="revenue-summary-item discount">
                <span className="revenue-summary-item-label">🎁 Khuyến mãi</span>
                <span className="revenue-summary-item-value">{formatDiscount(data.totalDiscount)}</span>
              </div>
              <div className="revenue-summary-item">
                <span className="revenue-summary-item-label">💵 Tiền mặt</span>
                <span className="revenue-summary-item-value">{formatVnd(data.cashRevenue)}</span>
              </div>
              <div className="revenue-summary-item">
                <span className="revenue-summary-item-label">🏦 Chuyển khoản</span>
                <span className="revenue-summary-item-value">{formatVnd(data.transferRevenue)}</span>
              </div>
              <div className="revenue-summary-item net">
                <span className="revenue-summary-item-label">Thực nhận</span>
                <span className="revenue-summary-item-value">{formatVnd(data.netRevenue)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Vùng bảng — chiếm phần chiều cao còn lại, chỉ phần này cuộn */}
        <div className="revenue-modal-table-section">
          {loading ? (
            <div className="revenue-modal-loading">
              <div className="revenue-modal-spinner"></div>
              <p>Đang tải dữ liệu doanh thu...</p>
            </div>
          ) : error ? (
            <div className="revenue-modal-error">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="revenue-modal-empty">Không có doanh thu trong khoảng thời gian này</div>
          ) : (
            <div className="revenue-modal-table-wrapper">
              <table className="revenue-modal-table">
                <thead>
                  <tr>
                    <th>Mã hóa đơn</th>
                    <th>Khách hàng</th>
                    <th>Dịch vụ</th>
                    <th>Phương thức</th>
                    <th>Khuyến mãi</th>
                    <th>Số tiền</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.invoiceCode}>
                      <td>{tx.invoiceCode}</td>
                      <td>{tx.customerName}</td>
                      <td>{tx.serviceName}</td>
                      <td>{paymentMethodLabel(tx.paymentMethod)}</td>
                      <td>
                        <span className={tx.discountAmount > 0 ? "revenue-modal-table-discount" : "revenue-modal-table-discount none"}>
                          {formatDiscount(tx.discountAmount)}
                        </span>
                        {tx.promotionApplied && (
                          <span className="revenue-modal-table-promo-name">{tx.promotionApplied}</span>
                        )}
                      </td>
                      <td className="revenue-modal-table-amount">{formatVnd(tx.amount)}</td>
                      <td>{formatDateTime(tx.paidAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
