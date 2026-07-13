import { useState } from "react";
import { toast } from "react-toastify";
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

        await adminBookingService.emergencyStop(
          bookingId
        );

        toast.error(
          "Đã kích hoạt dừng khẩn cấp"
        );

        await onRefresh?.();
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Không thể dừng khẩn cấp";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

  return (
    <button
      disabled={loading}
      onClick={handleEmergencyStop}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
    >
      {loading
        ? "Đang xử lý..."
        : "Dừng khẩn cấp"}
    </button>
  );
}