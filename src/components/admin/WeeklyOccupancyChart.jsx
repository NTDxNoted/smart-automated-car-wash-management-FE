import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const WEEKDAY_TRANSLATIONS = {
  Monday: "Thứ Hai",
  Tuesday: "Thứ Ba",
  Wednesday: "Thứ Tư",
  Thursday: "Thứ Năm",
  Friday: "Thứ Sáu",
  Saturday: "Thứ Bảy",
  Sunday: "Chủ Nhật",
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeeklyOccupancyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="report-chart-card flex items-center justify-center min-h-[250px]">
        <p className="text-sm text-slate-500 font-medium">Không có dữ liệu biểu đồ tuần.</p>
      </div>
    );
  }

  // Sort weekdays chronologically
  const sortedData = [...data].sort((a, b) => {
    return DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
  }).map(item => ({
    ...item,
    displayName: WEEKDAY_TRANSLATIONS[item.day] || item.day,
    occupancyRate: item.occupancyRate ?? item.occupancy_rate ?? 0,
    count: item.count ?? item.bookingCount ?? item.booking_count ?? 0,
  }));

  return (
    <div className="report-chart-card">
      <h3 className="report-chart-title">
        Tần suất đặt lịch theo thứ trong tuần
      </h3>

      <ResponsiveContainer width="100%" aspect={1.8}>
        <BarChart data={sortedData} margin={{ top: 10, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="displayName"
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
            formatter={(value, name, props) => {
              const item = props.payload;
              if (name === "count") {
                return [`${value} lượt đặt`, "Số lượng"];
              }
              if (name === "occupancyRate") {
                return [`${value}%`, "Tỷ lệ lấp đầy"];
              }
              return [value, name];
            }}
          />
          {/* Bar for booking count */}
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {sortedData.map((entry, index) => {
              // Highlight high occupancy rate (>80%) in Red/Orange, else Teal
              const rate = entry.occupancyRate;
              const fill = rate >= 80 ? "#EF4444" : rate >= 70 ? "#F59E0B" : "#00677F";
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#00677F]" /> Thường (Lấp đầy &lt; 70%)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#F59E0B]" /> Đông (Lấp đầy 70% - 80%)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#EF4444]" /> Quá tải (Lấp đầy &gt; 80%)
        </div>
      </div>
    </div>
  );
}
