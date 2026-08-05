import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import SafeChartContainer from "../common/SafeChartContainer";

const COLORS = [
  "#00677F", 
  "#0EA5E9", 
  "#10B981", 
  "#F59E0B", 
  "#EF4444", 
  "#8B5CF6", 
  "#64748B",
  "#EC4899",
  "#14B8A6"
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
      fontWeight="700"
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

export default function PopularServicesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="report-chart-card">
        <h3 className="report-chart-title">
          Tỷ lệ lượt dịch vụ phổ biến
        </h3>
        <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-400">
          <svg className="w-10 h-10 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className="text-xs font-medium">Chưa có dữ liệu dịch vụ phổ biến</p>
        </div>
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
      <h3 className="report-chart-title" style={{ marginBottom: "12px" }}>
        Tỷ lệ lượt dịch vụ phổ biến
      </h3>

      <SafeChartContainer height={230}>
        {(width, height) => {
          const outerRadius = Math.min(85, width * 0.22, height * 0.42);
          const innerRadius = Math.max(35, outerRadius * 0.55);
          return (
            <PieChart width={width} height={height} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                paddingAngle={3}
                dataKey="value"
                label={renderCustomizedLabel}
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
                  border: '1px solid #C3C6D7',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  padding: '8px 12px',
                }}
                formatter={(value, name, props) => {
                  const item = props.payload;
                  return [
                    `${value} lượt - Doanh thu: ${item.revenue?.toLocaleString()}đ (${Math.round(item.percentage)}%)`,
                    name
                  ];
                }}
              />
            </PieChart>
          );
        }}
      </SafeChartContainer>

      {/* Custom HTML Legend preventing overflow and wrapping cleanly */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 pt-4 mt-3 border-t border-slate-100">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{entry.name}:</span>
            <span className="font-semibold text-slate-900">{Math.round(entry.percentage)}%</span>
            <span className="text-slate-400 text-[11px]">({entry.value} lượt)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
