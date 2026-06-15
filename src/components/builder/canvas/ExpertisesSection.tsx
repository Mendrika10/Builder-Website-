import React from "react";

export function ExpertisesSection({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as { icon: string; label: string }[]) ?? [];
  const bg = (data.bgColor as string) || "#0F172A";
  return (
    <section style={{ background: bg, padding: "5rem 2rem", color: "#fff" }}>
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
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            color: "#fff",
            maxWidth: 500,
            lineHeight: 1.25,
            marginBottom: "1rem",
          }}
        >
          {data.title as string}
        </h2>
        <p
          style={{
            color: "#94A3B8",
            fontSize: ".9rem",
            lineHeight: 1.7,
            maxWidth: 500,
            marginBottom: "2.5rem",
          }}
        >
          {data.subtitle as string}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "1rem",
          }}
        >
          {items.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,.06)",
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
          <span
            style={{ color: "#60A5FA", fontWeight: 700, fontSize: ".9rem" }}
          >
            {data.ctaText as string} →
          </span>
        </div>
      </div>
    </section>
  );
}
