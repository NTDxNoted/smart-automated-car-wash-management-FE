import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import InvoicePreview from './InvoicePreview';
import PromoCodeInput from './PromoCodeInput';
import { useLanguage } from '../../context/LanguageContext';

function ConfirmRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value || '—'}</span>
    </div>
  );
}

export default function StepConfirm({ bookingData, onBack, user }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedRewardOption, setSelectedRewardOption] = useState(0);

  const baseAmount = bookingData.service?.price || 0;

  const getTierDiscountRate = (tier) => {
    switch (tier?.toUpperCase()) {
      case 'DIAMOND': return 0.15;
      case 'GOLD':    return 0.10;
      case 'SILVER':  return 0.05;
      default:        return 0;
    }
  };
  const tierDiscount = Math.floor(baseAmount * getTierDiscountRate(user?.tier));

  let promotionDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'PERCENT') {
      promotionDiscount = Math.floor(baseAmount * (appliedPromo.discountValue / 100));
    } else if (appliedPromo.discountType === 'FIXED') {
      promotionDiscount = appliedPromo.discountValue;
    }
  }

  const maxRewardCap = Math.floor(baseAmount * 0.5);
  let rawRewardDiscount = selectedRewardOption * 1000;
  let rewardDiscount = rawRewardDiscount;
  let isRewardCapped = false;
  if (rawRewardDiscount > maxRewardCap) {
    rewardDiscount = maxRewardCap;
    isRewardCapped = true;
  }

  const finalAmount = Math.max(0, baseAmount - tierDiscount - promotionDiscount - rewardDiscount);
  const invoice = { baseAmount, tierDiscount, promotionDiscount, rewardDiscount, finalAmount };

  const handleErrorResponse = (errCode, serverMessage) => {
    switch (errCode) {
      case 'PENDING_QUOTA_EXCEEDED':    return t('quotaExceeded');
      case 'SLOT_NOT_AVAILABLE':        return t('slotUnavailable');
      case 'VEHICLE_BUFFER_VIOLATION':  return t('bufferViolation');
      case 'BOOKING_SUSPENDED':         return t('bookingSuspended');
      default:                          return serverMessage || t('genericBookingError');
    }
  };

  const handleBookingConfirm = async () => {
    setLoading(true);
    setSubmitError('');

    const payload = {
      serviceId:        bookingData.service.id,
      phone:            bookingData.phone || null,
      licensePlate:     bookingData.licensePlate || null,
      vehicleId:        bookingData.selectedVehicleId ? Number(bookingData.selectedVehicleId) : null,
      scheduledTime:    bookingData.scheduledTime,
      promotionId:      appliedPromo?.promotionId || null,
      rewardPointsUsed: selectedRewardOption,
    };

    try {
      const res = await bookingService.createBooking(payload);
      setToast({ type: 'SUCCESS', message: t('bookingSuccessToast').replace('{id}', res.bookingId) });
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      const serverCode = err?.response?.data?.error || err?.response?.data?.code;
      const serverMessage = err?.response?.data?.message;
      setSubmitError(handleErrorResponse(serverCode, serverMessage));
    } finally {
      setLoading(false);
    }
  };

  const scheduledDisplay = bookingData.scheduledTime?.replace('T', ' ') || 'Chưa chọn';

  return (
    <section className="relative">
      {/* Success toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-cyan-500 text-cyan-600 px-6 py-4 rounded-xl shadow-lg animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="font-bold">{toast.message}</p>
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold text-cyan-700">
        {t('step3Title') || 'Bước 3: Kiểm tra hoá đơn & Xác nhận'}
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start mb-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Booking details */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <ConfirmRow label={t('bookingServiceLabel').replace(':', '')} value={bookingData.service?.name} />
            <ConfirmRow label={t('bookingTimeLabel').replace(':', '')} value={scheduledDisplay} />
            <ConfirmRow label={t('bookingPhoneLabel').replace(':', '')} value={bookingData.phone} />
            <ConfirmRow label={t('bookingPlateLabel').replace(':', '')} value={bookingData.licensePlate} />
          </div>

          {/* Promo code */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <PromoCodeInput onValidateSuccess={(promo) => setAppliedPromo(promo)} />
          </div>

          {/* Reward points */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {!user || user.points < 50 ? (
              <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                {t('rewardInsufficient').replace('{points}', 50 - (user?.points || 0))}
              </p>
            ) : (
              <div className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  {t('rewardLabel').replace('{points}', user.points)}
                </label>
                <select
                  value={selectedRewardOption}
                  onChange={e => setSelectedRewardOption(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-purple-500 transition-colors"
                >
                  <option value={0}>{t('rewardNoUse')}</option>
                  {user.points >= 50  && <option value={50}>{t('rewardUse50')}</option>}
                  {user.points >= 100 && <option value={100}>{t('rewardUse100')}</option>}
                </select>
                <p className="text-[11px] text-purple-400 font-medium">
                  {t('rewardLimit').replace('{amount}', maxRewardCap.toLocaleString('vi-VN'))}
                  {isRewardCapped && (
                    <span className="text-amber-500 block font-semibold mt-0.5">{t('rewardCappedMsg')}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column — invoice */}
        <InvoicePreview invoice={invoice} />
      </div>

      {/* Error */}
      {submitError && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          <span className="material-symbols-outlined text-base">error</span>
          {submitError}
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded-full font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2.5 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {t('btnBack')}
        </button>
        <button
          type="button"
          onClick={handleBookingConfirm}
          disabled={loading}
          className="rounded-full bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm font-semibold flex items-center gap-2 px-6 py-2.5 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              {t('btnProcessing')}
            </>
          ) : t('btnConfirm')}
        </button>
      </div>
    </section>
  );
}