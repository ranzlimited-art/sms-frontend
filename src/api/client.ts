/**
 * client.ts
 * ---------------------------------------------------------------------------
 * One place that knows how to talk to the API: base URL, JSON headers,
 * attaching the bearer token, and turning a failed response into a typed
 * `ApiError`. Endpoint files (api/endpoints/*.ts) should always go through
 * this rather than calling `fetch` directly.
 *
 * Set VITE_API_URL in your .env (e.g. VITE_API_URL=https://api.example.com/api).
 * Falls back to "/api" so it still works behind a same-origin proxy in dev.
 * ---------------------------------------------------------------------------
 */

import type { ApiErrorResponse } from './auth/types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

const TOKEN_KEY = 'auth_token';

/** Thrown for any non-2xx response, or a network failure. */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function getStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Attach the bearer token if one is stored. Defaults to true — pass `false` for public endpoints like login/institution. */
  auth?: boolean;
}

async function request<T>(path: string, { auth = true, headers, body, ...rest }: RequestOptions = {}): Promise<T> {
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };

  if (auth) {
    const token = getStoredToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const err: ApiErrorResponse = json ?? {};

    // Let anything listening (authContext) know the session is no longer
    // valid, so it can clear itself out regardless of which call tripped it.
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    throw new ApiError(
      err.message ?? 'Something went wrong. Please try again.',
      response.status,
      err.errors
    );
  }

  return json as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};