import { Link } from 'react-router-dom';

export default function CustomerTable({ customers = [] }) {
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
          {customers.map((customer) => (
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
                    customer.status === 'ACTIVE'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {customer.status}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}