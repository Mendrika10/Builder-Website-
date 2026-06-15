import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Facturation" };

const planFeatures: Record<string, string[]> = {
  Gratuit: ["1 site", "5 pages", "1 Go stockage", "Support email"],
  Pro: [
    "3 sites",
    "30 pages",
    "10 Go stockage",
    "Domaine perso",
    "SSL",
    "Analytics",
    "Support chat",
  ],
  Business: [
    "10 sites",
    "100 pages",
    "50 Go stockage",
    "Domaine perso",
    "SSL",
    "Analytics avancés",
    "Sans branding",
    "Support prioritaire",
  ],
};

export default async function BillingPage() {
  const session = await auth();
  if (!session) return null;

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    include: {
      plan: true,
      abonnements: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          paiements: {
            orderBy: { datePaiement: "desc" },
            take: 5,
          },
        },
      },
    },
  });

  if (!utilisateur) return null;

  const plan = utilisateur.plan;
  const abonnement = utilisateur.abonnements[0];
  const paiements = abonnement?.paiements ?? [];

  const allPlans = await prisma.plan.findMany({
    where: { estActif: true },
    orderBy: { prixMensuel: "asc" },
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="h4 fw-bold mb-1">Facturation & Abonnement</h1>
        <p className="text-muted small mb-0">
          Gérez votre plan et votre historique de paiements.
        </p>
      </div>

      {/* Plan actuel */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="text-muted small mb-1">Plan actuel</div>
              <h4 className="fw-bold mb-1">
                {plan?.nom ?? "Gratuit"}
                {plan?.nom === "Gratuit" && (
                  <span className="badge bg-secondary ms-2 small">Gratuit</span>
                )}
              </h4>
              {abonnement && (
                <div className="text-muted small">
                  Statut :{" "}
                  <span
                    className={`badge ${abonnement.statut === "actif" ? "bg-success" : "bg-warning text-dark"}`}
                  >
                    {abonnement.statut}
                  </span>
                  {abonnement.dateFin && (
                    <span className="ms-2">
                      · Renouvellement le{" "}
                      {new Date(abonnement.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              )}
            </div>
            {plan?.nom !== "Business" && (
              <a href="#plans" className="btn btn-primary">
                <i className="bi bi-arrow-up-circle me-2" />
                Upgrader
              </a>
            )}
          </div>

          {plan && (
            <div className="mt-3 d-flex flex-wrap gap-2">
              {(planFeatures[plan.nom] ?? []).map((f) => (
                <span key={f} className="badge bg-light text-dark border">
                  <i className="bi bi-check-circle-fill text-success me-1" />
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tous les plans */}
      <h5 className="fw-bold mb-3" id="plans">
        Changer de plan
      </h5>
      <div className="row g-4 mb-5">
        {allPlans.map((p) => {
          const isCurrent = p.id === plan?.id;
          return (
            <div key={p.id} className="col-md-4">
              <div
                className={`card border-0 shadow-sm h-100 ${isCurrent ? "border-primary border-2" : ""}`}
                style={isCurrent ? { border: "2px solid #6366f1" } : {}}
              >
                <div className="card-body p-4">
                  {isCurrent && (
                    <span className="badge bg-primary mb-2">Plan actuel</span>
                  )}
                  <h5 className="fw-bold">{p.nom}</h5>
                  <div className="mb-3">
                    <span className="fs-3 fw-bold">
                      {Number(p.prixMensuel).toFixed(0)}€
                    </span>
                    <span className="text-muted">/mois</span>
                    {Number(p.prixAnnuel) > 0 && (
                      <div className="text-success small">
                        ou {Number(p.prixAnnuel).toFixed(0)}€/an (économisez{" "}
                        {Math.round(
                          (1 -
                            Number(p.prixAnnuel) /
                              (Number(p.prixMensuel) * 12)) *
                            100,
                        )}
                        %)
                      </div>
                    )}
                  </div>
                  <ul className="list-unstyled small mb-4">
                    {(planFeatures[p.nom] ?? []).map((f) => (
                      <li key={f} className="mb-1">
                        <i className="bi bi-check-circle-fill text-success me-2" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button
                      className="btn btn-outline-secondary w-100"
                      disabled
                    >
                      Plan actuel
                    </button>
                  ) : (
                    <button className="btn btn-primary w-100">
                      Choisir {p.nom}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historique paiements */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-3 px-4">
          <h6 className="fw-bold mb-0">Historique des paiements</h6>
        </div>
        <div className="card-body px-4">
          {paiements.length === 0 ? (
            <p className="text-muted text-center py-3 mb-0">
              Aucun paiement enregistré.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0">Date</th>
                    <th className="border-0">Montant</th>
                    <th className="border-0">Méthode</th>
                    <th className="border-0">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {paiements.map((p) => (
                    <tr key={p.id}>
                      <td className="small">
                        {new Date(p.datePaiement).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="fw-semibold">
                        {Number(p.montant).toFixed(2)} {p.devise}
                      </td>
                      <td className="text-muted small">{p.methode}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            p.statut === "reussi"
                              ? "bg-success"
                              : p.statut === "echoue"
                                ? "bg-danger"
                                : p.statut === "rembourse"
                                  ? "bg-info"
                                  : "bg-secondary"
                          }`}
                        >
                          {p.statut}
                        </span>
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
