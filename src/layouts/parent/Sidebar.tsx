import { NavLink, useParams } from 'react-router-dom';
import { Home, Grid, CheckSquare, BarChart2, CreditCard, Clock, AlertTriangle, User, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/authContext';

interface ParentSidebarProps {
  selectedChild?: {
    uuid: string;
    first_name: string;
    last_name: string;
    admission_number: string;
    photo_url: string | null;
  };
}

const linkClass = (isActive: boolean) =>
  `flex items-center gap-3 rounded-md px-4 py-2.5 text-[13px] font-semibold transition ${
    isActive ? 'bg-slate-100 text-[#001327]' : 'text-[#283c50] hover:bg-slate-100'
  }`;

export function ParentSidebar({ selectedChild }: ParentSidebarProps) {
  const { logout } = useAuth();
  const params = useParams();
  const studentId = selectedChild?.uuid ?? params.studentId;

  const childLinks = studentId
    ? [
        { label: 'Overview', to: `/parent-portal/students/${studentId}`, icon: Grid },
        { label: 'Attendance', to: `/parent-portal/students/${studentId}/attendance`, icon: CheckSquare },
        { label: 'Exam Results', to: `/parent-portal/students/${studentId}/exam-results`, icon: BarChart2 },
        { label: 'Fees & Payments', to: `/parent-portal/students/${studentId}/fees`, icon: CreditCard },
        { label: 'Timetable', to: `/parent-portal/students/${studentId}/timetable`, icon: Clock },
        { label: 'Discipline Records', to: `/parent-portal/students/${studentId}/discipline`, icon: AlertTriangle },
      ]
    : [];

  const initials = selectedChild
    ? `${selectedChild.first_name[0] ?? ''}${selectedChild.last_name[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <nav
      className="fixed inset-y-0 left-0 z-[1026] w-[280px] overflow-y-auto bg-white"
      style={{ borderRight: '1px solid #e5e7eb' }}
    >
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <span className="text-lg font-bold" style={{ color: '#283c50' }}>
          EduCentral
        </span>
      </div>

      <div className="space-y-0.5 p-2.5">
        <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Overview</p>
        <NavLink to="/parent-portal/dashboard" className={({ isActive }) => linkClass(isActive)}>
          <Home size={18} />
          Home
        </NavLink>

        {selectedChild && (
          <>
            <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {selectedChild.first_name} {selectedChild.last_name}
            </p>

            <div className="mb-2 border-b border-slate-100 py-3 text-center">
              {selectedChild.photo_url ? (
                <img
                  src={selectedChild.photo_url}
                  alt=""
                  className="mx-auto mb-2 h-[60px] w-[60px] rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-2 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-600">
                  {initials}
                </div>
              )}
              <p className="font-mono text-xs text-slate-400">{selectedChild.admission_number}</p>
            </div>

            {childLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => linkClass(isActive)}>
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </>
        )}

        {!selectedChild && (
          <>
            <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</p>
            <NavLink to="/parent-portal/account/profile" className={({ isActive }) => linkClass(isActive)}>
              <User size={18} />
              My Profile
            </NavLink>
            <NavLink to="/parent-portal/account/password" className={({ isActive }) => linkClass(isActive)}>
              <Lock size={18} />
              Change Password
            </NavLink>
            <button
              onClick={() => void logout()}
              className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-[13px] font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}