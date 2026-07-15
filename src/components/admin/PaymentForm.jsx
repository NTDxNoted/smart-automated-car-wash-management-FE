import { useEffect } from "react";

export default function PaymentForm({
  booking,
  method,
  setMethod,
  confirmed,
  setConfirmed,
}) {
  const isPaid = booking.status?.toUpperCase() === "COMPLETED" || booking.paymentStatus === "Paid" || booking.isPaid || booking.paymentAt || false;
  const isPending = booking.status?.toUpperCase() === "PENDING";

  useEffect(() => {
    if (booking) {
      if (booking.paymentMethod) {
        setMethod(booking.paymentMethod.toUpperCase());
      } else {
        setMethod("CASH");
      }
    }
  }, [booking, setMethod]);

  const handleMethodChange = (value) => {
    setMethod(value);
    setConfirmed(false);
  };

  return (
    <div className="booking-drawer-payment-fieldset">
      <span className="booking-drawer-payment-legend">
        Thanh toán tại quầy
      </span>

      <div className="booking-drawer-radio-group">
        <div
          className={`booking-drawer-radio-card ${method === "CASH" ? "active" : ""} ${!isPending && !isPaid ? "opacity-50" : ""}`}
          onClick={() => !isPaid && isPending && handleMethodChange("CASH")}
        >
          <input
            type="radio"
            checked={method === "CASH"}
            readOnly
            disabled={isPaid || !isPending}
            className="booking-drawer-radio-input"
          />
          {/* Banknote SVG icon */}
          <svg width="22" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '4px' }}>
            <rect x="1" y="1" width="22" height="14" rx="2" stroke={method === "CASH" ? "#006B5F" : "#3C4947"} strokeWidth="2"/>
            <circle cx="12" cy="8" r="3" stroke={method === "CASH" ? "#006B5F" : "#3C4947"} strokeWidth="2"/>
            <path d="M5 5h.01M19 5h.01M5 11h.01M19 11h.01" stroke={method === "CASH" ? "#006B5F" : "#3C4947"} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="booking-drawer-radio-text">Tiền mặt (Cash)</span>
        </div>

        <div
          className={`booking-drawer-radio-card ${method === "TRANSFER" ? "active" : ""} ${!isPending && !isPaid ? "opacity-50" : ""}`}
          onClick={() => !isPaid && isPending && handleMethodChange("TRANSFER")}
        >
          <input
            type="radio"
            checked={method === "TRANSFER"}
            readOnly
            disabled={isPaid || !isPending}
            className="booking-drawer-radio-input"
          />
          {/* Bank temple SVG icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '4px' }}>
            <path d="M12 2L2 7V9H22V7L12 2Z" fill={method === "TRANSFER" ? "#006B5F" : "#3C4947"}/>
            <path d="M4 10H6V18H4V10Z" fill={method === "TRANSFER" ? "#006B5F" : "#3C4947"}/>
            <path d="M9 10H11V18H9V10Z" fill={method === "TRANSFER" ? "#006B5F" : "#3C4947"}/>
            <path d="M14 10H16V18H14V10Z" fill={method === "TRANSFER" ? "#006B5F" : "#3C4947"}/>
            <path d="M19 10H21V18H19V10Z" fill={method === "TRANSFER" ? "#006B5F" : "#3C4947"}/>
            <path d="M2 20H22V22H2V20Z" fill={method === "TRANSFER" ? "#006B5F" : "#3C4947"}/>
          </svg>
          <span className="booking-drawer-radio-text">Chuyển khoản (Transfer)</span>
        </div>
      </div>

      {method === "CASH" && (
        <label className="booking-drawer-checkbox-card">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={isPaid || !isPending}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="booking-drawer-checkbox-input"
          />
          <span className="booking-drawer-checkbox-text">Tôi xác nhận đã thu đủ tiền mặt từ khách hàng</span>
        </label>
      )}
    </div>
  );
}