// ── Auth-related types ──────────────────────────────────────────────────

export interface InstitutionSetting {
  name?: string;
  short_name?: string;
  motto?: string;
  logo_url?: string | null;
}

export interface LoginUser {
  id: number;
  uuid: string;
  branch_id: number | null;
  name: string;
  email: string;
  system_role: string;
  is_super_admin: boolean;
  is_active: boolean;
  profile_photo: string | null;
}

export interface LoginApiResponse {
  status: string;
  message: string;
  data: {
    user: LoginUser;
    token: string;
    token_type: string;
    redirect_hint: string;
  };
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  email: string;
  password: string;
  device_name: string;
}