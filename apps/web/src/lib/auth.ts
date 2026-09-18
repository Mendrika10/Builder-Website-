import { API_URL } from "./api";

export type SessionUser = { id: string; nom: string; email: string };

type LoginResponse = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

const KEY_ACCESS = "sitemg.access";
const KEY_REFRESH = "sitemg.refresh";
const KEY_USER = "sitemg.user";

/** Session courante (côté client) — null si déconnecté. */
export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY_USER);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY_ACCESS);
}

/** AUTH-013 — Connexion : persiste la session localement. */
export async function login(email: string, motDePasse: string): Promise<SessionUser> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, motDePasse }),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const raw = (data as { message?: string } | null)?.message;
    throw new Error(raw ?? "Connexion impossible. Réessayez.");
  }
  const { user, accessToken, refreshToken } = data as LoginResponse;
  window.localStorage.setItem(KEY_ACCESS, accessToken);
  window.localStorage.setItem(KEY_REFRESH, refreshToken);
  window.localStorage.setItem(KEY_USER, JSON.stringify(user));
  return user;
}

/** AUTH-013 — Déconnexion : révoque le refresh token puis purge la session. */
export async function logout(): Promise<void> {
  const refreshToken = window.localStorage.getItem(KEY_REFRESH);
  if (refreshToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }
  window.localStorage.removeItem(KEY_ACCESS);
  window.localStorage.removeItem(KEY_REFRESH);
  window.localStorage.removeItem(KEY_USER);
}
