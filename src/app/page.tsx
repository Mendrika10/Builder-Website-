import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site.mg — Créez votre site web en minutes",
};

const plans = [
  {
    key: "gratuit",
    nom: "Gratuit",
    prix: "0€",
    periode: "/mois",
    badge: null,
    description: "Idéal pour démarrer et tester la plateforme.",
    features: [
      { label: "1 site actif", ok: true },
      { label: "5 pages par site", ok: true },
      { label: "Éditeur visuel drag & drop", ok: true },
      { label: "Sous-domaine Site.mg", ok: true },
      { label: "Domaine personnalisé", ok: false },
      { label: "Analytics avancés", ok: false },
      { label: "Support prioritaire", ok: false },
    ],
    cta: "Démarrer gratuitement",
    featured: false,
  },
  {
    key: "pro",
    nom: "Pro",
    prix: "12€",
    periode: "/mois",
    badge: "Le plus populaire",
    description: "Pour les créateurs et indépendants qui veulent briller.",
    features: [
      { label: "3 sites actifs", ok: true },
      { label: "Pages illimitées", ok: true },
      { label: "Éditeur visuel drag & drop", ok: true },
      { label: "Domaine personnalisé + SSL", ok: true },
      { label: "Analytics de visites", ok: true },
      { label: "Formulaires de contact", ok: true },
      { label: "Support prioritaire", ok: false },
    ],
    cta: "Choisir Pro",
    featured: true,
  },
  {
    key: "business",
    nom: "Business",
    prix: "29€",
    periode: "/mois",
    badge: null,
    description: "Pour les agences et entreprises qui gèrent plusieurs sites.",
    features: [
      { label: "10 sites actifs", ok: true },
      { label: "Pages illimitées", ok: true },
      { label: "Éditeur visuel drag & drop", ok: true },
      { label: "Domaines personnalisés + SSL", ok: true },
      { label: "Analytics avancés & exports", ok: true },
      { label: "Suppression du branding", ok: true },
      { label: "Support prioritaire dédié", ok: true },
    ],
    cta: "Choisir Business",
    featured: false,
  },
];

