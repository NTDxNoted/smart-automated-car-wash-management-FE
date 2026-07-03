import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  PENDING: "#F59E0B",
  CONFIRMED: "#00677F",
  PROCESSING: "#0EA5E9",
  COMPLETED: "#10B981",
  CANCELLED: "#EF4444",
};

const DEFAULT_COLORS = ["#00677F", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

export default function BookingStatusPieChart({ data }) {
  return (
    <div className="report-chart-card">
      <h3 className="report-chart-title">
        Trạng thái đặt lịch
      </h3>

      <ResponsiveContainer width="100%" aspect={1.8}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={75}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => {
              const key = entry.name?.toUpperCase() || "";
              const fill = STATUS_COLORS[key] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
              return (
                <Cell
                  key={index}
                  fill={fill}
                />
              );
            })}
          </Pie>

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
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}