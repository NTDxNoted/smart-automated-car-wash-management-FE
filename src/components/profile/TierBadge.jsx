import React from 'react';

/**
 * TierBadge — hiển thị badge hạng thành viên với màu sắc theo tier.
 *
 * Props:
 *   tier: 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'
 *   size: 'sm' | 'md' | 'lg' (default: 'md')
 */

const TIER_CONFIG = {
  MEMBER: {
    label: 'Member',
    icon: '◈',
    gradient: 'from-slate-400 to-slate-500',
    glow: 'shadow-slate-400/30',
    border: 'border-slate-400/40',
    text: 'text-slate-200',
  },
  SILVER: {
    label: 'Silver',
    icon: '◈',
    gradient: 'from-slate-300 to-slate-400',
    glow: 'shadow-slate-300/40',
    border: 'border-slate-300/50',
    text: 'text-slate-100',
  },
  GOLD: {
    label: 'Gold',
    icon: '✦',
    gradient: 'from-amber-400 to-yellow-500',
    glow: 'shadow-amber-400/40',
    border: 'border-amber-400/50',
    text: 'text-amber-100',
  },
  PLATINUM: {
    label: 'Platinum',
    icon: '❋',
    gradient: 'from-cyan-300 to-sky-400',
    glow: 'shadow-cyan-400/50',
    border: 'border-cyan-300/60',
    text: 'text-cyan-50',
  },
};

const SIZE_CONFIG = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-1.5 text-base gap-2',
};

export default function TierBadge({ tier = 'MEMBER', size = 'md' }) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.MEMBER;
  const sizeClass = SIZE_CONFIG[size];

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold tracking-widest uppercase
        bg-gradient-to-r ${config.gradient} ${config.text}
        border ${config.border}
        shadow-lg ${config.glow}
        ${sizeClass}
      `}
      style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '0.12em' }}
    >
      <span className="opacity-80">{config.icon}</span>
      {config.label}
    </span>
  );
}
