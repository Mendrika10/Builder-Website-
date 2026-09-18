import { notFound } from "next/navigation";
import { BlocList } from "@/components/builder/BlocView";
import type { Bloc } from "@/lib/pages";
import { API_URL } from "@/lib/api";

type PublicSite = {
  nom: string;
  slug: string;
  pages: { titre: string; slug: string; contenu: Bloc[] }[];
};

/** Rendu serveur du site publié — 404 si le site n'existe pas ou n'est pas publié. */
export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${API_URL}/public/sites/${slug}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const site = (await res.json()) as PublicSite;

  const blocs = site.pages.flatMap((p) => p.contenu ?? []);

  return (
    <main className="min-h-screen bg-surface-card">
      <BlocList blocs={blocs} />
      {blocs.length === 0 && (
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
