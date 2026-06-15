"use client";

import React from "react";

interface FontSizeInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}

export function FontSizeInput({ label, value, onChange }: FontSizeInputProps) {
  const adjust = (dir: 1 | -1) => {
    const match = value.match(/^([\d.]+)(rem|px|em)?$/);
    if (match) {
      const unit = match[2] || "rem";
      const step = unit === "px" ? 1 : 0.05;
      const next = Math.max(0, parseFloat(match[1]) + dir * step).toFixed(
        unit === "px" ? 0 : 2,
      );
      onChange(`${next}${unit}`);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          className="flex items-center gap-1 mb-1"
          style={{
            fontSize: "10px",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <i
            className="bi bi-type"
            style={{ fontSize: "10px", color: "#94A3B8" }}
          />
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 28,
          border: "0.5px solid #E2E8F0",
          borderRadius: 6,
          background: "#F8FAFC",
          overflow: "hidden",
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.95rem"
          style={{
            flex: 1,
            height: "100%",
            padding: "0 6px",
            fontSize: "10px",
            fontFamily: "monospace",
            border: "none",
            background: "transparent",
            outline: "none",
            color: "#000000",
            minWidth: 0,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: "0.5px solid #E2E8F0",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => adjust(1)}
            style={{
              flex: 1,
              width: 20,
              border: "none",
              borderBottom: "0.5px solid #E2E8F0",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              color: "#94A3B8",
            }}
          >
            <i className="bi bi-chevron-up" style={{ fontSize: 10 }} />
          </button>
          <button
            onClick={() => adjust(-1)}
            style={{
              flex: 1,
              width: 20,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              color: "#94A3B8",
            }}
          >
            <i className="bi bi-chevron-down" style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
