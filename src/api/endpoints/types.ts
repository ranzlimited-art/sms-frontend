/**
 * types.ts
 * ---------------------------------------------------------------------------
 * Shared shapes for talking to the Laravel API. Mirrors what the backend
 * controllers actually return — keep this in sync as new endpoints are
 * wired up rather than letting each endpoint file invent its own shape.
 * ---------------------------------------------------------------------------
 */

/** Generic envelope most endpoints use: `{ status?, message?, data }`. */
export interface ApiEnvelope<T> {
  status?: string;
  message?: string;
  data: T;
}

/** Shape of a Laravel validation/auth error response (422/401/403/etc). */
export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

/** Laravel's default paginator shape, for endpoints that use ->paginate(). */
export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

// ── Institution branding ────────────────────────────────────────────────

export interface InstitutionSetting {
  name?: string;
  short_name?: string;
  motto?: string;
  logo_url?: string | null;
}

// ── Auth ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  uuid: string;
  branch_id: number | null;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string | null;
  phone_verified_at: string | null;
  profile_photo: string | null;
  system_role: string;
  is_super_admin: boolean;
  permissions?: string[];
  is_active: boolean;
  two_factor_enabled: boolean;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  device_name?: string;
}

export interface LoginResponseData {
  user: AuthUser;
  token: string;
  token_type: string;
  redirect_hint: string;
}

export type LoginResponse = ApiEnvelope<LoginResponseData>;