import { Link } from 'react-router-dom';

export default function CustomerTable({ customers = [] }) {
  if (customers.length === 0) {
    return (
      <div className="py-10 text-center text-slate-400 border border-dashed border-white/10 rounded-xl">
        Không tìm thấy khách hàng phù hợp
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="text-left py-3">Tên</th>
            <th className="text-left py-3">SĐT</th>
            <th className="text-left py-3">Tier</th>
            <th className="text-left py-3">Điểm</th>
            <th className="text-left py-3">Trạng thái</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => {
            const isLocked =
              customer.isLocked || customer.status === 'LOCKED';

            return (
              <tr
                key={customer.id}
                className="border-b border-white/5"
              >
                <td className="py-3">{customer.fullName}</td>
                <td>{customer.phone}</td>
                <td>{customer.tier}</td>
                <td>{customer.points}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      isLocked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {isLocked ? 'Bị khóa' : 'Hoạt động'}
                  </span>
                </td>

                <td>
                  <Link
                    to={`/admin/customers/${customer.id}`}
                    className="text-cyan-400 hover:underline"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}