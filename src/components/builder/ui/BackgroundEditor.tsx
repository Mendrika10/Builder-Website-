"use client";

import { useState } from "react";
import { FieldColor } from "./FieldColor";
import { FieldImageCard } from "./FieldImageCard";

interface BackgroundEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  siteId: string;
  prefix: string; // e.g., "heroBg" or "navBg"
}

export function BackgroundEditor({
  data,
  onUpdate,
  siteId,
  prefix,
}: BackgroundEditorProps) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const bgType = (data[`${prefix}Type`] as string) ?? "color";
  const bgColor = (data[`${prefix}Color`] as string) ?? "#ffffff";
  const bgImageUrl = (data[`${prefix}ImageUrl`] as string) ?? "";
  const bgColorType = (data[`${prefix}ColorType`] as string) ?? "solid";
  const [gradientInputFocused, setGradientInputFocused] = useState(false);

  const gradients = [
    {
      name: "Purple Dream",
      code: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      name: "Ocean Blue",
      code: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)",
    },
    {
      name: "Sunset",
      code: "linear-gradient(135deg, #FA8231 0%, #F77E21 100%)",
    },
    {
      name: "Green Mint",
      code: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      name: "Rose Gold",
      code: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      name: "Cool Blues",
      code: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  return (
    <>
      {/* --- Sélecteur Type (Couleur / Image) --- */}
      <div
        style={{
          display: "inline-flex",
          gap: 0,
          background: "#FAFBFC",
          border: "1px solid #E2E8F0",
          borderRadius: 10,
          padding: 4,
          marginBottom: 12,
        }}
      >
        {(["color", "image"] as const).map((type) => {
          const active = bgType === type;
          return (
            <button
              key={type}
              onClick={() => set(`${prefix}Type`, type)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 8,
                border: "none",
                background: active ? "#fff" : "transparent",
                color: active ? "#2563EB" : "#64748B",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                boxShadow: active ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
              }}
            >
              <i
                className={`bi ${type === "color" ? "bi-palette" : "bi-image"}`}
                style={{
                  fontSize: "14px",
                  color: active ? "#2563EB" : "#94A3B8",
                }}
              />
              {type === "color" ? "Couleur" : "Image"}
            </button>
          );
        })}
      </div>

      {bgType === "color" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* --- Sélecteur Solid / Gradient --- */}
          <div
            style={{
              display: "inline-flex",
              gap: 0,
              background: "#FAFBFC",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: 4,
            }}
          >
            {(["solid", "gradient"] as const).map((gtype) => {
              const active = bgColorType === gtype;
              return (
                <button
                  key={gtype}
                  onClick={() => set(`${prefix}ColorType`, gtype)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: active ? "#fff" : "transparent",
                    color: active ? "#2563EB" : "#64748B",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    boxShadow: active
                      ? "0 1px 2px rgba(0, 0, 0, 0.05)"
                      : "none",
                  }}
                >
                  {gtype === "solid" ? "Couleur unie" : "Gradient"}
                </button>
              );
            })}
          </div>

          {bgColorType === "solid" ? (
            <FieldColor
              label=""
              value={bgColor}
              onChange={(v) => set(`${prefix}Color`, v)}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* --- Gradients Presets --- */}
              <div
                style={{
                  padding: "14px 16px",
                  background: "#FAFBFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.01)",
                }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748B",
                    letterSpacing: "0.015em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Gradients modernes
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                  }}
                >
                  {gradients.map((g) => {
                    const active =
                      (data[`${prefix}GradientCode`] as string) === g.code;
                    return (
                      <div
                        key={g.code}
                        onClick={() => set(`${prefix}GradientCode`, g.code)}
                        style={{
                          background: g.code,
                          borderRadius: 10,
                          height: 44,
                          cursor: "pointer",
                          border: active
                            ? "2px solid #2563EB"
                            : "2px solid transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#fff",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          letterSpacing: "0.015em",
                          transition: "all 0.15s ease",
                          transform: active ? "scale(1.02)" : "scale(1)",
                          boxShadow: active
                            ? "0 4px 12px rgba(37, 99, 235, 0.25)"
                            : "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {g.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- Code CSS Personnalisé --- */}
              <div
                style={{
                  padding: "14px 16px",
                  background: "#FAFBFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.01)",
                }}
              >
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748B",
                    letterSpacing: "0.015em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Code CSS personnalisé
                </label>
                <input
                  type="text"
                  value={(data[`${prefix}GradientCode`] as string) ?? ""}
                  onChange={(e) => set(`${prefix}GradientCode`, e.target.value)}
                  onFocus={() => setGradientInputFocused(true)}
                  onBlur={() => setGradientInputFocused(false)}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: gradientInputFocused
                      ? "1.5px solid #2563EB"
                      : "1px solid #E2E8F0",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    fontWeight: 500,
                    outline: "none",
                    background: gradientInputFocused ? "#fff" : "#F8FAFC",
                    color: "#1E293B",
                    transition: "all 0.15s ease",
                    boxShadow: gradientInputFocused
                      ? "0 0 0 3px rgba(37, 99, 235, 0.1)"
                      : "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <FieldImageCard
            label="Image d'arrière-plan"
            url={bgImageUrl}
            onUrlChange={(v) => set(`${prefix}ImageUrl`, v)}
            uploadContext={{ siteId, collection: `${prefix.toLowerCase()}-bg` }}
            prefix={prefix}
            data={data}
            onUpdate={onUpdate}
          />
        </>
      )}
    </>
  );
}
