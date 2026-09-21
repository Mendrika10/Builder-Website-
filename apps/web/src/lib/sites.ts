import { API_URL } from "./api";
import { authHeaders, parseError } from "./http";

export type Site = {
  id: string;
  nom: string;
  slug: string;
  statut: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
};

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
  return updateSite(id, { nom });
}

/** US-060 — Change le nom et/ou le thème d'un site. */
export async function updateSite(id: string, data: { nom?: string; theme?: string }): Promise<Site> {
  const res = await fetch(`${API_URL}/sites/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as Site;
}

export async function deleteSite(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/sites/${id}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) await parseError(res);
}
