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

  // Lifted payment states
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);

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

      const isBookingPaid = data.paymentStatus === "Paid" || data.isPaid || data.paymentAt || false;
      setPaymentConfirmed(isBookingPaid);
      if (data.paymentMethod) {
        setPaymentMethod(data.paymentMethod.toUpperCase());
      } else {
        setPaymentMethod("CASH");
      }
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

  const handleConfirmPayment = async () => {
    try {
      setPaying(true);
      const res = await adminBookingService.payment(booking.id, {
        paymentMethod,
        confirmed: true,
      });
      toast.success("Ghi nhận thanh toán thành công!");
      onRefresh?.(booking.id, "PAYMENT", paymentMethod);
      fetchDetail();
    } catch (error) {
      console.error("Lỗi ghi nhận thanh toán:", error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      toast.error(serverMsg || "Không thể ghi nhận thanh toán");
    } finally {
      setPaying(false);
    }
  };

  const isPending = currentDetails.status?.toUpperCase() === "PENDING";
  const isPaid = currentDetails.paymentStatus === "Paid" || currentDetails.isPaid || currentDetails.paymentAt || false;
  const checkInTimeVal = currentDetails.checkInTime || currentDetails.checkinTime || currentDetails.CheckInTime;

  // No-show detection (overdue checkin by 15 mins or explicit status)
  const isNoShowStatus = currentDetails.status?.toUpperCase() === "NOSHOW" || currentDetails.status?.toUpperCase() === "NO_SHOW" || currentDetails.status?.toUpperCase() === "NO-SHOW";
  const scheduledDate = currentDetails.scheduledTime ? new Date(currentDetails.scheduledTime) : null;
  const isTimeOverdue = scheduledDate && !checkInTimeVal && (new Date() - scheduledDate) > 15 * 60 * 1000;
  const isNoShow = isNoShowStatus || (isPending && isTimeOverdue);

  const formattedPaymentTime = currentDetails.paymentAt
    ? new Date(currentDetails.paymentAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " " + new Date(currentDetails.paymentAt).toLocaleDateString("vi-VN")
    : "";

  return (
    <div className="booking-drawer-overlay" onClick={onClose}>
      <div className="booking-drawer-container" onClick={(e) => e.stopPropagation()}>
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

        {/* Scrollable Body */}
        <div className="booking-drawer-body">
          {loading && !details ? (
            <div className="py-12 text-center text-slate-400 w-full">
              <div className="booking-drawer-spinner mb-2"></div>
              <p className="text-xs">Đang tải chi tiết...</p>
            </div>
          ) : (
            <>
              {/* Customer Info */}
              <div className="booking-drawer-section">
                <h3 className="booking-drawer-section-title">
                  <span className="booking-drawer-section-title-icon"></span>
                  Thông tin Khách hàng
                </h3>
                <div className="booking-drawer-grid">
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Tên khách hàng:</span>
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
                  <div className="booking-drawer-row">
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
              <div className="booking-drawer-section booking-drawer-section-billing">
                <h3 className="booking-drawer-section-title">
                  <span className="booking-drawer-section-title-icon"></span>
                  Hóa đơn thanh toán
                </h3>
                <div className="booking-drawer-grid">
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Giá cơ bản:</span>
                    <span className="booking-drawer-value">
                      {(currentDetails.baseAmount ?? 0).toLocaleString()}đ
                    </span>
                  </div>
                  <div className="booking-drawer-row">
                    <span className="booking-drawer-label">Giảm giá:</span>
                    <span className="booking-drawer-value" style={{ color: '#BA1A1A' }}>
                      -{(currentDetails.discountApplied ?? 0).toLocaleString()}đ
                    </span>
                  </div>
                  {currentDetails.pointsEarned > 0 && (
                    <div className="booking-drawer-row">
                      <span className="booking-drawer-label">Điểm tích lũy:</span>
                      <span className="booking-drawer-value" style={{ color: '#006B5F' }}>
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

              {/* Check-in Banner / Button */}
              <div className="w-full">
                {isNoShow ? (
                  <div className="booking-drawer-noshow-banner">
                    {/* SVG warning icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#BA1A1A"/>
                    </svg>
                    <span>Ghi nhận xe không đến (No-show)</span>
                  </div>
                ) : checkInTimeVal ? (
                  <div className="booking-drawer-checkin-banner">
                    {/* SVG check icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#006B5F"/>
                    </svg>
                    <span>Xe đã check-in lúc {new Date(checkInTimeVal).toLocaleTimeString("vi-VN")} {new Date(checkInTimeVal).toLocaleDateString("vi-VN")}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={checkingIn || currentDetails.status?.toUpperCase() !== "PENDING"}
                    className="booking-drawer-checkin-btn"
                  >
                    {checkingIn ? (
                      <span className="booking-drawer-spinner"></span>
                    ) : (
                      "Ghi nhận xe đến (Check-in)"
                    )}
                  </button>
                )}
              </div>

              {/* Status Update Dropdown */}
              <div className="w-full">
                <label className="booking-drawer-form-label">Cập nhật trạng thái</label>
                <StatusUpdateDropdown
                  booking={currentDetails}
                  onSuccess={(status) => {
                    onRefresh?.(booking.id, "UPDATE_STATUS", status);
                    fetchDetail();
                  }}
                />
              </div>

              {/* Payment Method Selection Card Wrapper */}
              <div className="w-full">
                <PaymentForm
                  booking={currentDetails}
                  method={paymentMethod}
                  setMethod={setPaymentMethod}
                  confirmed={paymentConfirmed}
                  setConfirmed={setPaymentConfirmed}
                />
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Actions Container */}
        <div className="booking-drawer-footer">
          <button
            disabled={isPaid || !isPending || isNoShow || (paymentMethod === "CASH" && !paymentConfirmed) || paying}
            onClick={handleConfirmPayment}
            className="booking-drawer-pay-btn"
          >
            {!isPaid && isPending && !isNoShow && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="#FFFFFF"/>
              </svg>
            )}
            <span>
              {paying ? (
                "Đang ghi nhận..."
              ) : isPaid ? (
                "Đã thanh toán (Paid)"
              ) : isNoShow ? (
                "Ghi nhận xe không đến (No-show)"
              ) : !isPending ? (
                "Chỉ đơn ở trạng thái Pending mới được thanh toán"
              ) : (
                "Xác nhận thanh toán"
              )}
            </span>
          </button>

          <EmergencyStopButton
            bookingId={booking.id}
            onRefresh={() => {
              onRefresh?.(booking.id, "EMERGENCY_STOP");
              fetchDetail();
            }}
          />

          {isPaid && formattedPaymentTime && (
            <p className="booking-drawer-payment-note">
              ✓ Ghi nhận thanh toán bằng {paymentMethod === "TRANSFER" ? "Chuyển khoản" : "Tiền mặt"} lúc {formattedPaymentTime}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}