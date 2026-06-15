"use client";

import { useState } from "react";

import { FieldText } from "./ui/FieldText";
import { ButtonStylePopover } from "./ui/ButtonStylePopover";

type SectionAnchor = { label: string; href: string };
type PageOption = { label: string; href: string };

export function CtaLinkEditor({
  label,
  enabled,
  textValue,
  urlValue,
  sectionAnchors,
  pageOptions,
  inputStyle,
  onEnabledChange,
  onTextChange,
  onUrlChange,
  compact,
  prefix,
  data,
  onUpdate,
}: {
  label: string;
  enabled: boolean;
  textValue: string;
  urlValue: string;
  sectionAnchors: SectionAnchor[];
  pageOptions: PageOption[];
  inputStyle: React.CSSProperties;
  onEnabledChange: (v: boolean) => void;
  onTextChange: (v: string) => void;
  onUrlChange: (v: string) => void;
  compact?: boolean;
  prefix: string;
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  colorValue?: string;
  textColorValue?: string;
  borderColorValue?: string;
  iconValue?: string;
  sizeValue?: string;
  fontSize?: string;
  onColorChange?: (v: string) => void;
  onTextColorChange?: (v: string) => void;
  onBorderColorChange?: (v: string) => void;
  onIconChange?: (v: string) => void;
  onSizeChange?: (v: string) => void;
  onFontSizeChange?: (v: string) => void;
}) {
  const isSection = urlValue.startsWith("#");
  const [type, setType] = useState<"section" | "page">(
    isSection ? "section" : "page",
  );

  const handleTypeChange = (t: "section" | "page") => {
    setType(t);
    onUrlChange(t === "section" ? (sectionAnchors[0]?.href ?? "#") : "/");
  };

  return (
    <div
      style={{
        background: compact ? "transparent" : enabled ? "#fff" : "#F8FAFC",
        border: compact
          ? "none"
          : `1px solid ${enabled ? "#E2E8F0" : "#CBD5E1"}`,
        borderRadius: compact ? 0 : 12,
        padding: compact ? 0 : "16px",
        marginBottom: compact ? 0 : 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        opacity: enabled ? 1 : 0.7,
        boxShadow: compact ? "none" : "0 1px 3px rgba(0,0,0,0.02)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Ligne 1 : Texte du bouton + Bouton de Style */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <FieldText value={textValue} onChange={onTextChange} />
        </div>
        <div style={{ marginBottom: "4px" }}>
          <ButtonStylePopover prefix={prefix} data={data} onUpdate={onUpdate} />
        </div>
      </div>

      {/* Ligne 2 : Destination (URL/Ancre) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={smallLabelStyle}>Type de lien</label>
            <select
              value={type}
              onChange={(e) =>
                handleTypeChange(e.target.value as "section" | "page")
              }
              style={{
                fontSize: "10px",
                padding: "5px 8px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                outline: "none",
                cursor: "pointer",
                color: "#475569",
                fontWeight: 500,
              }}
            >
              <option value="section">Ancre (#)</option>
              <option value="page">Page (/)</option>
            </select>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <label style={smallLabelStyle}>Lien direct</label>
            <FieldText label="" value={urlValue} onChange={onUrlChange} />
          </div>
        </div>

        {/* Sélecteur de destination dynamique - Style "Pill" */}
        <div
          style={{
            padding: "6px 10px",
            background: "#F8FAFC",
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "#94A3B8",
              letterSpacing: "0.03em",
            }}
          >
            Destination rapide
          </label>
          <select
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              fontSize: "10px",
              background: "#fff",
              outline: "none",
              color: "#1E293B",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {type === "section"
              ? sectionAnchors.map((a) => (
                  <option key={a.href} value={a.href}>
                    {a.label}
                  </option>
                ))
              : pageOptions.map((p) => (
                  <option key={p.href} value={p.href}>
                    {p.label}
                  </option>
                ))}
          </select>
        </div>
      </div>

      {/* Ligne 3 : Toggle Visibilité - Style Moderne */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 6,
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <span style={{ fontSize: "9px", fontWeight: 700, color: "#000" }}>
          Activer ce bouton
        </span>
        <button
          onClick={() => onEnabledChange(!enabled)}
          style={{
            width: 31,
            height: 15,
            borderRadius: 10,
            background: enabled ? "#2563EB" : "#CBD5E1",
            position: "relative",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s ease",
            padding: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "#fff",
              top: 2,
              left: enabled ? 16 : 5,
              transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          />
        </button>
      </div>
    </div>
  );
}

const smallLabelStyle: React.CSSProperties = {
  fontSize: "9px",
  fontWeight: 600,
  color: "#94A3B8",
  letterSpacing: "0.02em",
};
