import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session) return null;

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: session.user.id },
    select: { id: true, nom: true, email: true, langue: true, createdAt: true },
  });

  if (!utilisateur) return null;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="h4 fw-bold mb-1">Paramètres du compte</h1>
        <p className="text-muted small mb-0">
          Gérez vos informations personnelles.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Informations personnelles */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pt-3 px-4">
              <h6 className="fw-bold mb-0">Informations personnelles</h6>
            </div>
            <div className="card-body px-4 pb-4">
              <form>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={utilisateur.nom}
                      name="nom"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={utilisateur.email}
                      name="email"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Langue de l'interface
                    </label>
                    <select
                      className="form-select"
                      defaultValue={utilisateur.langue}
                      name="langue"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Mot de passe */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pt-3 px-4">
              <h6 className="fw-bold mb-0">Changer le mot de passe</h6>
            </div>
            <div className="card-body px-4 pb-4">
              <form>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      minLength={8}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">
                      Confirmer
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      minLength={8}
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-outline-primary">
                      Modifier le mot de passe
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Zone danger */}
          <div className="card border-danger border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3 px-4">
              <h6 className="fw-bold text-danger mb-0">Zone dangereuse</h6>
            </div>
            <div className="card-body px-4 pb-4">
              <p className="text-muted small">
                La suppression de votre compte est irréversible. Tous vos sites,
                pages et données seront définitivement supprimés.
              </p>
              <button className="btn btn-outline-danger btn-sm">
                <i className="bi bi-trash me-2" />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>

        {/* Info compte */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold fs-3"
                style={{ width: 72, height: 72 }}
              >
                {utilisateur.nom[0]?.toUpperCase()}
              </div>
              <h6 className="fw-bold mb-1">{utilisateur.nom}</h6>
              <p className="text-muted small mb-0">{utilisateur.email}</p>
              <hr />
              <div className="text-muted small">
                <i className="bi bi-calendar me-1" />
                Membre depuis{" "}
                {new Date(utilisateur.createdAt).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
