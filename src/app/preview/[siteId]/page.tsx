import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import SitePreview from "@/components/builder/SitePreview";
import type { BuilderSection } from "@/components/builder/types";

interface PreviewPageProps {
  params: Promise<{ siteId: string }>;
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { siteId } = await params;
  const site = await prisma.site.findFirst({
    where: { id: siteId },
    select: { nom: true },
  });
  return { title: site ? `Aperçu — ${site.nom}` : "Aperçu" };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { siteId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: { id: true, nom: true, statut: true, parametres: true },
  });

  if (!site) notFound();

  const parametres = (site.parametres ?? {}) as Record<string, unknown>;
  const sections = (parametres.builderSections ?? []) as BuilderSection[];

  return (
    <>
      {/* Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
      />
      <SitePreview siteId={site.id} siteNom={site.nom} sections={sections} />
    </>
  );
}
