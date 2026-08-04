import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDateTime } from '../../utils/datetime';

function canCancel(booking) {
  return booking.status === 'Pending' && (new Date(booking.scheduledTime) - new Date()) >= 3600 * 1000;
}

function formatVND(amount, locale) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export default function BookingCard({ booking, onOpenDetail, onCancel }) {
  const { t, locale } = useLanguage();
  const showCancelBtn = canCancel(booking);

  return (
    <article
      className="booking-history-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-cyan-300 hover:shadow-md cursor-pointer"
      onClick={() => onOpenDetail(booking)}
    >
      {/* Top row: service info + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-800 truncate">{booking.serviceName}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <span className="material-symbols-outlined text-base">calendar_month</span>
            {formatDateTime(booking.scheduledTime, locale)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <span className="material-symbols-outlined text-base">directions_car</span>
            {booking.vehiclePlate}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Bottom row: price + buttons */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-lg font-bold text-cyan-600">{formatVND(booking.finalAmount, locale)}</span>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onOpenDetail(booking); }}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-slate-50 hover:border-slate-400 active:scale-95 shadow-2xs"
          >
            {t('btnDetail') || 'Chi tiết'}
          </button>
          {showCancelBtn && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onCancel(booking); }}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid #fecdd3',
                backgroundColor: '#fff5f5',
                color: '#dc2626',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              className="hover:bg-red-100 hover:border-red-300 active:scale-95 shadow-2xs"
            >
              {t('btnCancel') || 'Hủy'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
