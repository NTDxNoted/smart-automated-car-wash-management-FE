export default function BookingTable({
  bookings,
  onRowClick,
  loading
}) {
  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "FAILED":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "CANCELLED":
        return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
      default:
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED": return "Completed";
      case "PENDING": return "Pending";
      case "FAILED": return "Failed";
      case "CANCELLED": return "Cancelled";
      case "NOSHOW": return "No-show";
      default: return status || "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0c0f24] rounded-2xl border border-white/5">
        <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải danh sách đặt lịch...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0c0f24] rounded-2xl border border-white/5 border-dashed">
        Không tìm thấy booking nào phù hợp.
      </div>
    );
  }

  return (
    <div className="bg-[#0c0f24] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-slate-400 font-semibold">
              <th className="px-6 py-4 text-left">Khách hàng</th>
              <th className="px-6 py-4 text-left">SĐT</th>
              <th className="px-6 py-4 text-left">Biển số</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-left">Tổng tiền</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="cursor-pointer hover:bg-white/[0.02] transition"
                onClick={() => onRowClick(booking)}
              >
                <td className="px-6 py-4 font-medium text-slate-200">
                  {booking.customerName}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {booking.phone}
                </td>
                <td className="px-6 py-4 text-slate-300 font-mono">
                  {booking.licensePlate}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-200 font-medium">
                  {booking.totalAmount?.toLocaleString()}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}