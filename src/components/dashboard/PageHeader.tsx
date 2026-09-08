import { UserPlus, CheckSquare } from 'lucide-react';
import { useAuth } from '../../auth/authContext';

export function PageHeader() {
  const { user, hasPermission } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
        <span className="hidden text-xs font-semibold text-slate-400 sm:block">Home / Dashboard</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 md:block">
          {greeting}, <strong className="text-slate-700">{firstName}</strong> 👋
        </span>

        {hasPermission('students.create') && (
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <UserPlus size={16} />
            Admit Student
          </button>
        )}

        {hasPermission('attendance.take_student') && (
          <button className="flex items-center gap-2 rounded-md bg-[#1a6fba] px-3 py-2 text-sm font-medium text-white hover:bg-[#15589a]">
            <CheckSquare size={16} />
            Take Attendance
          </button>
        )}
      </div>
    </div>
  );
}