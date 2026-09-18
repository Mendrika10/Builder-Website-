import { API_URL } from "./api";
import { getAccessToken } from "./auth";

export type Site = {
  id: string;
  nom: string;
  slug: string;
  statut: string;
  createdAt: string;
  updatedAt: string;
};

/** En-tête d'authentification (JWT access). */
function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseError(res: Response): Promise<never> {
  const data: unknown = await res.json().catch(() => null);
  const raw = (data as { message?: string | string[] } | null)?.message;
  throw new Error(Array.isArray(raw) ? raw[0] : raw ?? "Une erreur est survenue.");
}

export async function fetchSites(): Promise<Site[]> {
  const res = await fetch(`${API_URL}/sites`, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) await parseError(res);
  return (await res.json()) as Site[];
}

export async function createSite(nom: string, slug?: string): Promise<Site> {
  const res = await fetch(`${API_URL}/sites`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(slug ? { nom, slug } : { nom }),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as Site;
}

export async function renameSite(id: string, nom: string): Promise<Site> {
  const res = await fetch(`${API_URL}/sites/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ nom }),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as Site;
}

export async function deleteSite(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/sites/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) await parseError(res);
}
