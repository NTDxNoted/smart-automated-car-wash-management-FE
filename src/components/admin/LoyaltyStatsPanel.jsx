import { useMemo } from "react";

const fallbackCustomers = [
  { customer: "Nguyễn Văn An", tier: "Gold Member", points: 2450 },
  { customer: "Trần Thị Bích", tier: "Platinum Member", points: 1890 },
  { customer: "Lê Hoàng Nam", tier: "Silver Member", points: 1420 },
  { customer: "Phạm Minh Đức", tier: "Silver Member", points: 980 }
];

const formatTier = (tier) => {
  const t = String(tier || "").toUpperCase();
  if (t === "GOLD") return "Gold Member";
  if (t === "SILVER") return "Silver Member";
  if (t === "PLATINUM") return "Platinum Member";
  return "Member";
};

export default function LoyaltyStatsPanel({ stats, customers }) {
  // Sort real customers or fallback to the CSS spec mock list
  const topCustomers = useMemo(() => {
    if (!customers || customers.length === 0) {
      return fallbackCustomers;
    }
    const sorted = [...customers]
      .filter(c => (c.points || 0) > 0)
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 4);

    return sorted.length > 0 ? sorted.map(c => ({
      customer: c.customer,
      tier: formatTier(c.tier),
      points: c.points
    })) : fallbackCustomers;
  }, [customers]);

  // Calculate dynamic progress bars
  const total = (stats?.totalPoints || 0) + (stats?.expired || 0) + (stats?.expiringSoon || 0);
  const activePercent = total > 0 ? Math.round(((stats?.totalPoints || 0) / total) * 100) : 75;
  const expiredPercent = total > 0 ? Math.round(((stats?.expired || 0) / total) * 100) : 25;

  return (
    <div className="loyalty-analytics-grid">
      
      {/* 3 Metric Cards Row */}
      <div className="loyalty-cards-row">
        
        {/* Card 1: Tổng điểm đang lưu hành */}
        <div className="loyalty-metric-card">
          <div className="loyalty-card-overlay-circle circle-blue"></div>
          <div className="loyalty-card-content">
            <div className="loyalty-card-row1">
              <div className="loyalty-card-icon-overlay bg-blue-tint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0050CB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M16 11h6" />
                  <rect x="16" y="9" width="6" height="4" rx="1" />
                </svg>
              </div>
            </div>
            
            <div className="loyalty-card-label-wrapper">
              <span className="loyalty-card-label">Tổng điểm đang lưu hành</span>
            </div>

            <div className="loyalty-card-value-wrapper">
              <h3 className="loyalty-card-value">
                {stats?.totalPoints?.toLocaleString() || "10,908"} <span className="loyalty-card-unit">pts</span>
              </h3>
            </div>

            <div className="loyalty-progress-container">
              <div 
                className="loyalty-progress-filler bg-green"
                style={{ width: `${activePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Sắp hết hạn (≤ 30 ngày) */}
        <div className="loyalty-metric-card">
          <div className="loyalty-card-overlay-circle circle-red"></div>
          <div className="loyalty-card-content">
            <div className="loyalty-card-row1">
              <div className="loyalty-card-icon-overlay bg-orange-tint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DB691A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="10" y1="14" x2="14" y2="18" />
                  <line x1="14" y1="14" x2="10" y2="18" />
                </svg>
              </div>
            </div>

            <div className="loyalty-card-label-wrapper">
              <span className="loyalty-card-label">Sắp hết hạn (≤ 30 ngày)</span>
            </div>

            <div className="loyalty-card-value-wrapper">
              <h3 className="loyalty-card-value">
                {stats?.expiringSoon?.toLocaleString() || "0"} <span className="loyalty-card-unit">pts</span>
              </h3>
            </div>

            <div className="loyalty-progress-container">
              <div className="loyalty-progress-filler" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Đã hết hạn */}
        <div className="loyalty-metric-card">
          <div className="loyalty-card-overlay-circle circle-gray"></div>
          <div className="loyalty-card-content">
            <div className="loyalty-card-row1">
              <div className="loyalty-card-icon-overlay bg-red-tint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BA1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>

            <div className="loyalty-card-label-wrapper">
              <span className="loyalty-card-label">Đã hết hạn</span>
            </div>

            <div className="loyalty-card-value-wrapper">
              <h3 className="loyalty-card-value">
                {stats?.expired?.toLocaleString() || "1,959"} <span className="loyalty-card-unit">pts</span>
              </h3>
            </div>

            <div className="loyalty-progress-container">
              <div 
                className="loyalty-progress-filler bg-red"
                style={{ width: `${expiredPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Bento Slot: Ranking List */}
      <div className="loyalty-ranking-container">
        <div className="loyalty-ranking-header">
          <h5 className="loyalty-ranking-title">Top Khách hàng</h5>
        </div>

        <div className="loyalty-ranking-list">
          {topCustomers.map((member, index) => {
            // Determine styles based on rank index
            let rankClass = "rank-blue";
            if (index === 1) rankClass = "rank-gray";
            if (index === 2) rankClass = "rank-teal";
            if (index === 3) rankClass = "rank-light";

            return (
              <div key={index} className="loyalty-ranking-item">
                <div className={`loyalty-ranking-badge ${rankClass}`}>
                  <span className="loyalty-ranking-badge-text">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                <div className="loyalty-ranking-info">
                  <span className="loyalty-ranking-name">{member.customer}</span>
                  <span className="loyalty-ranking-tier">{member.tier}</span>
                </div>

                <div className="loyalty-ranking-score-wrapper">
                  <span className="loyalty-ranking-score">
                    {member.points?.toLocaleString()} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}