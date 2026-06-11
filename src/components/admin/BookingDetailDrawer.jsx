import PaymentForm from "./PaymentForm";
import StatusUpdateDropdown from "./StatusUpdateDropdown";
import EmergencyStopButton from "./EmergencyStopButton";

export default function BookingDetailDrawer({
  booking,
  open,
  onClose,
  onRefresh,
}) {
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* drawer */}
      <div className="absolute right-0 top-0 h-full w-[500px] bg-white shadow-xl overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Booking Detail
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        {/* INFO */}
        <div className="space-y-3">
          <div>
            <b>Customer:</b> {booking.customerName}
          </div>

          <div>
            <b>Phone:</b> {booking.phone}
          </div>

          <div>
            <b>License Plate:</b>{" "}
            <input
              defaultValue={booking.licensePlate}
              className="border rounded px-2 py-1 ml-2"
            />
          </div>

          <div>
            <b>Status:</b> {booking.status}
          </div>
        </div>

        {/* CHECK-IN */}
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded">
          Check-in
        </button>

        {/* STATUS UPDATE */}
        <div className="mt-6">
          <StatusUpdateDropdown
            booking={booking}
            onSuccess={onRefresh}
          />
        </div>

        {/* PAYMENT */}
        <div className="mt-6">
          <PaymentForm
            booking={booking}
            onSuccess={onRefresh}
          />
        </div>

        {/* EMERGENCY */}
        <div className="mt-6">
          <EmergencyStopButton
            bookingId={booking.id}
          />
        </div>
      </div>
    </div>
  );
}