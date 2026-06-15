import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import SiteSettingsForm from "@/components/sites/SiteSettingsForm";

interface SiteSettingsPageProps {
  params: Promise<{ siteId: string }>;
}

export async function generateMetadata({
  params,
}: SiteSettingsPageProps): Promise<Metadata> {
  const { siteId } = await params;
  const site = await prisma.site.findFirst({
    where: { id: siteId },
    select: { nom: true },
  });
  return { title: site ? `Paramètres — ${site.nom}` : "Paramètres du site" };
}

export default async function SiteSettingsPage({
  params,
}: SiteSettingsPageProps) {
  const { siteId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const site = await prisma.site.findFirst({
    where: { id: siteId, idUtilisateur: session.user.id },
    select: {
      id: true,
      nom: true,
      slug: true,
      statut: true,
      langueDefaut: true,
      domainePerso: true,
      metaSeo: true,
      modele: { select: { nom: true } },
    },
  });

  if (!site) notFound();

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small mb-0">
          <li className="breadcrumb-item">
            <Link href="/sites" className="text-decoration-none">
              Mes sites
            </Link>
          </li>
          <li className="breadcrumb-item active">{site.nom}</li>
        </ol>
      </nav>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i className="bi bi-gear fs-5 text-primary" />
        </div>
        <div>
          <h1 className="h4 fw-bold mb-0">{site.nom}</h1>
          <p className="text-muted small mb-0">
            Paramètres du site
            {site.modele && (
              <span className="ms-2 badge bg-light text-secondary border">
                {site.modele.nom}
              </span>
            )}
          </p>
        </div>
      </div>

      <SiteSettingsForm
        site={{
          id: site.id,
          nom: site.nom,
          slug: site.slug,
          statut: site.statut,
          langueDefaut: site.langueDefaut,
          domainePerso: site.domainePerso ?? null,
          metaSeo: (site.metaSeo as Record<string, unknown>) ?? {},
        }}
      />
    </div>
  );
}
