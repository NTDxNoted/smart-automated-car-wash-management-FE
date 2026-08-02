import { useState } from "react";
import { toast } from "react-hot-toast";
import adminBookingService from "../../services/adminBookingService";

const NOSHOW_DISABLED_TOOLTIP =
  "Trạng thái No-show chỉ khả dụng sau 15 phút kể từ giờ hẹn hoặc khi Admin xác nhận khách không đến.";

export default function StatusUpdateDropdown({
  booking,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const disabled = booking?.status?.toUpperCase() !== "PENDING";

  let currentStatus = booking?.status?.toUpperCase() || "";
  if (currentStatus === "NO_SHOW") currentStatus = "NOSHOW";

  const selectedValue = currentStatus === "PENDING" ? "" : currentStatus;

  const checkInTimeVal = booking?.checkInTime || booking?.checkinTime || booking?.CheckInTime;
  const scheduledDate = booking?.scheduledTime ? new Date(booking.scheduledTime) : null;
  const now = Date.now();

  // 3 mốc thời gian cho No-show (đơn còn Pending, chưa check-in):
  // - Trước giờ hẹn: chưa cho chọn.
  // - Từ giờ hẹn đến hết 15 phút (grace window): chưa cho chọn qua dropdown, nhưng Admin có thể
  //   ghi đè bằng nút "Đánh dấu No-show" riêng nếu đã xác nhận với khách.
  // - Sau 15 phút: cho chọn bình thường qua dropdown (hoặc AutoNoShowJob ở backend tự chuyển).
  const appointmentStarted = scheduledDate && now >= scheduledDate.getTime();
  const graceWindowActive =
    scheduledDate && now >= scheduledDate.getTime() && now < scheduledDate.getTime() + 15 * 60 * 1000;
  const noShowAutoEligible = scheduledDate && now >= scheduledDate.getTime() + 15 * 60 * 1000;

  const canShowNoShow = disabled ? currentStatus === "NOSHOW" : !checkInTimeVal;
  const noShowOptionDisabled = !disabled && !checkInTimeVal && !noShowAutoEligible;
  const showOverrideButton = !disabled && !checkInTimeVal && appointmentStarted && graceWindowActive;

  const submitStatus = async (status) => {
    try {
      setLoading(true);

      await adminBookingService.updateStatus(booking.id, status);

      toast.success("Cập nhật trạng thái thành công");

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

  const handleChange = async (e) => {
    const status = e.target.value;

    if (!status || status === currentStatus) return;

    await submitStatus(status);
  };

  const handleOverrideNoShow = async () => {
    const confirmed = window.confirm(
      "Xác nhận khách đã báo không đến / muốn hủy lịch? Đơn sẽ được đánh dấu No-show ngay."
    );

    if (!confirmed) return;

    await submitStatus("NOSHOW");
  };

  return (
    <div>
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

          {disabled && currentStatus === "COMPLETED" && (
            <option value="COMPLETED">
              Completed (Đã hoàn thành)
            </option>
          )}

          {canShowNoShow && (
            <option
              value="NOSHOW"
              disabled={noShowOptionDisabled}
              title={noShowOptionDisabled ? NOSHOW_DISABLED_TOOLTIP : undefined}
            >
              No-show (Khách không đến)
            </option>
          )}

          <option value="FAILED">
            Failed (Thất bại)
          </option>

          <option value="CANCELLED">
            Cancelled (Đã hủy)
          </option>
        </select>
      </div>

      {showOverrideButton && (
        <button
          type="button"
          disabled={loading}
          onClick={handleOverrideNoShow}
          className="booking-drawer-noshow-override-btn"
          title="Đánh dấu No-show ngay mà không cần chờ hết 15 phút"
        >
          Đánh dấu No-show (khách xác nhận không đến)
        </button>
      )}
    </div>
  );
}
