import { Users, CheckCircle2, DollarSign, AlertTriangle, Briefcase, Edit3 } from 'lucide-react';
import { useCachedApiData } from '../../hooks/useCachedApiData';
import { fetchDashboard } from '../../api/dashboard/dashboard';
import { LoadingState } from '../../components/LoadingState';
import { StaleDataBanner } from '../../components/StaleDataBanner';
import { StatCard } from '../../components/StatCard';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { AttendanceBarChart } from '../../components/dashboard/AttendanceBarChart';
import { FeeAreaChart } from '../../components/dashboard/FeeAreaChart';
import { AttendanceDonut } from '../../components/dashboard/AttendanceDonut';
import { StaffLayout } from '../../layouts/StaffLayout';
import { useAuth } from '../../auth/authContext';
import { hasAttendanceSummary } from '../../api/dashboard/types';

/**
 * staffDashboard.tsx
 * ---------------------------------------------------------------------------
 * Port of dashboard.all_user_dashboard.content (Blade) — pulls from
 * GET /v1/dashboard (Api\Web\DashboardController::index()).
 *
 * The backend only includes a given section when the user has the matching
 * permission — every section below checks `.length > 0` / key presence
 * rather than checking permissions itself. The frontend never needs to
 * know the permission string; it just renders whatever the API sent.
 *
 * Charts (attendance bar, fee area, attendance donut) are Recharts
 * equivalents of the Blade version's ApexCharts widgets — same data shape
 * (`attendance_chart`, `fee_chart_data`, `attendance_summary`), same
 * placement in the layout.
 * ---------------------------------------------------------------------------
 */
