import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mes sites" };

const statutColors: Record<string, string> = {
  brouillon: "bg-secondary",
  publie: "bg-success",
  suspendu: "bg-warning text-dark",
  archive: "bg-dark",
};

export default async function SitesPage() {
  const session = await auth();
  if (!session) return null;

  const sites = await prisma.site.findMany({
    where: { idUtilisateur: session.user.id },
    include: {
      modele: { select: { nom: true } },
      _count: { select: { pages: true, medias: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">Mes sites</h1>
          <p className="text-muted small mb-0">
            {sites.length} site{sites.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/sites/new"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <i className="bi bi-plus-lg" />
          Nouveau site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-globe2 fs-1 text-muted d-block mb-3" />
            <h5 className="fw-bold">Aucun site pour le moment</h5>
            <p className="text-muted mb-4">
              Créez votre premier site web en quelques minutes.
            </p>
            <Link href="/sites/new" className="btn btn-primary px-5">
              <i className="bi bi-plus-lg me-2" />
              Créer mon premier site
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {sites.map((site) => (
            <div key={site.id} className="col-md-6 col-xl-4">
              <div className="card card-hover border-0 shadow-sm h-100">
                {/* Aperçu */}
                <div
                  className="rounded-top d-flex align-items-center justify-content-center"
                  style={{
                    height: 140,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  }}
                >
                  <i
                    className="bi bi-globe2 text-white"
                    style={{ fontSize: "3rem", opacity: 0.6 }}
                  />
                </div>

                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div>
                      <h6 className="fw-bold mb-0">{site.nom}</h6>
                      <small className="text-muted">/{site.slug}</small>
                    </div>
                    <span
                      className={`badge rounded-pill plan-badge ${statutColors[site.statut] ?? "bg-secondary"}`}
                    >
                      {site.statut}
                    </span>
                  </div>

                  {site.modele && (
                    <div className="text-muted small mb-2">
                      <i className="bi bi-layout-text-window me-1" />
                      Modèle : {site.modele.nom}
                    </div>
                  )}

                  <div className="d-flex gap-3 text-muted small mb-3">
                    <span>
                      <i className="bi bi-file-earmark me-1" />
                      {site._count.pages} page{site._count.pages > 1 ? "s" : ""}
                    </span>
                    <span>
                      <i className="bi bi-images me-1" />
                      {site._count.medias} média
                      {site._count.medias > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      href={`/builder/${site.id}`}
                      className="btn btn-primary btn-sm flex-grow-1"
                    >
                      <i className="bi bi-pencil me-1" />
                      Éditer
                    </Link>
                    <Link
                      href={`/sites/${site.id}`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="bi bi-gear" />
                    </Link>
                    {site.statut === "publie" && (
                      <Link
                        href={`/${site.slug}`}
                        className="btn btn-outline-success btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-box-arrow-up-right" />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0 text-muted small pb-3 px-3">
                  <i className="bi bi-clock me-1" />
                  Modifié le{" "}
                  {new Date(site.updatedAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
