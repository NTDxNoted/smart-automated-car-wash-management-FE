import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import SafeChartContainer from "../common/SafeChartContainer";

export default function CustomerGrowthChart({ data }) {
  return (
    <SafeChartContainer aspect={2.4}>
      {(width, height) => (
        <BarChart width={width} height={height} data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" tickLine={false} allowDecimals={false} />
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
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
          <Bar dataKey="customer" name="Customer" fill="#00677F" radius={[4, 4, 0, 0]} />
          <Bar dataKey="walkin" name="Khách vãng lai" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </SafeChartContainer>
  );
}
