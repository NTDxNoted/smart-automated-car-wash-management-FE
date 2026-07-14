import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";

export default function PaymentForm({
  booking,
  onSuccess,
}) {
  const [method, setMethod] = useState("CASH");
  const [confirmed, setConfirmed] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentAt, setPaymentAt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      const isBookingPaid = booking.paymentStatus === "Paid" || booking.isPaid || booking.paymentAt || false;
      setPaid(isBookingPaid);
      setConfirmed(isBookingPaid);
      if (booking.paymentMethod) {
        setMethod(booking.paymentMethod.toUpperCase());
      } else {
        setMethod("CASH");
      }
      setPaymentAt(booking.paymentAt || null);
    }
  }, [booking]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await adminBookingService.payment(booking.id, {
        paymentMethod: method,
        confirmed: true,
      });

      setPaid(true);
      setPaymentAt(res.data?.paymentAt || res.data?.updatedAt || new Date().toISOString());
      toast.success("Ghi nhận thanh toán thành công!");
      onSuccess?.(method);
    } catch (error) {
      console.error("Lỗi ghi nhận thanh toán:", error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      toast.error(
        serverMsg || "Không thể ghi nhận thanh toán"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (value) => {
    setMethod(value);
    setConfirmed(false);
  };

  const formattedPaymentTime = paymentAt
    ? new Date(paymentAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  const isPending = booking.status?.toUpperCase() === "PENDING";

  return (
    <fieldset
      disabled={paid || loading || !isPending}
      className="booking-drawer-payment-fieldset"
    >
      <legend className="booking-drawer-payment-legend">
        Thanh toán tại quầy
      </legend>

      <div className="booking-drawer-radio-group">
        <div
          className={`booking-drawer-radio-card ${method === "CASH" ? "active" : ""} ${!isPending && !paid ? "opacity-50" : ""}`}
          onClick={() => !paid && isPending && handleMethodChange("CASH")}
        >
          <input
            type="radio"
            checked={method === "CASH"}
            readOnly
            disabled={paid || !isPending}
            className="booking-drawer-radio-input"
          />
          <span className="booking-drawer-radio-text">Tiền mặt (Cash)</span>
        </div>

        <div
          className={`booking-drawer-radio-card ${method === "TRANSFER" ? "active" : ""} ${!isPending && !paid ? "opacity-50" : ""}`}
          onClick={() => !paid && isPending && handleMethodChange("TRANSFER")}
        >
          <input
            type="radio"
            checked={method === "TRANSFER"}
            readOnly
            disabled={paid || !isPending}
            className="booking-drawer-radio-input"
          />
          <span className="booking-drawer-radio-text">Chuyển khoản (Transfer)</span>
        </div>
      </div>

      {method === "CASH" && (
        <label className="booking-drawer-checkbox-card">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={paid || !isPending}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="booking-drawer-checkbox-input"
          />
          <span className="booking-drawer-checkbox-text">Tôi xác nhận đã thu đủ tiền mặt từ khách hàng</span>
        </label>
      )}

      <button
        disabled={paid || !isPending || (method === "CASH" && !confirmed) || loading}
        onClick={handleConfirm}
        className="booking-drawer-pay-btn"
        style={{
          background: !isPending && !paid ? 'rgba(255, 255, 255, 0.05)' : undefined,
          border: !isPending && !paid ? '1px solid rgba(255, 255, 255, 0.05)' : undefined,
          color: !isPending && !paid ? '#64748b' : undefined,
          cursor: !isPending && !paid ? 'not-allowed' : undefined
        }}
      >
        {loading ? (
          <>
            <span className="booking-drawer-spinner"></span>
            <span>Đang ghi nhận...</span>
          </>
        ) : paid ? (
          "Đã thanh toán (Paid)"
        ) : !isPending ? (
          "Chỉ đơn ở trạng thái Pending mới được thanh toán"
        ) : (
          "Xác nhận thanh toán"
        )}
      </button>

      {paid && paymentAt && (
        <p className="text-emerald-400 text-xs text-center mt-2">
          ✓ Ghi nhận thanh toán bằng {method === "CASH" ? "Tiền mặt" : "Chuyển khoản"} lúc {formattedPaymentTime}
        </p>
      )}
    </fieldset>
  );
}