import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: ".7rem",
        fontWeight: 700,
        color: "#2563EB",
        borderBottom: "1px solid #E2E8F0",
        paddingBottom: 6,
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {children}
    </p>
  );
}
