import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import * as authApi from '../api/endpoints/auth';
import type { AuthUser, InstitutionSetting } from '../api/endpoints/types';
import { dbDelete, dbGet, dbSet } from '../db/db';

const SESSION_STORE_KEY = 'current';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  institution: InstitutionSetting | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<string>;
  logout: () => Promise<void>;
  /** UI-gating only — the API re-checks every permission server-side regardless. Super admin always returns true. */
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): { token: string; user: AuthUser } | null {
  for (const store of [window.localStorage, window.sessionStorage]) {
    const token = store.getItem(TOKEN_KEY);
    const userRaw = store.getItem(USER_KEY);
    if (token && userRaw) {
      try {
        return { token, user: JSON.parse(userRaw) as AuthUser };
      } catch {
        // corrupted entry — ignore and keep looking
      }
    }
  }
  return null;
}

function persistSession(token: string, user: AuthUser, remember: boolean): void {
  const target = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;

  target.setItem(TOKEN_KEY, token);
  target.setItem(USER_KEY, JSON.stringify(user));
  other.removeItem(TOKEN_KEY);
  other.removeItem(USER_KEY);
}

function clearStoredSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [institution, setInstitution] = useState<InstitutionSetting | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = readStoredSession();
      if (stored) {
        setToken(stored.token);
        setUser(stored.user);
        await dbSet('session', SESSION_STORE_KEY, stored);
      } else {
        const cached = await dbGet<{ token: string; user: AuthUser }>('session', SESSION_STORE_KEY);
        if (cached) {
          setToken(cached.token);
          setUser(cached.user);
        }
      }
      setIsInitializing(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.fetchInstitution();
        setInstitution(res.data);
        await dbSet('cache', 'institution', res.data);
      } catch {
        const cached = await dbGet<InstitutionSetting>('cache', 'institution');
        if (cached) setInstitution(cached);
      }
    })();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearStoredSession();
      dbDelete('session', SESSION_STORE_KEY);
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    const response = await authApi.login({
      email,
      password,
      device_name: navigator.userAgent?.slice(0, 255) ?? 'web',
    });

    const { user: loggedInUser, token: issuedToken, redirect_hint } = response.data;

    persistSession(issuedToken, loggedInUser, remember);
    await dbSet('session', SESSION_STORE_KEY, { token: issuedToken, user: loggedInUser });

    setUser(loggedInUser);
    setToken(issuedToken);

    return redirect_hint;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort: still clear the local session even if the request fails.
    }
    clearStoredSession();
    await dbDelete('session', SESSION_STORE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      if (user.is_super_admin) return true;
      return user.permissions?.includes(permission) ?? false;
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      institution,
      isAuthenticated: Boolean(user && token),
      isInitializing,
      login,
      logout,
      hasPermission,
    }),
    [user, token, institution, isInitializing, login, logout, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() must be called from inside an <AuthProvider>.');
  }
  return ctx;
}