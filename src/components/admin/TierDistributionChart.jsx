import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

const COLORS = {
  MEMBER: "#0ea5e9", // cyan-500
  SILVER: "#94a3b8", // slate-400
  GOLD: "#f59e0b",   // amber-500
  PLATINUM: "#d946ef" // fuchsia-500
};

export default function TierDistributionChart({
  data,
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Tier Distribution</h3>
        <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
      </div>
      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
              dataKey="tier" 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
          />
          <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
          />
          <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.tier.toUpperCase()] || COLORS.MEMBER} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}