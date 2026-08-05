import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import SafeChartContainer from "../common/SafeChartContainer";
import adminPromotionService from "../../services/adminPromotionService";
import "./PromotionUsageModal.css";

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString("vi-VN")}đ`;

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
};

// Backend returns plain "yyyy-MM-dd" / "yyyy-MM" strings for the stats window and chart
// buckets — parse them as-is instead of through `new Date()` to avoid UTC-shift-by-a-day bugs.
const formatDateVn = (isoDate) => {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const formatMonthLabel = (yyyyMm) => {
  const [year, month] = yyyyMm.split("-");
  return `${month}/${year}`;
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
          totalDiscountAmount: Number(d.totalDiscountAmount ?? d.TotalDiscountAmount ?? 0),
          totalRevenueGenerated: Number(d.totalRevenueGenerated ?? d.TotalRevenueGenerated ?? 0),
          uniqueCustomerCount: Number(d.uniqueCustomerCount ?? d.UniqueCustomerCount ?? 0),
          effectivenessPercentage: Number(d.effectivenessPercentage ?? d.EffectivenessPercentage ?? 0),
          monthlyStats: (d.monthlyStats ?? d.MonthlyStats ?? []).map((m) => ({
            month: m.month ?? m.Month,
            usageCount: Number(m.usageCount ?? m.UsageCount ?? 0),
            revenue: Number(m.revenue ?? m.Revenue ?? 0),
            discount: Number(m.discount ?? m.Discount ?? 0),
          })),
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

  const hasUsage = !!detail && detail.totalUsageCount > 0;

  return (
    <div className="pum-modal-overlay" onClick={onClose}>
      <div className="pum-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="pum-modal-header">
          <h2 className="pum-modal-title">Chi tiết sử dụng: {promotion?.title}</h2>
          <button type="button" className="pum-modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        <div className="pum-modal-body">
          {loading ? (
            <div className="pum-loading">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="pum-error">{error}</div>
          ) : (
            <>
              <div className="pum-range-label">
                Thời gian thống kê: {formatDateVn(detail.rangeStart)} → {formatDateVn(detail.rangeEnd)}
              </div>

              <div className="pum-summary-bar">
                <div className="pum-summary-item">
                  <span className="pum-summary-label">Tổng số lượt sử dụng</span>
                  <span className="pum-summary-value">{detail.totalUsageCount}</span>
                </div>
                <div className="pum-summary-item">
                  <span className="pum-summary-label">Tổng số tiền đã giảm</span>
                  <span className="pum-summary-value danger">{formatVnd(detail.totalDiscountAmount)}</span>
                </div>
                <div className="pum-summary-item">
                  <span className="pum-summary-label">Tổng doanh thu tạo ra</span>
                  <span className="pum-summary-value net">{formatVnd(detail.totalRevenueGenerated)}</span>
                </div>
                <div className="pum-summary-item">
                  <span className="pum-summary-label">Khách hàng đã sử dụng</span>
                  <span className="pum-summary-value">{detail.uniqueCustomerCount}</span>
                </div>
                <div className="pum-summary-item">
                  <span className="pum-summary-label">Hiệu quả khuyến mãi</span>
                  <span className={`pum-summary-value ${detail.effectivenessPercentage >= 0 ? "ok" : "danger"}`}>
                    {detail.effectivenessPercentage.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%
                  </span>
                </div>
              </div>

              {!hasUsage ? (
                <div className="pum-empty">Không có dữ liệu trong 12 tháng gần nhất.</div>
              ) : (
                <>
                  <div className="pum-chart-card">
                    <h4 className="pum-chart-title">Doanh thu theo tháng</h4>
                    <SafeChartContainer aspect={2.6}>
                      {(width, height) => (
                        <BarChart
                          width={width}
                          height={height}
                          data={detail.monthlyStats.map((m) => ({ ...m, label: formatMonthLabel(m.month) }))}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" tickLine={false} width={40} />
                          <Tooltip
                            formatter={(value) => formatVnd(value)}
                            labelFormatter={(label) => `Tháng ${label}`}
                            contentStyle={{
                              background: '#FFFFFF',
                              border: '1px solid #BCC8CE',
                              borderRadius: '8px',
                              boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                              fontSize: '12px',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          />
                          <Bar dataKey="revenue" name="Doanh thu" fill="#00677F" radius={[4, 4, 0, 0]} maxBarSize={36} />
                        </BarChart>
                      )}
                    </SafeChartContainer>
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
                        {detail.usages.map((u) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
