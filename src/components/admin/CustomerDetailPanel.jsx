export default function CustomerDetailPanel({ customer }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Info title="Họ tên" value={customer.fullName} />
      <Info title="SĐT" value={customer.phone} />
      <Info title="Tier" value={customer.tier} />
      <Info title="Điểm" value={customer.points} />
      <Info
        title="Tổng chi tiêu"
        value={customer.totalSpending}
      />
      <Info
        title="Ngày tạo"
        value={customer.createdAt}
      />

      <div className="bg-[#070913] p-4 rounded-lg">
        <p className="text-slate-400 text-xs">Trạng thái</p>

        <span
          className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
            customer.isLocked || customer.status === 'LOCKED'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {customer.isLocked || customer.status === 'LOCKED'
            ? 'Bị khóa'
            : 'Hoạt động'}
        </span>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-[#070913] p-4 rounded-lg">
      <p className="text-slate-400 text-xs">{title}</p>
      <p className="font-medium mt-1">{value ?? '-'}</p>
    </div>
  );
}