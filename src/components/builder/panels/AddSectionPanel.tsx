"use client";

import { SectionType } from "../types";
import { SECTION_CONFIGS } from "../configs";

export function AddSectionPanel({
  onAdd,
  onClose,
}: {
  onAdd: (type: SectionType) => void;
  onClose: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
          Ajouter une section
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748B",
            fontSize: "1rem",
          }}
        >
          <i className="bi bi-x-lg" />
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {(
          Object.entries(SECTION_CONFIGS) as [
            SectionType,
            { label: string; icon: string },
          ][]
        ).map(([type, cfg]) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #E2E8F0",
              borderRadius: 10,
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              textAlign: "left",
              transition: "border-color .15s, background .15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#2563EB";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#EFF6FF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#E2E8F0";
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i
                className={`bi ${cfg.icon}`}
                style={{ color: "#2563EB", fontSize: "1rem" }}
              />
            </div>
            <span
              style={{ fontWeight: 600, fontSize: ".85rem", color: "#0F172A" }}
            >
              {cfg.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
