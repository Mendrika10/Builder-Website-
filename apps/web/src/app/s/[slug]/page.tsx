import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlocList } from "@/components/builder/BlocView";
import type { Bloc } from "@/lib/pages";
import { API_URL } from "@/lib/api";

type PublicPage = { titre: string; slug: string; contenu: Bloc[] };
type PublicSite = { nom: string; slug: string; pages: PublicPage[] };

async function getSite(slug: string): Promise<PublicSite | null> {
  const res = await fetch(`${API_URL}/public/sites/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as PublicSite;
}

/** SEO-001 — Metadata dérivée du contenu (titre de page + premier texte). */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return { title: "Page introuvable" };
  const page = site.pages[0];
  const description =
    page?.contenu.find((b) => b.texte)?.texte ??
    page?.contenu.find((b) => b.sousTitre)?.sousTitre ??
    `${site.nom} — site créé avec Site.mg`;
  return {
    title: `${page?.titre ?? site.nom} · ${site.nom}`,
    description: description.slice(0, 160),
  };
}

/** Rendu serveur du site publié — 404 si le site n'existe pas ou n'est pas publié. */
export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) notFound();

  const page = site.pages[0];

  return (
    <main className="min-h-screen bg-surface-card">
      {site.pages.length > 1 && (
        <nav aria-label="Pages du site" className="border-b border-neutral-100 bg-surface-card">
          <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 px-6 py-3">
            {site.pages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/s/${site.slug}/${p.slug}`}
                  className="inline-flex h-9 items-center rounded-input px-4 text-small font-medium text-neutral-600 transition-colors hover:bg-surface-sunken hover:text-neutral-900"
                >
                  {p.titre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <BlocList blocs={page?.contenu ?? []} />
      {(!page || page.contenu.length === 0) && (
        <p className="px-6 py-24 text-center text-body-lg text-neutral-400">
          Ce site est publié, mais sa page d&apos;accueil est encore vide.
        </p>
      )}
      <footer className="border-t border-neutral-100 py-8 text-center text-small text-neutral-400">
        {site.nom} · propulsé par Site.mg
      </footer>
    </main>
  );
}
