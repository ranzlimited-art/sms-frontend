import { apiClient } from '../client';
import type { ParentDashboardApiResponse, ChildStudent } from './types';

export async function fetchParentDashboard(): Promise<ChildStudent[]> {
  const res = await apiClient.get<ParentDashboardApiResponse>('/v1/parent/dashboard');
  return res.data;
}