import { useEffect, useState } from "react";
import adminPromotionService from "../../services/adminPromotionService";
import "./PromotionUsageModal.css";

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString("vi-VN")}đ`;

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
};

export default function PromotionUsageModal({ open, onClose, promotion }) {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !promotion) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await adminPromotionService.getPromoUsage(promotion.id);
        if (cancelled) return;
        const rawList = res.data?.data || res.data || [];
        setUsages(rawList.map((item) => ({
          bookingId: item.bookingId ?? item.BookingId,
          customerName: item.customerName ?? item.CustomerName ?? "Khách vãng lai",
          phone: item.phone ?? item.Phone ?? "",
          usedAt: item.usedAt ?? item.UsedAt,
          discountAmountActual: Number(item.discountAmountActual ?? item.DiscountAmountActual ?? 0),
        })));
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || "Không thể tải danh sách sử dụng khuyến mãi.");
          setUsages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [open, promotion]);

  if (!open) return null;

  const totalDiscount = usages.reduce((sum, u) => sum + u.discountAmountActual, 0);

  return (
    <div className="pum-modal-overlay" onClick={onClose}>
      <div className="pum-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="pum-modal-header">
          <h2 className="pum-modal-title">Chi tiết sử dụng: {promotion?.title}</h2>
          <button type="button" className="pum-modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <div className="pum-modal-body">
          {!loading && !error && (
            <div className="pum-summary-bar">
              <div className="pum-summary-item">
                <span className="pum-summary-label">Số lượt sử dụng</span>
                <span className="pum-summary-value">{usages.length}</span>
              </div>
              <div className="pum-summary-item">
                <span className="pum-summary-label">Tổng số tiền đã giảm</span>
                <span className="pum-summary-value">{formatVnd(totalDiscount)}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="pum-loading">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="pum-error">{error}</div>
          ) : usages.length === 0 ? (
            <div className="pum-empty">Khuyến mãi này chưa được sử dụng lần nào.</div>
          ) : (
            <div className="pum-table-wrapper">
              <table className="pum-table">
                <thead>
                  <tr>
                    <th>Mã booking</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Thời gian sử dụng</th>
                    <th>Số tiền giảm</th>
                  </tr>
                </thead>
                <tbody>
                  {usages.map((u) => (
                    <tr key={u.bookingId}>
                      <td>#{u.bookingId}</td>
                      <td>{u.customerName}</td>
                      <td>{u.phone}</td>
                      <td>{formatDateTime(u.usedAt)}</td>
                      <td className="pum-table-amount">{formatVnd(u.discountAmountActual)}</td>
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
