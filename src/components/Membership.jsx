const tiers = [
  {
    id: 1, name: "Member", color: "#94a3b8", bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.3)", points: "0 điểm",
    discount: "0%", window: "7 ngày", multiplier: "1x",
    perks: ["Đặt lịch cơ bản", "Tích điểm x1", "Ưu đãi thành viên mới"],
  },
  {
    id: 2, name: "Silver", color: "#cbd5e1", bg: "rgba(203,213,225,0.08)",
    border: "rgba(203,213,225,0.4)", points: "500 điểm",
    discount: "5%", window: "10 ngày", multiplier: "1.1x",
    perks: ["Đặt lịch 10 ngày trước", "Tích điểm x1.1", "Giảm 5% mỗi lần rửa"],
  },
  {
    id: 3, name: "Gold", color: "#f5c842", bg: "rgba(245,200,66,0.08)",
    border: "rgba(245,200,66,0.5)", points: "1,500 điểm",
    discount: "10%", window: "12 ngày", multiplier: "1.3x",
    perks: ["Đặt lịch 12 ngày trước", "Tích điểm x1.3", "Giảm 10% + quà tặng"],
    featured: true,
  },
  {
    id: 4, name: "Platinum", color: "#a78bfa", bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.5)", points: "3,000 điểm",
    discount: "15%", window: "14 ngày", multiplier: "1.5x",
    perks: ["Đặt lịch 14 ngày trước", "Tích điểm x1.5", "Giảm 15% + ưu tiên tối đa"],
  },
];

export default function Membership() {
  return (
    <section className="membership" id="membership">
      <div className="section-header">
        <p className="section-tag">— Hạng thành viên</p>
        <h2>Hành trình <span className="gradient-text">thăng hạng</span></h2>
        <p className="section-desc">Tích điểm mỗi lần rửa — nâng hạng để nhận đặc quyền cao hơn</p>
      </div>

      <div className="tiers-grid">
        {tiers.map((t) => (
          <div
            className={`tier-card ${t.featured ? "featured" : ""}`}
            key={t.id}
            style={{ "--tier-color": t.color, "--tier-bg": t.bg, "--tier-border": t.border }}
          >
            {t.featured && <div className="featured-badge">Phổ biến nhất</div>}
            <div className="tier-icon" style={{ color: t.color }}>◈</div>
            <h3 style={{ color: t.color }}>{t.name}</h3>
            <p className="tier-points">Từ {t.points}</p>

            <div className="tier-stats">
              <div className="tier-stat">
                <span className="ts-val">{t.discount}</span>
                <span className="ts-label">Giảm giá</span>
              </div>
              <div className="tier-stat">
                <span className="ts-val">{t.multiplier}</span>
                <span className="ts-label">Điểm</span>
              </div>
              <div className="tier-stat">
                <span className="ts-val">{t.window}</span>
                <span className="ts-label">Đặt trước</span>
              </div>
            </div>

            <ul className="tier-perks">
              {t.perks.map((p) => (
                <li key={p}><span style={{ color: t.color }}>✓</span> {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
