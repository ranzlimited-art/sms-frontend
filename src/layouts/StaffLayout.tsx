import type { ReactNode } from 'react';
import { Sidebar } from './staff/Sidebar';
import { Navbar } from './staff/Navbar';

interface StaffLayoutProps {
  children: ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-[280px] pt-20">
        <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>

        <footer
          className="flex items-center justify-between bg-white px-8 py-5 text-[11px] font-medium uppercase text-slate-400"
          style={{ borderTop: '1px solid #e5e7eb' }}
        >
          <span>Copyright © {new Date().getFullYear()} EduCentral</span>
          <div className="flex gap-4">
            <a href="#">Help</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </footer>
      </main>
    </div>
  );
}