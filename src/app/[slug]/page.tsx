import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SitePreview from "@/components/builder/SitePreview";
import type { BuilderSection } from "@/components/builder/BuilderEditor";

interface PublicSitePageProps {
  params: Promise<{ slug: string }>;
}

// Routes internes à exclure du routage dynamique de sites
const RESERVED_SLUGS = new Set([
  "login",
  "register",
  "dashboard",
  "sites",
  "builder",
  "settings",
  "preview",
  "api",
  "templates",
  "_next",
  "favicon.ico",
]);

export async function generateMetadata({
  params,
}: PublicSitePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};

  const site = await prisma.site.findFirst({
    where: { slug, statut: "publie" },
    select: {
      nom: true,
      metaSeo: true,
    },
  });

  if (!site) return {};

  const metaSeo = (site.metaSeo as Record<string, unknown>) ?? {};
  return {
    title: (metaSeo.title as string) || site.nom,
    description: (metaSeo.description as string) || undefined,
  };
}

export default async function PublicSitePage({ params }: PublicSitePageProps) {
  const { slug } = await params;

  // Ne pas intercepter les routes internes
  if (RESERVED_SLUGS.has(slug)) notFound();

  const site = await prisma.site.findFirst({
    where: { slug, statut: "publie" },
    select: {
      id: true,
      nom: true,
      slug: true,
      parametres: true,
    },
  });

  if (!site) notFound();

  const parametres = (site.parametres ?? {}) as Record<string, unknown>;
  const sections = (parametres.builderSections ?? []) as BuilderSection[];

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
