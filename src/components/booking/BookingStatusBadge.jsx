// BookingStatusBadge.jsx
// BR-64: Màu theo spec — Pending=vàng, Completed=xanh lá, Cancelled=xám, Failed=đỏ, No-show=cam

const STATUS_CONFIG = {
  Pending:   { label: "Chờ xác nhận", bg: "#2D2500", color: "#FFD04A", border: "#5C4A00" },
  Completed: { label: "Hoàn thành",   bg: "#0A2D1A", color: "#4AE082", border: "#0F5C31" },
  Cancelled: { label: "Đã hủy",       bg: "#1C1C1C", color: "#A0A0A0", border: "#3A3A3A" },
  Failed:    { label: "Thất bại",      bg: "#2D0A0A", color: "#FF5C5C", border: "#5C1A1A" },
  "No-show": { label: "Vắng mặt",     bg: "#2D1500", color: "#FF8C42", border: "#5C2E00" },
};

export default function BookingStatusBadge({ status, size = "md" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Cancelled"];
  const fontSize = size === "sm" ? "11px" : "12px";
  const padding  = size === "sm" ? "2px 8px" : "3px 10px";

  return (
    <span
      style={{
        display: "inline-block",
        fontSize,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding,
        borderRadius: "100px",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}
