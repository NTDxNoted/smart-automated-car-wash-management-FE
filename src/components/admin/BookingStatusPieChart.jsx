import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function BookingStatusPieChart({ data }) {
  const grouped = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let cancelled = 0;

    if (data && data.length > 0) {
      data.forEach(item => {
        const name = item.name?.toUpperCase() || "";
        if (name === "COMPLETED") completed += item.value;
        else if (name === "PENDING") pending += item.value;
        else if (["CANCELLED", "FAILED", "NO-SHOW", "NOSHOW"].includes(name)) cancelled += item.value;
        else pending += item.value;
      });
    }

    const total = completed + pending + cancelled;

    return {
      total,
      completed,
      pending,
      cancelled,
      chartItems: [
        { name: "Hoàn thành", value: completed, color: "#14B8A6" },
        { name: "Chờ xác nhận", value: pending, color: "#FBBF24" },
        { name: "Đã hủy", value: cancelled, color: "#FB7185" },
      ].filter(x => x.value > 0)
    };
  }, [data]);

  const legends = [
    { name: "Hoàn thành", value: grouped.completed, percent: grouped.total > 0 ? (grouped.completed / grouped.total) * 100 : 0, color: "#14B8A6", textPercentColor: "#0D9488" },
    { name: "Chờ xác nhận", value: grouped.pending, percent: grouped.total > 0 ? (grouped.pending / grouped.total) * 100 : 0, color: "#FBBF24", textPercentColor: "#D97706" },
    { name: "Đã hủy", value: grouped.cancelled, percent: grouped.total > 0 ? (grouped.cancelled / grouped.total) * 100 : 0, color: "#FB7185", textPercentColor: "#E11D48" },
  ];

  return (
    <div className="report-chart-card booking-status-card">
      <div className="booking-status-header">
        <div className="booking-status-title-container">
          <h3 className="booking-status-title">Trạng thái đặt lịch</h3>
          <span className="booking-status-subtitle">Phân bổ dữ liệu theo trạng thái đơn</span>
        </div>
      </div>

      <div className="booking-status-body">
        {/* Left Side: Doughnut Chart */}
        <div className="booking-status-chart-container">
          {grouped.total > 0 ? (
            <>
              <PieChart width={224} height={224}>
                <Pie
                  data={grouped.chartItems}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={4}
                  cornerRadius={6}
                  dataKey="value"
                >
                  {grouped.chartItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #BCC8CE',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </PieChart>
              <div className="booking-status-total-overlay">
                <span className="booking-status-total-label">TỔNG CỘNG</span>
                <h4 className="booking-status-total-value">{grouped.total}</h4>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-full text-slate-400">
              <span className="text-2xl font-bold">0</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Đơn hàng</span>
            </div>
          )}
        </div>

        {/* Right Side: Enhanced Legends */}
        <div className="booking-status-legend-container">
          {legends.map((item, index) => (
            <div key={index} className="booking-status-legend-item">
              <div className="booking-status-legend-left">
                <span className="booking-status-legend-dot" style={{ backgroundColor: item.color }} />
                <span className="booking-status-legend-name">{item.name}</span>
              </div>
              <div className="booking-status-legend-right">
                <span className="booking-status-legend-count">{item.value}</span>
                <span className="booking-status-legend-percent" style={{ color: item.textPercentColor }}>
                  {item.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}