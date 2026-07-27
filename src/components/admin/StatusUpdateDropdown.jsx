import { useState } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";

export default function StatusUpdateDropdown({
  booking,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const disabled = booking?.status?.toUpperCase() !== "PENDING";

  let currentStatus = booking?.status?.toUpperCase() || "";
  if (currentStatus === "NO_SHOW") currentStatus = "NOSHOW";

  const selectedValue = currentStatus === "PENDING" ? "" : currentStatus;

  const handleChange = async (e) => {
    const status = e.target.value;

    if (!status || status === currentStatus) return;

    try {
      setLoading(true);

      await adminBookingService.updateStatus(
        booking.id,
        status
      );

      toast.success(
        "Cập nhật trạng thái thành công"
      );

      onSuccess?.(status);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Không thể cập nhật trạng thái"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-drawer-select-wrapper">
      <select
        disabled={disabled || loading}
        onChange={handleChange}
        value={selectedValue}
        className="booking-drawer-select"
      >
        {!disabled && (
          <option value="" disabled>
            Cập nhật trạng thái...
          </option>
        )}

        <option value="COMPLETED">
          Completed (Đã hoàn thành)
        </option>

        <option value="NOSHOW">
          No-show (Khách không đến)
        </option>

        <option value="FAILED">
          Failed (Thất bại)
        </option>

        <option value="CANCELLED">
          Cancelled (Đã hủy)
        </option>
      </select>
    </div>
  );
}