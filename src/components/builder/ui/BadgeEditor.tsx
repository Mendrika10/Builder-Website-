"use client";

import { useState } from "react";
import { BadgeStylePopover } from "./BadgeStylePopover";

interface BadgeEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  prefix: string;
}

export function BadgeEditor({ data, onUpdate, prefix }: BadgeEditorProps) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const enabled = (data[`${prefix}Enabled`] as boolean) ?? true;
  const text = (data[`${prefix}Text`] as string) ?? "";
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* --- Toggle Affichage (Moderne & fluide) --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 2,
        }}
      >
        <label
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: enabled ? "#0066ff" : "#64748B",
            transition: "color 0.2s ease",
            userSelect: "none",
          }}
        >
          <i
            className="bi bi-tags me-1"
            style={{ color: enabled ? "#0066ff" : "#64748B", fontSize: "11px" }}
          ></i>
          Afficher le badge
        </label>

        {/* Toggle Button Ultra-Moderne */}
        <button
          type="button"
          onClick={() => set(`${prefix}Enabled`, !enabled)}
          onMouseEnter={() => setIsToggleHovered(true)}
          onMouseLeave={() => setIsToggleHovered(false)}
          style={{
            position: "relative",
            width: 31,
            height: 15,
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
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "#fff",
              top: 2,
              left: enabled ? 16 : 5,
              boxShadow:
                "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </button>
      </div>

      {/* --- Carte Moderne (Wix/Framer Style) --- */}
      {enabled && (
        <div
          style={{
            padding: "9px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "#FAFBFC",
            border: "1px solid #E2E8F0",
            borderRadius: 5,
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
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#475569",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                <i
                  className="bi bi-hash me-1 text-primary"
                  style={{ fontSize: "11px" }}
                ></i>
                Libellé du badge
              </label>

              {/* Input Modern */}
              <input
                type="text"
                value={text}
                onChange={(e) => set(`${prefix}Text`, e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ex: Nouveau, Premium, Top..."
                style={{
                  width: "100%",
                  padding: "5px 9px",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#1E293B",
                  background: isFocused ? "#fff" : "#fff",
                  border: isFocused
                    ? "1.5px solid #2563EB"
                    : "1px solid #E2E8F0",
                  borderRadius: 5,
                  outline: "none",
                  transition: "all 0.15s ease",
                  boxShadow: isFocused
                    ? "0 0 0 3px rgba(37, 99, 235, 0.1)"
                    : "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Style Button */}
            <div style={{ marginTop: 20 }}>
              <BadgeStylePopover
                prefix={prefix}
                data={data}
                onUpdate={onUpdate}
              />
            </div>
          </div>

          {/* Séparateur subtil */}
          <div
            style={{
              height: "0.5px",
              background: "#E2E8F0",
              margin: "4px 0",
            }}
          />

          {/* Info Text (Optionnel mais professionnel) */}
          <div
            style={{
              fontSize: "8px",
              color: "#7588a0",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 600,
            }}
          >
            <i
              className="bi bi-info-circle text-primary"
              style={{ fontSize: "10px" }}
            />
            Cliquez sur l'icône réglages pour personnaliser les couleurs et la
            typographie
          </div>
        </div>
      )}
    </div>
  );
}