export default function StaffDashboard() {
  const { data, loading, error, isStale, cachedAt } = useCachedApiData('dashboard:staff', fetchDashboard);
  const { hasPermission } = useAuth();

  const attendancePresentPct = (present: number, absent: number) =>
    present + absent > 0 ? Math.round((present / (present + absent)) * 100) : 0;

  return (
    <StaffLayout>
      <PageHeader />

      {isStale && <StaleDataBanner cachedAt={cachedAt} />}

      <LoadingState loading={loading} error={error}>
        {data && (
          <div className="space-y-6">
            {/* ── Top stat cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.today_stats.total_students !== undefined && (
                <StatCard
                  icon={<Users size={20} />}
                  value={data.today_stats.total_students}
                  label="Active Students"
                  footerLabel="New Admissions"
                  footerValue={`${data.today_stats.new_admissions_today ?? 0} Today`}
                  progressPercent={75}
                  progressColor="bg-blue-600"
                />
              )}

              {data.today_stats.present_today !== undefined && (
                <StatCard
                  icon={<CheckCircle2 size={20} />}
                  value={data.today_stats.present_today}
                  label="Present Today"
                  footerLabel="Attendance Rate"
                  footerValue={`${data.today_stats.attendance_percentage ?? 0}% (${data.today_stats.absent_today ?? 0} absent)`}
                  progressPercent={data.today_stats.attendance_percentage ?? 0}
                  progressColor="bg-green-600"
                />
              )}

              {data.today_stats.todays_collections !== undefined && (
                <StatCard
                  icon={<DollarSign size={20} />}
                  value={`TZS ${data.today_stats.todays_collections.toLocaleString()}`}
                  label="Collected Today"
                  footerLabel="vs Yesterday"
                  footerValue={`${(data.today_stats.collection_difference ?? 0) >= 0 ? '+' : ''}TZS ${Math.abs(
                    data.today_stats.collection_difference ?? 0
                  ).toLocaleString()}`}
                  progressPercent={70}
                  progressColor="bg-slate-800"
                />
              )}

              {data.today_stats.outstanding_balance !== undefined && (
                <StatCard
                  icon={<AlertTriangle size={20} />}
                  value={`TZS ${data.today_stats.outstanding_balance.toLocaleString()}`}
                  label="Outstanding Fees"
                  footerLabel="Unpaid Invoices"
                  footerValue={`${data.today_stats.unpaid_invoices ?? 0} invoices`}
                  progressPercent={60}
                  progressColor="bg-amber-500"
                />
              )}

              {/* Staff card — only when there's no finance widget taking its slot, matching Blade's !isset($todayStats['todays_collections']) condition */}
              {data.today_stats.total_staff !== undefined && data.today_stats.todays_collections === undefined && (
                <StatCard
                  icon={<Briefcase size={20} />}
                  value={data.today_stats.total_staff}
                  label="Staff Members"
                  footerLabel="Active Staff"
                  footerValue="All Active"
                  progressPercent={100}
                  progressColor="bg-cyan-600"
                />
              )}

              {/* Open Exams card — teacher-facing, only when there's no student-count widget */}
              {data.today_stats.active_exams !== undefined && data.today_stats.total_students === undefined && (
                <StatCard
                  icon={<Edit3 size={20} />}
                  value={data.today_stats.active_exams}
                  label="Open Exams"
                  footerLabel="Awaiting Marks"
                  footerValue=""
                  progressPercent={50}
                  progressColor="bg-purple-600"
                />
              )}
            </div>

            {/* ── Attendance chart + donut ────────────────────────────── */}
            {hasPermission('attendance.view') && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2 className="font-bold text-slate-800">Attendance Overview</h2>
                    <span className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                      Last 7 Days
                    </span>
                  </div>
                  <div className="p-2">
                    <AttendanceBarChart data={data.attendance_chart} />
                  </div>
                  {hasAttendanceSummary(data.attendance_summary) && (
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 p-5 sm:grid-cols-4">
                      {(
                        [
                          ['Present Today', data.attendance_summary.present, 'bg-blue-600'],
                          ['Absent Today', data.attendance_summary.absent, 'bg-red-600'],
                          ['Late', data.attendance_summary.late, 'bg-amber-500'],
                          ['Excused', data.attendance_summary.excused, 'bg-slate-400'],
                        ] as const
                      ).map(([label, count, barColor]) => (
                        <div key={label} className="rounded-lg border border-dashed border-slate-200 p-3">
                          <div className="mb-1 text-xs text-slate-500">{label}</div>
                          <div className="font-bold text-slate-800">{count}</div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{
                                width: `${attendancePresentPct(
                                  data.attendance_summary.present,
                                  data.attendance_summary.absent
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {hasAttendanceSummary(data.attendance_summary) && (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-[#1a6fba] p-5 text-white">
                      <div className="mb-2 flex justify-end">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">Today</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {data.attendance_summary.present + data.attendance_summary.absent + data.attendance_summary.late}
                      </div>
                      <p className="text-sm text-white/80">Total Records Today</p>
                      <AttendanceDonut summary={data.attendance_summary} />
                    </div>
                    <div className="p-5">
                      <h3 className="mb-3 font-bold text-slate-800">Attendance Breakdown</h3>
                      {(
                        [
                          ['Present', data.attendance_summary.present, 'text-blue-600 bg-blue-50'],
                          ['Absent', data.attendance_summary.absent, 'text-red-600 bg-red-50'],
                          ['Late', data.attendance_summary.late, 'text-amber-500 bg-amber-50'],
                          ['Excused', data.attendance_summary.excused, 'text-slate-500 bg-slate-100'],
                        ] as const
                      ).map(([label, count, classes], idx, arr) => (
                        <div key={label}>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${classes}`}>
                                {count}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{label}</p>
                                <p className="text-xs text-slate-400">Today</p>
                              </div>
                            </div>
                          </div>
                          {idx < arr.length - 1 && <hr className="border-dashed border-slate-100" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            

            {/* ── Fee chart + recent payments ─────────────────────────── */}
            {hasPermission('finance.view_dashboard') && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2 className="font-bold text-slate-800">Fee Collections Overview</h2>
                    <span className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                      Last 30 Days
                    </span>
                  </div>
                  <div className="p-2">
                    <FeeAreaChart data={data.fee_chart_data} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-5 sm:grid-cols-3">
                    <div className="rounded-lg border border-dashed border-slate-200 p-3">
                      <div className="mb-1 text-xs text-slate-500">Today's Collections</div>
                      <div className="font-bold text-slate-800">
                        TZS {(data.today_stats.todays_collections ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-dashed border-slate-200 p-3">
                      <div className="mb-1 text-xs text-slate-500">Outstanding Balance</div>
                      <div className="font-bold text-red-600">
                        TZS {(data.today_stats.outstanding_balance ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-dashed border-slate-200 p-3">
                      <div className="mb-1 text-xs text-slate-500">Unpaid Invoices</div>
                      <div className="font-bold text-amber-600">{data.today_stats.unpaid_invoices ?? 0}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2 className="font-bold text-slate-800">Recent Payments</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.recent_payments.length === 0 ? (
                      <p className="px-5 py-6 text-center text-sm text-slate-400">No recent payments</p>
                    ) : (
                      data.recent_payments.map((pay) => (
                        <div key={pay.id} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                              {pay.first_name[0]}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {pay.first_name} {pay.last_name}
                              </p>
                              <p className="text-xs text-slate-400">{pay.receipt_number}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">TZS {pay.amount.toLocaleString()}</p>
                            <span className="text-xs text-slate-400">{pay.method.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Recent students + Pending fees ─────────────────────── */}
            {(data.recent_students.length > 0 || data.pending_fees.length > 0) && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {data.recent_students.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h2 className="font-bold text-slate-800">Recently Admitted Students</h2>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs uppercase text-slate-400">
                        <tr>
                          <th className="px-5 py-2">Adm. No.</th>
                          <th className="px-5 py-2">Student</th>
                          <th className="px-5 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.recent_students.map((s) => (
                          <tr key={s.id}>
                            <td className="px-5 py-3 font-medium text-blue-600">{s.admission_number}</td>
                            <td className="px-5 py-3 text-slate-800">
                              {s.first_name} {s.last_name}
                            </td>
                            <td className="px-5 py-3">
                              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {data.pending_fees.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h2 className="font-bold text-slate-800">Top Outstanding Fees</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {data.pending_fees.map((f) => (
                        <div key={f.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {f.first_name} {f.last_name}
                            </div>
                            <div className="text-xs text-slate-400">{f.invoice_number}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-800">TZS {f.balance.toLocaleString()}</div>
                            <div className="text-xs text-slate-400">Due {new Date(f.due_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Upcoming exams + Leave requests ────────────────────── */}
            {(data.upcoming_exams.length > 0 || data.leave_requests.length > 0) && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {data.upcoming_exams.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h2 className="font-bold text-slate-800">Upcoming Exams</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {data.upcoming_exams.map((exam) => (
                        <div key={exam.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <div className="text-sm font-medium text-slate-800">{exam.name}</div>
                            <div className="text-xs text-slate-400">
                              {exam.type.replace('_', ' ')} · Ends {new Date(exam.end_date).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              exam.results_published ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {exam.results_published ? 'Published' : 'Upcoming'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.leave_requests.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h2 className="font-bold text-slate-800">Pending Leave Requests</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {data.leave_requests.map((leave) => (
                        <div key={leave.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <div className="text-sm font-medium text-slate-800">{leave.staff_name}</div>
                            <div className="text-xs text-slate-400">
                              {leave.leave_type} · {leave.days_requested} day(s)
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
                              Approve
                            </button>
                            <button className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Overdue library books ──────────────────────────────── */}
            {data.overdue_books.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="font-bold text-slate-800">Overdue Library Books</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.overdue_books.map((book) => (
                    <div key={book.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{book.title}</div>
                        <div className="text-xs text-slate-400">
                          {book.first_name} {book.last_name} ({book.admission_number})
                        </div>
                      </div>
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                        Due {new Date(book.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Announcements + Recent activity ────────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h2 className="font-bold text-slate-800">Announcements</h2>
                  {hasPermission('communication.create_announcements') && (
                    <button className="text-xs font-semibold text-blue-600 hover:underline">+ New</button>
                  )}
                </div>
                <div className="divide-y divide-slate-100">
                  {data.recent_announcements.length === 0 ? (
                    <p className="px-5 py-6 text-center text-sm text-slate-400">No announcements yet</p>
                  ) : (
                    data.recent_announcements.map((ann) => (
                      <div key={ann.id} className="px-5 py-3">
                        <p className="text-sm font-semibold text-slate-800">{ann.title}</p>
                        <p className="text-xs text-slate-400">
                          {ann.target_audience} · {new Date(ann.publish_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="font-bold text-slate-800">Recent Activity</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.recent_activity.length === 0 ? (
                    <p className="px-5 py-6 text-center text-sm text-slate-400">No recent activity</p>
                  ) : (
                    data.recent_activity.map((log) => (
                      <div key={log.id} className="px-5 py-3">
                        <div className="text-sm font-medium text-slate-800">
                          {log.action} {log.table_name ? `· ${log.table_name}` : ''}
                        </div>
                        <div className="text-xs text-slate-400">
                          by {log.user_name} · {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </LoadingState>
    </StaffLayout>
  );
}