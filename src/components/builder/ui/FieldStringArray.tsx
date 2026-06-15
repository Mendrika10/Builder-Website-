import React from "react";

export function FieldStringArray({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          fontSize: ".75rem",
          fontWeight: 700,
          color: "#475569",
          display: "block",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </label>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").filter(Boolean))}
        rows={4}
        style={{
          width: "100%",
          padding: "7px 10px",
          borderRadius: 8,
          border: "1.5px solid #E2E8F0",
          fontSize: ".85rem",
          resize: "vertical",
          outline: "none",
        }}
      />
      <p style={{ fontSize: ".7rem", color: "#94A3B8", margin: "2px 0 0" }}>
        {hint ?? "Un élément par ligne"}
      </p>
    </div>
  );
}
