/**
 * api/endpoints/auth.ts
 * ---------------------------------------------------------------------------
 * One function per route on Api\Web\Auth\LoginController. Nothing here
 * touches storage, IndexedDB, or React state — that's authContext's job.
 * This file only knows how to call the API.
 * ---------------------------------------------------------------------------
 */

import { apiClient } from '../client';
import type { ApiEnvelope, InstitutionSetting, LoginPayload, LoginResponse } from './types';
// src/api/endpoints
/** GET /auth/institution — public, used to brand the login/splash screen before a user is authenticated. */
export function fetchInstitution(): Promise<ApiEnvelope<InstitutionSetting>> {
  return apiClient.get<ApiEnvelope<InstitutionSetting>>('/auth/institution', { auth: false });
}

/** POST /auth/login */
export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/login', payload, { auth: false });
}

/** POST /auth/logout — revokes only the token used for this request. */
export function logout(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/auth/logout');
}

/** POST /auth/logout-all — revokes every token for the user (all devices). */
export function logoutAll(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/auth/logout-all');
}