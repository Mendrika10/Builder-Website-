import { API_URL } from "./api";
import { getAccessToken } from "./auth";

/** Blocs supportés par le builder v1 (miroir du sanitizeContenu API). */
export type BlocType = "hero" | "texte" | "cta";
export type Bloc = { type: BlocType } & Partial<Record<"titre" | "sousTitre" | "texte" | "ctaLabel" | "ctaHref", string>>;

export type PageData = {
  id: string;
  titre: string;
  slug: string;
  contenu: Bloc[];
  ordre: number;
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

/** PAGE-005 — Récupère (ou crée) la page d'accueil du site. */
export async function fetchOrCreateHomePage(siteId: string): Promise<PageData> {
  const listRes = await fetch(`${API_URL}/sites/${siteId}/pages`, { headers: authHeaders(), cache: "no-store" });
  if (!listRes.ok) await parseError(listRes);
  const pages = (await listRes.json()) as PageData[];
  if (pages.length > 0) return pages[0];

  const createRes = await fetch(`${API_URL}/sites/${siteId}/pages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ titre: "Accueil" }),
  });
  if (!createRes.ok) await parseError(createRes);
  return (await createRes.json()) as PageData;
}

/** PAGE-006 — Sauvegarde le contenu (et le titre) de la page. */
export async function savePage(pageId: string, data: { titre?: string; contenu?: Bloc[] }): Promise<PageData> {
  const res = await fetch(`${API_URL}/pages/${pageId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as PageData;
}

/** PAGE-008 — Publie ou dépublie le site. */
export async function publishSite(siteId: string, publier: boolean): Promise<{ statut: string }> {
  const res = await fetch(`${API_URL}/sites/${siteId}/publish`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(publier ? {} : { action: "brouillon" }),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as { statut: string };
}

/** PAGE-009 — Vue publique d'un site publié (sans authentification). */
export async function fetchPublicSite(slug: string): Promise<{ nom: string; slug: string; pages: { titre: string; slug: string; contenu: Bloc[] }[] }> {
  const res = await fetch(`${API_URL}/public/sites/${slug}`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return (await res.json()) as { nom: string; slug: string; pages: { titre: string; slug: string; contenu: Bloc[] }[] };
}
