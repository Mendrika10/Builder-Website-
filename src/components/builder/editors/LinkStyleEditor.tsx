import React from "react";
import { FieldColor } from "../ui/FieldColor";

export function LinkStyleEditor({
  data,
  onUpdate,
  inputStyle,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  inputStyle: React.CSSProperties;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const sharedInput: React.CSSProperties = {
    ...inputStyle,
    height: 28,
    padding: "0 8px",
    fontSize: 12,
    borderRadius: 6,
    border: "0.5px solid #E2E8F0",
    background: "#F8FAFC",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#64748B",
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #E2E8F0",
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Couleur */}
      <div>
        <label style={labelStyle}>
          <i
            className="bi bi-palette"
            style={{ fontSize: 10, color: "#94A3B8" }}
          />
          Couleur
        </label>
        <FieldColor
          label=""
          value={(data.linksColor as string) || "#334155"}
          onChange={(v) => set("linksColor", v)}
        />
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            <i
              className="bi bi-type"
              style={{ fontSize: 10, color: "#94A3B8" }}
            />
            Taille
          </label>
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
              value={(data.linksFontSize as string) || "0.88rem"}
              onChange={(e) => set("linksFontSize", e.target.value)}
              placeholder="0.88rem"
              style={{
                flex: 1,
                height: "100%",
                padding: "0 6px",
                fontSize: 12,
                fontFamily: "monospace",
                border: "none",
                background: "transparent",
                outline: "none",
                color: "#334155",
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
                onClick={() => {
                  const raw = (data.linksFontSize as string) || "0.88rem";
                  const match = raw.match(/^([\d.]+)(rem|px|em)?$/);
                  if (match) {
                    const unit = match[2] || "rem";
                    const step = unit === "px" ? 1 : 0.05;
                    const next = (parseFloat(match[1]) + step).toFixed(
                      unit === "px" ? 0 : 2,
                    );
                    set("linksFontSize", `${next}${unit}`);
                  }
                }}
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
                onClick={() => {
                  const raw = (data.linksFontSize as string) || "0.88rem";
                  const match = raw.match(/^([\d.]+)(rem|px|em)?$/);
                  if (match) {
                    const unit = match[2] || "rem";
                    const step = unit === "px" ? 1 : 0.05;
                    const next = Math.max(
                      0,
                      parseFloat(match[1]) - step,
                    ).toFixed(unit === "px" ? 0 : 2);
                    set("linksFontSize", `${next}${unit}`);
                  }
                }}
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
      </div>

      {/* Taille + Graisse sur une ligne */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            <i
              className="bi bi-bold"
              style={{ fontSize: 10, color: "#94A3B8" }}
            />
            Graisse
          </label>
          <select
            value={(data.linksFontWeight as string) || "600"}
            onChange={(e) => set("linksFontWeight", e.target.value)}
            style={sharedInput}
          >
            <option value="400">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi-bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra bold</option>
          </select>
        </div>
      </div>

      {/* Style de police */}
      <div>
        <label style={labelStyle}>
          <i
            className="bi bi-italic"
            style={{ fontSize: 10, color: "#94A3B8" }}
          />
          Style
        </label>
        <select
          value={(data.linksFontStyle as string) || "normal"}
          onChange={(e) => set("linksFontStyle", e.target.value)}
          style={sharedInput}
        >
          <option value="normal">Normal</option>
          <option value="italic">Italique</option>
        </select>
      </div>
    </div>
  );
}
