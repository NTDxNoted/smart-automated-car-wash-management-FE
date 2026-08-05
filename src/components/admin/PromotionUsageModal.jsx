import { useEffect, useState } from "react";
import adminPromotionService from "../../services/adminPromotionService";
import "./PromotionUsageModal.css";

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString("vi-VN")}đ`;

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
};

// Backend returns a plain "yyyy-MM-dd" string for the stats window — parse it as-is instead of
// through `new Date()` to avoid UTC-shift-by-a-day bugs.
const formatDateVn = (isoDate) => {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

export default function PromotionUsageModal({ open, onClose, promotion }) {
  const [detail, setDetail] = useState(null);
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
        const d = res.data?.data || res.data || {};
        setDetail({
          rangeStart: d.rangeStart ?? d.RangeStart ?? "",
          rangeEnd: d.rangeEnd ?? d.RangeEnd ?? "",
          totalUsageCount: Number(d.totalUsageCount ?? d.TotalUsageCount ?? 0),
          usages: (d.usages ?? d.Usages ?? []).map((item) => ({
            bookingId: item.bookingId ?? item.BookingId,
            customerName: item.customerName ?? item.CustomerName ?? "Khách vãng lai",
            phone: item.phone ?? item.Phone ?? "",
            usedAt: item.usedAt ?? item.UsedAt,
            discountAmountActual: Number(item.discountAmountActual ?? item.DiscountAmountActual ?? 0),
          })),
        });
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || "Không thể tải chi tiết khuyến mãi.");
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [open, promotion]);

  if (!open) return null;

  return (
    <div className="pum-modal-overlay" onClick={onClose}>
      <div className="pum-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="pum-modal-header">
          <h2 className="pum-modal-title">Chi tiết sử dụng: {promotion?.title}</h2>
          <button type="button" className="pum-modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <div className="pum-modal-body">
          {loading || (!detail && !error) ? (
            <div className="pum-loading">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="pum-error">{error}</div>
          ) : (
            <>
              <div className="pum-range-label">
                Thời gian thống kê: {formatDateVn(detail.rangeStart)} → {formatDateVn(detail.rangeEnd)}
              </div>

              <div className="pum-total-usage-card">
                <span className="pum-total-usage-label">Tổng số lượt sử dụng</span>
                <span className="pum-total-usage-value">{detail.totalUsageCount}</span>
              </div>

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
                    {detail.usages.length === 0 ? (
                      <tr><td colSpan={5} className="pum-table-empty">Không có dữ liệu trong 12 tháng gần nhất.</td></tr>
                    ) : detail.usages.map((u) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
