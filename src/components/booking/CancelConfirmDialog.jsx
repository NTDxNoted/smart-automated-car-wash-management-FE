// CancelConfirmDialog.jsx
// Dialog xác nhận hủy lịch — hiển thị thông tin booking và cảnh báo trước khi submit

import BookingStatusBadge from "./BookingStatusBadge";

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function estimatePointsRefund(finalAmount) {
  return Math.floor(finalAmount / 10000);
}

export default function CancelConfirmDialog({ booking, onConfirm, onClose, isLoading }) {
  if (!booking) return null;
  const estimatedPoints = estimatePointsRefund(booking.finalAmount);

  return (
    // Faux viewport overlay — dùng normal-flow div để tránh position:fixed collapse iframe
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          maxWidth: "90vw",
          background: "#ffffff",
          border: "none",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 0 40px rgba(255,92,92,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,92,92,0.12)",
              border: "1px solid rgba(255,92,92,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              marginBottom: "14px",
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            Xác nhận hủy lịch hẹn
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "rgba(0,0,0,0.5)",
              margin: 0,
            }}
          >
            Hành động này không thể hoàn tác sau khi xác nhận.
          </p>
        </div>

        {/* Booking Info */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0891b2",
                letterSpacing: "0.05em",
              }}
            >
              {booking.vehiclePlate}
            </span>
            <BookingStatusBadge status="Pending" size="sm" />
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(0,0,0,0.7)", margin: "0 0 4px" }}>
            {booking.serviceName}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0 }}>
            #{booking.bookingId}
          </p>
        </div>

        {/* Points Refund Info */}
        {estimatedPoints > 0 && (
          <div
            style={{
              background: "rgba(8, 145, 178, 0.05)",
              border: "1px solid rgba(8, 145, 178, 0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>💎</span>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#0891b2",
                margin: 0,
              }}
            >
              Khi hủy, bạn sẽ nhận lại khoảng{" "}
              <strong>{estimatedPoints} điểm</strong> Loyalty.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(0,0,0,0.6)",
              background: "#f1f5f9",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Giữ lịch
          </button>
          <button
            onClick={() => onConfirm(booking.bookingId)}
            disabled={isLoading}
            style={{
              flex: 1,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: isLoading ? "rgba(255,92,92,0.3)" : "rgba(255,92,92,0.85)",
              border: "1px solid rgba(255,92,92,0.5)",
              borderRadius: "10px",
              padding: "12px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? "Đang hủy..." : "Xác nhận hủy"}
          </button>
        </div>
      </div>
    </div>
  );
}
