export default function CustomerDetailPanel({ customer }) {
  const getTierBadge = (tier) => {
    switch (tier?.toUpperCase()) {
      case "PLATINUM":
        return "bg-gradient-to-r from-slate-300 via-indigo-100 to-indigo-300 text-indigo-950 font-black px-2.5 py-1 rounded-md text-xs shadow border border-indigo-200/50";
      case "GOLD":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black px-2.5 py-1 rounded-md text-xs shadow border border-amber-300/50";
      case "SILVER":
        return "bg-gradient-to-r from-slate-400 to-slate-200 text-slate-900 font-black px-2.5 py-1 rounded-md text-xs shadow border border-slate-300/50";
      default:
        return "bg-cyan-950/40 text-cyan-400 px-2.5 py-1 rounded-md text-xs border border-cyan-500/30 font-bold";
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Info title="Họ tên" value={customer.fullName} />
      <Info title="SĐT" value={customer.phone} />
      
      <div className="bg-[#070913] p-4 rounded-lg flex flex-col justify-between">
        <p className="text-slate-400 text-xs">Tier</p>
        <div className="mt-2.5">
          <span className={getTierBadge(customer.tier)}>
            {customer.tier || 'Member'}
          </span>
        </div>
      </div>

      <Info title="Điểm" value={`${(customer.points ?? 0).toLocaleString()} pts`} />
      <Info
        title="Tổng chi tiêu"
        value={`${Number(customer.totalSpending || 0).toLocaleString()}đ`}
      />
      <Info
        title="Ngày tạo"
        value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : '-'}
      />

      <div className="bg-[#070913] p-4 rounded-lg">
        <p className="text-slate-400 text-xs">Trạng thái</p>
        {(() => {
          const isLocked = customer.isLocked || customer.status === 'LOCKED';
          const isSuspended = customer.status === 'SUSPENDED';
          if (isLocked) {
            return (
              <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/20">
                Bị khóa
              </span>
            );
          }
          if (isSuspended) {
            return (
              <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                Tạm đình chỉ
              </span>
            );
          }
          return (
            <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/20">
              Hoạt động
            </span>
          );
        })()}
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-[#070913] p-4 rounded-lg">
      <p className="text-slate-400 text-xs">{title}</p>
      <p className="font-semibold text-slate-200 mt-1">{value ?? '-'}</p>
    </div>
  );
}