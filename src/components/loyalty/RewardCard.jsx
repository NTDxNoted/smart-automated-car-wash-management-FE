import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Hiển thị phần thưởng có thể đổi (nếu điểm >= 50)
 * Áp dụng Inline CSS chống lỗi Tailwind đè giao diện
 */
export default function RewardCard({ reward }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleUseReward = () => {
    navigate('/booking');
  };

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        transition: 'all 0.25s ease',
        boxSizing: 'border-box',
      }}
      className="hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Top section: Title/Value & Icon Box */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#0891b2',
              margin: 0,
              lineHeight: 1.25,
              fontFamily: "'Archivo', sans-serif",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {reward.name}
          </h4>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 900,
              color: '#94a3b8',
              marginTop: '4px',
              marginBottom: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            VOUCHER ƯU ĐÃI
          </p>
        </div>

        {/* Icon Box in Top-Right */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: '18px' }}>
            local_activity
          </span>
        </div>
      </div>

      {/* Middle Section: Dashed Divider with Cutouts */}
      <div style={{ position: 'relative', marginTop: '4px', marginBottom: '12px' }}>
        <div style={{ borderTop: '2px dashed #f1f5f9' }} />
      </div>

      {/* Bottom section: Points Required & Use Now Button */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 800,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '2px',
            }}
          >
            CẦN TÍCH LŨY
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1,
                fontFamily: "'Archivo', sans-serif",
              }}
            >
              {reward.pointsRequired}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#0891b2',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              {t('loyaltyPoints') || 'ĐIỂM'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseReward}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '12px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Archivo', sans-serif",
            transition: 'all 0.2s ease',
          }}
          className="hover:brightness-110 active:scale-95"
        >
          {t('btnUseNow') || 'Dùng ngay'}
        </button>
      </div>
    </div>
  );
}
