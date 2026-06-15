"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SiteSettingsFormProps {
  site: {
    id: string;
    nom: string;
    slug: string;
    statut: string;
    langueDefaut: string;
    domainePerso: string | null;
    metaSeo: Record<string, unknown>;
  };
}

export default function SiteSettingsForm({ site }: SiteSettingsFormProps) {
  const router = useRouter();
  const [nom, setNom] = useState(site.nom);
  const [slug, setSlug] = useState(site.slug);
  const [statut, setStatut] = useState(site.statut);
  const [langueDefaut, setLangueDefaut] = useState(site.langueDefaut);
  const [domainePerso, setDomainePerso] = useState(site.domainePerso ?? "");
  const [metaTitle, setMetaTitle] = useState(
    (site.metaSeo?.title as string) ?? "",
  );
  const [metaDesc, setMetaDesc] = useState(
    (site.metaSeo?.description as string) ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);

    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          statut,
          langueDefaut,
          domainePerso: domainePerso.trim() || null,
          metaSeo: { title: metaTitle, description: metaDesc },
        }),
      });

      if (res.ok) {
        setSaveMsg({
          type: "success",
          text: "Paramètres sauvegardés avec succès.",
        });
        router.refresh();
      } else {
        const data = await res.json();
        setSaveMsg({
          type: "error",
          text: data.error ?? "Une erreur est survenue.",
        });
      }
    } catch {
      setSaveMsg({ type: "error", text: "Erreur réseau." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== site.nom) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${site.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/sites");
        router.refresh();
      } else {
        setSaveMsg({ type: "error", text: "Impossible de supprimer le site." });
        setShowDelete(false);
      }
    } catch {
      setSaveMsg({ type: "error", text: "Erreur réseau." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        {saveMsg && (
          <div
            className={`alert alert-${saveMsg.type === "success" ? "success" : "danger"} d-flex align-items-center gap-2 mb-4`}
          >
            <i
              className={`bi ${saveMsg.type === "success" ? "bi-check-circle" : "bi-exclamation-circle"}`}
            />
            {saveMsg.text}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Général */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pt-3 px-4">
              <h6 className="fw-bold mb-0">Informations générales</h6>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium small">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Slug <span className="text-muted fw-normal">(URL)</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text text-muted small">
                      site.mg/
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-"),
                        )
                      }
                      required
                      pattern="[a-z0-9-]+"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Langue par défaut
                  </label>
                  <select
                    className="form-select"
                    value={langueDefaut}
                    onChange={(e) => setLangueDefaut(e.target.value)}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="mg">Malagasy</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small">Statut</label>
                  <select
                    className="form-select"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="publie">Publié</option>
                    <option value="suspendu">Suspendu</option>
                    <option value="archive">Archivé</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Domaine personnalisé{" "}
                    <span className="text-muted fw-normal">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="monsite.com"
                    value={domainePerso}
                    onChange={(e) => setDomainePerso(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pt-3 px-4">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-search me-2 text-primary" />
                SEO & Métadonnées
              </h6>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium small">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Titre affiché dans les résultats Google"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={60}
                  />
                  <div className="form-text">
                    {metaTitle.length}/60 caractères
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small">
                    Description SEO
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description courte du site pour les moteurs de recherche"
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    maxLength={160}
                  />
                  <div className="form-text">
                    {metaDesc.length}/160 caractères
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <i className="bi bi-floppy me-2" />
                  Enregistrer
                </>
              )}
            </button>
            <a
              href={`/builder/${site.id}`}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-pencil me-2" />
              Ouvrir l&apos;éditeur
            </a>
          </div>
        </form>

        {/* Zone de danger */}
        <div className="card border-danger border-opacity-25 mt-5">
          <div className="card-header bg-white border-0 pt-3 px-4">
            <h6 className="fw-bold text-danger mb-0">
              <i className="bi bi-exclamation-triangle me-2" />
              Zone de danger
            </h6>
          </div>
          <div className="card-body px-4 pb-4">
            <p className="small text-muted mb-3">
              La suppression du site est <strong>irréversible</strong>. Toutes
              les pages, médias et données associées seront définitivement
              perdus.
            </p>
            {!showDelete ? (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowDelete(true)}
              >
                <i className="bi bi-trash me-2" />
                Supprimer ce site
              </button>
            ) : (
              <div className="border border-danger border-opacity-25 rounded p-3 bg-danger bg-opacity-10">
                <p className="small fw-medium mb-2">
                  Tapez <strong>{site.nom}</strong> pour confirmer la
                  suppression :
                </p>
                <input
                  type="text"
                  className="form-control form-control-sm mb-3"
                  placeholder={site.nom}
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={deleteConfirm !== site.nom || deleting}
                  >
                    {deleting ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <i className="bi bi-trash me-2" />
                    )}
                    Supprimer définitivement
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setShowDelete(false);
                      setDeleteConfirm("");
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar info */}
      <div className="col-lg-4">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 pt-3 px-4">
            <h6 className="fw-bold mb-0">Informations</h6>
          </div>
          <div className="card-body px-4 pb-4">
            <div className="d-flex flex-column gap-3 small">
              <div>
                <div className="text-muted mb-1">ID du site</div>
                <code className="text-break" style={{ fontSize: ".75rem" }}>
                  {site.id}
                </code>
              </div>
              <div>
                <div className="text-muted mb-1">URL actuelle</div>
                <span className="fw-medium">{site.slug}.site.mg</span>
              </div>
              <div>
                <div className="text-muted mb-1">Statut</div>
                <span
                  className={`badge ${
                    site.statut === "publie"
                      ? "bg-success"
                      : site.statut === "brouillon"
                        ? "bg-secondary"
                        : site.statut === "suspendu"
                          ? "bg-warning text-dark"
                          : "bg-dark"
                  }`}
                >
                  {site.statut}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mt-3">
          <div className="card-header bg-white border-0 pt-3 px-4">
            <h6 className="fw-bold mb-0">Actions rapides</h6>
          </div>
          <div className="card-body px-4 pb-4 d-flex flex-column gap-2">
            <a
              href={`/builder/${site.id}`}
              className="btn btn-primary btn-sm w-100"
            >
              <i className="bi bi-pencil me-2" />
              Ouvrir l&apos;éditeur
            </a>
            <a
              href={`/preview/${site.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm w-100"
            >
              <i className="bi bi-eye me-2" />
              Prévisualiser
            </a>
            {site.statut === "publie" && (
              <a
                href={`/${site.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success btn-sm w-100"
              >
                <i className="bi bi-box-arrow-up-right me-2" />
                Voir le site en ligne
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
