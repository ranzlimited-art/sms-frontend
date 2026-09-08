import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../auth/authContext';
import { staffNavConfig, type NavGroupItem, type NavLinkItem } from './navConfig';

const PRIMARY = '#1a6fba';

export function Sidebar() {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const isSuperAdmin = Boolean(user?.is_super_admin);

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  const canSeeLink = (item: NavLinkItem) => {
    if (item.superAdminOnly) return isSuperAdmin;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  };

  const visibleChildren = (group: NavGroupItem) =>
    group.children.filter((c) => !c.permission || hasPermission(c.permission));

  const canSeeGroup = (group: NavGroupItem) =>
    group.permission ? hasPermission(group.permission) : visibleChildren(group).length > 0;

  return (
    <nav
      className="fixed inset-y-0 left-0 z-[1026] w-[280px] overflow-y-auto bg-white"
      style={{ borderRight: '1px solid #e5e7eb' }}
    >
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <span className="text-lg font-bold" style={{ color: '#283c50' }}>
          EduCentral
        </span>
      </div>

      <div className="space-y-0.5 p-2.5">
        {staffNavConfig.map((item, i) => {
          if (item.type === 'caption') {
            return (
              <p
                key={i}
                className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400"
              >
                {item.label}
              </p>
            );
          }

          if (item.type === 'link') {
            if (!canSeeLink(item)) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-4 py-2.5 text-[13px] font-semibold transition ${
                    isActive ? 'bg-slate-100 text-[#001327]' : 'text-[#283c50] hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          }

          // group
          if (!canSeeGroup(item)) return null;
          const children = visibleChildren(item);
          const isOpen = openGroups.has(item.label) || children.some((c) => location.pathname.startsWith(c.to));
          const Icon = item.icon;

          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => toggleGroup(item.label)}
                className="flex w-full items-center justify-between rounded-md px-4 py-2.5 text-[13px] font-semibold text-[#283c50] transition hover:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                <ChevronRight size={14} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <div className="ml-9 space-y-0.5 border-l border-slate-100 pl-3">
                  {children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `block rounded-md px-3 py-1.5 text-[13px] transition ${
                          isActive ? 'font-semibold text-[#001327]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}