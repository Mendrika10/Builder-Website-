"use client";

import { useState } from "react";
import { BuilderSection } from "../types";
import { SECTION_CONFIGS } from "../configs";

export function SectionWrapper({
  section,
  isSelected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
}: {
  section: BuilderSection;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const show = hovered || isSelected;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        outline: isSelected
          ? "2.5px solid #2563EB"
          : hovered
            ? "2px dashed #93C5FD"
            : "2px solid transparent",
        outlineOffset: -2,
        transition: "outline .1s",
      }}
    >
      {/* Pointer events shield so user can't interact with section content */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />

      {/* Overlay controls */}
      {show && (
        <>
          {/* Label top-left */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 20,
              background: isSelected ? "#2563EB" : "#64748B",
              color: "#fff",
              fontSize: ".7rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {SECTION_CONFIGS[section.type]?.label}
          </div>

          {/* Buttons top-right */}
          <div
            style={{
              position: "absolute",
              top: 4,
              right: 8,
              zIndex: 20,
              display: "flex",
              gap: 4,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={!canMoveUp}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: canMoveUp ? "#fff" : "#F1F5F9",
                color: canMoveUp ? "#334155" : "#CBD5E1",
                cursor: canMoveUp ? "pointer" : "not-allowed",
                fontSize: ".8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,.1)",
              }}
            >
              <i className="bi bi-chevron-up" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={!canMoveDown}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: canMoveDown ? "#fff" : "#F1F5F9",
                color: canMoveDown ? "#334155" : "#CBD5E1",
                cursor: canMoveDown ? "pointer" : "not-allowed",
                fontSize: ".8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,.1)",
              }}
            >
              <i className="bi bi-chevron-down" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: "#EF4444",
                color: "#fff",
                cursor: "pointer",
                fontSize: ".8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,.1)",
              }}
            >
              <i className="bi bi-trash3" />
            </button>
          </div>
        </>
      )}
      {children}
    </div>
  );
}
