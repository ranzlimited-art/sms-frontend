import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { FeeChartData } from '../../api/dashboard/types';

interface FeeAreaChartProps {
  data: FeeChartData;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return `${value}`;
}

export function FeeAreaChart({ data }: FeeAreaChartProps) {
  const rows = data.categories.map((label, i) => ({ label, collected: data.collected[i] ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a6fba" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#1a6fba" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
        <Tooltip formatter={(value: number) => [`TZS ${value.toLocaleString()}`, 'Collections']} />
        <Area type="monotone" dataKey="collected" stroke="#1a6fba" strokeWidth={2} fill="url(#feeGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}