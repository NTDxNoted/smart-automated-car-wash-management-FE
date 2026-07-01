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
    <ResponsiveContainer width="100%" aspect={2}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
            dataKey="month" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
        />
        <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            dx={-10}
            tickFormatter={(value) => `${value / 1000000}M`}
        />
        <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#0ea5e9" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}