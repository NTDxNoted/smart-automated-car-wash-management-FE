import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import { useLanguage } from '../../context/LanguageContext';

function canCancel(booking) {
  return booking.status === 'Pending' && (new Date(booking.scheduledTime) - new Date()) >= 7200 * 1000;
}

function formatVND(amount, locale) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function formatDateTime(iso, locale) {
  return new Date(iso).toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">{value || '—'}</span>
    </div>
  );
}

function InvoiceRow({ label, amount, isDiscount = false, isFinal = false, highlight = false, locale }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${isFinal ? 'border-t border-slate-200 mt-2 pt-3' : ''}`}>
      <span className={`text-sm ${isFinal ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
        {label}
      </span>
      <span className={`text-sm ${
        isFinal    ? 'font-bold text-cyan-600 text-base'
        : isDiscount ? 'font-medium text-green-600'
        : highlight  ? 'font-medium text-amber-600'
        : 'font-medium text-slate-700'
      }`}>
        {isDiscount && amount > 0 ? `−${formatVND(amount, locale)}` : formatVND(amount, locale)}
      </span>
    </div>
  );
}

export default function BookingDetailModal({ booking, onClose, onCancel }) {
  const { t, locale } = useLanguage();
  if (!booking) return null;
  const showCancel = canCancel(booking);
  const isVi = locale === 'vi';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="detail-title" className="text-lg font-bold text-slate-800">
              {isVi ? 'Chi tiết lịch đặt' : 'Booking Details'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">#{booking.bookingId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Status */}
        <div className="mb-5">
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Details */}
        <div className="mb-6">
          <DetailRow label={isVi ? 'Dịch vụ' : 'Service'}        value={booking.serviceName} />
          <DetailRow label={isVi ? 'Biển số xe' : 'License Plate'} value={booking.vehiclePlate} />
          <DetailRow label={isVi ? 'Thời gian' : 'Time'}          value={formatDateTime(booking.scheduledTime, locale)} />
        </div>

        {/* Invoice breakdown */}
        <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t('invoiceTitle') || 'Chi tiết thanh toán'}
          </p>
          <InvoiceRow label={t('invoiceBaseAmount').replace(':', '') || 'Phí dịch vụ'} amount={booking.baseAmount} locale={locale} />
          {booking.tierDiscount > 0      && <InvoiceRow label={t('invoiceTierDiscount').replace(':', '')}  amount={booking.tierDiscount}      isDiscount locale={locale} />}
          {booking.promotionDiscount > 0 && <InvoiceRow label={t('invoicePromoDiscount').replace(':', '')} amount={booking.promotionDiscount} isDiscount locale={locale} />}
          {booking.rewardDiscount > 0    && <InvoiceRow label={t('invoiceRewardDiscount').replace(':', '')} amount={booking.rewardDiscount}   isDiscount locale={locale} />}
          <InvoiceRow label={t('invoiceTotal').replace(':', '') || 'Tổng cộng'} amount={booking.finalAmount} isFinal locale={locale} />
        </div>

        {/* Points */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⭐</span>
            <span className="text-sm font-medium text-amber-900">
              {booking.status === 'Cancelled'
                ? (isVi ? 'Điểm hoàn trả' : 'Points Refunded')
                : t('profilePoints') || 'Điểm tích luỹ'}
            </span>
          </div>
          <span className="font-bold text-amber-600">
            {booking.status === 'Cancelled'
              ? `+${booking.pointsRefunded || 0} pts`
              : booking.pointsEarned > 0 ? `+${booking.pointsEarned} pts` : '—'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-2">
          {showCancel && (
            <button
              type="button"
              onClick={() => { onClose(); onCancel(booking); }}
              className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              {t('btnCancelModal') || 'Hủy lịch đặt'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            {isVi ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
