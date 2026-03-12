"use client";

export type AuthSession = {
  id: string;
  email: string;
  name: string;
  token: string;
};

const STORAGE_KEY = "ryu-auth";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type JwtPayload = {
  exp?: number;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}

export function getStoredAuth(): AuthSession | null {
  if (!isBrowser()) {
    console.warn('getStoredAuth called on non-browser environment');
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      console.warn('No ryu-auth found in localStorage');
      return null;
    }
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || isJwtExpired(parsed.token)) {
      clearStoredAuth();
      return null;
    }
    console.log('Retrieved auth from localStorage:', { id: parsed.id, email: parsed.email, hasToken: !!parsed.token });
    return parsed;
  } catch (error) {
    console.error("Failed to read auth from storage", error);
    return null;
  }
}

export function setStoredAuth(session: AuthSession) {
  if (!isBrowser()) {
    console.warn('setStoredAuth called on non-browser environment');
    return;
  }
  
  try {
    const serialized = JSON.stringify(session);
    console.log('Saving to localStorage:', serialized.substring(0, 100));
    window.localStorage.setItem(STORAGE_KEY, serialized);
    
    // Verify it was actually saved
    const verify = window.localStorage.getItem(STORAGE_KEY);
    if (!verify) {
      console.error('ERROR: Failed to save to localStorage!');
      return;
    }
    console.log('Successfully saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return;
  }
  
  // Keep a lightweight cookie for simple client-only checks; secure cookie should be set server-side in production.
  try {
    document.cookie = `ryu_token=${session.token}; path=/; SameSite=Lax`;
    console.log('Cookie set successfully');
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

export function clearStoredAuth() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  document.cookie = "ryu_token=; Max-Age=0; path=/; SameSite=Lax";
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return false;

    const result = await response.json();
    return Boolean(result?.success && result?.data?.valid);
  } catch (error) {
    console.warn("Token validation request failed", error);
    return false;
  }
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Login failed");
  }

  const result = await response.json();
  console.log('Login response:', result);
  
  // Extract payload from nested data object
  const payload = result.data || result;
  console.log('Extracted payload:', payload);
  console.log('Token in payload:', payload.token);
  
  if (!payload.token) {
    console.error('ERROR: Token is missing from login response!', result);
    throw new Error('Token not found in login response');
  }
  
  const session: AuthSession = {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    token: payload.token,
  };
  
  setStoredAuth(session);
  const stored = getStoredAuth();
  console.log('Verified stored auth:', stored);
  console.log('Token in stored auth:', stored?.token);
  return session;
}

export async function logout(): Promise<void> {
  const session = getStoredAuth();
  if (!session) {
    clearStoredAuth();
    return;
  }

  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
  } catch (error) {
    console.warn("Logout request failed", error);
  } finally {
    clearStoredAuth();
  }
}

async function safeErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(", ");
  } catch {
    /* ignore */
  }
  return response.statusText || null;
}
