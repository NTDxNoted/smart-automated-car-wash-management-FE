import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Trang chủ", "Dịch vụ", "Đặt lịch", "Hạng thành viên"];
  const hrefs = ["#hero", "#services", "#booking", "#membership"];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="logo-icon">⟡</span>
          AutoWash <span className="logo-accent">Pro</span>
        </a>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((l, i) => (
            <li key={l}>
              <a href={hrefs[i]} onClick={() => setMenuOpen(false)}>{l}</a>
            </li>
          ))}
          <li>
            <a href="#booking" className="nav-cta" onClick={() => setMenuOpen(false)}>
              Đặt lịch ngay
            </a>
          </li>
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
