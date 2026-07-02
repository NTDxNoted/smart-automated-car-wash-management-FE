import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import InvoicePreview from './InvoicePreview';
import PromoCodeInput from './PromoCodeInput';
import { useLanguage } from '../../context/LanguageContext';

export default function StepConfirm({ bookingData, onBack, user }) {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedRewardOption, setSelectedRewardOption] = useState(0);

  const baseAmount = bookingData.service?.price || 0;

  const getTierDiscountRate = (tier) => {
    const tStr = String(tier !== undefined && tier !== null ? tier : '').trim().toUpperCase();
    if (tStr === '4' || tStr === 'PLATINUM' || tStr === 'DIAMOND') return 0.15;
    if (tStr === '3' || tStr === 'GOLD') return 0.10;
    if (tStr === '2' || tStr === 'SILVER') return 0.05;
    return 0;
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

      <h2 
        className="text-xl font-bold text-slate-800 flex items-center gap-2"
        style={{ marginBottom: '24px' }}
      >
        <span className="w-2.5 h-6 rounded-full bg-cyan-500"></span>
        {t('step3Title') || 'Bước 3: Kiểm tra hoá đơn & Xác nhận'}
      </h2>

      <div 
        className="grid grid-cols-1 lg:grid-cols-2 items-start"
        style={{ gap: '24px', marginBottom: '24px' }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ gap: '20px' }}>
          {/* Booking details */}
          <div 
            className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm space-y-4"
            style={{ marginBottom: '20px' }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-750 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500">info</span>
              {locale === 'en' ? 'Booking Details' : 'Thông tin chi tiết'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Service block */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300 border border-slate-100/50">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                  <span className="material-symbols-outlined text-xl">local_car_wash</span>
                </div>
                <div>
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('bookingServiceLabel').replace(':', '')}
                  </span>
                  <span className="text-[15px] font-extrabold text-slate-800 block mt-0.5 leading-snug">
                    {bookingData.service?.name}
                  </span>
                </div>
              </div>

              {/* Time block */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300 border border-slate-100/50">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                </div>
                <div>
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('bookingTimeLabel').replace(':', '')}
                  </span>
                  <span className="text-[15px] font-extrabold text-cyan-600 block mt-0.5 leading-snug">
                    {scheduledDisplay}
                  </span>
                </div>
              </div>

              {/* Phone block */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300 border border-slate-100/50">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <span className="material-symbols-outlined text-xl">call</span>
                </div>
                <div>
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('bookingPhoneLabel').replace(':', '')}
                  </span>
                  <span className="text-[15px] font-extrabold text-slate-800 block mt-0.5 leading-snug">
                    {bookingData.phone || '—'}
                  </span>
                </div>
              </div>

              {/* License Plate block */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300 border border-slate-100/50">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <span className="material-symbols-outlined text-xl">tag</span>
                </div>
                <div>
                  <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('bookingPlateLabel').replace(':', '')}
                  </span>
                  {bookingData.licensePlate ? (
                    <span className="inline-block mt-1 font-mono text-sm font-extrabold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-300 tracking-wider shadow-sm">
                      {bookingData.licensePlate}
                    </span>
                  ) : (
                    <span className="text-[15px] font-extrabold text-slate-800 block mt-0.5 leading-snug">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Promo code */}
          <div 
            className="rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm"
            style={{ marginBottom: '20px' }}
          >
            <PromoCodeInput onValidateSuccess={(promo) => setAppliedPromo(promo)} />
          </div>

          {/* Reward points */}
          <div 
            className="rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm"
            style={{ marginBottom: '20px' }}
          >
            {!user || user.points < 50 ? (
              <div className="flex items-start gap-3 rounded-2xl bg-purple-50/30 border border-purple-100 p-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <span className="material-symbols-outlined text-lg">stars</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide">
                    {t('loyaltyTabWallet') || 'Ví điểm & Đổi thưởng'}
                  </h4>
                  <p className="text-xs text-purple-600/90 mt-1 leading-relaxed">
                    {t('rewardInsufficient').replace('{points}', String(50 - (user?.points || 0)))}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">stars</span>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      {t('loyaltyTabWallet') || 'Ví điểm & Đổi thưởng'}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {user.points} PTS
                  </span>
                </div>
                
                <div className="relative group">
                  <select
                    value={selectedRewardOption}
                    onChange={e => setSelectedRewardOption(Number(e.target.value))}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-white pl-4 pr-10 py-3.5 text-base font-semibold text-slate-800 outline-none appearance-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100/50 transition-all duration-300 cursor-pointer"
                  >
                    <option value={0}>{t('rewardNoUse')}</option>
                    {user.points >= 50  && <option value={50}>{t('rewardUse50')}</option>}
                    {user.points >= 100 && <option value={100}>{t('rewardUse100')}</option>}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-purple-600 transition-colors duration-300">
                    keyboard_arrow_down
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[11px] text-purple-600/90 font-medium">
                    {t('rewardLimit').replace('{amount}', maxRewardCap.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN'))}
                  </p>
                  {isRewardCapped && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50/50 border border-amber-100/60 p-2.5 rounded-xl">
                      <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                      <span>{t('rewardCappedMsg')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column — invoice */}
        <InvoicePreview invoice={invoice} />
      </div>

      {/* Error */}
      {submitError && (
        <div 
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium"
          style={{ marginBottom: '24px' }}
        >
          <span className="material-symbols-outlined text-base">error</span>
          {submitError}
        </div>
      )}

      <div 
        className="flex justify-between items-center border-t border-slate-100"
        style={{ marginTop: '40px', paddingTop: '24px' }}
      >
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded-full font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 px-10 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          {t('btnBack')}
        </button>
        <button
          type="button"
          onClick={handleBookingConfirm}
          disabled={loading}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 px-12 py-3.5 text-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              {t('btnProcessing')}
            </>
          ) : (
            <>
              {t('btnConfirm')}
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}