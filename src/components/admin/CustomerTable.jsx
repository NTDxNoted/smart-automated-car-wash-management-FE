import { Link } from 'react-router-dom';

export default function CustomerTable({ customers = [] }) {
  const getInitials = (name) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getTierBadge = (tier) => {
    switch (tier?.toUpperCase()) {
      case "PLATINUM":
        return "bg-gradient-to-r from-slate-300 via-indigo-100 to-indigo-300 text-indigo-950 font-black px-2.5 py-0.5 rounded-md text-xs shadow border border-indigo-200/50";
      case "GOLD":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black px-2.5 py-0.5 rounded-md text-xs shadow border border-amber-300/50";
      case "SILVER":
        return "bg-gradient-to-r from-slate-450 to-slate-200 text-slate-900 font-black px-2.5 py-0.5 rounded-md text-xs shadow border border-slate-350/50";
      default:
        return "bg-cyan-950/40 text-cyan-400 px-2.5 py-0.5 rounded-md text-xs border border-cyan-500/30 font-bold";
    }
  };

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
        Không tìm thấy khách hàng phù hợp
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-slate-450 text-xs font-bold uppercase tracking-wider bg-white/[0.01]">
            <th className="text-left px-4 py-3.5">Khách hàng</th>
            <th className="text-left px-4 py-3.5">Số điện thoại</th>
            <th className="text-left px-4 py-3.5">Hạng thành viên</th>
            <th className="text-left px-4 py-3.5">Điểm tích lũy</th>
            <th className="text-left px-4 py-3.5">Trạng thái</th>
            <th className="text-right px-4 py-3.5">Tác vụ</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {customers.map((customer) => {
            const isLocked = customer.isLocked || customer.status === 'LOCKED';

            return (
              <tr
                key={customer.id}
                className="hover:bg-white/[0.01] transition-all duration-150"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md shrink-0">
                      {getInitials(customer.fullName)}
                    </div>
                    <p className="text-sm font-medium text-slate-200">{customer.fullName}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-300 font-mono">{customer.phone}</td>
                <td className="px-4 py-4">
                  <span className={getTierBadge(customer.tier)}>
                    {customer.tier || 'Member'}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-200 font-semibold">
                  {(customer.points || 0).toLocaleString()} pts
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isLocked
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full mr-1.5 ${isLocked ? 'bg-red-450' : 'bg-emerald-400 animate-pulse'}`}></span>
                    {isLocked ? 'Bị khóa' : 'Hoạt động'}
                  </span>
                </td>

                <td className="px-4 py-4 text-right">
                  <Link
                    to={`/admin/customers/${customer.id}`}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition"
                  >
                    Chi tiết →
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