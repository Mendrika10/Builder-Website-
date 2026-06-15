import React from "react";

export function ContactSection({ data }: { data: Record<string, unknown> }) {
  return (
    <section
      style={{
        padding: "5rem 2rem",
        background: (data.bgColor as string) || "#F8FAFC",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            textAlign: "center",
            marginBottom: ".75rem",
          }}
        >
          {data.title as string}
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            fontSize: ".9rem",
            marginBottom: "3rem",
          }}
        >
          {data.subtitle as string}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
          }}
        >
          {/* Infos de contact */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {(data.email as string) && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                  <i
                    className="bi bi-envelope"
                    style={{ color: "#2563EB", fontSize: "1.1rem" }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: ".8rem", fontWeight: 700, margin: 0 }}>
                    Email
                  </p>
                  <p style={{ fontSize: ".85rem", color: "#475569", margin: 0 }}>
                    {data.email as string}
                  </p>
                </div>
              </div>
            )}
            {(data.phone as string) && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                  <i
                    className="bi bi-telephone"
                    style={{ color: "#2563EB", fontSize: "1.1rem" }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: ".8rem", fontWeight: 700, margin: 0 }}>
                    Téléphone
                  </p>
                  <p style={{ fontSize: ".85rem", color: "#475569", margin: 0 }}>
                    {data.phone as string}
                  </p>
                </div>
              </div>
            )}
            {(data.address as string) && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                  <i
                    className="bi bi-geo-alt"
                    style={{ color: "#2563EB", fontSize: "1.1rem" }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: ".8rem", fontWeight: 700, margin: 0 }}>
                    Adresse
                  </p>
                  <p style={{ fontSize: ".85rem", color: "#475569", margin: 0 }}>
                    {data.address as string}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Formulaire (statique dans l'éditeur) */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              boxShadow: "0 2px 16px rgba(0,0,0,.06)",
              border: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: ".8rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {data.labelNom as string}
              </label>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid #E2E8F0",
                  fontSize: ".85rem",
                  color: "#94A3B8",
                  background: "#F8FAFC",
                }}
              >
                Jean Dupont
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: ".8rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {data.labelEmail as string}
              </label>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid #E2E8F0",
                  fontSize: ".85rem",
                  color: "#94A3B8",
                  background: "#F8FAFC",
                }}
              >
                jean@exemple.com
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: ".8rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {data.labelMessage as string}
              </label>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid #E2E8F0",
                  fontSize: ".85rem",
                  color: "#94A3B8",
                  background: "#F8FAFC",
                  minHeight: 80,
                }}
              >
                Votre message ici…
              </div>
            </div>
            <div
              style={{
                padding: "11px",
                borderRadius: 9,
                background: "#2563EB",
                color: "#fff",
                fontWeight: 700,
                fontSize: ".88rem",
                textAlign: "center",
              }}
            >
              {data.labelSubmit as string}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
