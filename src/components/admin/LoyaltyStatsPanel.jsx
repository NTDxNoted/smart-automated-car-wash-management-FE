function Card({ title, value }) {
  return (
    <div className="bg-[#0c0f24] p-5 rounded-2xl border border-white/5">
      <p className="text-slate-400">{title}</p>

      <h3 className="text-white text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}

export default function LoyaltyStatsPanel({
  stats,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      <Card
        title="Total Points"
        value={stats.totalPoints.toLocaleString()}
      />

      <Card
        title="Expiring Soon"
        value={stats.expiringSoon.toLocaleString()}
      />

      <Card
        title="Expired"
        value={stats.expired.toLocaleString()}
      />
    </div>
  );
}