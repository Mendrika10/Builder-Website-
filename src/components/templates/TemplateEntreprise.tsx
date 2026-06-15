"use client";

import { useState } from "react";

const services = [
  { icon: "bi-laptop", label: "Développement Web" },
  { icon: "bi-phone", label: "Applications Mobile" },
  { icon: "bi-palette", label: "Design UI/UX" },
  { icon: "bi-graph-up-arrow", label: "SEO & Marketing" },
  { icon: "bi-cloud", label: "Cloud & DevOps" },
  { icon: "bi-shield-check", label: "Cybersécurité" },
  { icon: "bi-bar-chart-line", label: "Analytics" },
  { icon: "bi-robot", label: "Intelligence Artificielle" },
  { icon: "bi-cart3", label: "E-commerce" },
  { icon: "bi-people", label: "Conseil & Stratégie" },
  { icon: "bi-headset", label: "Support & Maintenance" },
  { icon: "bi-megaphone", label: "Communication Digitale" },
];

const temoignages = [
  {
    logo: "AirFrance",
    color: "#00205B",
    name: "Daniel Cros",
    role: "Chef de Projet IT",
    text: "Le développement s'est déroulé de façon fluide et efficace. L'équipe a parfaitement compris nos besoins spécifiques et livré un outil robuste, ergonomique et parfaitement intégré à nos processus.",
  },
  {
    logo: "Crédit\nMutuel",
    color: "#CC0000",
    name: "Mickaël Joseph",
    role: "Lead Développeur, Projet & Skills",
    text: "Dans un environnement exigeant, l'agence a su s'adapter à nos nombreuses contraintes. Notre projet a avancé sans aucune friction avec un respect exemplaire des délais et une grande disponibilité des équipes.",
  },
  {
    logo: "Henry Gill",
    color: "#2563EB",
    name: "Henry Gill",
    role: "Fondateur - Firme",
    text: "Nous avons confié toutes les réalisations de notre système à cette agence, bâtie en un temps record. Cette agence en comparaison à d'autres sont d'un réel avantage.",
  },
];

const realisations = [
  {
    titre: "HERMÈS Paris",
    desc: "Maintenance d'une solution de sensibilisation à la cybersécurité",
    bg: "#1A1A1A",
    color: "#C6A96A",
  },
  {
    titre: "ROGER & GALLET",
    desc: "Intégration d'une interface pour un e-commerce headless",
    bg: "#F5F0EB",
    color: "#2D2D2D",
  },
  {
    titre: "UltraEdge",
    desc: "Conception et intégration d'un site vitrine multilingue",
    bg: "#0A0E1A",
    color: "#4FC3F7",
  },
];

const articles = [
  {
    tag: "FRAMEWORK",
    titre: "Sylius : Le meilleur framework e-commerce",
    desc: "Découvrez les caractéristiques de Sylius qui en font le framework e-commerce le plus adapté pour les entreprises.",
    img: "🛍️",
    bg: "#F0FDF4",
  },
  {
    tag: "CMS",
    titre: "Strapi : CMS Headless gratuit & open source",
    desc: "Une introduction complète de Strapi en tant que CMS Headless et les différents avantages de cette solution.",
    img: "📦",
    bg: "#EFF6FF",
  },
  {
    tag: "CMS",
    titre: "CMS Headless : Le guide complet",
    desc: "Plongez dans le monde du CMS Headless et découvrez les avantages de passer à une architecture découplée.",
    img: "📝",
    bg: "#FDF4FF",
  },
];

const faqs = [
  "Qu'est-ce qu'une agence web ?",
  "Quels sont les critères pour choisir une agence web ?",
  "Pourquoi préférer une agence digitale plutôt qu'un freelance ?",
  "Quelle est la différence entre une agence web et une agence digitale ?",
];

