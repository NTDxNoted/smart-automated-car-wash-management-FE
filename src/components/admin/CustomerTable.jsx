import { Link } from 'react-router-dom';

export default function CustomerTable({ customers = [] }) {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Chưa có';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
          <th className="customer-th spending">Tổng chi tiêu</th>
          <th className="customer-th last-visit">Ldn đến cuối</th>
          <th className="customer-th actions"></th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => {
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
              <td className="customer-td spending">
                <span className="customer-spending-text">
                  {Number(customer.totalSpending || 0).toLocaleString()} đ
                </span>
              </td>
              <td className="customer-td last-visit">
                <span className="customer-visit-text">
                  {formatDate(customer.lastVisit || customer.LastVisit)}
                </span>
              </td>
              <td className="customer-td actions">
                <Link
                  to={`/admin/customers/${customer.id}`}
                  className="customer-detail-link"
                >
                  Chi tiết
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}