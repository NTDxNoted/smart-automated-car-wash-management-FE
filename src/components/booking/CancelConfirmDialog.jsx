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
        className="w-full max-w-md rounded-[28px] bg-white p-6 sm:p-7 text-center shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100/80 shadow-xs mb-4 text-rose-500">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>

        {/* Title & Warning Text */}
        <h2 id="cancel-dialog-title" className="text-xl font-black text-slate-800 tracking-tight">
          {t('confirmCancelTitle') || 'Xác nhận hủy lịch hẹn'}
        </h2>
        <p className="mt-1.5 text-xs font-medium text-slate-500 leading-relaxed">
          {t('confirmCancelWarning') || 'Hành động này không thể hoàn tác sau khi xác nhận.'}
        </p>

        {/* Booking Card Preview */}
        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-left shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm font-black font-mono bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-lg border border-cyan-200/70 tracking-wider">
              {booking.vehiclePlate || booking.licensePlate || 'N/A'}
            </span>
            <BookingStatusBadge status={booking.status || "Pending"} size="sm" />
          </div>

          <h4 className="text-sm font-extrabold text-slate-800 leading-snug">
            {booking.serviceName || booking.service?.name || 'Dịch vụ rửa xe'}
          </h4>
          
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-2 pt-2 border-t border-slate-200/50">
            <span>Mã đơn: #{booking.bookingId || booking.id}</span>
            <span>{booking.scheduledTime?.replace('T', ' ') || ''}</span>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50/70 p-3 text-left">
          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">info</span>
          <p className="text-xs text-amber-800 font-semibold leading-relaxed">
            {locale === 'en'
              ? 'Cancellation is final and cannot be undone once confirmed.'
              : 'Khi xác nhận hủy, lịch hẹn này sẽ bị hủy bỏ vĩnh viễn.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-3 text-xs font-bold text-slate-700 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {t('btnKeepAppointment') || 'Giữ lịch'}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(booking.bookingId || booking.id)}
            disabled={isLoading}
            className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-extrabold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                <span>{t('btnCancelling') || 'Đang hủy...'}</span>
              </>
            ) : (
              <>
                <span>{t('btnConfirmCancel') || 'Xác nhận hủy'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
