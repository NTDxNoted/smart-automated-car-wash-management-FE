import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";
import PaymentForm from "./PaymentForm";
import StatusUpdateDropdown from "./StatusUpdateDropdown";
import EmergencyStopButton from "./EmergencyStopButton";
import "./BookingDetailDrawer.css";


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
      if (data) {
        data.id = data.bookingID ?? data.bookingId ?? data.id ?? booking.id;
      }
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
      onRefresh?.(booking.id, "UPDATE_PLATE", plate.trim());
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
      onRefresh?.(booking.id, "CHECKIN");
      fetchDetail();
    } catch (err) {
      console.error("Lỗi check-in:", err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      toast.error(serverMsg || "Không thể ghi nhận check-in");
    } finally {
      setCheckingIn(false);
    }
  };

  // Determine checkin status
  const checkInTimeVal = currentDetails.checkInTime || currentDetails.checkinTime || currentDetails.CheckInTime;
  return (
    <div className="booking-drawer-overlay">
      <div className="booking-drawer-container">
        <div className="space-y-6">
          {/* Header */}
          <div className="booking-drawer-header">
            <div className="booking-drawer-title-wrapper">
              <h2 className="booking-drawer-title">Chi tiết Đặt lịch</h2>
              <p className="booking-drawer-subtitle">Mã booking: {booking.id}</p>
            </div>
            <button onClick={onClose} className="booking-drawer-close-btn">
              ✕
            </button>
          </div>

          {loading && !details ? (
            <div className="py-12 text-center text-slate-400">
              <div className="booking-drawer-spinner mb-2"></div>
              <p className="text-xs">Đang tải chi tiết...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Customer Info */}
              <div className="booking-drawer-section">
                <h3 className="booking-drawer-section-title">Thông tin Khách hàng</h3>
                <div className="booking-drawer-grid">
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Tên khách:</span>
                    <span className="booking-drawer-value highlight">
                      {currentDetails.customerName || "Vãng lai"}
                    </span>
                  </div>
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Số ĐT:</span>
                    <span className="booking-drawer-value">
                      {currentDetails.phone || "-"}
                    </span>
                  </div>
                  <div className="booking-drawer-row" style={{ alignItems: 'center' }}>
                    <span className="booking-drawer-label">Biển số:</span>
                    <div className="booking-drawer-plate-wrapper">
                      <input
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        className="booking-drawer-plate-input"
                      />
                      <button
                        onClick={handleSavePlate}
                        disabled={updatingPlate}
                        className="booking-drawer-save-btn"
                      >
                        {updatingPlate ? <span className="booking-drawer-spinner"></span> : "Lưu"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="booking-drawer-section">
                <h3 className="booking-drawer-section-title">Hóa đơn thanh toán</h3>
                <div className="booking-drawer-grid">
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Giá cơ bản:</span>
                    <span className="booking-drawer-value">
                      {(currentDetails.baseAmount ?? 0).toLocaleString()}đ
                    </span>
                  </div>
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Giảm giá:</span>
                    <span className="booking-drawer-value" style={{ color: '#f87171' }}>
                      -{(currentDetails.discountApplied ?? 0).toLocaleString()}đ
                    </span>
                  </div>
                  {currentDetails.pointsEarned > 0 && (
                    <div className="booking-drawer-row">
                      <span className="booking-drawer-label">Điểm tích lũy:</span>
                      <span className="booking-drawer-value" style={{ color: '#34d399' }}>
                        +{currentDetails.pointsEarned} pts
                      </span>
                    </div>
                  )}
                  <div className="booking-drawer-divider" />
                  <div className="booking-drawer-total-row">
                    <span className="booking-drawer-total-label">Tổng thanh toán:</span>
                    <span className="booking-drawer-total-value">
                      {(currentDetails.finalAmount ?? currentDetails.totalAmount ?? currentDetails.totalPrice ?? 0).toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Check-in Block */}
              <div>
                {checkInTimeVal ? (
                  <div className="booking-drawer-checkin-banner">
                    <span>✓ Xe đã check-in lúc {new Date(checkInTimeVal).toLocaleString("vi-VN")}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn || currentDetails.status?.toUpperCase() !== "PENDING"}
                    className="booking-drawer-checkin-btn"
                    style={{
                      background: currentDetails.status?.toUpperCase() !== "PENDING" ? 'rgba(255, 255, 255, 0.05)' : undefined,
                      border: currentDetails.status?.toUpperCase() !== "PENDING" ? '1px solid rgba(255, 255, 255, 0.05)' : undefined,
                      color: currentDetails.status?.toUpperCase() !== "PENDING" ? '#64748b' : undefined,
                      cursor: currentDetails.status?.toUpperCase() !== "PENDING" ? 'not-allowed' : undefined,
                      boxShadow: currentDetails.status?.toUpperCase() !== "PENDING" ? 'none' : undefined
                    }}
                  >
                    {checkingIn ? (
                      <span className="booking-drawer-spinner"></span>
                    ) : currentDetails.status?.toUpperCase() !== "PENDING" ? (
                      `Không thể check-in đơn ${currentDetails.status}`
                    ) : (
                      "Ghi nhận xe đến (Check-in)"
                    )}
                  </button>
                )}
              </div>

              {/* Status Update Block */}
              <div className="space-y-2">
                <label className="booking-drawer-form-label">Cập nhật trạng thái</label>
                <StatusUpdateDropdown
                  booking={currentDetails}
                  onSuccess={(status) => {
                    onRefresh?.(booking.id, "UPDATE_STATUS", status);
                    fetchDetail();
                  }}
                />
              </div>

              {/* Payment Form */}
              <div className="pt-2">
                <PaymentForm
                  booking={currentDetails}
                  onSuccess={(method) => {
                    onRefresh?.(booking.id, "PAYMENT", method);
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
              onRefresh?.(booking.id, "EMERGENCY_STOP");
              fetchDetail();
            }}
          />
        </div>
      </div>
    </div>
  );
}