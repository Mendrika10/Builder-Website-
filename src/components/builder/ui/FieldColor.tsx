import React from "react";

export function FieldColor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          fontSize: "9px",
          fontWeight: 600,
          color: "#475569",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 20,
            height: 20,
            border: "1.5px solid #E2E8F0",
            borderRadius: 1,
            cursor: "pointer",
            padding: 2,
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "4px 9px",
            borderRadius: 5,
            border: "1.5px solid #E2E8F0",
            fontSize: "9px",
            fontFamily: "monospace",
            outline: "none",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}
