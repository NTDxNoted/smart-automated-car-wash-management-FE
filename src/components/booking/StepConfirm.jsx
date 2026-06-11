import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import InvoicePreview from './InvoicePreview';
import PromoCodeInput from './PromoCodeInput';

export default function StepConfirm({ bookingData, onBack, user }) {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [appliedPromo, setAppliedPromo] = useState(null);
    const [selectedRewardOption, setSelectedRewardOption] = useState(0);

    const baseAmount = bookingData.service?.price || 0;

    // Tính tự động TierDiscount (BR-23)
    const getTierDiscountRate = (tier) => {
        switch (tier?.toUpperCase()) {
            case 'DIAMOND': return 0.15;
            case 'GOLD': return 0.10;
            case 'SILVER': return 0.05;
            default: return 0;
        }
    };
    const tierDiscount = Math.floor(baseAmount * getTierDiscountRate(user?.tier));

    // Tính Promotion Discount
    let promotionDiscount = 0;
    if (appliedPromo) {
        if (appliedPromo.discountType === 'PERCENT') {
            promotionDiscount = Math.floor(baseAmount * (appliedPromo.discountValue / 100));
        } else if (appliedPromo.discountType === 'FIXED') {
            promotionDiscount = appliedPromo.discountValue;
        }
    }

    // Tính Reward Discount + Áp dụng BR-60 (Cap tối đa 50% BaseAmount)
    const maxRewardCap = Math.floor(baseAmount * 0.5);
    let rawRewardDiscount = selectedRewardOption * 1000; // Quy đổi giả lập: 1 điểm = 1.000 đ
    let rewardDiscount = rawRewardDiscount;
    let isRewardCapped = false;
    if (rawRewardDiscount > maxRewardCap) {
        rewardDiscount = maxRewardCap;
        isRewardCapped = true;
    }

    const finalAmount = Math.max(0, baseAmount - tierDiscount - promotionDiscount - rewardDiscount);
    const invoice = { baseAmount, tierDiscount, promotionDiscount, rewardDiscount, finalAmount };

    const handleErrorResponse = (errCode) => {
        switch (errCode) {
            case 'PENDING_QUOTA_EXCEEDED': return "Bạn đã có lịch đặt đang chờ. Vui lòng hoàn thành trước khi đặt lịch mới.";
            case 'SLOT_NOT_AVAILABLE': return "Khung giờ này hiện tại đã có người đặt trước. Vui lòng chọn khung giờ khác.";
            case 'VEHICLE_BUFFER_VIOLATION': return "Xe này đã có lịch hẹn được đặt trong vòng 120 phút. Vui lòng đổi giờ.";
            case 'BOOKING_SUSPENDED': return "Tài khoản của bạn đang bị tạm khóa tính năng đặt lịch. Liên hệ Admin.";
            default: return "Đã xảy ra lỗi hệ thống khi đặt lịch. Vui lòng thử lại.";
        }
    };

    const handleBookingConfirm = async () => {
        setLoading(true);
        setSubmitError('');

        const payload = {
            serviceId: bookingData.service.id,
            phone: bookingData.phone,
            licensePlate: bookingData.licensePlate,
            scheduledTime: bookingData.scheduledTime,
            promotionId: appliedPromo?.promotionId || null,
            rewardPointsUsed: selectedRewardOption,
            ...invoice
        };

        try {
            const res = await bookingService.createBooking(payload);
            setToast({ type: 'SUCCESS', message: `Đặt lịch thành công! Mã hóa đơn: ${res.bookingId}` });
            setTimeout(() => {
                navigate('/bookings');
            }, 2000);
        } catch (err) {
            const serverCode = err?.response?.data?.code;
            setSubmitError(handleErrorResponse(serverCode));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            {toast && (
                <div className="fixed top-5 right-5 z-50 bg-white border border-cyan-500 text-cyan-600 px-6 py-4 rounded-xl shadow-lg animate-bounce">
                    <p className="font-bold">{toast.message}</p>
                </div>
            )}

            <h3 className="text-xl font-heading text-cyan-600 font-semibold mb-4">Bước 3: Kiểm tra hóa đơn & Xác nhận</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
                <div><span className="text-slate-500">Dịch vụ:</span> <strong className="text-slate-800">{bookingData.service?.name}</strong></div>
                <div><span className="text-slate-500">Thời gian:</span> <strong className="text-slate-800">{bookingData.scheduledTime?.replace('T', ' ')}</strong></div>
                <div><span className="text-slate-500">Số điện thoại:</span> <strong className="text-slate-800">{bookingData.phone}</strong></div>
                <div><span className="text-slate-500">Biển số xe:</span> <strong className="text-slate-800">{bookingData.licensePlate}</strong></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                    {/* Gọi PromoCodeInput */}
                    <PromoCodeInput onValidateSuccess={(promo) => setAppliedPromo(promo)} />

                    {/* REWARD LOGIC */}
                    <div className="border border-slate-200 bg-white p-4 rounded-lg">
                        {!user || user.points < 50 ? (
                            <p className="text-xs text-slate-500 italic">
                                Cần thêm {50 - (user?.points || 0)} điểm để đổi thưởng quà tặng thành viên.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-purple-600 uppercase tracking-wider">Đổi điểm tích lũy (Hiện có: {user.points} điểm)</label>
                                <select
                                    value={selectedRewardOption}
                                    onChange={e => setSelectedRewardOption(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-purple-500"
                                >
                                    <option value={0}>Không đổi điểm</option>
                                    {user.points >= 50 && <option value={50}>Dùng 50 điểm (-50.000đ)</option>}
                                    {user.points >= 100 && <option value={100}>Dùng 100 điểm (-100.000đ)</option>}
                                </select>
                                <p className="text-[11px] text-purple-300">
                                    * Tối đa được giảm {maxRewardCap.toLocaleString('vi-VN')} đ (50% giá trị gốc).
                                    {isRewardCapped && <span className="text-amber-400 block font-semibold">Hệ thống đã tự động áp mức giảm tối đa.</span>}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gọi InvoicePreview */}
                <InvoicePreview invoice={invoice} />
            </div>

            {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                    {submitError}
                </div>
            )}

            <div className="flex justify-between pt-6 border-t border-slate-200">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-3 border border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-medium rounded-lg transition-all"
                >
                    Quay lại
                </button>
                <button
                    onClick={handleBookingConfirm}
                    disabled={loading}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-md disabled:opacity-50"
                >
                    {loading ? 'Hệ thống đang xử lý...' : 'Xác nhận đặt lịch'}
                </button>
            </div>
        </div>
    );
}