export type UserRole = "super_admin";

export interface AuthSession {
  email: string;
  name: string;
  role: UserRole;
}

export const SUPER_ADMIN_CREDENTIALS = {
  username: "superadmin",
  email: "superadmin@sigocana.local",
  password: "SuperAdmin2026!",
  name: "Super Admin",
} as const;

const AUTH_STORAGE_KEY = "sigocana.auth.session";

const canUseStorage = () => typeof window !== "undefined";

export function authenticate(identifier: string, password: string): AuthSession | null {
  const normalized = identifier.trim().toLowerCase();
  const matchesUser =
    normalized === SUPER_ADMIN_CREDENTIALS.username ||
    normalized === SUPER_ADMIN_CREDENTIALS.email;

  if (!matchesUser || password !== SUPER_ADMIN_CREDENTIALS.password) {
    return null;
  }

  return {
    email: SUPER_ADMIN_CREDENTIALS.email,
    name: SUPER_ADMIN_CREDENTIALS.name,
    role: "super_admin",
  };
}

export function getStoredSession(): AuthSession | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isSuperAdmin(session: AuthSession | null | undefined) {
  return session?.role === "super_admin";
}
