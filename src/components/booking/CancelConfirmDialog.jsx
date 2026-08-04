import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function CancelConfirmDialog({ booking, onConfirm, onClose, isLoading }) {
  const { t, locale } = useLanguage();
  if (!booking) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-slate-100 text-center overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon Box */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-xs mb-3.5">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>

        {/* Title & Warning Message */}
        <h2 id="cancel-dialog-title" className="text-xl font-black text-slate-800 tracking-tight">
          {t('confirmCancelTitle') || 'Xác nhận hủy lịch hẹn'}
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed mb-4">
          {t('confirmCancelWarning') || 'Hành động này không thể hoàn tác sau khi xác nhận.'}
        </p>

        {/* Booking Info Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left shadow-2xs mb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-black font-mono bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-md border border-cyan-200/70 tracking-wider">
              {booking.vehiclePlate || booking.licensePlate || 'N/A'}
            </span>
            <BookingStatusBadge status={booking.status || "Pending"} size="sm" />
          </div>

          <h4 className="text-sm font-extrabold text-slate-800 leading-snug">
            {booking.serviceName || booking.service?.name || 'Dịch vụ rửa xe'}
          </h4>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mt-2.5 pt-2 border-t border-slate-200/60">
            <span>Mã đơn: #{booking.bookingId || booking.id}</span>
            <span>{booking.scheduledTime?.replace('T', ' ') || ''}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-slate-700 text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {t('btnKeepAppointment') || 'Giữ lịch'}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(booking.bookingId || booking.id)}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 font-extrabold text-white text-xs transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                <span>{t('btnCancelling') || 'Đang hủy...'}</span>
              </>
            ) : (
              <span>{t('btnConfirmCancel') || 'Xác nhận hủy'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