const faqItems = [
  {
    q: "Qu'est-ce que Site.mg ?",
    a: "Site.mg est une plateforme SaaS de création de sites web. Créez, personnalisez et publiez votre site sans aucune compétence technique, grâce à notre éditeur visuel glisser-déposer.",
  },
  {
    q: "Comment Site.mg protège-t-il mes données ?",
    a: "Nous utilisons un chiffrement fort et des protocoles de sécurité modernes pour protéger vos données. Vos informations ne sont jamais revendues ni partagées. Vous gardez le contrôle total à tout moment.",
  },
  {
    q: "Puis-je utiliser mon propre domaine ?",
    a: "Oui ! Avec les plans Pro et Business, vous pouvez connecter votre propre domaine personnalisé en quelques clics. Un certificat SSL est inclus automatiquement.",
  },
  {
    q: "Combien de temps pour créer mon premier site ?",
    a: "En moins de 5 minutes. Choisissez un modèle, personnalisez le contenu et publiez. Aucun code requis.",
  },
  {
    q: "Quels plans sont disponibles ?",
    a: "Nous proposons trois plans : Gratuit (1 site, 5 pages), Pro (3 sites, domaine perso, analytics) et Business (10 sites, 50 Go, support prioritaire). Commencez gratuitement, sans carte bancaire.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===================================================
          NAVBAR
      =================================================== */}
      <nav className="lp-nav">
        <div className="container d-flex align-items-center">
          <Link href="/" className="lp-brand me-4">
            <span className="brand-icon">
              <i className="bi bi-grid-3x3-gap-fill" />
            </span>
            Site.mg
          </Link>

          <button
            className="navbar-toggler border-0 ms-auto d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMain"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse d-lg-flex align-items-center"
            id="navMain"
          >
            <ul className="navbar-nav mx-auto d-flex flex-row gap-1">
              <li>
                <a href="#fonctionnalites" className="nav-link">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#comment" className="nav-link">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#tarifs" className="nav-link">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="nav-link">
                  FAQ
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-2">
              <Link
                href="/login"
                style={{
                  fontSize: ".88rem",
                  fontWeight: 600,
                  color: "var(--text-body)",
                  textDecoration: "none",
                }}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm px-4 ms-1"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================================================
          HERO
      =================================================== */}
      <section className="hero-section">
        <div className="container">
          <div className="d-flex justify-content-center">
            <span className="badge-announce">
              <span className="dot" />
              Nouveau — Éditeur v2 avec IA disponible ✦
            </span>
          </div>

          <h1>
            Créez votre site web
            <br />
            <span style={{ color: "var(--primary)" }}>en quelques minutes</span>
          </h1>

          <p className="hero-sub">
            Aucune compétence technique requise. Choisissez un modèle,
            personnalisez chaque détail et publiez — le tout depuis un seul
            outil.
          </p>

          <div className="hero-cta-wrap">
            <Link href="/register" className="btn-hero-primary">
              Commencer gratuitement
            </Link>
          </div>
          <p className="hero-note">
            Aucune carte bancaire requise · Annulez à tout moment
          </p>

          {/* Dashboard mockup */}
          <div className="hero-mockup-wrap">
            <div className="hero-mockup">
              <div className="mockup-topbar">
                <span
                  className="mockup-dot"
                  style={{ background: "#FC5555" }}
                />
                <span
                  className="mockup-dot"
                  style={{ background: "#FBBC04" }}
                />
                <span
                  className="mockup-dot"
                  style={{ background: "#34C759" }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    background: "#E2E8F0",
                    borderRadius: 6,
                    maxWidth: 200,
                    margin: "0 auto",
                  }}
                />
              </div>
              <div className="mockup-body">
                <div className="mockup-sidebar">
                  <div className="mockup-sidebar-item active" />
                  {[75, 55, 65, 40, 80, 50].map((w, i) => (
                    <div
                      key={i}
                      className="mockup-sidebar-item"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <div className="mockup-main">
                  <div className="mockup-stat-row">
                    {[
                      "Sites créés",
                      "Pages publiées",
                      "Visites totales",
                      "Dernier rapport",
                    ].map((l, i) => (
                      <div key={l} className="mockup-stat">
                        <div
                          className="mockup-stat-val"
                          style={{ opacity: i === 0 ? 1 : 0.6 }}
                        />
                        <div className="mockup-stat-lbl" />
                      </div>
                    ))}
                  </div>
                  <div className="mockup-table-header" />
                  {[{ risk: "red" }, { risk: "red" }, { risk: null }].map(
                    (r, i) => (
                      <div key={i} className="mockup-table-row">
                        <div
                          className="mockup-table-cell"
                          style={{ maxWidth: 90 }}
                        />
                        {r.risk === "red" ? (
                          <div className="mockup-badge-red" />
                        ) : (
                          <div
                            style={{
                              width: 52,
                              height: 18,
                              background: "#DCFCE7",
                              borderRadius: 12,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div className="mockup-table-cell" />
                        <div className="mockup-table-cell" />
                        <div className="mockup-badge-blue" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          STATS
      =================================================== */}
      <section className="stats-bar">
        <div className="container">
          <div className="row g-3">
            {[
              { val: "12 000+", lbl: "Sites créés" },
              { val: "3 500+", lbl: "Utilisateurs actifs" },
              { val: "99.9%", lbl: "Uptime garanti" },
              { val: "4.9 / 5", lbl: "Satisfaction client" },
            ].map((s) => (
              <div key={s.lbl} className="col-6 col-md-3">
                <div className="stat-item">
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          FONCTIONNALITES
      =================================================== */}
      <section id="fonctionnalites" className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-label">Fonctionnalités clés</p>
            <h2 className="section-title">
              Créez et publiez vos sites
              <br />
              boostés par l&apos;IA
            </h2>
            <p className="section-sub">
              Des outils professionnels pour concevoir, publier et gérer votre
              présence en ligne — sans écrire une seule ligne de code.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-palette2" />
                </div>
                <h5 className="mb-2">Éditeur visuel drag &amp; drop</h5>
                <p className="text-muted small mb-0">
                  Glissez, déposez et personnalisez chaque section en temps
                  réel. Créez un design unique sans toucher au code, en quelques
                  minutes.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card featured">
                <div className="feature-icon">
                  <i className="bi bi-rocket-takeoff" />
                </div>
                <h5 className="mb-2">Publication en un clic</h5>
                <p className="small mb-0">
                  Publiez votre site instantanément sur notre infrastructure
                  rapide et sécurisée. SSL gratuit, CDN mondial et uptime
                  garanti à 99,9%.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-bar-chart-line" />
                </div>
                <h5 className="mb-2">Analytics intégrés</h5>
                <p className="text-muted small mb-0">
                  Suivez vos visites, sources de trafic et performances par
                  page. Exportez vos données et prenez les bonnes décisions pour
                  votre activité.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link href="/register" className="btn btn-primary px-5 py-2">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          COMMENT CA MARCHE
      =================================================== */}
      <section id="comment" className="how-section">
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-label">Comment ça marche</p>
            <h2 className="section-title">Créez votre site en 3 étapes</h2>
            <p className="section-sub">
              De la sélection du modèle à la publication en ligne, tout est
              guidé pas à pas. Votre site est prêt en moins de 5 minutes.
            </p>
          </div>

          {/* Étapes avec connecteur */}
          <div className="row g-4 align-items-stretch position-relative">
            {/* Ligne connectrice (desktop uniquement) */}
            <div
              className="d-none d-md-block position-absolute"
              style={{
                top: 52,
                left: "calc(16.66% + 28px)",
                right: "calc(16.66% + 28px)",
                height: 2,
                background:
                  "linear-gradient(90deg, var(--primary) 0%, #93C5FD 50%, var(--primary) 100%)",
                zIndex: 0,
                opacity: 0.35,
              }}
            />

            {/* ---- ÉTAPE 1 ---- */}
            <div className="col-md-4">
              <div className="how-card h-100 position-relative">
                {/* Numéro */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                    boxShadow: "0 0 0 6px var(--primary-light)",
                  }}
                >
                  1
                </div>
                <h5 className="fw-bold mb-2">Choisissez un modèle</h5>
                <p className="text-muted small mb-3">
                  Parcourez notre bibliothèque de modèles professionnels —
                  portfolio, boutique, blog, restaurant et plus encore.
                  Sélectionnez celui qui correspond à votre activité.
                </p>
                {/* Mockup grille de modèles */}
                <div
                  style={{
                    background: "#F8FAFF",
                    borderRadius: 10,
                    padding: "10px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    style={{
                      fontSize: ".6rem",
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Bibliothèque de modèles
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 6,
                    }}
                  >
                    {[
                      { label: "Portfolio", color: "#DBEAFE", active: true },
                      { label: "Boutique", color: "#F0FDF4", active: false },
                      { label: "Blog", color: "#FEF3C7", active: false },
                      { label: "Restaurant", color: "#FCE7F3", active: false },
                      { label: "Entreprise", color: "#EDE9FE", active: false },
                      { label: "Événement", color: "#FFEDD5", active: false },
                    ].map((m) => (
                      <div
                        key={m.label}
                        style={{
                          background: m.active ? "var(--primary)" : m.color,
                          borderRadius: 7,
                          padding: "8px 4px",
                          textAlign: "center",
                          fontSize: ".58rem",
                          fontWeight: 600,
                          color: m.active ? "#fff" : "#475569",
                          border: m.active
                            ? "2px solid var(--primary)"
                            : "1.5px solid transparent",
                          cursor: "pointer",
                        }}
                      >
                        {m.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ---- ÉTAPE 2 ---- */}
            <div className="col-md-4">
              <div className="how-card h-100 position-relative">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                    boxShadow: "0 0 0 6px var(--primary-light)",
                  }}
                >
                  2
                </div>
                <h5 className="fw-bold mb-2">Personnalisez votre contenu</h5>
                <p className="text-muted small mb-3">
                  Glissez-déposez des blocs, modifiez les textes, couleurs et
                  images directement sur la page. Aucun code requis — ce que
                  vous voyez est ce que vos visiteurs verront.
                </p>
                {/* Mockup éditeur */}
                <div
                  style={{
                    background: "#F8FAFF",
                    borderRadius: 10,
                    padding: "10px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    style={{
                      fontSize: ".6rem",
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Éditeur visuel
                  </div>
                  {/* Barre d'outils */}
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      marginBottom: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {["Texte", "Image", "Bouton", "Formulaire", "Vidéo"].map(
                      (t, i) => (
                        <span
                          key={t}
                          style={{
                            fontSize: ".58rem",
                            background: i === 0 ? "var(--primary)" : "#E2E8F0",
                            color: i === 0 ? "#fff" : "#475569",
                            padding: "2px 7px",
                            borderRadius: 999,
                            fontWeight: 600,
                          }}
                        >
                          {t}
                        </span>
                      ),
                    )}
                  </div>
                  {/* Canvas simplifié */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 7,
                      padding: 8,
                      border: "1.5px dashed #BFDBFE",
                    }}
                  >
                    <div
                      style={{
                        height: 10,
                        background: "var(--primary)",
                        borderRadius: 4,
                        marginBottom: 5,
                        width: "60%",
                      }}
                    />
                    <div
                      style={{
                        height: 6,
                        background: "#E2E8F0",
                        borderRadius: 4,
                        marginBottom: 4,
                        width: "85%",
                      }}
                    />
                    <div
                      style={{
                        height: 6,
                        background: "#E2E8F0",
                        borderRadius: 4,
                        marginBottom: 8,
                        width: "70%",
                      }}
                    />
                    <div
                      style={{
                        height: 22,
                        background: "var(--primary)",
                        borderRadius: 5,
                        width: 70,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ---- ÉTAPE 3 ---- */}
            <div className="col-md-4">
              <div className="how-card h-100 position-relative">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                    boxShadow: "0 0 0 6px var(--primary-light)",
                  }}
                >
                  3
                </div>
                <h5 className="fw-bold mb-2">Publiez &amp; suivez vos stats</h5>
                <p className="text-muted small mb-3">
                  Un clic pour mettre votre site en ligne avec SSL gratuit et
                  CDN mondial. Suivez ensuite vos visites, formulaires reçus et
                  performances depuis votre dashboard.
                </p>
                {/* Mockup dashboard stats */}
                <div
                  style={{
                    background: "#F8FAFF",
                    borderRadius: 10,
                    padding: "10px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: ".6rem",
                        fontWeight: 700,
                        color: "var(--text-dark)",
                      }}
                    >
                      Dashboard
                    </span>
                    <span
                      style={{
                        fontSize: ".58rem",
                        background: "#DCFCE7",
                        color: "#15803D",
                        padding: "1px 8px",
                        borderRadius: 999,
                        fontWeight: 700,
                      }}
                    >
                      ● En ligne
                    </span>
                  </div>
                  {/* Mini stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 5,
                      marginBottom: 8,
                    }}
                  >
                    {[
                      { lbl: "Visites", val: "3 870" },
                      { lbl: "Pages vues", val: "12 400" },
                      { lbl: "Formulaires", val: "47" },
                      { lbl: "Taux rebond", val: "38%" },
                    ].map((s) => (
                      <div
                        key={s.lbl}
                        style={{
                          background: "#fff",
                          borderRadius: 6,
                          padding: "5px 7px",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: ".72rem",
                            fontWeight: 800,
                            color: "var(--primary)",
                          }}
                        >
                          {s.val}
                        </div>
                        <div
                          style={{
                            fontSize: ".55rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {s.lbl}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Barre de progression simulée */}
                  {[
                    { page: "Accueil", pct: 78 },
                    { page: "À propos", pct: 42 },
                    { page: "Contact", pct: 25 },
                  ].map((b) => (
                    <div key={b.page} className="mb-1">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: ".58rem",
                          color: "var(--text-muted)",
                          marginBottom: 2,
                        }}
                      >
                        <span>{b.page}</span>
                        <span>{b.pct}%</span>
                      </div>
                      <div
                        style={{
                          height: 4,
                          background: "#E2E8F0",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${b.pct}%`,
                            background: "var(--primary)",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA sous les étapes */}
          <div className="text-center mt-5">
            <Link href="/register" className="btn btn-primary px-5 py-2">
              Créer mon site gratuitement
            </Link>
            <p className="text-muted small mt-2 mb-0">
              Sans carte bancaire · En ligne en moins de 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          TARIFS
      =================================================== */}
      <section id="tarifs" className="pricing-section">
        <div className="container">
          <div className="text-center mb-5">
            <p
              className="section-label"
              style={{ color: "rgba(255,255,255,.7)" }}
            >
              Tarifs
            </p>
            <h2 className="section-title text-white">Choisissez votre plan</h2>
            <p
              className="section-sub"
              style={{ color: "rgba(255,255,255,.7)", margin: "0 auto 1.5rem" }}
            >
              Commencez gratuitement. Évoluez quand votre activité grandit. Tous
              les plans incluent un essai de 30 jours.
            </p>
            {/* Toggle facturation */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
              style={{
                background: "rgba(255,255,255,.1)",
                fontSize: ".82rem",
                color: "rgba(255,255,255,.85)",
              }}
            >
              <span style={{ fontWeight: 600 }}>Mensuel</span>
              <span style={{ opacity: 0.5, fontSize: ".75rem" }}>·</span>
              <span>Annuel</span>
              <span className="save-badge ms-1">−17%</span>
            </div>
          </div>

          <div className="row g-4 justify-content-center align-items-stretch">
            {plans.map((plan) => (
              <div key={plan.key} className="col-md-4">
                <div
                  className={`price-card h-100 ${plan.featured ? "featured" : ""}`}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {/* Badge populaire */}
                  {plan.badge ? (
                    <div className="text-center mb-3">
                      <span
                        style={{
                          background: "rgba(255,255,255,.22)",
                          color: "#fff",
                          fontSize: ".72rem",
                          fontWeight: 700,
                          padding: "3px 14px",
                          borderRadius: 999,
                          letterSpacing: ".04em",
                          textTransform: "uppercase",
                        }}
                      >
                        ⭐ {plan.badge}
                      </span>
                    </div>
                  ) : (
                    <div style={{ height: 30 }} />
                  )}

                  {/* Nom + description */}
                  <div
                    className="mb-1"
                    style={{
                      fontSize: ".82rem",
                      fontWeight: 700,
                      opacity: 0.7,
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    {plan.nom}
                  </div>
                  <p
                    style={{
                      fontSize: ".8rem",
                      opacity: 0.7,
                      marginBottom: "1rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {plan.description}
                  </p>

                  {/* Prix */}
                  <div
                    className="mb-4"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,.12)",
                      paddingBottom: "1.25rem",
                    }}
                  >
                    <span className="price-amount">{plan.prix}</span>
                    <span className="price-period ms-1">{plan.periode}</span>
                    {plan.key !== "gratuit" && (
                      <div
                        style={{
                          fontSize: ".72rem",
                          opacity: 0.6,
                          marginTop: 3,
                        }}
                      >
                        soit {plan.key === "pro" ? "99€" : "249€"} / an (−17%)
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="list-unstyled mb-4" style={{ flex: 1 }}>
                    {plan.features.map((f) => (
                      <li
                        key={f.label}
                        className="price-feature"
                        style={{ opacity: f.ok ? 1 : 0.4 }}
                      >
                        <i
                          className={`bi ${f.ok ? "bi-check-circle-fill" : "bi-x-circle"}`}
                          style={{
                            color: f.ok
                              ? plan.featured
                                ? "#fff"
                                : "var(--primary)"
                              : "currentColor",
                          }}
                        />
                        <span
                          style={{
                            textDecoration: f.ok ? "none" : "line-through",
                          }}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/register"
                    className={
                      plan.featured ? "btn-price-primary" : "btn-price-white"
                    }
                  >
                    {plan.cta}
                  </Link>
                  <p className="no-card-note mt-2">Sans carte bancaire</p>
                </div>
              </div>
            ))}
          </div>

          {/* Garantie */}
          <div className="text-center mt-5">
            <p style={{ color: "rgba(255,255,255,.55)", fontSize: ".83rem" }}>
              <i className="bi bi-shield-check me-1" />
              Essai gratuit 30 jours · Annulation à tout moment · Données
              sécurisées
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          FAQ
      =================================================== */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-4">
              <p className="section-label">FAQ</p>
              <h2 className="section-title" style={{ fontSize: "2rem" }}>
                Questions fréquentes
              </h2>
              <p className="text-muted small" style={{ lineHeight: 1.7 }}>
                Retrouvez les réponses aux questions les plus courantes sur
                Site.mg et la création de sites web.
                <br />
                <br />
                Besoin d&apos;aide ?{" "}
                <a
                  href="mailto:contact@site.mg"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Contactez-nous
                </a>
              </p>
            </div>

            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqItems.map((item, i) => (
                  <div key={i} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${i !== 1 ? "collapsed" : ""}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${i}`}
                        aria-expanded={i === 1}
                      >
                        {item.q}
                      </button>
                    </h2>
                    <div
                      id={`faq${i}`}
                      className={`accordion-collapse collapse ${i === 1 ? "show" : ""}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CTA FINAL
      =================================================== */}
      <section className="cta-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <span
                  style={{
                    width: 36,
                    height: 36,
                    background: "var(--primary)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-grid-3x3-gap-fill text-white" />
                </span>
                <span
                  style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}
                >
                  Site.mg
                </span>
              </div>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "2rem",
                  fontWeight: 800,
                  marginBottom: "1rem",
                }}
              >
                Commencez votre essai gratuit de 30 jours
              </h2>
              <p
                style={{
                  color: "#94A3B8",
                  marginBottom: "2rem",
                  fontSize: ".95rem",
                }}
              >
                Rejoignez des milliers d&apos;entrepreneurs et de créateurs qui
                font confiance à Site.mg pour leur présence en ligne.
              </p>
              <Link href="/register" className="btn-hero-primary">
                Commencer gratuitement
              </Link>
              <p
                style={{
                  color: "#475569",
                  fontSize: ".78rem",
                  marginTop: ".75rem",
                }}
              >
                Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}
      <footer className="site-footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  style={{
                    width: 28,
                    height: 28,
                    background: "var(--primary)",
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="bi bi-grid-3x3-gap-fill text-white"
                    style={{ fontSize: ".75rem" }}
                  />
                </span>
                <span className="footer-brand mb-0">Site.mg</span>
              </div>
              <p className="footer-tagline">
                Commencez votre essai gratuit de 30 jours.
                <br />
                Sans carte bancaire requise.
              </p>
              <Link href="/register" className="btn btn-primary btn-sm px-4">
                Commencer gratuitement
              </Link>
            </div>

            <div className="col-lg-2 d-none d-lg-block" />

            <div className="col-6 col-md-2">
              <div className="footer-heading">Produit</div>
              <a href="#" className="footer-link">
                Démo
              </a>
              <a href="#fonctionnalites" className="footer-link">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="footer-link">
                Tarifs
              </a>
              <a href="#comment" className="footer-link">
                Comment ça marche
              </a>
            </div>

            <div className="col-6 col-md-2">
              <div className="footer-heading">Entreprise</div>
              <a href="#" className="footer-link">
                Blog
              </a>
              <a href="#faq" className="footer-link">
                FAQ
              </a>
              <a href="mailto:contact@site.mg" className="footer-link">
                Contact
              </a>
            </div>

            <div className="col-6 col-md-2">
              <div className="footer-heading">Légal</div>
              <a href="#" className="footer-link">
                Sécurité des données
              </a>
              <a href="#" className="footer-link">
                Conditions d&apos;utilisation
              </a>
              <a href="#" className="footer-link">
                Politique de confidentialité
              </a>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <p className="footer-copy mb-0">
              © 2026 Site.mg. Tous droits réservés.
            </p>
            <div className="d-flex gap-3">
              <a
                href="#"
                className="footer-link mb-0"
                style={{ display: "inline" }}
              >
                <i className="bi bi-linkedin" />
              </a>
              <a
                href="#"
                className="footer-link mb-0"
                style={{ display: "inline" }}
              >
                <i className="bi bi-twitter-x" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
