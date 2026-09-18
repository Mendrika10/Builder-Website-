import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlocList } from "@/components/builder/BlocView";
import { API_URL } from "@/lib/api";

type PublicPage = { titre: string; slug: string; contenu: import("@/lib/pages").Bloc[] };
type PublicSitePage = { nom: string; slug: string; page: PublicPage };
type NavSite = { nom: string; slug: string; pages: PublicPage[] };

async function getSitePage(slug: string, pageSlug: string): Promise<PublicSitePage | null> {
  const res = await fetch(`${API_URL}/public/sites/${slug}/pages/${pageSlug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as PublicSitePage;
}

/** SEO-001 — Metadata de la page précise (404 si le site/page n'existe pas ou n'est pas publié). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
}): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const data = await getSitePage(slug, pageSlug);
  if (!data) return { title: "Page introuvable" };
  const description =
    data.page.contenu.find((b) => b.texte)?.texte ??
    data.page.contenu.find((b) => b.sousTitre)?.sousTitre ??
    `${data.nom} — ${data.page.titre}`;
  return {
    title: `${data.page.titre} · ${data.nom}`,
    description: description.slice(0, 160),
  };
}

export default async function PublicPagePage({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
}) {
  const { slug, pageSlug } = await params;
  const data = await getSitePage(slug, pageSlug);
  if (!data) notFound();

  // Navigation : la liste complète vient de l'index du site (léger, en cache no-store)
  let navPages: PublicPage[] = [];
  const indexRes = await fetch(`${API_URL}/public/sites/${slug}`, { cache: "no-store" });
  if (indexRes.ok) {
    const index = (await indexRes.json()) as NavSite;
    navPages = index.pages;
  }

  return (
    <main className="min-h-screen bg-surface-card">
      <nav aria-label="Pages du site" className="border-b border-neutral-100 bg-surface-card">
        <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 px-6 py-3">
          {navPages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/s/${data.slug}/${p.slug}`}
                className={
                  "inline-flex h-9 items-center rounded-input px-4 text-small font-medium transition-colors " +
                  (p.slug === data.page.slug
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-surface-sunken hover:text-neutral-900")
                }
              >
                {p.titre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <BlocList blocs={data.page.contenu} />
      {data.page.contenu.length === 0 && (
        <p className="px-6 py-24 text-center text-body-lg text-neutral-400">Cette page est encore vide.</p>
      )}
      <footer className="border-t border-neutral-100 py-8 text-center text-small text-neutral-400">
        {data.nom} · propulsé par Site.mg
      </footer>
    </main>
  );
}
