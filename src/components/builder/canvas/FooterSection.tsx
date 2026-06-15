import React from "react";

export function FooterSection({ data }: { data: Record<string, unknown> }) {
  const cities = (data.cities as string[]) ?? [];
  const columns = (data.columns as { title: string; links: string[] }[]) ?? [];
  return (
    <footer
      style={{
        background: (data.bgColor as string) || "#0F172A",
        color: "#94A3B8",
        padding: "4rem 2rem 2rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 800,
                color: "#fff",
                fontSize: ".95rem",
                marginBottom: "1rem",
              }}
            >
              {data.logo as string}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cities.map((city: string, i) => (
                <p key={i} style={{ fontSize: ".8rem", margin: 0 }}>
                  {city}
                </p>
              ))}
            </div>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                {col.title}
              </p>
              {col.links.map((l: string, j) => (
                <p
                  key={j}
                  style={{
                    fontSize: ".8rem",
                    marginBottom: 6,
                    color: "#94A3B8",
                  }}
                >
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            paddingTop: "1.5rem",
          }}
        >
          <span style={{ fontSize: ".78rem" }}>{data.copyright as string}</span>
        </div>
      </div>
    </footer>
  );
}
