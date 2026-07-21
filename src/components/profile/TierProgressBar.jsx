import { useLanguage } from '../../context/LanguageContext';

/**
 * TierProgressBar — hiển thị tiến trình lên hạng tiếp theo.
 *
 * Tier thresholds (BR spec):
 *   Member  → Silver  : 500,000 VND
 *   Silver  → Gold    : 1,500,000 VND
 *   Gold    → Platinum: 3,000,000 VND
 *   Platinum: không hiện progress (đã đỉnh)
 *
 * Props:
 *   tier         : 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'
 *   totalSpending: number (VND)
 */

const TIER_THRESHOLDS = {
  MEMBER:   { nextTier: 'SILVER',   minSpending: 500000 },
  SILVER:   { nextTier: 'GOLD',     minSpending: 1500000 },
  GOLD:     { nextTier: 'PLATINUM', minSpending: 3000000 },
  PLATINUM: null, // Đã đạt hạng cao nhất
};

const NEXT_TIER_LABEL = {
  SILVER:   'Silver',
  GOLD:     'Gold',
  PLATINUM: 'Platinum',
};

const formatVND = (amount, locale) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function TierProgressBar({ tier = 'MEMBER', totalSpending = 0 }) {
  const { t, locale } = useLanguage();
  
  let calculated = 'MEMBER';
  if (totalSpending >= 3000000) calculated = 'PLATINUM';
  else if (totalSpending >= 1500000) calculated = 'GOLD';
  else if (totalSpending >= 500000) calculated = 'SILVER';

  const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
  let explicit = 'MEMBER';
  if (tStr === '4' || tStr === 'PLATINUM') explicit = 'PLATINUM';
  else if (tStr === '3' || tStr === 'GOLD') explicit = 'GOLD';
  else if (tStr === '2' || tStr === 'SILVER') explicit = 'SILVER';

  const tierOrder = { MEMBER: 1, SILVER: 2, GOLD: 3, PLATINUM: 4 };
  const normalizedTier = tierOrder[calculated] > tierOrder[explicit] ? calculated : explicit;

  const threshold = TIER_THRESHOLDS[normalizedTier];

  // Platinum — không render progress
  if (!threshold) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-cyan-600 text-sm" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {t('profileHighestTier')}
        </span>
      </div>
    );
  }

  const pct = Math.min(Math.round((totalSpending / threshold.minSpending) * 100), 100);
  const remaining = Math.max(threshold.minSpending - totalSpending, 0);

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
        <span
          className="text-xs sm:text-sm font-extrabold text-slate-600 uppercase tracking-wider"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          {t('profileProgressTo')} {NEXT_TIER_LABEL[threshold.nextTier]}
        </span>
        <span
          className="text-sm sm:text-base font-black text-cyan-600"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress track */}
      <div className="relative w-full h-5 rounded-full bg-slate-100 border border-slate-200/50 p-0.5 overflow-hidden shadow-inner" style={{ marginBottom: '10px' }}>
        {/* Glow fill */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #06b6d4 0%, #0284c7 50%, #4f46e5 100%)',
            boxShadow: '0 0 8px rgba(6,182,212,0.3)',
          }}
        >
          {pct >= 10 && (
            <span className="text-[10px] font-black text-white leading-none pr-1">
              {pct}%
            </span>
          )}
        </div>
      </div>

      {/* Sub-label */}
      <p
        className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {formatVND(totalSpending, locale)} / {formatVND(threshold.minSpending, locale)}
        {remaining > 0 && (
          <span className="text-slate-400 ml-1 font-medium">
            {t('profileRemainingSpending').replace('{remaining}', formatVND(remaining, locale))}
          </span>
        )}
      </p>
    </div>
  );
}

