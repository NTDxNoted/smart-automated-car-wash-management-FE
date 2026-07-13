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
  if (!data || data.length === 0) {
    return (
      <div className="report-chart-card">
        <h3 className="report-chart-title">
          Trạng thái đặt lịch
        </h3>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[192px] text-slate-400">
          <svg className="w-10 h-10 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-xs font-medium">Chưa có dữ liệu đặt lịch</p>
        </div>
      </div>
    );
  }

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