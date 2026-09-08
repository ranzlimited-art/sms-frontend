import type { LoginUser } from '../auth/types';

/**
 * Placeholder until AuthContext.tsx exists (per our earlier plan) —
 * once that's built, LoginPage should call its login() method instead
 * of this directly. Keeping it isolated here means that swap only
 * touches one import in LoginPage.tsx.
 */
export function persistSession(token: string, user: LoginUser, remember: boolean): void {
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem('auth_token', token);
  store.setItem('auth_user', JSON.stringify(user));
}