import { useAuth } from '../../auth/authContext';

export function ParentNavbar() {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <header
      className="fixed inset-x-0 top-0 z-[1025] ml-[280px] flex h-20 items-center justify-between bg-white px-8"
      style={{ borderBottom: '1px solid #e5e7eb' }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Parent Portal</p>

      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#1a6fba,#0d4f8b)' }}
        >
          {initials}
        </span>
        <div className="hidden sm:block">
          <p className="text-[13px] font-semibold text-slate-800">{user?.name}</p>
          <p className="text-[11px] text-slate-500">Parent</p>
        </div>
      </div>
    </header>
  );
}