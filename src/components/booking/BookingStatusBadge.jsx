import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_MAP = {
  Pending:   { key: 'statusPending',   className: 'bg-amber-100 text-amber-700' },
  Completed: { key: 'statusCompleted', className: 'bg-emerald-100 text-emerald-700' },
  Cancelled: { key: 'statusCancelled', className: 'bg-slate-200 text-slate-500' },
  Failed:    { key: 'statusFailed',    className: 'bg-red-100 text-red-700' },
  'No-show': { key: 'statusNoShow',    className: 'bg-orange-100 text-orange-700' },
};

export default function BookingStatusBadge({ status = 'Pending', size = 'md' }) {
  const { t } = useLanguage();
  const config = STATUS_MAP[status] || STATUS_MAP.Pending;
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}
        ${config.className}`}
    >
      {t(config.key)}
    </span>
  );
}
