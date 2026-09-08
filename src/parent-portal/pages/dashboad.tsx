import { Link } from 'react-router-dom';
import { useCachedApiData } from '../../hooks/useCachedApiData';
import { fetchParentDashboard } from '../../api/parentPortal/parentPortal';
import { LoadingState } from '../../components/LoadingState';
import { StaleDataBanner } from '../../components/StaleDataBanner';
import { ParentLayout } from '../../layouts/ParentLayout';

/**
 * dashboad.tsx (Parent Portal — "My Children")
 * ---------------------------------------------------------------------------
 * Port of parent-portal.dashboard (Blade) — pulls from
 * GET /v1/parent/dashboard (Api\Web\ParentPortal\ParentPortalController::dashboard()).
 *
 * Each card is a Link into that child's overview page — the equivalent of
 * the Blade version's whole-card <a href="{{ route('parent.students.overview', $child) }}">.
 *
 * Backed by useCachedApiData under the 'dashboard:parent' key — on a repeat
 * visit the last-cached payload renders immediately while a fresh fetch
 * runs in the background; a StaleDataBanner appears above the content
 * whenever what's on screen is the cached copy rather than a live one.
 * ---------------------------------------------------------------------------
 */
export default function ParentDashboardPage() {
  const { data: children, loading, error, isStale, cachedAt } = useCachedApiData(
    'dashboard:parent',
    fetchParentDashboard
  );

  const statusColor: Record<string, string> = {
    active: 'bg-green-50 text-green-700',
    inactive: 'bg-slate-100 text-slate-600',
    graduated: 'bg-blue-50 text-blue-700',
    transferred: 'bg-amber-50 text-amber-700',
    expelled: 'bg-red-50 text-red-700',
  };

  return (
    <ParentLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">My Children</h1>
      </div>

      {isStale && <StaleDataBanner cachedAt={cachedAt} />}

      <LoadingState loading={loading} error={error}>
        {children && children.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">
            <p>No student records are linked to your account yet.</p>
            <p className="mt-1 text-sm">Contact the school office if this doesn't look right.</p>
          </div>
        )}

        {children && children.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => {
              const currentEnrollment = child.enrollments?.[0];
              const initials = `${child.first_name[0] ?? ''}${child.last_name[0] ?? ''}`.toUpperCase();

              return (
                <Link
                  key={child.id}
                  to={`/parent-portal/students/${child.uuid}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:shadow-md"
                >
                  {child.photo_url ? (
                    <img
                      src={child.photo_url}
                      alt={`${child.first_name} ${child.last_name}`}
                      className="mx-auto mb-3 h-[90px] w-[90px] rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`mx-auto mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full text-2xl font-semibold ${
                        child.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {initials}
                    </div>
                  )}

                  <h2 className="mb-1 font-semibold text-slate-900">
                    {child.first_name} {child.last_name}
                  </h2>
                  <p className="mb-2 font-mono text-xs text-slate-400">{child.admission_number}</p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColor[child.status] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
                  </span>

                  <hr className="my-4 border-slate-100" />

                  <div className="space-y-1 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Branch</span>
                      <span className="font-medium text-slate-700">{child.branch?.name ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Level</span>
                      <span className="font-medium text-slate-700">
                        {child.school_type?.display_name ?? child.school_type?.type ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class</span>
                      <span className="font-medium text-slate-700">
                        {currentEnrollment?.school_class?.name ?? '—'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </LoadingState>
    </ParentLayout>
  );
}