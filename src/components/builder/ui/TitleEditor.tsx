"use client";

import { useState } from "react";
import { TextStylePopover } from "./TextStylePopover";

interface TitleEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  prefix: string; // ex: "title" ou "subtitle"
  label?: string; // ex: "Titre principal"
  rows?: number;
  canToggle?: boolean;
}

export function TitleEditor({
  data,
  onUpdate,
  prefix,
  label = "Titre",
  rows = 3,
  canToggle = false,
}: TitleEditorProps) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const enabled = (data[`${prefix}Enabled`] as boolean) ?? true;
  const text = (data[prefix] as string) ?? "";
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* --- Header avec Toggle d'affichage (Moderne) --- */}
      {canToggle && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: enabled ? "#1E293B" : "#64748B",
              transition: "color 0.2s ease",
              userSelect: "none",
            }}
          >
            Afficher le {label.toLowerCase()}
          </label>

          {/* Toggle Button Ultra-Moderne */}
          <button
            type="button"
            onClick={() => set(`${prefix}Enabled`, !enabled)}
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            style={{
              position: "relative",
              width: 44,
              height: 24,
              border: "none",
              borderRadius: 999,
              background: enabled
                ? "#2563EB"
                : isToggleHovered
                  ? "#E2E8F0"
                  : "#E8EEF9",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: 0,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                top: 3,
                left: enabled ? 23 : 3,
                boxShadow:
                  "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </button>
        </div>
      )}

      {/* --- Carte Moderne (Wix/Framer Style) --- */}
      {(!canToggle || enabled) && (
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "#FAFBFC",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            boxShadow:
              "0 2px 4px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.01)",
            transition: "all 0.2s ease",
          }}
        >
          {/* Header avec Label + Style Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: "0.015em",
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              {label}
            </label>

            {/* Style Button */}
            <TextStylePopover
              prefix={prefix}
              data={data}
              onUpdate={onUpdate}
              defaultSize={prefix === "title" ? "2.25rem" : "1rem"}
              defaultColor={prefix === "title" ? "#1E293B" : "#475569"}
              defaultWeight={prefix === "title" ? "800" : "400"}
              defaultAlign="center"
            />
          </div>

          {/* Séparateur subtil */}
          <div
            style={{ height: "0.5px", background: "#E2E8F0", margin: "2px 0" }}
          />

          {/* TextArea Modern */}
          <textarea
            value={text}
            onChange={(e) => set(prefix, e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            placeholder={`Ex: ${
              prefix === "title"
                ? "Bienvenue sur notre plateforme"
                : "Découvrez nos solutions innovantes"
            }`}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#1E293B",
              background: isFocused ? "#fff" : "#F8FAFC",
              border: isFocused ? "1.5px solid #2563EB" : "1px solid #E2E8F0",
              borderRadius: 8,
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              boxShadow: isFocused
                ? "0 0 0 3px rgba(37, 99, 235, 0.1)"
                : "none",
              boxSizing: "border-box",
            }}
          />

          {/* Info Text (Aide visuelle discrète) */}
          <div
            style={{
              fontSize: "11px",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <i className="bi bi-info-circle" style={{ fontSize: "10px" }} />
            Appuyez sur la zone de style pour personnaliser la typographie
          </div>
        </div>
      )}
    </div>
  );
}
