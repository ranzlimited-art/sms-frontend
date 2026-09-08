import { apiClient } from '../client';
import type { DashboardApiResponse, StaffDashboardData } from './types';

export function hasAttendanceSummary(
  summary: AttendanceSummary | Record<string, never>
): summary is AttendanceSummary {
  return typeof (summary as AttendanceSummary).present === 'number';
}

export async function fetchDashboard(): Promise<StaffDashboardData> {
  const res = await apiClient.get<DashboardApiResponse>('/v1/dashboard');
  return res.data;
}