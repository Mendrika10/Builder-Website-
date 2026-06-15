import React from "react";

export function CtaSection({ data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ padding: "2rem 2rem 5rem" }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: (data.bgColor as string) || "#0F172A",
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
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            color: "#fff",
            marginBottom: "1rem",
            whiteSpace: "pre-line",
          }}
        >
          {data.title as string}
        </h2>
        <p
          style={{ color: "#94A3B8", marginBottom: "2rem", fontSize: ".9rem" }}
        >
          {data.subtitle as string}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "13px 28px",
              borderRadius: 10,
              background: (data.cta1Color as string) || "#2563EB",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".95rem",
            }}
          >
            {data.cta1Text as string}
          </span>
          <span
            style={{
              padding: "13px 24px",
              borderRadius: 10,
              border: "1.5px solid rgba(255,255,255,.2)",
              color: "#fff",
              fontWeight: 600,
              fontSize: ".95rem",
            }}
          >
            {data.cta2Text as string}
          </span>
        </div>
      </div>
    </section>
  );
}
