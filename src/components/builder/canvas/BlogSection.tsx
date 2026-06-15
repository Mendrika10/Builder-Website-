import React from "react";

export function BlogSection({ data }: { data: Record<string, unknown> }) {
  const items =
    (data.items as {
      tag: string;
      titre: string;
      desc: string;
      imageUrl?: string;
      imageBg: string;
      imageEmoji: string;
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
          <h2 style={{ fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
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
          {items.map((a, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  background: a.imageBg,
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {a.imageUrl ? (
                  <img
                    src={a.imageUrl}
                    alt={a.titre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "3rem" }}>{a.imageEmoji}</span>
                )}
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
                    display: "inline-block",
                    marginBottom: 8,
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
  );
}
