import Link from "next/link";

const features = [
  {
    icon: "bi-palette2",
    title: "Éditeur visuel drag & drop",
    desc: "Créez des pages magnifiques en glissant-déposant des blocs — aucun code requis.",
  },
  {
    icon: "bi-rocket-takeoff",
    title: "Publication en un clic",
    desc: "Mettez votre site en ligne instantanément avec SSL gratuit et CDN mondial.",
  },
  {
    icon: "bi-globe2",
    title: "Domaine personnalisé inclus",
    desc: "Connectez votre propre domaine et renforcez votre image de marque professionnelle.",
  },
  {
    icon: "bi-bar-chart-line",
    title: "Analytics & rapports intégrés",
    desc: "Suivez vos visites, formulaires et performances depuis un dashboard clair.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ===== CÔTÉ GAUCHE : Formulaire ===== */}
      <div
        style={{
          flex: "0 0 50%",
          maxWidth: "50%",
          display: "flex",
          flexDirection: "column",
          padding: "2.5rem 3rem",
          overflowY: "auto",
        }}
        className="auth-left"
      >
        {/* Logo */}
        <div className="mb-5">
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 34,
                height: 34,
                background: "var(--primary)",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-grid-3x3-gap-fill text-white"
                style={{ fontSize: ".9rem" }}
              />
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "var(--text-dark)",
              }}
            >
              Site.mg
            </span>
          </Link>
        </div>

        {/* Contenu (formulaire) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 550,
            padding: "0 2rem",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <p
          style={{
            fontSize: ".73rem",
            color: "var(--text-muted)",
            marginTop: "2rem",
          }}
        >
          © 2026 Site.mg ·{" "}
          <a
            href="#"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            CGU
          </a>{" "}
          ·{" "}
          <a
            href="#"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            Confidentialité
          </a>
        </p>
      </div>

      {/* ===== CÔTÉ DROIT : Panel bleu ===== */}
      <div
        style={{
          flex: "0 0 50%",
          maxWidth: "50%",
          background:
            "linear-gradient(145deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 3.5rem",
          color: "#fff",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
        className="auth-right d-none d-lg-flex"
      >
        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.9rem",
            lineHeight: 1.25,
            marginBottom: "2.5rem",
            color: "#fff",
          }}
        >
          Bienvenue sur votre plateforme de <br /> création de sites web
          tout-en-un
        </h2>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255,255,255,.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className={`bi ${f.icon}`}
                  style={{ fontSize: "1.1rem", color: "#fff" }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: ".95rem",
                    marginBottom: 3,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: ".82rem",
                    opacity: 0.75,
                    lineHeight: 1.55,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,.2)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex" }}>
            {["#60A5FA", "#93C5FD", "#BFDBFE"].map((c) => (
              <div
                key={c}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: c,
                  border: "2px solid rgba(255,255,255,.5)",
                  marginLeft: -8,
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: ".8rem", opacity: 0.8 }}>
            <strong style={{ opacity: 1 }}>+12 000 sites</strong> créés par nos
            utilisateurs
          </div>
        </div>
      </div>
    </div>
  );
}
