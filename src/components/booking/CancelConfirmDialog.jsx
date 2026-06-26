import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import { useLanguage } from '../../context/LanguageContext';

function calcPointsRefund(finalAmount) {
  return Math.floor(finalAmount / 10000);
}

export default function CancelConfirmDialog({ booking, onConfirm, onClose, isLoading }) {
  const { t } = useLanguage();
  if (!booking) return null;

  const points = calcPointsRefund(booking.finalAmount);
  const parts = t('confirmCancelRefundMsg').split('{points}');

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="material-symbols-outlined text-3xl text-red-600">warning</span>
        </div>

        <h2 id="cancel-dialog-title" className="mt-4 text-lg font-bold text-slate-800">
          {t('confirmCancelTitle')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">{t('confirmCancelWarning')}</p>

        {/* Booking preview */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-cyan-600 tracking-wider uppercase">
              {booking.vehiclePlate}
            </span>
            <BookingStatusBadge status="Pending" size="sm" />
          </div>
          <p className="text-sm font-semibold text-slate-800">{booking.serviceName}</p>
          <p className="text-xs text-slate-400 mt-1">#{booking.bookingId}</p>
        </div>

        {/* Points refund */}
        {points > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 py-2.5 px-3">
            <span className="text-lg">💎</span>
            <p className="text-xs text-cyan-700 font-medium">
              {parts[0]}
              <strong className="mx-1 font-bold">{points}</strong>
              {parts[1]}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {t('btnKeepAppointment')}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(booking.bookingId)}
            disabled={isLoading}
            className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                {t('btnCancelling')}
              </>
            ) : t('btnConfirmCancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
