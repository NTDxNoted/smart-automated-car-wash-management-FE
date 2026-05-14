const services = [
  { icon: "◈", name: "Rửa xe cơ bản",        price: "30,000đ", duration: "20 phút", desc: "Rửa ngoài, sấy khô, lau kính cơ bản" },
  { icon: "◉", name: "Rửa xe cao cấp",        price: "60,000đ", duration: "35 phút", desc: "Rửa toàn diện + xịt bóng ngoại thất" },
  { icon: "◍", name: "Rửa + Hút bụi nội thất", price: "90,000đ", duration: "50 phút", desc: "Kết hợp rửa ngoài và hút bụi bên trong" },
  { icon: "◎", name: "Rửa chi tiết toàn bộ",  price: "150,000đ", duration: "90 phút", desc: "Dịch vụ cao cấp nhất — trong và ngoài hoàn hảo" },
  { icon: "◐", name: "Đánh bóng lốp",         price: "40,000đ", duration: "25 phút", desc: "Làm sạch và đánh bóng 4 lốp xe" },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="section-header">
        <p className="section-tag">— Dịch vụ</p>
        <h2>Chọn gói rửa xe <span className="gradient-text">phù hợp</span></h2>
        <p className="section-desc">Từ rửa nhanh đến chi tiết toàn bộ — tất cả đều tích điểm thưởng</p>
      </div>

      <div className="services-grid">
        {services.map((s, i) => (
          <div className="service-card" key={s.name} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="service-icon">{s.icon}</div>
            <h3>{s.name}</h3>
            <p className="service-desc">{s.desc}</p>
            <div className="service-meta">
              <span className="service-duration">⏱ {s.duration}</span>
            </div>
            <div className="service-footer">
              <span className="service-price">{s.price}</span>
              <a href="#booking" className="service-btn">Đặt ngay →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
