// BookingDetailModal.jsx
// Modal chi tiết booking — hiển thị đầy đủ invoice breakdown + điểm tích lũy
// BR-63: nút Hủy chỉ hiện khi status=Pending VÀ scheduledTime - now >= 2h

import BookingStatusBadge from "./BookingStatusBadge";

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function canCancel(booking) {
  if (booking.status !== "Pending") return false;
  const diffMs = new Date(booking.scheduledTime) - new Date();
  return diffMs >= 2 * 60 * 60 * 1000;
}

function InvoiceRow({ label, amount, isDiscount = false, isFinal = false, highlight = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isFinal ? "10px 0 0" : "6px 0",
        borderTop: isFinal ? "1px solid rgba(0,0,0,0.1)" : "none",
        marginTop: isFinal ? "4px" : 0,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isFinal ? "14px" : "13px",
          color: isFinal ? "#0f172a" : "rgba(0,0,0,0.6)",
          fontWeight: isFinal ? 600 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isFinal ? "16px" : "13px",
          fontWeight: isFinal ? 700 : 500,
          color: isFinal
            ? "#0891b2"
            : isDiscount
            ? "#16a34a"
            : highlight
            ? "#d97706"
            : "rgba(0,0,0,0.7)",
        }}
      >
        {isDiscount && amount > 0 ? `−${formatVND(amount)}` : formatVND(amount)}
      </span>
    </div>
  );
}

export default function BookingDetailModal({ booking, onClose, onCancel }) {
  if (!booking) return null;
  const showCancel = canCancel(booking);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "480px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          border: "none",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,220,220,0.2) transparent",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#0891b2",
                  letterSpacing: "0.06em",
                }}
              >
                {booking.vehiclePlate}
              </span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: "#0f172a",
                margin: "0 0 4px",
                fontWeight: 500,
              }}
            >
              {booking.serviceName}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(0,0,0,0.5)", margin: 0 }}>
              #{booking.bookingId}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              color: "rgba(0,0,0,0.5)",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Giờ hẹn */}
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
          <span style={{ fontSize: "18px" }}>📅</span>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(0,0,0,0.5)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Giờ hẹn</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#0891b2", margin: 0, fontWeight: 500 }}>
              {formatDateTime(booking.scheduledTime)}
            </p>
          </div>
        </div>

        {/* Invoice Breakdown */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "12px", color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
            Chi tiết hóa đơn
          </p>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "14px 16px",
            }}
          >
            <InvoiceRow label="Giá dịch vụ" amount={booking.baseAmount} />
            {booking.tierDiscount > 0 && (
              <InvoiceRow label="Giảm hạng thành viên (Tier)" amount={booking.tierDiscount} isDiscount />
            )}
            {booking.promotionDiscount > 0 && (
              <InvoiceRow label="Mã khuyến mãi" amount={booking.promotionDiscount} isDiscount />
            )}
            {booking.rewardDiscount > 0 && (
              <InvoiceRow label="Đổi điểm thưởng (Reward)" amount={booking.rewardDiscount} isDiscount />
            )}
            <InvoiceRow label="Thành tiền" amount={booking.finalAmount} isFinal />
          </div>
        </div>

        {/* Points Info */}
        <div
          style={{
            background: "rgba(217, 119, 6, 0.05)",
            border: "1px solid rgba(217, 119, 6, 0.2)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>⭐</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(0,0,0,0.6)" }}>
              {booking.status === "Cancelled" ? "Điểm được hoàn trả" : "Điểm tích lũy"}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#d97706",
            }}
          >
            {booking.status === "Cancelled"
              ? `+${booking.pointsRefunded} pts`
              : booking.pointsEarned > 0
              ? `+${booking.pointsEarned} pts`
              : "—"}
          </span>
        </div>

        {/* Cancel Button — BR-63 */}
        {showCancel && (
          <button
            onClick={() => {
              onClose();
              onCancel(booking);
            }}
            style={{
              width: "100%",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FF5C5C",
              background: "rgba(255,92,92,0.08)",
              border: "1px solid rgba(255,92,92,0.3)",
              borderRadius: "10px",
              padding: "13px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,92,92,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,92,92,0.08)";
            }}
          >
            Hủy lịch hẹn này
          </button>
        )}
      </div>
    </div>
  );
}
