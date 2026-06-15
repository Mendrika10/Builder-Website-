"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Modele {
  id: string;
  nom: string;
  description: string | null;
  secteur: string | null;
  estPremium: boolean;
  apercuUrl: string | null;
  categorie: { nom: string; icone: string | null } | null;
}

// Mini previews CSS-based pour chaque catégorie
const miniPreviews: Record<string, React.ReactNode> = {
  "Agence / Entreprise": (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "5px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 7,
            background: "#0F172A",
            borderRadius: 3,
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          <div
            style={{
              width: 18,
              height: 4,
              background: "#CBD5E1",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 18,
              height: 4,
              background: "#CBD5E1",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              width: 22,
              height: 4,
              background: "#2563EB",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
      {/* Hero */}
      <div
        style={{ background: "#fff", padding: "10px 8px 8px", flexShrink: 0 }}
      >
        <div
          style={{
            width: "60%",
            height: 7,
            background: "#0F172A",
            borderRadius: 3,
            marginBottom: 4,
          }}
        />
        <div
          style={{
            width: "80%",
            height: 5,
            background: "#CBD5E1",
            borderRadius: 2,
            marginBottom: 3,
          }}
        />
        <div
          style={{
            width: "70%",
            height: 5,
            background: "#CBD5E1",
            borderRadius: 2,
            marginBottom: 6,
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          <div
            style={{
              width: 36,
              height: 9,
              background: "#2563EB",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: 36,
              height: 9,
              background: "#F1F5F9",
              borderRadius: 4,
              border: "1px solid #CBD5E1",
            }}
          />
        </div>
      </div>
      {/* Section sombre */}
      <div
        style={{
          background: "#0F172A",
          padding: "8px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            width: "55%",
            height: 5,
            background: "rgba(255,255,255,.6)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                height: 18,
                background: "rgba(255,255,255,.08)",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#60A5FA",
                  borderRadius: "50%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div
        style={{
          background: "#0F172A",
          borderTop: "1px solid rgba(255,255,255,.08)",
          padding: "4px 8px",
        }}
      >
        <div
          style={{
            width: "40%",
            height: 4,
            background: "rgba(255,255,255,.2)",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  ),
  "Portfolio Créatif": (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: 8,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          flex: 1,
        }}
      >
        {["#BFDBFE", "#FDE68A", "#A7F3D0", "#FCA5A5"].map((c, i) => (
          <div key={i} style={{ background: c, borderRadius: 6 }} />
        ))}
      </div>
      <div
        style={{
          width: "50%",
          height: 6,
          background: "#0F172A",
          borderRadius: 3,
          margin: "0 auto",
        }}
      />
      <div
        style={{
          width: "70%",
          height: 4,
          background: "#CBD5E1",
          borderRadius: 2,
          margin: "0 auto",
        }}
      />
    </div>
  ),
  "Restaurant & Café": (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#1A0A00",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          background: "linear-gradient(180deg, #78350F 0%, #92400E 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: "#FEF3C7",
            borderRadius: "50%",
            opacity: 0.8,
          }}
        >
          🍽️
        </div>
        <div
          style={{
            width: "60%",
            height: 6,
            background: "rgba(255,255,255,.8)",
            borderRadius: 3,
          }}
        />
        <div
          style={{
            width: "40%",
            height: 4,
            background: "rgba(255,255,255,.4)",
            borderRadius: 2,
          }}
        />
      </div>
      <div style={{ padding: "6px 8px", background: "#111" }}>
        <div style={{ display: "flex", gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 24,
                background: "#1C1C1C",
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  "Blog Personnel": (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        padding: 8,
        gap: 5,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "55%",
          height: 7,
          background: "#0F172A",
          borderRadius: 3,
        }}
      />
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <div
            style={{
              width: 28,
              height: 20,
              background: "#F1F5F9",
              borderRadius: 4,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{
                width: "80%",
                height: 4,
                background: "#334155",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: "60%",
                height: 3,
                background: "#CBD5E1",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  ),
  "Boutique E-commerce": (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "5px 8px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 24,
            height: 6,
            background: "#0F172A",
            borderRadius: 2,
          }}
        />
        <div style={{ width: 14, height: 12, fontSize: 8 }}>🛒</div>
      </div>
      <div
        style={{
          padding: 6,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 4,
          flex: 1,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              background: "#F8FAFC",
              borderRadius: 5,
              border: "1px solid #E2E8F0",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div
              style={{ height: 16, background: "#E2E8F0", borderRadius: 3 }}
            />
            <div
              style={{
                width: "80%",
                height: 3,
                background: "#94A3B8",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: "50%",
                height: 4,
                background: "#2563EB",
                borderRadius: 2,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
  default: (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8FAFC",
        gap: 8,
        padding: 16,
      }}
    >
      <i
        className="bi bi-layout-text-window"
        style={{ fontSize: "1.8rem", color: "#CBD5E1" }}
      />
      <div
        style={{
          width: "60%",
          height: 5,
          background: "#CBD5E1",
          borderRadius: 3,
        }}
      />
    </div>
  ),
};

export default function NewSitePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [selectedModele, setSelectedModele] = useState<string | "blank" | null>(
    "blank",
  );
  const [form, setForm] = useState({ nom: "", langue: "fr" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/modeles")
      .then((r) => r.json())
      .then(setModeles)
      .catch(() => setModeles([]));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: form.nom,
        langueDefaut: form.langue,
        idModele: selectedModele === "blank" ? null : selectedModele,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Erreur lors de la création.");
      return;
    }

    router.push(`/builder/${data.site.id}`);
  };

  const selectedLabel =
    selectedModele === "blank"
      ? "Page vierge"
      : (modeles.find((m) => m.id === selectedModele)?.nom ?? "");

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div className="mb-4">
        <h1
          style={{
            fontWeight: 800,
            fontSize: "1.5rem",
            marginBottom: ".25rem",
          }}
        >
          Créer un nouveau site
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: ".88rem",
            marginBottom: "1rem",
          }}
        >
          Étape {step} sur 2
        </p>
        <div style={{ height: 5, background: "#E2E8F0", borderRadius: 999 }}>
          <div
            style={{
              height: "100%",
              borderRadius: 999,
              background: "var(--primary)",
              width: step === 1 ? "50%" : "100%",
              transition: "width .3s",
            }}
          />
        </div>
      </div>

      {/* ===== ÉTAPE 1 : Choisir le modèle ===== */}
      {step === 1 && (
        <div>
          <h5 style={{ fontWeight: 700, marginBottom: ".35rem" }}>
            Choisissez un modèle de départ
          </h5>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: ".85rem",
              marginBottom: "1.75rem",
            }}
          >
            Vous pourrez personnaliser chaque section dans l&apos;éditeur
            visuel.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {/* Carte : Page vierge */}
            <div
              onClick={() => setSelectedModele("blank")}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                border:
                  selectedModele === "blank"
                    ? "2.5px solid var(--primary)"
                    : "2px solid #E2E8F0",
                boxShadow:
                  selectedModele === "blank"
                    ? "0 0 0 3px rgba(37,99,235,.15)"
                    : "none",
                transition: "border .15s, box-shadow .15s",
                background: "#fff",
              }}
            >
              {/* Preview area */}
              <div
                style={{
                  height: 150,
                  background: "#F8FAFC",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                <i
                  className="bi bi-file-earmark-plus"
                  style={{ fontSize: "2rem", color: "#CBD5E1" }}
                />
                <div
                  style={{
                    fontSize: ".75rem",
                    color: "#94A3B8",
                    fontWeight: 600,
                  }}
                >
                  Partir de zéro
                </div>
              </div>
              {/* Footer */}
              <div
                style={{
                  padding: "10px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: ".85rem" }}>
                    Page vierge
                  </div>
                  <div
                    style={{ fontSize: ".72rem", color: "var(--text-muted)" }}
                  >
                    Toutes catégories
                  </div>
                </div>
                {selectedModele === "blank" && (
                  <i
                    className="bi bi-check-circle-fill"
                    style={{ color: "var(--primary)", fontSize: "1.1rem" }}
                  />
                )}
              </div>
            </div>

            {/* Cartes : Modèles depuis la DB */}
            {modeles.map((m) => {
              const preview = miniPreviews[m.nom] ?? miniPreviews["default"];
              const isSelected = selectedModele === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModele(m.id)}
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isSelected
                      ? "2.5px solid var(--primary)"
                      : "2px solid #E2E8F0",
                    boxShadow: isSelected
                      ? "0 0 0 3px rgba(37,99,235,.15)"
                      : "none",
                    transition: "border .15s, box-shadow .15s",
                    background: "#fff",
                  }}
                >
                  {/* Preview miniature */}
                  <div
                    style={{
                      height: 150,
                      position: "relative",
                      overflow: "hidden",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    {preview}
                    {/* Badge premium */}
                    {m.estPremium && (
                      <span
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#F59E0B",
                          color: "#fff",
                          fontSize: ".65rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        Premium
                      </span>
                    )}
                    {/* Lien aperçu */}
                    {m.apercuUrl && (
                      <Link
                        href={m.apercuUrl}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          bottom: 8,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(15,23,42,.75)",
                          color: "#fff",
                          fontSize: ".72rem",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 999,
                          textDecoration: "none",
                          backdropFilter: "blur(4px)",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <i className="bi bi-eye" />
                        Voir l&apos;aperçu
                      </Link>
                    )}
                  </div>
                  {/* Footer */}
                  <div
                    style={{
                      padding: "10px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: ".85rem" }}>
                        {m.nom}
                      </div>
                      <div
                        style={{
                          fontSize: ".72rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {m.categorie?.nom ?? m.secteur ?? "Général"}
                      </div>
                    </div>
                    {isSelected && (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: "var(--primary)", fontSize: "1.1rem" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modèle sélectionné + bouton suivant */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
              Modèle sélectionné :{" "}
              <strong style={{ color: "var(--text-dark)" }}>
                {selectedLabel}
              </strong>
            </div>
            <button
              className="btn btn-primary px-5"
              onClick={() => setStep(2)}
              style={{ borderRadius: 10, fontWeight: 700 }}
            >
              Suivant <i className="bi bi-arrow-right ms-2" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleCreate} style={{ maxWidth: 560 }}>
          <h5 style={{ fontWeight: 700, marginBottom: ".35rem" }}>
            Informations de votre site
          </h5>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: ".85rem",
              marginBottom: "1.75rem",
            }}
          >
            Modèle choisi :{" "}
            <strong style={{ color: "var(--primary)" }}>{selectedLabel}</strong>
          </p>

          {error && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3"
              style={{ fontSize: ".85rem" }}
            >
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-3">
            <label
              style={{
                fontSize: ".82rem",
                fontWeight: 600,
                color: "var(--text-dark)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Nom du site *
            </label>
            <input
              type="text"
              className="form-control"
              style={{
                height: 46,
                borderRadius: 10,
                border: "1.5px solid #E2E8F0",
                fontSize: ".9rem",
              }}
              placeholder="Mon super site"
              required
              minLength={2}
              maxLength={120}
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
            <div
              style={{
                fontSize: ".75rem",
                color: "var(--text-muted)",
                marginTop: 4,
              }}
            >
              Ce nom est utilisé pour identifier votre site dans le dashboard.
            </div>
          </div>

          <div className="mb-4">
            <label
              style={{
                fontSize: ".82rem",
                fontWeight: 600,
                color: "var(--text-dark)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Langue par défaut
            </label>
            <select
              className="form-select"
              style={{
                height: 46,
                borderRadius: 10,
                border: "1.5px solid #E2E8F0",
                fontSize: ".9rem",
              }}
              value={form.langue}
              onChange={(e) => setForm({ ...form, langue: e.target.value })}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                height: 46,
                padding: "0 20px",
                borderRadius: 10,
                border: "1.5px solid #E2E8F0",
                background: "#fff",
                fontWeight: 600,
                fontSize: ".9rem",
                cursor: "pointer",
                color: "var(--text-dark)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <i className="bi bi-arrow-left" />
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 10,
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: ".95rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Création en cours…
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" />
                  Créer et ouvrir l&apos;éditeur
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
