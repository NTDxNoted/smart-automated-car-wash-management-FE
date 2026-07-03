import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function OverviewChart({ data }) {
  return (
    <div className="report-chart-card">
      <h3 className="report-chart-title">
        Doanh thu theo tháng
      </h3>

      <ResponsiveContainer width="100%" aspect={1.8}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="month"
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
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#00677F"
            strokeWidth={3}
            dot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 1.5 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}