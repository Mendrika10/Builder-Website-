"use client";

import { useState, useRef, useEffect } from "react";
import { FieldColor } from "./FieldColor";
import { FontSizeInput } from "./FontSizeInput";

interface ButtonStylePopoverProps {
  prefix: string;
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ButtonStylePopover({
  prefix,
  data,
  onUpdate,
}: ButtonStylePopoverProps) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      {/* Bouton Trigger - Style "Tool" */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        type="button"
        style={{
          width: 25,
          height: 25,
          borderRadius: 8,
          border: open ? "1px solid #2563EB" : "1px solid #E2E8F0",
          background: open ? "#EFF6FF" : "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          color: open ? "#2563EB" : "#64748B",
          boxShadow: open ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
        }}
      >
        <i className="bi bi-palette2" style={{ fontSize: "11px" }} />
      </button>

      {/* Popover de Style - Design "Studio" */}
      {open && (
        <div
          ref={popoverRef}
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
          {/* --- Section Couleurs --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i
                className="bi bi-droplet-half"
                style={{ fontSize: "11px", color: "rgb(0 103 247)" }}
              />
              <label style={labelStyle}>Palette de couleurs</label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                background: "#F8FAFC",
                padding: "5px",
                borderRadius: 5,
                border: "1px solid #F1F5F9",
              }}
            >
              <FieldColor
                label="Fond"
                value={(data[`${prefix}Color`] as string) || "#2563EB"}
                onChange={(v) => set(`${prefix}Color`, v)}
              />
              <FieldColor
                label="Texte"
                value={(data[`${prefix}TextColor`] as string) || "#FFFFFF"}
                onChange={(v) => set(`${prefix}TextColor`, v)}
              />
            </div>
            <div
              style={{
                background: "#F8FAFC",
                padding: "5px",
                borderRadius: 5,
                border: "1px solid #F1F5F9",
              }}
            >
              <FieldColor
                label="Bordure"
                value={
                  (data[`${prefix}BorderColor`] as string) || "transparent"
                }
                onChange={(v) => set(`${prefix}BorderColor`, v)}
              />
            </div>
          </div>

          <div style={dividerStyle} />

          {/* --- Section Taille & Typo --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <i
                className="bi bi-aspect-ratio"
                style={{ fontSize: "11px", color: "rgb(0, 103, 247)" }}
              />
              <label style={labelStyle}>Dimensions & Texte</label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Segmented Control pour la taille */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={subLabelStyle}>Taille du bouton</span>
                <div
                  style={{
                    display: "flex",
                    background: "#F1F5F9",
                    padding: "5px",
                    borderRadius: 8,
                    gap: 2,
                  }}
                >
                  {["sm", "md", "lg"].map((size) => {
                    const isActive = (data[`${prefix}Size`] as string) === size;
                    return (
                      <button
                        key={size}
                        onClick={() => set(`${prefix}Size`, size)}
                        style={{
                          flex: 1,
                          padding: "3px 3px",
                          borderRadius: 4,
                          border: "none",
                          background: isActive ? "#fff" : "transparent",
                          color: isActive ? "#2563EB" : "#000000",
                          fontSize: "9px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isActive
                            ? "0 1px 3px rgba(0,0,0,0.1)"
                            : "none",
                        }}
                      >
                        {size === "sm"
                          ? "Petit"
                          : size === "md"
                            ? "Moyen"
                            : "Grand"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Taille Texte */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={subLabelStyle}>Taille du texte</span>
                <div>
                  <FontSizeInput
                    value={(data[`${prefix}FontSize`] as string) || "14px"}
                    onChange={(v) => set(`${prefix}FontSize`, v)}
                  />
                </div>
              </div>
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

const subLabelStyle: React.CSSProperties = {
  fontSize: "9px", // Réduit de 11px à 10px
  fontWeight: 600, // Augmenté pour plus de visibilité
  color: "rgb(82 92 105)",
};

const dividerStyle: React.CSSProperties = {
  height: "1px",
  background: "linear-gradient(to right, transparent, #E2E8F0, transparent)",
};
