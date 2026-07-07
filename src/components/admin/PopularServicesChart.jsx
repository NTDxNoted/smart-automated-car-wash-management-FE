import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#00677F", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

export default function PopularServicesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="report-chart-card flex items-center justify-center min-h-[250px]">
        <p className="text-sm text-slate-500 font-medium">Không có dữ liệu biểu đồ.</p>
      </div>
    );
  }

  // Format data for Recharts Pie
  const chartData = data.map(item => ({
    name: item.serviceName || item.service_name,
    value: item.totalWashes || item.total_washes || 0,
    revenue: item.revenue || 0,
    percentage: item.revenueContribution || item.revenue_contribution || 0
  }));

  return (
    <div className="report-chart-card">
      <h3 className="report-chart-title">
        Tỷ lệ lượt dịch vụ phổ biến
      </h3>

      <ResponsiveContainer width="100%" aspect={1.8}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={75}
            innerRadius={45} // Making it a Doughnut Chart
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
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
            formatter={(value, name, props) => {
              const item = props.payload;
              return [
                `${value} lượt (Doanh thu: ${item.revenue?.toLocaleString()}đ)`,
                name
              ];
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
