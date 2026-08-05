import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function CustomerTypeRatioChart({ customerCount, walkinCount }) {
  const total = customerCount + walkinCount;
  const data = [
    { name: "Customer", value: customerCount, color: "#00677F" },
    { name: "Khách vãng lai", value: walkinCount, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  if (total === 0) {
    return <p className="cust-chart-empty">Chưa có dữ liệu</p>;
  }

  return (
    <div className="cust-ratio-chart-row">
      <PieChart width={150} height={150}>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #BCC8CE',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </PieChart>
      <div className="cust-ratio-legend">
        {data.map((d) => (
          <div key={d.name} className="cust-ratio-legend-item">
            <span className="cust-ratio-legend-dot" style={{ backgroundColor: d.color }} />
            <span className="cust-ratio-legend-text">
              {d.name}: <b>{d.value}</b> ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
