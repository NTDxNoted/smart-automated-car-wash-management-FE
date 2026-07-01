import { Link } from 'react-router-dom';

const TIER_STYLES = {
  GOLD: "bg-amber-100 text-amber-600 border border-amber-200",
  SILVER: "bg-slate-200 text-slate-600 border border-slate-300",
  PLATINUM: "bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-200",
  MEMBER: "bg-cyan-100 text-cyan-600 border border-cyan-200",
};

export default function CustomerTable({ customers = [], loading = false }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
          <tr className="divide-x divide-slate-200">
            <th className="px-6 py-5">CUSTOMER</th>
            <th className="px-6 py-5">CONTACT</th>
            <th className="px-6 py-5">TIER</th>
            <th className="px-6 py-5 text-center">LOYALTY POINTS</th>
            <th className="px-6 py-5 text-right">TOTAL SPENT</th>
            <th className="px-6 py-5">STATUS</th>
            <th className="px-6 py-5 text-center">ACTION</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {loading ? (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-500">Đang tải dữ liệu...</td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                Không tìm thấy khách hàng phù hợp
              </td>
            </tr>
          ) : (
            customers.map((customer) => {
              const isLocked = customer.isLocked || customer.status === 'LOCKED';
              const customerName = customer.fullName || 'Khách vãng lai';
              const initials = customerName !== 'Khách vãng lai' ? customerName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'KV';
              
              const avatarColors = ["bg-sky-100 text-sky-700", "bg-emerald-100 text-emerald-700", "bg-indigo-100 text-indigo-700", "bg-rose-100 text-rose-700"];
              const avatarColor = avatarColors[customerName.length % avatarColors.length];
              
              const tierStr = customer.tier ? customer.tier.toUpperCase() : 'MEMBER';
              const tierStyle = TIER_STYLES[tierStr] || TIER_STYLES.MEMBER;

              return (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50 transition-colors divide-x divide-slate-100"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}>
                          {initials}
                      </div>
                      <div>
                          <p className="font-semibold text-slate-800">{customerName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{customer.phone || 'N/A'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{customer.email || 'No email provided'}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${tierStyle}`}>
                      {tierStr === 'GOLD' && <span className="material-symbols-outlined text-[14px]">star</span>}
                      {tierStr === 'PLATINUM' && <span className="material-symbols-outlined text-[14px]">diamond</span>}
                      {tierStr === 'SILVER' && <span className="material-symbols-outlined text-[14px]">military_tech</span>}
                      {tierStr === 'MEMBER' && <span className="material-symbols-outlined text-[14px]">person</span>}
                      {tierStr}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-slate-700">{customer.points ? customer.points.toLocaleString() : '0'} pts</span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-cyan-600">{customer.totalSpent ? customer.totalSpent.toLocaleString() : '0'} đ</span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        isLocked
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                      {isLocked ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/customers/${customer.id}`}
                      className="text-cyan-600 font-semibold hover:text-cyan-700 transition"
                    >
                      Chi tiết
                    </Link>
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