import { Link } from 'react-router-dom';
import { toggleLock } from '../../services/adminCustomerService';

export default function CustomerTable({ customers = [], onRefresh }) {
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

  const handleToggleLock = async (id) => {
    try {
      await toggleLock(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Toggle lock error:', err);
    }
  };

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl w-full">
        Không tìm thấy khách hàng phù hợp
      </div>
    );
  }

  return (
    <table className="customer-table">
      <thead>
        <tr className="customer-thead-row">
          <th className="customer-th name">Tên khách hàng</th>
          <th className="customer-th phone">Số điện thoại</th>
          <th className="customer-th tier">Hạng</th>
          <th className="customer-th points">Điểm tích lũy</th>
          <th className="customer-th status">Trạng thái</th>
          <th className="customer-th actions">Tác vụ</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => {
          const isLocked = customer.isLocked || customer.status === 'LOCKED';

          return (
            <tr
              key={customer.id}
              className="customer-tbody-row"
            >
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
              <td className="customer-td points">
                <span className="customer-points-text">
                  {Number(customer.points || 0).toLocaleString()} pts
                </span>
              </td>
              <td className="customer-td status">
                <div className={`customer-status-badge ${isLocked ? 'offline' : 'active'}`}>
                  <span className="status-dot" />
                  <span className="status-text">{isLocked ? 'Ngoại tuyến' : 'Hoạt động'}</span>
                </div>
              </td>
              <td className="customer-td actions">
                {/* Edit Button -> navigate to detail */}
                <Link
                  to={`/admin/customers/${customer.id}`}
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
                  onClick={() => handleToggleLock(customer.id)}
                  className="customer-action-btn lock"
                  title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                >
                  <svg className="w-[13.33px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}