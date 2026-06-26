import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Hiển thị tổng điểm cực lớn và trạng thái "Có thể đổi thưởng"
 * BR-59: Tổng điểm < 50 → hiện "Cần thêm X điểm"
 */
export default function PointSummary({ totalPoints = 0, canRedeem = false }) {
  const { t, locale } = useLanguage();
  const pointsNeeded = Math.max(50 - totalPoints, 0);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 p-8 flex flex-col items-center text-center space-y-4"
      style={{
        background: '#ffffff',
        boxShadow: '0 0 40px rgba(6,182,212,0.06)',
      }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 60%)'
        }}
      />

      <h3 
        className="text-sm uppercase tracking-widest text-slate-500 z-10"
        style={{ fontFamily: "'Archivo', sans-serif" }}
      >
        {t('loyaltySummaryTitle')}
      </h3>

      <div 
        className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text z-10"
        style={{ 
          backgroundImage: 'linear-gradient(135deg, #0891b2, #06b6d4)',
          fontFamily: "'Archivo', sans-serif" 
        }}
      >
        {totalPoints.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')}
      </div>

      <div className="z-10 mt-2">
        {canRedeem ? (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-300 text-cyan-600 text-sm font-semibold" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.667 8A6.667 6.667 0 111.333 8a6.667 6.667 0 0113.334 0z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5.333 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('loyaltyCanRedeem')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-sm" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {t('loyaltyPointsNeeded').replace('{points}', pointsNeeded)}
          </span>
        )}
      </div>
    </div>
  );
}
