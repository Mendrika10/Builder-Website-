import React from "react";

export function FaqSection({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as { question: string; answer: string }[]) ?? [];
  return (
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
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          {data.title as string}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((q, i) => (
            <div
              key={i}
              style={{
                border: "1.5px solid #E2E8F0",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1rem 1.25rem",
                  fontWeight: 600,
                  fontSize: ".9rem",
                  background: i === 0 ? "#EFF6FF" : "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {q.question}
                <i
                  className={`bi ${i === 0 ? "bi-chevron-up" : "bi-chevron-down"}`}
                  style={{ color: "#2563EB", flexShrink: 0, marginLeft: 12 }}
                />
              </div>
              {i === 0 && (
                <div
                  style={{
                    padding: "1rem 1.25rem 1.25rem",
                    fontSize: ".88rem",
                    color: "#475569",
                    lineHeight: 1.7,
                    background: "#EFF6FF",
                  }}
                >
                  {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
