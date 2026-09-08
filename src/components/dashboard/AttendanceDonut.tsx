import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { AttendanceSummary } from '../../api/dashboard/types';

interface AttendanceDonutProps {
  summary: AttendanceSummary;
}

const COLORS = ['#1a6fba', '#dc3545', '#f4a11d', '#6c757d'];

export function AttendanceDonut({ summary }: AttendanceDonutProps) {
  const data = [
    { name: 'Present', value: summary.present },
    { name: 'Absent', value: summary.absent },
    { name: 'Late', value: summary.late },
    { name: 'Excused', value: summary.excused },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}