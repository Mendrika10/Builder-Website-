import { API_URL } from "./api";
import { authHeaders, parseError } from "./http";

/** STATS-003 — Réponse de GET /sites/:id/analytics. */
export type Statistiques = {
  site: { nom: string; slug: string };
  periode: { jours: number; depuis: string };
  totalVues: number;
  vuesAujourdHui: number;
  serie: { date: string; vues: number }[];
  topPages: { titre: string; slug: string; vues: number }[];
};

/** STATS-003 — Statistiques du site (403 si le plan n'inclut pas analytics). */
export async function fetchAnalytics(siteId: string, jours = 30): Promise<Statistiques> {
  const res = await fetch(`${API_URL}/sites/${siteId}/analytics?days=${jours}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as Statistiques;
}
