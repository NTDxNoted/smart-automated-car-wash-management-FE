export default function PromoSummaryCards({ summary }) {
  const totalDiscount = summary?.totalDiscount ?? summary?.total_discount ?? 0;
  const totalRevenue = summary?.totalRevenue ?? summary?.total_revenue ?? 0;

  return (
    <div className="report-stats-grid">
      {/* Total Discount Given Card */}
      <div className="report-stat-card">
        <div className="flex items-center justify-between w-full">
          <span className="report-stat-label">Tổng tiền giảm giá đã áp dụng</span>
          <span className="text-xl">🏷️</span>
        </div>
        <h3 className="report-stat-value text-red-600">
          {totalDiscount.toLocaleString()} VNĐ
        </h3>
        <p className="text-xs text-slate-400 mt-1">Số tiền hệ thống đã giảm giá cho khách hàng</p>
      </div>

      {/* Total Revenue Generated Card */}
      <div className="report-stat-card">
        <div className="flex items-center justify-between w-full">
          <span className="report-stat-label">Tổng doanh thu mang lại</span>
          <span className="text-xl">💰</span>
        </div>
        <h3 className="report-stat-value text-emerald-600">
          {totalRevenue.toLocaleString()} VNĐ
        </h3>
        <p className="text-xs text-slate-400 mt-1">Doanh thu thu về từ các đơn đặt lịch áp dụng KM</p>
      </div>

      {/* ROI Ratio Card */}
      <div className="report-stat-card">
        <div className="flex items-center justify-between w-full">
          <span className="report-stat-label">Hiệu quả doanh thu / Chi phí (ROI)</span>
          <span className="text-xl">📈</span>
        </div>
        <h3 className="report-stat-value text-cyan-700">
          {totalDiscount > 0 ? (totalRevenue / totalDiscount).toFixed(2) : "0.00"}x
        </h3>
        <p className="text-xs text-slate-400 mt-1">Mỗi đồng giảm giá đem lại số lần doanh thu tương ứng</p>
      </div>
    </div>
  );
}
