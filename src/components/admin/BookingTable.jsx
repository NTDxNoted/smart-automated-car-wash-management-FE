import { formatScheduledTime } from '../../utils/datetime';

export default function BookingTable({
  bookings = [],
  onRowClick,
  loading
}) {
  const getInitials = (name) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getStatusBadgeClass = (status) => {
    const normStatus = status?.toUpperCase() || 'PENDING';
    switch (normStatus) {
      case 'COMPLETED':
        return 'booking-status-badge completed';
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
      case 'CONFIRMED':
        return 'booking-status-badge confirmed';
      case 'CANCELLED':
        return 'booking-status-badge cancelled';
      case 'FAILED':
        return 'booking-status-badge failed';
      case 'NOSHOW':
      case 'NO-SHOW':
        return 'booking-status-badge noshow';
      case 'PENDING':
      default:
        return 'booking-status-badge pending';
    }
  };

  const getStatusText = (status) => {
    const normStatus = status?.toUpperCase() || 'PENDING';
    switch (normStatus) {
      case 'COMPLETED':
        return 'COMPLETED';
      case 'PROCESSING':
      case 'IN-PROGRESS':
      case 'IN_PROGRESS':
        return 'PROCESSING';
      case 'CONFIRMED':
        return 'CONFIRMED';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'FAILED':
        return 'FAILED';
      case 'NOSHOW':
      case 'NO-SHOW':
        return 'NO-SHOW';
      case 'PENDING':
      default:
        return 'PENDING';
    }
  };



  const renderServices = (booking) => {
    if (!booking.services) return '-';
    if (Array.isArray(booking.services)) {
      if (booking.services.length === 0) return '-';
      return booking.services.map(s => s.name || s.serviceName || s).join(', ');
    }
    if (typeof booking.services === 'string') {
      return booking.services;
    }
    return '-';
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 w-full bg-white border border-slate-200 rounded-2xl">
        <div className="inline-block w-8 h-8 border-4 border-slate-350 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải danh sách đặt lịch...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 w-full bg-white border border-slate-200 border-dashed rounded-2xl">
        Không tìm thấy đơn đặt lịch nào phù hợp
      </div>
    );
  }

  return (
    <div className="booking-table-wrapper">
      <table className="booking-table">
        <thead>
          <tr className="booking-thead-row">
            <th className="booking-th customer">CUSTOMER</th>
            <th className="booking-th phone">PHONE</th>
            <th className="booking-th plate">PLATE</th>
            <th className="booking-th time">TIME</th>
            <th className="booking-th service">SERVICE</th>
            <th className="booking-th status">STATUS</th>
            <th className="booking-th amount">AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="booking-tbody-row"
              onClick={() => onRowClick(booking)}
            >
              <td className="booking-td customer">
                <div className="booking-customer-avatar">
                  {getInitials(booking.customerName)}
                </div>
                <span className="booking-customer-name" title={booking.customerName}>
                  {booking.customerName}
                </span>
              </td>
              
              <td className="booking-td phone">
                <span className="booking-phone-text">
                  {booking.phone || '-'}
                </span>
              </td>
              
              <td className="booking-td plate">
                <span className="booking-plate-badge">
                  {booking.licensePlate || '-'}
                </span>
              </td>

              <td className="booking-td time">
                <span className="booking-time-text">
                  {formatScheduledTime(booking.scheduledTime)}
                </span>
              </td>
              
              <td className="booking-td service">
                <span className="booking-service-text" title={renderServices(booking)}>
                  {renderServices(booking)}
                </span>
              </td>
              
              <td className="booking-td status">
                <span className={getStatusBadgeClass(booking.status)}>
                  {getStatusText(booking.status)}
                </span>
              </td>
              
              <td className="booking-td amount">
                <span className="booking-amount-text">
                  {Number(booking.totalAmount || 0).toLocaleString()} đ
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}