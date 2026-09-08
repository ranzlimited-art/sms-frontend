import type { ReactNode } from 'react';
import { ParentSidebar } from './parent/Sidebar';
import { ParentNavbar } from './parent/Navbar';

interface ParentLayoutProps {
  children: ReactNode;
  selectedChild?: {
    uuid: string;
    first_name: string;
    last_name: string;
    admission_number: string;
    photo_url: string | null;
  };
}

export function ParentLayout({ children, selectedChild }: ParentLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ParentSidebar selectedChild={selectedChild} />
      <ParentNavbar />

      <main className="ml-[280px] pt-20">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>

        <footer
          className="bg-white px-8 py-5 text-center text-[11px] text-slate-400"
          style={{ borderTop: '1px solid #e5e7eb' }}
        >
          Copyright © {new Date().getFullYear()} EduCentral
        </footer>
      </main>
    </div>
  );
}