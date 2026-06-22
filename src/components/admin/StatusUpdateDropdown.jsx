import { useState } from "react";
import { toast } from "react-toastify";
import adminBookingService from "../../services/adminBookingService";

export default function StatusUpdateDropdown({
  booking,
  onSuccess,
}) {
  const [loading, setLoading] =
    useState(false);

  const disabled =
    booking.status !== "PENDING";

  const handleChange = async (e) => {
    const status = e.target.value;

    if (!status) return;

    try {
      setLoading(true);

      await adminBookingService.updateStatus(
        booking.id,
        status
      );

      toast.success(
        "Cập nhật trạng thái thành công"
      );

      onSuccess?.();
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
    <select
      disabled={disabled || loading}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">
        Update status
      </option>

      <option value="COMPLETED">
        Completed
      </option>

      <option value="FAILED">
        Failed
      </option>

      <option value="CANCELLED">
        Cancelled
      </option>
    </select>
  );
}