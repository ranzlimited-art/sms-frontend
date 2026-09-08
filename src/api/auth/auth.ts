import { API_URL } from '../../config/constants';
import type {
  InstitutionSetting,
  LoginApiResponse,
  ApiErrorResponse,
  LoginPayload,
} from './types';

/**
 * Thin result wrapper so callers don't have to deal with fetch's
 * "ok vs not ok" split themselves — one shape either way.
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorResponse };

export async function login(payload: LoginPayload): Promise<ApiResult<LoginApiResponse>> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}));
    return { ok: false, error };
  }

  const data: LoginApiResponse = await response.json();
  return { ok: true, data };
}

/**
 * Institution branding — best-effort only. Returns null on any failure
 * so the login page can fall back to defaults without special-casing.
 */
export async function getInstitution(): Promise<InstitutionSetting | null> {
  try {
    const response = await fetch(`${API_URL}/auth/institution`);
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}