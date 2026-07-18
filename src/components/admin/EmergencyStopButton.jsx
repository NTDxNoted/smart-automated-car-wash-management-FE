import { useState } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";

export default function EmergencyStopButton({
  bookingId,
  onRefresh,
}) {
  const [loading, setLoading] =
    useState(false);

  const handleEmergencyStop =
    async () => {
      const confirmed =
        window.confirm(
          "Bạn chắc chắn muốn dừng khẩn cấp?"
        );

      if (!confirmed) return;

      try {
        setLoading(true);

        await adminBookingService.emergencyStop(bookingId, { reason: "Dừng khẩn cấp máy rửa" });

        toast.error(
          "Đã kích hoạt dừng khẩn cấp!",
          { icon: "🚨", duration: 4000 }
        );

        await onRefresh?.();
      } catch (error) {
        toast.error(
          "Không thể thực hiện dừng khẩn cấp"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <button
      disabled={loading}
      onClick={handleEmergencyStop}
      className="booking-drawer-emergency-btn"
    >
      {loading
        ? "Đang xử lý..."
        : "Dừng khẩn cấp"}
    </button>
  );
}