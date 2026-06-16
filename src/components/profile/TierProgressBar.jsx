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
  const threshold = TIER_THRESHOLDS[tier];

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
    <div className="w-full space-y-2">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <span
          className="text-xs text-slate-500 uppercase tracking-widest"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          {t('profileProgressTo')} {NEXT_TIER_LABEL[threshold.nextTier]}
        </span>
        <span
          className="text-xs font-semibold text-cyan-600"
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress track */}
      <div className="relative w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        {/* Glow fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #0891b2, #06b6d4)',
            boxShadow: 'none',
          }}
        />
      </div>

      {/* Sub-label */}
      <p
        className="text-xs text-slate-600"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {formatVND(totalSpending, locale)} / {formatVND(threshold.minSpending, locale)}
        {remaining > 0 && (
          <span className="text-slate-500 ml-1">
            {t('profileRemainingSpending').replace('{remaining}', formatVND(remaining, locale))}
          </span>
        )}
      </p>
    </div>
  );
}

