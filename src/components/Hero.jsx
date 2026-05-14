
import heroCar from "../assets/img/hero-car.png"

export default function Hero() {
  return (
    <section className="hero" id="hero" style={{ backgroundImage: `url(${heroCar})` }}>
      <div className="hero-bg">
        <div className="ripple r1" />
        <div className="ripple r2" />
        <div className="ripple r3" />
        <div className="grid-overlay" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">✦ Smart Car Wash System</div>
        <h1 className="hero-title">
          Car Wash <span className="gradient-text">Smart Automated</span>
        </h1>
        <p className="hero-sub">
          Đặt lịch trước · Nhận ưu đãi theo hạng · Tự động nhận diện biển số
        </p>
        <div className="hero-actions">
          <a href="#booking" className="btn-primary">
            <span>Đặt lịch ngay</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#services" className="btn-ghost">Xem dịch vụ</a>
        </div>

        <div className="hero-stats">
          {[
            { val: "4 Hạng", label: "Thành viên" },
            { val: "5+", label: "Dịch vụ" },
            { val: "LPR", label: "Tự động nhận diện" },
          ].map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span>Cuộn xuống</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
