import React from "react";

export function TemoignagesSection({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const items =
    (data.items as {
      logo: string;
      logoColor: string;
      name: string;
      role: string;
      text: string;
    }[]) ?? [];
  return (
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
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            maxWidth: 400,
            marginBottom: "2.5rem",
          }}
        >
          {data.title as string}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((t, i) => (
            <div
              key={i}
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
                  background: t.logoColor,
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: ".9rem",
                  display: "inline-block",
                  marginBottom: "1rem",
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
              <div style={{ fontWeight: 700, fontSize: ".85rem" }}>
                {t.name}
              </div>
              <div style={{ fontSize: ".78rem", color: "#64748B" }}>
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
