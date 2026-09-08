import type { LucideIcon } from 'lucide-react';
import {
  Wind, Globe, Settings, FileText, BarChart2, GitBranch, Calendar, Grid,
  BookOpen, Clock, Award, Users, CheckSquare, Edit3, CreditCard, Briefcase,
  MessageSquare, Book, Home, Truck, Shield, Eye, User,
} from 'lucide-react';

export interface NavLinkItem {
  type: 'link';
  label: string;
  to: string;
  icon: LucideIcon;
  permission?: string;
  superAdminOnly?: boolean;
}

export interface NavGroupItem {
  type: 'group';
  label: string;
  icon: LucideIcon;
  permission?: string;
  children: { label: string; to: string; permission?: string; badge?: string }[];
}

export interface NavCaptionItem {
  type: 'caption';
  label: string;
}

export type NavItem = NavLinkItem | NavGroupItem | NavCaptionItem;

export const staffNavConfig: NavItem[] = [
  { type: 'caption', label: 'Overview' },
  { type: 'link', label: 'Dashboard', to: '/dashboard', icon: Wind },
  { type: 'link', label: 'All Branches Overview', to: '/school-admin/dashboard', icon: Globe, superAdminOnly: true },

  { type: 'caption', label: 'Institution' },
  { type: 'link', label: 'Institution Settings', to: '/institution/settings', icon: Settings, permission: 'institution.view' },
  {
    type: 'group', label: 'Report Templates', icon: FileText, permission: 'templates.create',
    children: [
      { label: 'All Templates', to: '/institution/report-templates' },
      { label: 'Create Template', to: '/institution/report-templates/create' },
    ],
  },
  { type: 'link', label: 'Cross-Branch Analytics', to: '/school-admin/dashboard', icon: BarChart2, permission: 'institution.view_analytics' },

  { type: 'caption', label: 'Branch Settings' },
  {
    type: 'group', label: 'Settings', icon: GitBranch,
    children: [
      { label: 'Branches', to: '/settings/branches', permission: 'branches.view' },
      { label: 'Education Types', to: '/settings/education-types', permission: 'branches.manage_types' },
      { label: 'Report Templates', to: '/settings/templates', permission: 'templates.view' },
    ],
  },

  { type: 'caption', label: 'Academics' },
  { type: 'link', label: 'Academic Years', to: '/academics/years', icon: Calendar, permission: 'academic_years.view' },
  {
    type: 'group', label: 'Classes & Streams', icon: Grid,
    children: [
      { label: 'All Streams', to: '/academics/streams', permission: 'streams.view' },
      { label: 'All Classes', to: '/academics/classes', permission: 'classes.view' },
      { label: 'Add Class', to: '/academics/classes/create', permission: 'classes.create' },
    ],
  },
  {
    type: 'group', label: 'Subjects', icon: BookOpen, permission: 'subjects.view',
    children: [
      { label: 'All Subjects', to: '/academics/subjects' },
      { label: 'Add Subject', to: '/academics/subjects/create', permission: 'subjects.create' },
    ],
  },
  { type: 'link', label: 'Timetable', to: '/academics/timetable', icon: Clock, permission: 'timetable.view' },
  {
    type: 'group', label: 'Grading Scales', icon: Award, permission: 'grading.view',
    children: [
      { label: 'All Scales', to: '/academics/grading' },
      { label: 'New Scale', to: '/academics/grading/create', permission: 'grading.create' },
    ],
  },

  { type: 'caption', label: 'Students' },
  {
    type: 'group', label: 'Students', icon: Users, permission: 'students.view',
    children: [
      { label: 'All Students', to: '/students' },
      { label: 'Admit Student', to: '/students/create', permission: 'students.create' },
      { label: 'Class Enrolment', to: '/students/enrolment', permission: 'enrollments.view' },
      { label: 'Transfers', to: '/students/transfers', permission: 'transfers.view' },
      { label: 'Discipline', to: '/students/discipline', permission: 'discipline.view' },
      { label: 'ID Cards', to: '/students/id-cards', permission: 'students.print_id_card' },
    ],
  },

  { type: 'caption', label: 'Attendance' },
  {
    type: 'group', label: 'Attendance', icon: CheckSquare,
    children: [
      { label: 'Take Attendance', to: '/attendance/students/take', permission: 'student_attendance.take' },
      { label: 'Student Records', to: '/attendance/students', permission: 'student_attendance.view' },
      { label: 'Teacher Attendance', to: '/attendance/teachers', permission: 'teacher_attendance.view' },
      { label: 'Biometric Devices', to: '/attendance/devices', permission: 'biometric.view' },
    ],
  },

  { type: 'caption', label: 'Exams & Results' },
  {
    type: 'group', label: 'Examinations', icon: Edit3,
    children: [
      { label: 'Exams', to: '/exams', permission: 'exams.view' },
      { label: 'Enter Marks', to: '/exams/marks-section', permission: 'exam_marks.enter' },
      { label: 'Results', to: '/results', permission: 'results.view' },
      { label: 'Report Cards', to: '/report-cards', permission: 'results.generate_report_cards' },
    ],
  },

  { type: 'caption', label: 'Finance' },
  {
    type: 'group', label: 'Finance', icon: CreditCard,
    children: [
      { label: 'Fee Structure', to: '/finance/fee-structure', permission: 'fees.view' },
      { label: 'Invoices', to: '/finance/invoices', permission: 'invoices.view' },
      { label: 'Record Payment', to: '/finance/payments/create', permission: 'payments.record' },
      { label: 'Payment History', to: '/finance/payments', permission: 'payments.view' },
      { label: 'Expenses', to: '/finance/expenses', permission: 'expenses.view' },
      { label: 'Payroll', to: '/staff/payroll', permission: 'payroll.view' },
      { label: 'Finance Reports', to: '/finance/reports', permission: 'reports.view_finance' },
    ],
  },

  { type: 'caption', label: 'Human Resources' },
  {
    type: 'group', label: 'Staff', icon: Briefcase, permission: 'staff.view',
    children: [
      { label: 'All Staff', to: '/staff' },
      { label: 'Add Staff', to: '/staff/create', permission: 'staff.create' },
      { label: 'Leave Requests', to: '/staff/leave-requests', permission: 'leave.view' },
      { label: 'Payroll', to: '/staff/payroll', permission: 'payroll.view' },
      { label: 'Contracts', to: '/staff/contracts', permission: 'staff_contracts.view' },
    ],
  },

  { type: 'caption', label: 'Communication' },
  {
    type: 'group', label: 'Communication', icon: MessageSquare, permission: 'communication.view',
    children: [
      { label: 'Announcements', to: '/communication/announcements' },
      { label: 'Send SMS', to: '/communication/sms/send', permission: 'sms.send' },
      { label: 'SMS Logs', to: '/communication/sms/logs', permission: 'sms.view_logs' },
    ],
  },

  { type: 'caption', label: 'Library' },
  {
    type: 'group', label: 'Library', icon: Book, permission: 'library.view',
    children: [
      { label: 'Book Catalogue', to: '/library/books' },
      { label: 'Issue / Return', to: '/library/issues', permission: 'library.issue_book' },
      { label: 'Add Books', to: '/library/books/create', permission: 'library.create' },
      { label: 'Overdue Books', to: '/library/overdue', permission: 'library.manage_fines' },
    ],
  },

  { type: 'link', label: 'Hostel', to: '/hostel/buildings', icon: Home, permission: 'hostel.view' },
  { type: 'link', label: 'Transport', to: '/transport', icon: Truck, permission: 'transport.view' },

  { type: 'caption', label: 'System' },
  {
    type: 'group', label: 'Users & Roles', icon: Shield, permission: 'users.view',
    children: [
      { label: 'System Users', to: '/system/users' },
      { label: 'Roles', to: '/system/roles', permission: 'roles.view' },
      { label: 'Permissions', to: '/system/permissions', permission: 'roles.update' },
    ],
  },
  { type: 'link', label: 'Audit Logs', to: '/system/audit-logs', icon: Eye, permission: 'institution.view_audit_logs' },

  { type: 'caption', label: 'Account' },
  {
    type: 'group', label: 'Profile', icon: User,
    children: [
      { label: 'My Profile', to: '/account/profile' },
      { label: 'Change Password', to: '/account/password' },
    ],
  },
];