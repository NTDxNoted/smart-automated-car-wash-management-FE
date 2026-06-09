import React from 'react';

/**
 * Bảng lịch sử giao dịch điểm
 * Có 3 loại (type): 'Earn' (Tích điểm), 'Redeem' (Đổi thưởng), 'Expire' (Hết hạn)
 */
export default function PointHistoryTable({ history = [] }) {
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const getRowStyle = (type) => {
    switch (type) {
      case 'Earn':
        return { color: 'text-cyan-600', label: 'Tích điểm', bg: 'bg-cyan-50' };
      case 'Redeem':
        return { color: 'text-yellow-600', label: 'Đổi thưởng', bg: 'bg-yellow-50' };
      case 'Expire':
        return { color: 'text-red-600', label: 'Hết hạn', bg: 'bg-red-50' };
      default:
        return { color: 'text-slate-600', label: 'Khác', bg: 'bg-slate-100' };
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="py-12 text-center border border-slate-200 rounded-xl bg-white">
        <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Chưa có lịch sử giao dịch điểm
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500" style={{ fontFamily: "'Syne', sans-serif" }}>
              <th className="px-5 py-4 font-semibold">Thời gian</th>
              <th className="px-5 py-4 font-semibold">Giao dịch</th>
              <th className="px-5 py-4 font-semibold">Mã đặt lịch</th>
              <th className="px-5 py-4 font-semibold text-right">Số điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {history.map((row) => {
              const style = getRowStyle(row.type);
              const isPositive = row.points > 0;
              
              return (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${style.bg} ${style.color}`}>
                      {style.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {row.refBookingId || <span className="text-slate-400">-</span>}
                  </td>
                  <td className={`px-5 py-4 text-sm font-bold text-right whitespace-nowrap ${style.color}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                    {isPositive ? '+' : ''}{row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
