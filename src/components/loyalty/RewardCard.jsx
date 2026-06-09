import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hiển thị phần thưởng có thể đổi (nếu điểm >= 50)
 */
export default function RewardCard({ reward }) {
  const navigate = useNavigate();

  const handleUseReward = () => {
    // Redirect to booking page, có thể pass params nếu muốn tự apply reward, 
    // hoặc chỉ đơn thuần redirect để user đi tới form booking
    navigate('/booking');
  };

  const formatVND = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div 
      className="group relative rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:border-cyan-400 hover:-translate-y-1"
      style={{
        background: '#ffffff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      }}
    >
      {/* Glow on hover */}
      <div 
        className="absolute inset-0 rounded-xl bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300 pointer-events-none" 
      />

      <div className="flex flex-col h-full gap-4 relative z-10">
        <div>
          <h4 
            className="text-lg font-bold text-slate-800 mb-1 group-hover:text-cyan-600 transition-colors"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {reward.name}
          </h4>
          <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Trị giá giảm: <span className="font-semibold text-slate-800">{formatVND(reward.discountValue)}</span>
          </p>
        </div>

        <div className="flex-1" />

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="flex items-baseline gap-1">
            <span 
              className="text-xl font-bold text-cyan-600"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {reward.pointsRequired}
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wide">điểm</span>
          </div>

          <button
            onClick={handleUseReward}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              boxShadow: '0 0 14px rgba(6,182,212,0.2)',
            }}
          >
            Dùng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
