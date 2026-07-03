import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";
import PaymentForm from "./PaymentForm";
import StatusUpdateDropdown from "./StatusUpdateDropdown";
import EmergencyStopButton from "./EmergencyStopButton";

export default function BookingDetailDrawer({
  booking,
  open,
  onClose,
  onRefresh,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plate, setPlate] = useState("");
  const [updatingPlate, setUpdatingPlate] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (booking && open) {
      fetchDetail();
    } else {
      setDetails(null);
    }
  }, [booking, open]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await adminBookingService.getDetail(booking.id);
      const data = res.data?.data || res.data || booking;
      setDetails(data);
      setPlate(data.licensePlate || "");
    } catch (err) {
      console.error("Fetch booking detail error:", err);
      setDetails(booking);
      setPlate(booking.licensePlate || "");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !booking) return null;

  const currentDetails = details || booking;

  const handleSavePlate = async () => {
    if (!plate.trim()) {
      toast.error("Vui lòng nhập biển số xe");
      return;
    }
    try {
      setUpdatingPlate(true);
      await adminBookingService.updatePlate(booking.id, plate.trim());
      toast.success("Cập nhật biển số thành công");
      onRefresh?.();
      fetchDetail();
    } catch (err) {
      toast.error("Không thể cập nhật biển số xe");
      console.error(err);
    } finally {
      setUpdatingPlate(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      await adminBookingService.checkin(booking.id);
      toast.success("Đã ghi nhận check-in thành công");
      onRefresh?.();
      fetchDetail();
    } catch (err) {
      toast.error("Không thể ghi nhận check-in");
      console.error(err);
    } finally {
      setCheckingIn(false);
    }
  };

  // Determine checkin status
  const checkInTimeVal = currentDetails.checkInTime || currentDetails.checkinTime || currentDetails.CheckInTime;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* drawer content */}
      <div className="relative w-full max-w-md h-full bg-[#0c0f24] border-l border-white/10 shadow-2xl text-slate-100 p-6 overflow-y-auto flex flex-col justify-between z-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Chi tiết Đặt lịch</h2>
              <p className="text-xs text-slate-400 mt-1">Mã booking: {booking.id}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {loading && !details ? (
            <div className="py-12 text-center text-slate-400">
              <div className="inline-block w-6 h-6 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
              <p className="text-xs">Đang tải chi tiết...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Customer Info */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Thông tin Khách hàng</h3>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-400">Tên khách:</span>
                  <span className="col-span-2 text-slate-200 font-semibold">{currentDetails.customerName || "Vãng lai"}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-400">Số ĐT:</span>
                  <span className="col-span-2 text-slate-200">{currentDetails.phone || "-"}</span>
                </div>
                <div className="grid grid-cols-3 text-sm items-center">
                  <span className="text-slate-400">Biển số:</span>
                  <div className="col-span-2 flex gap-2">
                    <input
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      className="bg-[#070913] border border-white/10 text-white rounded-lg px-2 py-1 text-xs w-full focus:border-cyan-500 outline-none font-mono"
                    />
                    <button
                      onClick={handleSavePlate}
                      disabled={updatingPlate}
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition shrink-0"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Hóa đơn thanh toán</h3>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-400">Giá cơ bản:</span>
                  <span className="col-span-2 text-right text-slate-300">
                    {(currentDetails.baseAmount ?? 0).toLocaleString()}đ
                  </span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-slate-400">Giảm giá:</span>
                  <span className="col-span-2 text-right text-red-400">
                    -{(currentDetails.discountApplied ?? 0).toLocaleString()}đ
                  </span>
                </div>
                {currentDetails.pointsEarned > 0 && (
                  <div className="grid grid-cols-3 text-sm">
                    <span className="text-slate-400">Điểm tích lũy:</span>
                    <span className="col-span-2 text-right text-emerald-400">+{currentDetails.pointsEarned} pts</span>
                  </div>
                )}
                <div className="h-[1px] bg-white/5 my-2" />
                <div className="grid grid-cols-3 text-sm font-semibold">
                  <span className="text-slate-200">Tổng thanh toán:</span>
                  <span className="col-span-2 text-right text-white text-base">
                    {(currentDetails.finalAmount ?? currentDetails.totalAmount ?? 0).toLocaleString()}đ
                  </span>
                </div>
              </div>

              {/* Check-in Block */}
              <div>
                {checkInTimeVal ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-3 text-center">
                    ✓ Xe đã check-in lúc {new Date(checkInTimeVal).toLocaleString("vi-VN")}
                  </div>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Ghi nhận xe đến (Check-in)
                  </button>
                )}
              </div>

              {/* Status Update Block */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cập nhật trạng thái</label>
                <StatusUpdateDropdown
                  booking={currentDetails}
                  onSuccess={() => {
                    onRefresh?.();
                    fetchDetail();
                  }}
                />
              </div>

              {/* Payment Form */}
              <div className="pt-2">
                <PaymentForm
                  booking={currentDetails}
                  onSuccess={() => {
                    onRefresh?.();
                    fetchDetail();
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Emergency Stop at the bottom */}
        <div className="border-t border-white/5 pt-4 mt-6">
          <EmergencyStopButton
            bookingId={booking.id}
            onRefresh={() => {
              onRefresh?.();
              fetchDetail();
            }}
          />
        </div>
      </div>
    </div>
  );
}