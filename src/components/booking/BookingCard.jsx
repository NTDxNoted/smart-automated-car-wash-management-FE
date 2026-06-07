// BookingCard.jsx
// Hiển thị thông tin tóm tắt một booking trong danh sách
// Click card → callback onOpenDetail(booking)
// BR-63: nút Hủy chỉ hiện khi status=Pending VÀ scheduledTime - now >= 2h

import BookingStatusBadge from "./BookingStatusBadge";

function canCancel(booking) {
  if (booking.status !== "Pending") return false;
  const diffMs = new Date(booking.scheduledTime) - new Date();
  return diffMs >= 2 * 60 * 60 * 1000; // >= 2 tiếng
}

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingCard({ booking, onOpenDetail, onCancel }) {
  const showCancelBtn = canCancel(booking);

  return (
    <div
      onClick={() => onOpenDetail(booking)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0, 220, 220, 0.12)",
        borderRadius: "14px",
        padding: "18px 22px",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0, 220, 220, 0.35)";
        e.currentTarget.style.background = "rgba(255,255,255,0.055)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0, 220, 220, 0.12)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {/* Row 1: Biển số + Service + Badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Biển số */}
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "#00DCDC",
                background: "rgba(0,220,220,0.08)",
                border: "1px solid rgba(0,220,220,0.25)",
                borderRadius: "6px",
                padding: "2px 9px",
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
              fontSize: "14px",
              color: "rgba(255,255,255,0.75)",
              margin: "6px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {booking.serviceName}
          </p>
        </div>

        {/* Số tiền */}
        <div style={{ textAlign: "right", marginLeft: "16px", flexShrink: 0 }}>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {formatVND(booking.finalAmount)}
          </span>
        </div>
      </div>

      {/* Row 2: Giờ hẹn + ID + Nút hủy */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "18px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
            🕐 {formatDateTime(booking.scheduledTime)}
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            #{booking.bookingId}
          </span>
        </div>

        {showCancelBtn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(booking);
            }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#FF5C5C",
              background: "rgba(255,92,92,0.08)",
              border: "1px solid rgba(255,92,92,0.3)",
              borderRadius: "8px",
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,92,92,0.18)";
              e.currentTarget.style.borderColor = "rgba(255,92,92,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,92,92,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,92,92,0.3)";
            }}
          >
            Hủy lịch
          </button>
        )}
      </div>
    </div>
  );
}
