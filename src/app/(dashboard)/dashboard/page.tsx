import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    include: {
      plan: true,
      sites: {
        select: {
          id: true,
          nom: true,
          slug: true,
          statut: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
      _count: { select: { sites: true } },
    },
  });

  if (!utilisateur) return null;

  const plan = utilisateur.plan;
  const nbSites = utilisateur._count.sites;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">
            Bonjour, {utilisateur.nom.split(" ")[0]} 👋
          </h1>
          <p className="text-muted small mb-0">
            Voici un aperçu de votre activité
          </p>
        </div>
        <Link
          href="/sites/new"
          className="btn btn-primary gap-2 d-flex align-items-center"
        >
          <i className="bi bi-plus-lg" />
          Nouveau site
        </Link>
      </div>

      {/* Stats cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 rounded-3 p-2 text-primary">
                <i className="bi bi-globe2 fs-4" />
              </div>
              <div>
                <div className="fw-bold fs-4">{nbSites}</div>
                <div className="text-muted small">Sites créés</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 rounded-3 p-2 text-success">
                <i className="bi bi-file-earmark-text fs-4" />
              </div>
              <div>
                <div className="fw-bold fs-4">{plan?.maxSites ?? 1}</div>
                <div className="text-muted small">Sites autorisés</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 rounded-3 p-2 text-warning">
                <i className="bi bi-hdd fs-4" />
              </div>
              <div>
                <div className="fw-bold fs-4">{plan?.stockageGo ?? 1} Go</div>
                <div className="text-muted small">Stockage</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-10 rounded-3 p-2 text-info">
                <i className="bi bi-award fs-4" />
              </div>
              <div>
                <div className="fw-bold fs-5">{plan?.nom ?? "Gratuit"}</div>
                <div className="text-muted small">Plan actuel</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan upgrade banner */}
      {plan?.nom === "Gratuit" && (
        <div
          className="alert border-0 mb-4 d-flex align-items-center justify-content-between gap-3"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
          }}
        >
          <div>
            <i className="bi bi-stars me-2" />
            <strong>Passez à Pro</strong> pour débloquer domaines personnalisés,
            analytics et plus encore.
          </div>
          <Link
            href="/billing"
            className="btn btn-light btn-sm text-primary fw-semibold text-nowrap"
          >
            Voir les plans
          </Link>
        </div>
      )}

      {/* Sites récents */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex align-items-center justify-content-between border-0 pt-3 px-4">
          <h6 className="fw-bold mb-0">Sites récents</h6>
          <Link href="/sites" className="btn btn-sm btn-outline-secondary">
            Voir tout
          </Link>
        </div>
        <div className="card-body px-4">
          {utilisateur.sites.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-globe2 fs-1 text-muted d-block mb-3" />
              <p className="text-muted mb-3">Vous n'avez pas encore de site.</p>
              <Link href="/sites/new" className="btn btn-primary">
                <i className="bi bi-plus-lg me-2" />
                Créer mon premier site
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0">Site</th>
                    <th className="border-0">Statut</th>
                    <th className="border-0">Modifié le</th>
                    <th className="border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateur.sites.map((site) => (
                    <tr key={site.id}>
                      <td>
                        <div className="fw-semibold">{site.nom}</div>
                        <div className="text-muted small">/{site.slug}</div>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            site.statut === "publie"
                              ? "bg-success"
                              : site.statut === "brouillon"
                                ? "bg-secondary"
                                : "bg-warning text-dark"
                          }`}
                        >
                          {site.statut}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(site.updatedAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="text-end">
                        <Link
                          href={`/builder/${site.id}`}
                          className="btn btn-sm btn-outline-primary me-1"
                        >
                          <i className="bi bi-pencil" />
                        </Link>
                        <Link
                          href={`/sites/${site.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="bi bi-gear" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
