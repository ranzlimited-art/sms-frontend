import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { AttendanceChart } from '../../api/dashboard/types';

interface AttendanceBarChartProps {
  data: AttendanceChart;
}

export function AttendanceBarChart({ data }: AttendanceBarChartProps) {
  const rows = data.categories.map((label, i) => ({
    label,
    Present: data.present[i] ?? 0,
    Absent: data.absent[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Present" fill="#1a6fba" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Absent" fill="#dc3545" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}