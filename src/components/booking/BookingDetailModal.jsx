import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { formatDateTime } from '../../utils/datetime';

function canCancel(booking) {
  return booking.status === 'Pending' && (new Date(booking.scheduledTime) - new Date()) >= 7200 * 1000;
}

function formatVND(amount, locale) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
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

  // Fix NaN display issues by defaulting baseAmount to finalAmount if undefined
  const baseAmt = booking.baseAmount !== undefined && booking.baseAmount !== null && !isNaN(booking.baseAmount)
    ? booking.baseAmount
    : (booking.service?.price || booking.finalAmount || 0);

  const totalDiscount = Math.max(0, baseAmt - booking.finalAmount);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto relative"
        style={{ padding: '32px', boxSizing: 'border-box', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 pr-8">
          <h2 id="detail-title" className="text-xl font-bold text-slate-800 tracking-tight">
            {isVi ? 'Chi tiết lịch đặt' : 'Booking Details'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">#{booking.bookingId}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center"
          style={{ top: '24px', right: '24px' }}
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Status */}
        <div className="mb-5">
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Details */}
        <div className="mb-6 border-t border-b border-slate-100 py-1">
          <DetailRow label={isVi ? 'Dịch vụ' : 'Service'}        value={booking.serviceName} />
          <DetailRow label={isVi ? 'Biển số xe' : 'License Plate'} value={booking.vehiclePlate} />
          <DetailRow label={isVi ? 'Thời gian' : 'Time'}          value={formatDateTime(booking.scheduledTime, locale)} />
        </div>

        {/* Invoice breakdown */}
        <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            {t('invoiceTitle') || 'Chi tiết thanh toán'}
          </p>
          <InvoiceRow label={isVi ? 'Phí dịch vụ gốc' : 'Original Fee'} amount={baseAmt} locale={locale} />
          
          {/* Display specific discounts if available */}
          {booking.tierDiscount > 0 && (
            <InvoiceRow label={t('invoiceTierDiscount').replace(':', '')} amount={booking.tierDiscount} isDiscount locale={locale} />
          )}
          {booking.promotionDiscount > 0 && (
            <InvoiceRow label={t('invoicePromoDiscount').replace(':', '')} amount={booking.promotionDiscount} isDiscount locale={locale} />
          )}
          {booking.rewardDiscount > 0 && (
            <InvoiceRow label={t('invoiceRewardDiscount').replace(':', '')} amount={booking.rewardDiscount} isDiscount locale={locale} />
          )}
          
          {/* Fallback to display total discount if specific ones are zero/missing but price is reduced */}
          {(!booking.tierDiscount && !booking.promotionDiscount && !booking.rewardDiscount && totalDiscount > 0) && (
            <InvoiceRow label={isVi ? 'Tổng tiền giảm giá' : 'Total Discount'} amount={totalDiscount} isDiscount locale={locale} />
          )}

          <InvoiceRow label={t('invoiceTotal').replace(':', '') || 'Tổng cộng'} amount={booking.finalAmount} isFinal locale={locale} />
        </div>

        {/* Points */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="text-sm font-medium text-amber-900">
              {booking.status === 'Cancelled'
                ? (isVi ? 'Điểm hoàn trả' : 'Points Refunded')
                : t('profilePoints') || 'Điểm tích luỹ'}
            </span>
          </div>
          <span className="font-extrabold text-amber-600">
            {booking.status === 'Cancelled'
              ? `+${booking.pointsRefunded || 0} pts`
              : booking.pointsEarned > 0 ? `+${booking.pointsEarned} pts` : '—'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          {showCancel && (
            <button
              type="button"
              onClick={() => { onClose(); onCancel(booking); }}
              className="w-full rounded-full border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-[0.99] cursor-pointer"
            >
              {t('btnCancelModal') || 'Hủy lịch đặt'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-cyan-600 hover:bg-cyan-500 py-3 text-sm font-bold text-white transition-all shadow-md shadow-cyan-600/10 active:scale-[0.99] cursor-pointer"
          >
            {isVi ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
