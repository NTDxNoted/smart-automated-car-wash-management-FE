export default function BookingTable({
  bookings,
  onRowClick,
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Plate</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Amount</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-t cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick(booking)}
            >
              <td className="p-3">{booking.customerName}</td>
              <td className="p-3">{booking.phone}</td>
              <td className="p-3">{booking.licensePlate}</td>
              <td className="p-3">{booking.status}</td>
              <td className="p-3">
                {booking.totalAmount?.toLocaleString()}đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}