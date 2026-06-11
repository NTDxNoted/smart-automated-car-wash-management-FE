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
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="bg-[#070913] p-4 rounded-lg">
      <p className="text-slate-400 text-xs">{title}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}