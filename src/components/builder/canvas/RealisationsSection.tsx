import React from "react";

export function RealisationsSection({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const items =
    (data.items as {
      titre: string;
      desc: string;
      bg: string;
      color: string;
      imageUrl?: string;
    }[]) ?? [];
  return (
    <section style={{ padding: "5rem 2rem" }}>
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
            {data.title as string}
          </h2>
          <span
            style={{ color: "#2563EB", fontWeight: 700, fontSize: ".88rem" }}
          >
            {data.ctaText as string}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((r, i) => (
            <div
              key={i}
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
                  overflow: "hidden",
                }}
              >
                {r.imageUrl ? (
                  <img
                    src={r.imageUrl}
                    alt={r.titre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
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
                )}
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
  );
}
