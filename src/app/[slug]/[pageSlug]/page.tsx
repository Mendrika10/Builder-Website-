import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SitePreview from "@/components/builder/SitePreview";
import type {
  BuilderSection,
  BuilderPage,
} from "@/components/builder/BuilderEditor";

interface SitePageProps {
  params: Promise<{ slug: string; pageSlug: string }>;
}

export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { slug, pageSlug } = await params;

  const site = await prisma.site.findFirst({
    where: { slug, statut: "publie" },
    select: { nom: true, parametres: true },
  });

  if (!site) return {};

  const parametres = (site.parametres ?? {}) as Record<string, unknown>;
  const pages = (parametres.builderPages ?? []) as BuilderPage[];
  const page = pages.find((p) => p.slug === pageSlug);
  if (!page) return {};

  return {
    title: `${page.name} — ${site.nom}`,
  };
}

export default async function SiteInternalPage({ params }: SitePageProps) {
  const { slug, pageSlug } = await params;

  const site = await prisma.site.findFirst({
    where: { slug, statut: "publie" },
    select: { id: true, nom: true, parametres: true },
  });

  if (!site) notFound();

  const parametres = (site.parametres ?? {}) as Record<string, unknown>;

  // Sections principales (navbar / footer) pour avoir la navigation
  const mainSections = (parametres.builderSections ?? []) as BuilderSection[];

  // Page interne ciblée
  const pages = (parametres.builderPages ?? []) as BuilderPage[];
  const page = pages.find((p) => p.slug === pageSlug);

  if (!page) notFound();

  // On affiche : navbar + sections de la page + footer (si présents)
  const navbar = mainSections.filter((s) => s.type === "navbar");
  const footer = mainSections.filter((s) => s.type === "footer");
  const sections: BuilderSection[] = [...navbar, ...page.sections, ...footer];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
      />
      <SitePreview
        siteId={site.id}
        siteNom={site.nom}
        sections={sections}
        hideBanner
      />
    </>
  );
}
