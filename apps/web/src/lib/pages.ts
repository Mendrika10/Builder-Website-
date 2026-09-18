import { API_URL } from "./api";
import { getAccessToken } from "./auth";

/** Blocs supportés par le builder (miroir du sanitizeContenu API). */
export type BlocType = "hero" | "texte" | "cta" | "image" | "contact" | "horaires";
export type Bloc = { type: BlocType } & Partial<
  Record<"titre" | "sousTitre" | "texte" | "ctaLabel" | "ctaHref" | "url" | "alt" | "telephone" | "email" | "adresse" | "horaires", string>
>;

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

/** PAGE-012 — Liste les pages du site. */
export async function fetchPages(siteId: string): Promise<PageData[]> {
  const res = await fetch(`${API_URL}/sites/${siteId}/pages`, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) await parseError(res);
  return (await res.json()) as PageData[];
}

/** PAGE-012 — Crée une page (403 si quota du plan atteint). */
export async function createPage(siteId: string, titre: string): Promise<PageData> {
  const res = await fetch(`${API_URL}/sites/${siteId}/pages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ titre }),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as PageData;
}

/** PAGE-012 — Supprime une page. */
export async function deletePage(pageId: string): Promise<void> {
  const res = await fetch(`${API_URL}/pages/${pageId}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) await parseError(res);
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

/** SEO-001 — Description lisible dérivée du contenu (premier texte trouvé). */
export function deriveDescription(blocs: Bloc[]): string | undefined {
  const texte = blocs.find((b) => b.texte)?.texte ?? blocs.find((b) => b.sousTitre)?.sousTitre ?? blocs.find((b) => b.titre && b.type !== "contact" && b.type !== "horaires")?.titre;
  return texte?.slice(0, 160);
}

/** PAGE-013 — Vue publique d'une page précise du site publié. */
export async function fetchPublicPage(slug: string, pageSlug: string): Promise<{ nom: string; slug: string; page: { titre: string; slug: string; contenu: Bloc[] } }> {
  const res = await fetch(`${API_URL}/public/sites/${slug}/pages/${pageSlug}`, { cache: "no-store" });
  if (!res.ok) await parseError(res);
  return (await res.json()) as { nom: string; slug: string; page: { titre: string; slug: string; contenu: Bloc[] } };
}
