import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  footerLabel?: string;
  footerValue?: string;
  progressPercent?: number;
  progressColor?: string; // tailwind bg-* class
}

export function StatCard({
  icon,
  value,
  label,
  footerLabel,
  footerValue,
  progressPercent = 0,
  progressColor = 'bg-blue-600',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-xs font-semibold text-slate-500">{label}</div>
        </div>
      </div>

      {(footerLabel || footerValue) && (
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{footerLabel}</span>
            <span className="font-medium text-slate-700">{footerValue}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}