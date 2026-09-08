import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, User, Activity, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/authContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <header
      className="fixed inset-x-0 top-0 z-[1025] ml-[280px] flex h-20 items-center justify-between bg-white px-8"
      style={{ borderBottom: '1px solid #e5e7eb' }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        EduCentral Platform
      </p>

      <div className="flex items-center gap-1">
        <button className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
        </button>

        <div className="relative ml-1">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#1a6fba,#0d4f8b)' }}
            >
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-[130px] truncate text-[13px] font-semibold text-slate-800">
                {user?.name}
              </span>
              <span className="block text-[11px] text-slate-500">{user?.system_role}</span>
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {open && (
            <div
              onMouseLeave={() => setOpen(false)}
              className="absolute right-0 mt-2 w-[220px] rounded-lg border border-slate-200 bg-white py-2 shadow-lg"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-[13px] font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Link to="/account/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <User size={14} /> My Profile
              </Link>
              <Link to="/system/audit-logs" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Activity size={14} /> Activity Log
              </Link>
              <Link to="/account/password" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Lock size={14} /> Change Password
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => void logout()}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}