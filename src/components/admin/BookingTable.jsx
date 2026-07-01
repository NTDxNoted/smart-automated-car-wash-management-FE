const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-cyan-100 text-cyan-700 border border-cyan-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  FAILED: "bg-rose-100 text-rose-700 border border-rose-200",
  NOSHOW: "bg-rose-100 text-rose-700 border border-rose-200",
};

export default function BookingTable({
  bookings,
  loading,
  onRowClick,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
          <tr className="divide-x divide-slate-200">
            <th className="px-6 py-5">CUSTOMER</th>
            <th className="px-6 py-5">PHONE</th>
            <th className="px-6 py-5">PLATE</th>
            <th className="px-6 py-5">SERVICE</th>
            <th className="px-6 py-5">STATUS</th>
            <th className="px-6 py-5 text-right">AMOUNT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Đang tải dữ liệu...</td>
            </tr>
          ) : bookings.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Không tìm thấy lịch đặt nào</td>
            </tr>
          ) : (
            bookings.map((booking) => {
              const customerName = booking.customerName || booking.customer?.fullName || 'Khách vãng lai';
              const initials = customerName !== 'Khách vãng lai' ? customerName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'KV';
              // Random color for avatar based on name length or something simple
              const avatarColors = ["bg-sky-100 text-sky-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-indigo-100 text-indigo-700", "bg-rose-100 text-rose-700"];
              const avatarColor = avatarColors[customerName.length % avatarColors.length];

              const status = booking.status ? booking.status.toUpperCase() : 'UNKNOWN';
              const statusStyle = STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border border-slate-200";

              return (
                <tr
                  key={booking.id || booking.bookingId}
                  className="hover:bg-slate-50 cursor-pointer transition-colors divide-x divide-slate-100"
                  onClick={() => onRowClick(booking)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}>
                          {initials}
                      </div>
                      <span className="font-semibold text-slate-800">{customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{booking.phone || booking.customer?.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
                      {booking.licensePlate || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{booking.serviceName || booking.service?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-slate-900">
                      {booking.totalAmount ? booking.totalAmount.toLocaleString() : '0'} đ
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}