"use client";

import React, { useState } from "react";

export function SectionAccordion({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        background: "#fff",
        marginBottom: 12,
        // Ombre subtile qui s'agrandit quand l'accordéon est ouvert
        boxShadow: open
          ? "0 4px 12px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -1px rgba(15, 23, 42, 0.02)"
          : "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        transition: "all 0.2s ease",
        // overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "none",
          borderBottom: open ? "1px solid #F1F5F9" : "none",
          // Fond blanc ou gris très clair au survol/ouverture
          background: open ? "#F8FAFC" : isHovered ? "#F8FAFC" : "#fff",
          color: open ? "#2563EB" : "#334155",
          fontSize: "11px",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.15s ease",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {icon && (
            <i
              className={`${icon}`}
              style={{
                fontSize: "12px",
                // L'icône s'illumine en bleu quand c'est ouvert
                color: open ? "#2563EB" : "rgb(148, 163, 184)",
                transition: "color 0.15s ease",
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
          )}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600, // Un demi-gras plus élégant que le gras pur
              color: open ? "#1E40AF" : "rgb(51, 65, 85)",
              flex: "1 1 0%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </span>
        </span>

        {/* Chevron moderne entouré d'une petite capsule */}
        <span
          style={{
            width: 20,
            height: 20,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            background: open ? "#EFF6FF" : "transparent",
            color: open ? "#2563EB" : "rgb(148, 163, 184)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.2s ease",
          }}
        >
          <i className="bi bi-chevron-down" style={{ fontSize: 10 }} />
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#fff",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
