import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import BuilderEditor from "@/components/builder/BuilderEditor";

export const metadata: Metadata = { title: "Éditeur" };

interface BuilderPageProps {
  params: Promise<{ siteId: string }>;
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { siteId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    include: {
      modele: true,
    },
  });

  if (!site) redirect("/sites");

  return (
    <BuilderEditor
      siteId={site.id}
      siteSlug={site.slug}
      siteNom={site.nom}
      siteStatut={site.statut}
      modeleNom={site.modele?.nom ?? null}
    />
  );
}
