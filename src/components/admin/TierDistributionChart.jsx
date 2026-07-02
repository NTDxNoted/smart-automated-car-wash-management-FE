import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

const TIER_COLORS = {
  MEMBER: "#0EA5E9",
  SILVER: "#94A3B8",
  GOLD: "#F59E0B",
  PLATINUM: "#A855F7",
};

const DEFAULT_COLOR = "#00677F";

export default function TierDistributionChart({ data }) {
  return (
    <div className="report-chart-card">
      <h3 className="report-chart-title">
        Phân bố thứ hạng thành viên
      </h3>

      <ResponsiveContainer width="100%" aspect={1.8}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="tier"
            tick={{ fontSize: 11, fill: '#64748B' }}
            stroke="#CBD5E1"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748B' }}
            stroke="#CBD5E1"
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #BCC8CE',
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => {
              const key = entry.tier?.toUpperCase() || "";
              const fill = TIER_COLORS[key] || DEFAULT_COLOR;
              return (
                <Cell
                  key={index}
                  fill={fill}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}