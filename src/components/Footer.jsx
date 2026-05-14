export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">⟡</span>
          AutoWash <span className="logo-accent">Pro</span>
          <p>Rửa xe thông minh — Tích điểm mỗi lần, Nâng hạng mọi lúc</p>
        </div>
        <div className="footer-links">
          {["Trang chủ","Dịch vụ","Đặt lịch","Hạng thành viên"].map((l,i) => (
            <a key={l} href={["#hero","#services","#booking","#membership"][i]}>{l}</a>
          ))}
        </div>
        <p className="footer-copy">© 2025 AutoWash Pro · FPT University — SWP391 Project</p>
      </div>
    </footer>
  );
}
