import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Hiển thị danh sách các lô điểm (batch)
 * BR-57: Highlight đỏ nếu số ngày còn lại ≤ 30 ngày
 */
export default function PointBatchList({ batches = [] }) {
  const { t, locale } = useLanguage();
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  if (!batches || batches.length === 0) {
    return (
      <div className="py-8 text-center border border-slate-200 rounded-xl bg-white">
        <p className="text-slate-500 text-sm" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {t('loyaltyNoBatches')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 
        className="text-sm uppercase tracking-widest text-slate-500 mb-3"
        style={{ fontFamily: "'Archivo', sans-serif" }}
      >
        {t('loyaltyBatchesTitle')}
      </h3>
      
      <div className="space-y-3">
        {batches.map((batch) => {
          const isExpiringSoon = batch.daysUntilExpiry <= 30;
          
          return (
            <div 
              key={batch.id}
              className={`
                flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                ${isExpiringSoon 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span 
                    className={`text-lg font-bold ${isExpiringSoon ? 'text-red-600' : 'text-slate-800'}`}
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                  >
                    {batch.points} {t('loyaltyPoints')}
                  </span>
                  {isExpiringSoon && (
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-100 text-red-600 border border-red-300 tracking-wider">
                      {t('loyaltyExpiringSoon')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {t('loyaltyAccumulatedFrom')} {formatDate(batch.earnedAt)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-0.5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {t('loyaltyExpiry')} <span className="text-slate-700">{formatDate(batch.expiredAt)}</span>
                </p>
                <p 
                  className={`text-sm font-semibold ${isExpiringSoon ? 'text-red-600' : 'text-cyan-600'}`}
                  style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                >
                  {t('loyaltyDaysRemaining').replace('{days}', batch.daysUntilExpiry)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-slate-500 text-center mt-2" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {t('loyaltyExpiryNote')}
      </p>
    </div>
  );
}
