export interface DashboardUser {
  id: number;
  name: string;
  branch_id: number | null;
  role_slug: string | null;
}

export interface TodayStats {
  total_students?: number;
  new_admissions_today?: number;
  total_staff?: number;
  present_today?: number;
  absent_today?: number;
  attendance_percentage?: number;
  todays_collections?: number;
  yesterdays_collections?: number;
  collection_difference?: number;
  collection_percentage?: number;
  outstanding_balance?: number;
  unpaid_invoices?: number;
  active_exams?: number;
}

export interface AttendanceChart {
  categories: string[];
  present: number[];
  absent: number[];
}

export interface FeeChartData {
  categories: string[];
  collected: number[];
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export interface RecentStudent {
  id: number;
  admission_number: string;
  first_name: string;
  last_name: string;
  gender: string;
  admission_date: string;
  status: string;
}

export interface PendingFee {
  id: number;
  invoice_number: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  due_date: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export interface UpcomingExam {
  id: number;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  results_published: boolean;
}

export interface RecentPayment {
  id: number;
  receipt_number: string;
  amount: number;
  method: string;
  paid_at: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export interface LeaveRequest {
  id: number;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: string;
  staff_name: string;
  leave_type: string;
  staff_type: string;
}

export interface OverdueBook {
  id: number;
  due_date: string;
  title: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export interface Announcement {
  id: number;
  title: string;
  target_audience: string;
  channels: string; // JSON-encoded array, as stored
  publish_at: string;
  sent_at: string | null;
}

export interface ActivityLogEntry {
  id: number;
  action: string;
  table_name: string | null;
  created_at: string;
  user_name: string;
}

export interface StaffDashboardData {
  user: DashboardUser;
  today_stats: TodayStats;
  week_stats: Record<string, unknown>;
  attendance_chart: AttendanceChart;
  fee_chart_data: FeeChartData;
  attendance_summary: AttendanceSummary | Record<string, never>;
  recent_students: RecentStudent[];
  pending_fees: PendingFee[];
  upcoming_exams: UpcomingExam[];
  recent_payments: RecentPayment[];
  leave_requests: LeaveRequest[];
  overdue_books: OverdueBook[];
  recent_announcements: Announcement[];
  recent_activity: ActivityLogEntry[];
}

export interface DashboardApiResponse {
  success: boolean;
  data: StaffDashboardData;
}

export function hasAttendanceSummary(
  summary: AttendanceSummary | Record<string, never>
): summary is AttendanceSummary {
  return typeof (summary as AttendanceSummary).present === 'number';
}