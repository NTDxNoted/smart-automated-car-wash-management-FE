function Card({ title, value, icon, colorClass }) {
  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-500 font-medium text-sm">{title}</p>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-white shadow-sm ${colorClass}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <h3 className="text-slate-800 text-2xl font-bold mt-1">
        {value}
      </h3>
    </div>
  );
}

export default function LoyaltyStatsPanel({
  stats,
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Loyalty Points</h3>
        <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card
          title="Total Points Issued"
          value={stats.totalPoints.toLocaleString()}
          icon="stars"
          colorClass="text-amber-500"
        />

        <Card
          title="Expiring Soon (30d)"
          value={stats.expiringSoon.toLocaleString()}
          icon="timer"
          colorClass="text-orange-500"
        />

        <div className="md:col-span-2">
            <Card
            title="Expired Points (YTD)"
            value={stats.expired.toLocaleString()}
            icon="history"
            colorClass="text-rose-500"
            />
        </div>
      </div>
    </div>
  );
}