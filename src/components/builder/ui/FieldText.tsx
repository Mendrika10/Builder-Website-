import React from "react";

export function FieldText({
  label,
  value,
  onChange,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 5 }}>
      <label
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#475569",
          display: "block",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "5px 9px",
          borderRadius: 5,
          border: "1.5px solid #E2E8F0",
          fontSize: "10px",
          outline: "none",
        }}
      />
    </div>
  );
}
