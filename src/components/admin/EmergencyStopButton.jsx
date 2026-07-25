import { useState } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";

export default function EmergencyStopButton({
  bookingId,
  disabled,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);

  const handleEmergencyStop = async () => {
    const confirmed = window.confirm("Bạn chắc chắn muốn dừng khẩn cấp?");

    if (!confirmed) return;

    try {
      setLoading(true);

      await adminBookingService.emergencyStop(bookingId, { reason: "Dừng khẩn cấp máy rửa" });

      toast.error("Đã kích hoạt dừng khẩn cấp!", { icon: "🚨", duration: 4000 });

      await onRefresh?.();
    } catch (error) {
      console.error("Emergency stop error:", error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      toast.error(serverMsg || "Không thể thực hiện dừng khẩn cấp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading || disabled}
      onClick={handleEmergencyStop}
      className={`booking-drawer-emergency-btn ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={disabled ? "Chỉ có thể dừng khẩn cấp đơn đang rửa xe (đã Check-in)" : ""}
    >
      {loading ? "Đang xử lý..." : "Dừng khẩn cấp"}
    </button>
  );
}