export default function TemplateEntreprise() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        fontFamily: "Manrope, sans-serif, system-ui",
        color: "#0F172A",
        overflowX: "hidden",
      }}
    >
      {/* ===== NAVBAR ===== */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid #E2E8F0",
          padding: "0 2rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="bi bi-hexagon-fill text-white"
              style={{ fontSize: ".75rem" }}
            />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>
            MonEntreprise
          </span>
        </div>

        {/* Nav links — desktop */}
        <div
          className="d-none d-lg-flex"
          style={{ gap: "2rem", alignItems: "center" }}
        >
          {["Expertises", "Technologies", "Réalisations", "Ressources"].map(
            (l) => (
              <a
                key={l}
                href="#"
                style={{
                  textDecoration: "none",
                  fontSize: ".88rem",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                {l}
              </a>
            ),
          )}
        </div>

        <div
          className="d-none d-lg-flex"
          style={{ gap: 8, alignItems: "center" }}
        >
          <a
            href="#contact"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              fontSize: ".85rem",
              fontWeight: 600,
              textDecoration: "none",
              color: "#0F172A",
            }}
          >
            Planifier un appel
          </a>
          <a
            href="#contact"
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "#2563EB",
              color: "#fff",
              fontSize: ".85rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Nous contacter
          </a>
        </div>

        {/* Hamburger — mobile */}
        <button
          className="d-lg-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.4rem",
          }}
        >
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            zIndex: 99,
            background: "#fff",
            borderBottom: "1px solid #E2E8F0",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {["Expertises", "Technologies", "Réalisations", "Ressources"].map(
            (l) => (
              <a
                key={l}
                href="#"
                style={{
                  textDecoration: "none",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                {l}
              </a>
            ),
          )}
          <a
            href="#contact"
            style={{
              padding: "10px",
              textAlign: "center",
              borderRadius: 8,
              background: "#2563EB",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Nous contacter
          </a>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section
        style={{
          padding: "5rem 2rem 4rem",
          maxWidth: 960,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#EFF6FF",
            borderRadius: 999,
            padding: "4px 14px",
            fontSize: ".78rem",
            fontWeight: 700,
            color: "#2563EB",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#2563EB",
              display: "inline-block",
            }}
          />
          AGENCE WEB &amp; DIGITALE
        </div>

        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
          }}
        >
          Concepteurs d&apos;expériences
          <br />
          digitales sur mesure et
          <br />
          performantes
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "#475569",
            maxWidth: 580,
            margin: "0 auto 2rem",
            lineHeight: 1.7,
          }}
        >
          Confiez la conception et le développement de vos solutions digitales à
          une agence reconnue pour son expertise en innovation technologique.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          <a
            href="#contact"
            style={{
              padding: "13px 28px",
              borderRadius: 10,
              background: "#2563EB",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".95rem",
              textDecoration: "none",
            }}
          >
            Réserver une étude de projet gratuite →
          </a>
          <a
            href="#realisations"
            style={{
              padding: "13px 24px",
              borderRadius: 10,
              border: "1.5px solid #CBD5E1",
              color: "#334155",
              fontWeight: 600,
              fontSize: ".95rem",
              textDecoration: "none",
            }}
          >
            Consulter notre agence
          </a>
        </div>

        {/* Rating & trust */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ color: "#F59E0B", fontSize: "1rem" }}>
                  ★
                </span>
              ))}
            </div>
            <span style={{ fontSize: ".82rem", fontWeight: 700 }}>4.9/5</span>
            <span style={{ fontSize: ".78rem", color: "#64748B" }}>
              sur Google
            </span>
          </div>
          <div style={{ width: 1, height: 20, background: "#E2E8F0" }} />
          <span style={{ fontSize: ".82rem", color: "#64748B" }}>
            +150 projets livrés
          </span>
          <div style={{ width: 1, height: 20, background: "#E2E8F0" }} />
          <span style={{ fontSize: ".82rem", color: "#64748B" }}>
            Certifié Google Partner
          </span>
        </div>

        {/* Client logos */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
            marginTop: "3rem",
            padding: "1.5rem 0",
            borderTop: "1px solid #E2E8F0",
          }}
        >
          {[
            "Credit Suisse",
            "Axéréal",
            "INpi",
            "Meilleurce",
            "NATIVE",
            "Qorc",
          ].map((brand) => (
            <span
              key={brand}
              style={{
                fontSize: ".85rem",
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: 1,
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ===== SECTION SOMBRE : Expertises ===== */}
      <section
        style={{ background: "#0F172A", padding: "5rem 2rem", color: "#fff" }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "#60A5FA",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            LES TECHNOLOGIES UTILISÉES PAR NOS AGENCES
          </p>
          <div
            style={{
              display: "flex",
              gap: "3rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                lineHeight: 1.25,
                color: "#fff",
                flex: "0 0 auto",
                maxWidth: 380,
              }}
            >
              Nos développeurs utilisent les meilleures technologies open source
              du marché pour votre projet
            </h2>
            <div style={{ flex: 1, minWidth: 280 }}>
              <p
                style={{
                  color: "#94A3B8",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                  fontSize: ".9rem",
                }}
              >
                Chaque projet est une opportunité. Nos équipes maîtrisent un
                large éventail de technologies modernes pour vous offrir les
                meilleures solutions.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "1rem",
              marginTop: "3rem",
            }}
          >
            {services.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 12,
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <i
                  className={`bi ${s.icon}`}
                  style={{ fontSize: "1.5rem", color: "#60A5FA" }}
                />
                <span
                  style={{
                    fontSize: ".78rem",
                    fontWeight: 600,
                    color: "#CBD5E1",
                    textAlign: "center",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a
              href="#"
              style={{
                color: "#60A5FA",
                fontWeight: 700,
                fontSize: ".9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Consulter toutes nos technologies{" "}
              <i className="bi bi-arrow-right" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== TÉMOIGNAGES ===== */}
      <section style={{ padding: "5rem 2rem", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: ".75rem",
            }}
          >
            NOS CLIENTS EN PARLENT
          </p>
          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                flex: "0 0 auto",
                maxWidth: 380,
              }}
            >
              Ils ont fait confiance à notre agence et témoignent de leur
              expérience
            </h2>
            <p
              style={{
                color: "#64748B",
                lineHeight: 1.7,
                flex: 1,
                minWidth: 260,
                fontSize: ".9rem",
                alignSelf: "center",
              }}
            >
              La satisfaction de nos clients demeure notre priorité et leurs
              témoignages positifs constituent pour nous une immense fierté.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {temoignages.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "1.75rem",
                  boxShadow: "0 2px 16px rgba(0,0,0,.06)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    background: t.color,
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: ".95rem",
                    display: "inline-block",
                    marginBottom: "1rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {t.logo}
                </div>
                <p
                  style={{
                    fontSize: ".85rem",
                    color: "#475569",
                    lineHeight: 1.65,
                    marginBottom: "1.25rem",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: ".85rem" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: ".78rem", color: "#64748B" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RÉALISATIONS ===== */}
      <section id="realisations" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: ".75rem",
            }}
          >
            NOS RÉALISATIONS
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                maxWidth: 440,
              }}
            >
              Quelques-unes de nos collaborations les plus marquantes
            </h2>
            <a
              href="#"
              style={{
                color: "#2563EB",
                fontWeight: 700,
                fontSize: ".88rem",
                textDecoration: "none",
              }}
            >
              Consulter toutes nos réalisations →
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {realisations.map((r) => (
              <div
                key={r.titre}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,.1)",
                }}
              >
                <div
                  style={{
                    background: r.bg,
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: "1.4rem",
                      color: r.color,
                      textAlign: "center",
                      padding: "1rem",
                    }}
                  >
                    {r.titre}
                  </span>
                </div>
                <div style={{ padding: "1.25rem", background: "#fff" }}>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "#475569",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section style={{ padding: "5rem 2rem", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: ".75rem",
            }}
          >
            NOS DERNIÈRES PUBLICATIONS
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2
              style={{ fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
            >
              Nos derniers articles
            </h2>
            <a
              href="#"
              style={{
                color: "#2563EB",
                fontWeight: 700,
                fontSize: ".88rem",
                textDecoration: "none",
              }}
            >
              Consulter tous nos articles →
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {articles.map((a) => (
              <div
                key={a.titre}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    background: a.bg,
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                  }}
                >
                  {a.img}
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <span
                    style={{
                      fontSize: ".7rem",
                      fontWeight: 700,
                      color: "#2563EB",
                      background: "#EFF6FF",
                      borderRadius: 999,
                      padding: "2px 10px",
                      marginBottom: 10,
                      display: "inline-block",
                    }}
                  >
                    {a.tag}
                  </span>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: ".95rem",
                      marginBottom: ".5rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {a.titre}
                  </h3>
                  <p
                    style={{
                      fontSize: ".8rem",
                      color: "#64748B",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {a.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: ".75rem",
              textAlign: "center",
            }}
          >
            VOUS HÉSITEZ ENCORE ?
          </p>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            On éclair votre choix !
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((q, i) => (
              <div
                key={i}
                style={{
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: openFaq === i ? "#EFF6FF" : "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: ".9rem",
                    textAlign: "left",
                    color: "#0F172A",
                  }}
                >
                  {q}
                  <i
                    className={`bi ${openFaq === i ? "bi-chevron-up" : "bi-chevron-down"}`}
                    style={{ color: "#2563EB", flexShrink: 0, marginLeft: 12 }}
                  />
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "1rem 1.25rem 1.25rem",
                      fontSize: ".88rem",
                      color: "#475569",
                      lineHeight: 1.7,
                      background: "#EFF6FF",
                    }}
                  >
                    Votre réponse personnalisée apparaîtra ici. Modifiez ce
                    texte dans l&apos;éditeur pour répondre précisément à la
                    question de vos visiteurs.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section id="contact" style={{ padding: "2rem 2rem 5rem" }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            background: "#0F172A",
            borderRadius: 24,
            padding: "4rem 3rem",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              color: "#60A5FA",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            DES AMBITIONS PLEIN LA TÊTE
          </p>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            Profitez d&apos;un regard expert
            <br />
            sur votre projet
          </h2>
          <p
            style={{
              color: "#94A3B8",
              marginBottom: "2rem",
              fontSize: ".9rem",
            }}
          >
            Notre agence analyse gratuitement votre projet et vous apporte un
            rapport de performance en moins de 48h.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#"
              style={{
                padding: "13px 28px",
                borderRadius: 10,
                background: "#2563EB",
                color: "#fff",
                fontWeight: 700,
                fontSize: ".95rem",
                textDecoration: "none",
              }}
            >
              Démarrer un projet
            </a>
            <a
              href="#"
              style={{
                padding: "13px 24px",
                borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,.2)",
                color: "#fff",
                fontWeight: 600,
                fontSize: ".95rem",
                textDecoration: "none",
              }}
            >
              Planifier un appel →
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          background: "#0F172A",
          color: "#94A3B8",
          padding: "4rem 2rem 2rem",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            {/* Brand + offices */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="bi bi-hexagon-fill text-white"
                    style={{ fontSize: ".65rem" }}
                  />
                </div>
                <span
                  style={{ fontWeight: 800, color: "#fff", fontSize: ".95rem" }}
                >
                  MonEntreprise
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Paris", "Montpellier", "Toulouse", "Remote"].map((city) => (
                  <span
                    key={city}
                    style={{
                      fontSize: ".8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <i
                      className="bi bi-geo-alt"
                      style={{ fontSize: ".75rem", color: "#60A5FA" }}
                    />
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Expertises */}
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                EXPERTISES
              </p>
              {[
                "Développement Web",
                "Applications Mobile",
                "Design UI/UX",
                "E-commerce",
                "SEO",
              ].map((l) => (
                <p key={l} style={{ fontSize: ".8rem", marginBottom: 6 }}>
                  <a
                    href="#"
                    style={{ color: "#94A3B8", textDecoration: "none" }}
                  >
                    {l}
                  </a>
                </p>
              ))}
            </div>

            {/* Front-end */}
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                FRONT-END
              </p>
              {["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS"].map(
                (l) => (
                  <p key={l} style={{ fontSize: ".8rem", marginBottom: 6 }}>
                    <a
                      href="#"
                      style={{ color: "#94A3B8", textDecoration: "none" }}
                    >
                      {l}
                    </a>
                  </p>
                ),
              )}
            </div>

            {/* Liens site */}
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                SITE
              </p>
              {[
                "Accueil",
                "À propos",
                "Expertises",
                "Réalisations",
                "Blog",
                "Contact",
              ].map((l) => (
                <p key={l} style={{ fontSize: ".8rem", marginBottom: 6 }}>
                  <a
                    href="#"
                    style={{ color: "#94A3B8", textDecoration: "none" }}
                  >
                    {l}
                  </a>
                </p>
              ))}
            </div>

            {/* Ressources */}
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                RESSOURCES
              </p>
              {["Blog", "Tutoriels", "Documentation", "Changelog"].map((l) => (
                <p key={l} style={{ fontSize: ".8rem", marginBottom: 6 }}>
                  <a
                    href="#"
                    style={{ color: "#94A3B8", textDecoration: "none" }}
                  >
                    {l}
                  </a>
                </p>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.08)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: ".78rem" }}>
              © 2026 MonEntreprise · Tous droits réservés
            </span>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["CGU", "Politique de confidentialité", "Mentions légales"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      fontSize: ".78rem",
                      color: "#94A3B8",
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
