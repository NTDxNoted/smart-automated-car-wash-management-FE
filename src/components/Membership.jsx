import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tiers = [
  {
    id: 1, name: "Member", color: "#94a3b8", bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.3)", points: "0 điểm",
    discount: "0%", window: "7 ngày", multiplier: "1x",
    requirement: "Free – Sign up now",
    perks: ["No discount", "x1.0 point multiplier", "Book up to 7 days ahead", "No wash requirement"],
  },
  {
    id: 2, name: "Silver", color: "#10b981", bg: "rgba(16,185,129,0.04)",
    border: "rgba(16,185,129,0.3)", points: "500 điểm",
    discount: "5%", window: "10 ngày", multiplier: "1.1x",
    requirement: "Spend ≥ 500K VND or ≥ 8 washes",
    perks: ["5% off all services", "x1.1 point multiplier", "Book up to 10 days ahead", "Silver-tier queue priority"],
  },
  {
    id: 3, name: "Gold", color: "#f5c842", bg: "rgba(245,200,66,0.06)",
    border: "rgba(245,200,66,0.5)", points: "1,500 điểm",
    discount: "10%", window: "12 ngày", multiplier: "1.3x",
    requirement: "Spend ≥ 1.5M VND or ≥ 20 washes",
    perks: ["10% off all services", "x1.3 point multiplier", "Book up to 12 days ahead", "Gold-priority service lane"],
    featured: true,
  },
  {
    id: 4, name: "Platinum", color: "#06b6d4", bg: "rgba(6,182,212,0.06)",
    border: "rgba(6,182,212,0.5)", points: "3,000 điểm",
    discount: "15%", window: "14 ngày", multiplier: "1.5x",
    requirement: "Spend ≥ 3M VND or ≥ 40 washes",
    perks: ["15% off all services", "x1.5 point multiplier", "Book up to 14 days ahead", "Max priority – Platinum lane"],
  },
];

export default function Membership() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleCtaClick = () => {
    if (auth.token) {
      navigate('/booking');
    } else {
      navigate('/register');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '40px 16px', display: 'block' }}>

      {/* Grid chống lỗi bằng cách chỉ định rõ display grid inline */}
      <div style={{
        display: 'grid !important',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '28px',
        alignItems: 'stretch'
      }} className="membership-grid-secured">
        {tiers.map((t) => (
          <div
            key={t.id}
            className="premium-secured-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: `2px solid ${t.featured ? t.color : '#e2e8f0'}`,
              padding: '36px 24px',
              position: 'relative',
              boxShadow: t.featured ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
              transform: t.featured ? 'scale(1.02)' : 'none',
              height: 'auto', // Phá bỏ chiều cao cố định của CSS cũ
              minHeight: '520px', // Ép khung có độ dài tối thiểu bằng nhau
              boxSizing: 'border-box'
            }}
          >
            {t.featured && (
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: t.color, color: '#000', fontSize: '11px', fontWeight: '900',
                padding: '4px 16px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '1px', zIndex: 10
              }}>
                ⭐ MOST POPULAR ⭐
              </div>
            )}

            {/* Icon Top - Margin Top 8px */}
            <div style={{ marginTop: '8px', marginBottom: '12px', textAlign: 'center', fontSize: '28px', color: t.color }}>
              ◈
            </div>

            {/* Cụm Header tách biệt - Tuyệt đối không đè chữ */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
              <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', padding: 0 }}>{t.name}</h3>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Requirement</span>
              <p style={{
                fontSize: '13px', fontWeight: '750', color: t.color,
                backgroundColor: t.bg, border: `1px solid ${t.border}`,
                padding: '8px 12px', borderRadius: '8px', marginTop: '6px', width: '100%', textAlgin: 'center', marginHorizontal: 0
              }}>
                {t.requirement}
              </p>
            </div>

            {/* Danh sách đặc quyền thông thoáng cấp độ 16px */}
            <ul style={{
              display: 'flex', flexDirection: 'column', gap: '16px',
              listStyle: 'none', padding: 0, margin: '0 0 24px 0', flexGrow: 1
            }}>
              {t.perks.map((p) => (
                <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                  <span style={{ color: t.color, fontSize: '16px', fontWeight: 'bold' }}>✓</span>
                  {p}
                </li>
              ))}
            </ul>

            {/* Nút bấm to khỏe đầy đặn nằm sát đáy card */}
            <button 
              onClick={handleCtaClick}
              style={{
                marginTop: 'auto',
                width: '100%',
                padding: '14px 24px',
                borderRadius: '12px',
                border: `2px solid ${t.color}`,
                backgroundColor: t.featured ? t.color : 'transparent',
                color: t.featured ? '#0f172a' : t.color,
                fontSize: '13px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              {t.id === 4 ? "Contact Us" : t.id === 1 ? "Get Started" : `Go ${t.name}`}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}