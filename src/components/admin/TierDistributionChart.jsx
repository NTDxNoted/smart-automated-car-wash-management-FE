import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import SafeChartContainer from "../common/SafeChartContainer";

const TIER_COLORS = {
  MEMBER: "#0EA5E9",
  SILVER: "#94A3B8",
  GOLD: "#F59E0B",
  PLATINUM: "#A855F7",
};

const DEFAULT_COLOR = "#00677F";

export default function TierDistributionChart({ data }) {
  return (
    <div className="report-chart-card" style={{ minHeight: "530px", height: "auto" }}>
      <h3 className="report-chart-title">
        Phân bố thứ hạng thành viên
      </h3>

      <SafeChartContainer height={420}>
        {(width, height) => (
          <BarChart width={width} height={height} data={data} margin={{ top: 25, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="tier"
              tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }}
              stroke="#CBD5E1"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748B' }}
              stroke="#CBD5E1"
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #BCC8CE',
                borderRadius: '8px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={55}>
              <LabelList dataKey="total" position="top" fill="#475569" fontSize={13} fontWeight={700} offset={10} />
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
        )}
      </SafeChartContainer>
    </div>
  );
}