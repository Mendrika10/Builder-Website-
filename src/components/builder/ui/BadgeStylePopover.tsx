"use client";

import { useState, useRef, useEffect } from "react";
import { FontSizeInput } from "./FontSizeInput";
import { FieldColor } from "./FieldColor";

interface BadgeStylePopoverProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  prefix: string; // ex: "heroBadge"
}

export function BadgeStylePopover({
  data,
  onUpdate,
  prefix,
}: BadgeStylePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const bgColor = (data[`${prefix}BgColor`] as string) ?? "#EFF6FF";
  const textColor = (data[`${prefix}TextColor`] as string) ?? "#2563EB";
  const fontSize = (data[`${prefix}FontSize`] as string) ?? "10px";
  const fontWeight = (data[`${prefix}Weight`] as string) ?? "700";
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
          width: 25,
          height: 25,
          borderRadius: 8,
          border: isOpen ? "1px solid #2563EB" : "1px solid #E2E8F0",
          background: isOpen ? "#EFF6FF" : "#F8FAFC",
          color: isOpen ? "#2563EB" : "#64748B",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isOpen ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
        }}
        title="Style du badge"
      >
        <i className="bi bi-sliders" style={{ fontSize: 11 }} />
      </button>

      {/* Bulle flottante (Popover) */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: -6,
            width: 225,
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            zIndex: 1000,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            animation: "popoverIn 0.2s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <i
              className="bi bi-droplet-half"
              style={{ fontSize: "11px", color: "rgb(0 103 247)" }}
            />
            <label style={labelStyle}>Style du badge</label>
          </div>

          {/* 1. Taille */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <FontSizeInput
              label="Taille du texte"
              value={fontSize}
              onChange={(v) => set(`${prefix}FontSize`, v)}
            />
          </div>

          <div style={{ height: "0.5px", background: "#F1F5F9" }} />

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

          <div style={{ height: "0.5px", background: "#F1F5F9" }} />

          {/* 3. Couleurs (Fond & Texte) */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div>
              <label
                style={{
                  fontSize: ".75rem",
                  fontWeight: 600,
                  color: "#64748B",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Fond
              </label>
              <FieldColor
                label=""
                value={bgColor}
                onChange={(v) => set(`${prefix}BgColor`, v)}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: ".75rem",
                  fontWeight: 600,
                  color: "#64748B",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Texte
              </label>
              <FieldColor
                label=""
                value={textColor}
                onChange={(v) => set(`${prefix}TextColor`, v)}
              />
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes popoverIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
const labelStyle: React.CSSProperties = {
  fontSize: "10px", // Réduit de 11px à 10px
  fontWeight: 800, // Augmenté pour plus de visibilité
  color: "rgb(82 92 105)",
};
