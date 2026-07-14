function Card({ title, value }) {
  return (
    <div className="report-stat-card">
      <span className="report-stat-label">{title}</span>
      <h3 className="report-stat-value">
        {value}
      </h3>
    </div>
  );
}

export default function LoyaltyStatsPanel({ stats }) {
  return (
    <div className="report-stats-grid">
      <Card
        title="Tổng điểm đang lưu hành"
        value={stats?.totalPoints?.toLocaleString() || "0"}
      />

      <Card
        title="Sắp hết hạn (≤ 30 ngày)"
        value={stats?.expiringSoon?.toLocaleString() || "0"}
      />

      <Card
        title="Đã hết hạn"
        value={stats?.expired?.toLocaleString() || "0"}
      />
    </div>
  );
}