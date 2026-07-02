export default function BookingTable({
  bookings,
  onRowClick,
  loading
}) {
  const getInitials = (name) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const formatBookingId = (id) => {
    if (!id) return '#AW-0000';
    const cleanId = String(id).replace(/[^a-zA-Z0-9]/g, '');
    if (cleanId.length > 6) {
      return `#BK-${cleanId.slice(-4).toUpperCase()}`;
    }
    return `#BK-${cleanId.toUpperCase()}`;
  };

  const getStatusBadge = (status) => {
    const normStatus = status?.toUpperCase();
    switch (normStatus) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Completed
          </span>
        );
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse"></span>
            Processing
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>
            Cancelled
          </span>
        );
      case 'NOSHOW':
      case 'NO-SHOW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
            No-show
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1.5 animate-pulse"></span>
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0c0f24] rounded-2xl border border-white/5 shadow-xl">
        <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải danh sách đặt lịch...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0c0f24] rounded-2xl border border-white/5 border-dashed shadow-xl">
        Không tìm thấy đơn đặt lịch nào phù hợp.
      </div>
    );
  }

  return (
    <div className="bg-[#0c0f24] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-slate-450 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 text-left">Mã đơn</th>
              <th className="px-6 py-4 text-left">Khách hàng</th>
              <th className="px-6 py-4 text-left">SĐT</th>
              <th className="px-6 py-4 text-left">Biển số</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-right">Tổng tiền</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="cursor-pointer hover:bg-white/[0.01] transition-all duration-150"
                onClick={() => onRowClick(booking)}
              >
                <td className="px-6 py-4 font-mono text-sm text-white font-medium">
                  {formatBookingId(booking.id)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md shrink-0">
                      {getInitials(booking.customerName)}
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      {booking.customerName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {booking.phone || '-'}
                </td>
                <td className="px-6 py-4 text-slate-200 font-mono font-semibold tracking-wider">
                  {booking.licensePlate || '-'}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 text-right text-slate-200 font-semibold">
                  {(booking.totalAmount || 0).toLocaleString()}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}