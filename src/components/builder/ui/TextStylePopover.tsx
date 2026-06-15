"use client";

import { useState, useRef, useEffect } from "react";
import { FontSizeInput } from "./FontSizeInput";
import { FieldColor } from "./FieldColor";

interface TextStylePopoverProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  prefix: string; // ex: "title", "subtitle", "heroBadge"
  defaultSize?: string;
  defaultColor?: string;
  defaultWeight?: string;
  defaultAlign?: "left" | "center" | "right";
}

export function TextStylePopover({
  data,
  onUpdate,
  prefix,
  defaultSize = "1rem",
  defaultColor = "#1E293B",
  defaultWeight = "400",
  defaultAlign = "left",
}: TextStylePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const color = (data[`${prefix}Color`] as string) ?? defaultColor;
  const fontSize = (data[`${prefix}FontSize`] as string) ?? defaultSize;
  const align =
    (data[`${prefix}Align`] as "left" | "center" | "right") ?? defaultAlign;
  const fontWeight = (data[`${prefix}Weight`] as string) ?? defaultWeight;
  const isItalic = (data[`${prefix}Italic`] as boolean) ?? false;

  // Fermer le popover si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={popoverRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Bouton déclencheur */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 6,
          border: "0.5px solid #E2E8F0",
          background: isOpen ? "#EFF6FF" : "#F8FAFC",
          color: isOpen ? "#2563EB" : "#64748B",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        title="Style du texte"
      >
        <i className="bi bi-sliders" style={{ fontSize: 13 }} />
      </button>

      {/* Bulle flottante (Popover) */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 6,
            zIndex: 100,
            width: 240,
            background: "#fff",
            border: "0.5px solid #CBD5E1",
            borderRadius: 10,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 2,
            }}
          >
            Style du texte
          </div>

          {/* 1. Taille & Alignement */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <FontSizeInput
              label="Taille"
              value={fontSize}
              onChange={(v) => set(`${prefix}FontSize`, v)}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: ".75rem",
                  fontWeight: 600,
                  color: "#64748B",
                }}
              >
                Alignement
              </label>
              <div
                style={{
                  display: "flex",
                  background: "#F1F5F9",
                  border: "0.5px solid #E2E8F0",
                  borderRadius: 6,
                  padding: 2,
                  height: 28,
                  boxSizing: "border-box",
                }}
              >
                {(["left", "center", "right"] as const).map((a) => {
                  const active = align === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => set(`${prefix}Align`, a)}
                      style={{
                        flex: 1,
                        border: "none",
                        background: active ? "#fff" : "transparent",
                        borderRadius: 4,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: active ? "#2563EB" : "#64748B",
                        transition: "all 0.1s",
                      }}
                    >
                      <i
                        className={`bi bi-text-${a}`}
                        style={{ fontSize: 12 }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Graisse & Italique */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: ".75rem",
                  fontWeight: 600,
                  color: "#64748B",
                }}
              >
                Graisse
              </label>
              <select
                value={fontWeight}
                onChange={(e) => set(`${prefix}Weight`, e.target.value)}
                style={{
                  height: 28,
                  padding: "0 6px",
                  borderRadius: 6,
                  border: "0.5px solid #E2E8F0",
                  background: "#F8FAFC",
                  fontSize: 11,
                  outline: "none",
                  color: "#334155",
                  cursor: "pointer",
                }}
              >
                <option value="300">Fin (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Médium (500)</option>
                <option value="600">Demi-gras (600)</option>
                <option value="700">Gras (700)</option>
                <option value="800">Extra-gras (800)</option>
                <option value="900">Noir (900)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => set(`${prefix}Italic`, !isItalic)}
              style={{
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                borderRadius: 6,
                border: "0.5px solid #E2E8F0",
                background: isItalic ? "#EFF6FF" : "#F8FAFC",
                color: isItalic ? "#2563EB" : "#64748B",
                fontWeight: isItalic ? 700 : 500,
                fontSize: 11,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <i className="bi bi-type-italic" style={{ fontSize: 12 }} />
              Italique
            </button>
          </div>

          {/* 3. Couleur */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label
              style={{ fontSize: ".75rem", fontWeight: 600, color: "#64748B" }}
            >
              Couleur
            </label>
            <FieldColor
              label=""
              value={color}
              onChange={(v) => set(`${prefix}Color`, v)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
