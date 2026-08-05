import { Link } from 'react-router-dom';
import { toggleLock } from '../../services/adminCustomerService';

const formatVnd = (value) => `${Math.round(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '-');

export default function CustomerTable({ customers = [], onRefresh, onToggleLock }) {
  const getTierBadgeClass = (tier) => {
    switch (tier?.toUpperCase()) {
      case 'GOLD':
        return 'customer-tier-badge gold';
      case 'SILVER':
        return 'customer-tier-badge silver';
      case 'PLATINUM':
        return 'customer-tier-badge platinum';
      case 'MEMBER':
      default:
        return 'customer-tier-badge member';
    }
  };

  const handleToggleLock = async (customer) => {
    const isLocked = customer.isLocked || customer.status === 'LOCKED';
    const confirmMessage = isLocked
      ? `Bạn có chắc chắn muốn mở khóa tài khoản của khách hàng ${customer.fullName || ''}?`
      : `Bạn có chắc chắn muốn khóa tài khoản của khách hàng ${customer.fullName || ''}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const data = await toggleLock(customer.customerId);
      const newLockedState = typeof data?.isLocked === 'boolean' ? data.isLocked : !isLocked;

      if (onToggleLock) {
        onToggleLock(customer.customerId, newLockedState);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Toggle lock error:', err);
    }
  };

  const getStatusBadge = (customer) => {
    const isLocked = customer.isLocked || customer.status === 'LOCKED';
    const isSuspended = customer.status === 'SUSPENDED';

    if (isLocked) {
      return (
        <div className="customer-status-badge locked">
          <span className="status-dot" />
          <span className="status-text">Bị khóa</span>
        </div>
      );
    }
    if (isSuspended) {
      return (
        <div className="customer-status-badge suspended">
          <span className="status-dot" />
          <span className="status-text">Tạm đình chỉ</span>
        </div>
      );
    }
    return (
      <div className="customer-status-badge active">
        <span className="status-dot" />
        <span className="status-text">Hoạt động</span>
      </div>
    );
  };

  const getTypeBadge = (customer) =>
    customer.isWalkIn ? (
      <span className="customer-type-badge walkin">🟡 Khách vãng lai</span>
    ) : (
      <span className="customer-type-badge registered">🟢 Customer</span>
    );

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl w-full">
        Không tìm thấy khách hàng phù hợp
      </div>
    );
  }

  return (
    <div className="customer-table-scroll">
      <table className="customer-table">
        <thead>
          <tr className="customer-thead-row">
            <th className="customer-th id">Mã KH</th>
            <th className="customer-th type">Loại khách</th>
            <th className="customer-th name">Tên khách hàng</th>
            <th className="customer-th phone">Số điện thoại</th>
            <th className="customer-th tier">Hạng</th>
            <th className="customer-th usage">Lượt dùng</th>
            <th className="customer-th spending">Tổng chi tiêu</th>
            <th className="customer-th lastvisit">Dùng gần nhất</th>
            <th className="customer-th status">Trạng thái</th>
            <th className="customer-th actions">Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => {
            const isLocked = customer.isLocked || customer.status === 'LOCKED';

            return (
              <tr key={customer.customerId} className="customer-tbody-row">
                <td className="customer-td id">
                  <span className="customer-id-text">#{customer.customerId}</span>
                </td>
                <td className="customer-td type">{getTypeBadge(customer)}</td>
                <td className="customer-td name">
                  <span className="customer-name-text">{customer.fullName}</span>
                </td>
                <td className="customer-td phone">
                  <span className="customer-phone-text">{customer.phone}</span>
                </td>
                <td className="customer-td tier">
                  <span className={getTierBadgeClass(customer.tier)}>
                    {customer.tier || 'Member'}
                  </span>
                </td>
                <td className="customer-td usage">
                  <span className="customer-usage-text">{customer.bookingCount ?? 0} lần</span>
                </td>
                <td className="customer-td spending">
                  <span className="customer-spending-text">{formatVnd(customer.totalSpending)}</span>
                </td>
                <td className="customer-td lastvisit">
                  <span className="customer-lastvisit-text">{formatDate(customer.lastVisit)}</span>
                </td>
                <td className="customer-td status">
                  {getStatusBadge(customer)}
                </td>
                <td className="customer-td actions">
                  {/* Detail Page Link */}
                  <Link
                    to={`/admin/customers/${customer.customerId}`}
                    className="customer-action-btn edit"
                    title="Chi tiết"
                  >
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </Link>

                  {/* Toggle Lock Button */}
                  <button
                    onClick={() => handleToggleLock(customer)}
                    className="customer-action-btn lock"
                    title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                  >
                    {isLocked ? (
                      <svg className="w-[14px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    ) : (
                      <svg className="w-[14px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
