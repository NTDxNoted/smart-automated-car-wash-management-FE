import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function OverviewChart({ data }) {
  return (
    <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
      <h3 className="text-white font-semibold mb-4">
        Revenue Overview
      </h3>

      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line dataKey="revenue" stroke="#06b6d4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}