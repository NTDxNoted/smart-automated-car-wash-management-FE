export default function StatusUpdateDropdown({
  booking,
}) {
  const disabled = booking.status !== "PENDING";

  return (
    <select
      disabled={disabled}
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