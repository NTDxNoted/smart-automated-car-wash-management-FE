import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function TierDistributionChart({
  data,
}) {
  return (
    <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
      <h3 className="text-white font-semibold mb-4">
        Tier Distribution
      </h3>

      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart data={data}>
          <XAxis dataKey="tier" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}