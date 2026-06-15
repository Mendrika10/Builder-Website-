"use client";

import { useState } from "react";
import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";
import { FieldTextArea } from "../ui/FieldTextArea";

export function EditPanelTemoignages({
  data,
  onUpdate,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const items =
    (data.items as {
      logo: string;
      logoColor: string;
      name: string;
      role: string;
      text: string;
    }[]) ?? [];

  const [expanded, setExpanded] = useState<number | null>(null);

  const updateItem = (i: number, field: string, value: string) => {
    const next = items.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item,
    );
    set("items", next);
  };

  const removeItem = (i: number) => {
    set(
      "items",
      items.filter((_, idx) => idx !== i),
    );
    setExpanded(null);
  };

  const addItem = () => {
    set("items", [
      ...items,
      {
        logo: "Nouveau",
        logoColor: "#2563EB",
        name: "Nom Prénom",
        role: "Rôle",
        text: "Témoignage du client.",
      },
    ]);
    setExpanded(items.length);
  };

  return (
    <>
      <SectionLabel>Contenu</SectionLabel>
      <FieldText
        label="Label de section"
        value={data.sectionLabel as string}
        onChange={(v) => set("sectionLabel", v)}
      />
      <FieldTextArea
        label="Titre"
        value={data.title as string}
        onChange={(v) => set("title", v)}
        rows={2}
      />
      <SectionLabel>Témoignages ({items.length})</SectionLabel>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#F8FAFC",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            marginBottom: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              cursor: "pointer",
            }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <span style={{ fontWeight: 600, fontSize: ".82rem" }}>
              {item.name}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(i);
                }}
                style={{
                  background: "#FEE2E2",
                  border: "none",
                  borderRadius: 4,
                  color: "#EF4444",
                  cursor: "pointer",
                  padding: "2px 6px",
                  fontSize: ".75rem",
                }}
              >
                ✕
              </button>
              <i
                className={`bi ${expanded === i ? "bi-chevron-up" : "bi-chevron-down"}`}
                style={{ fontSize: ".8rem", color: "#64748B" }}
              />
            </div>
          </div>
          {expanded === i && (
            <div
              style={{
                padding: "0 10px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <input
                value={item.logo}
                onChange={(e) => updateItem(i, "logo", e.target.value)}
                placeholder="Nom de l'entreprise"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="color"
                  value={item.logoColor}
                  onChange={(e) => updateItem(i, "logoColor", e.target.value)}
                  style={{
                    width: 36,
                    height: 32,
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                />
                <input
                  value={item.logoColor}
                  onChange={(e) => updateItem(i, "logoColor", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid #E2E8F0",
                    fontSize: ".82rem",
                    outline: "none",
                  }}
                />
              </div>
              <input
                value={item.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder="Nom complet"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  outline: "none",
                }}
              />
              <input
                value={item.role}
                onChange={(e) => updateItem(i, "role", e.target.value)}
                placeholder="Rôle / Entreprise"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  outline: "none",
                }}
              />
              <textarea
                value={item.text}
                onChange={(e) => updateItem(i, "text", e.target.value)}
                rows={3}
                placeholder="Témoignage..."
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: 8,
          border: "1.5px dashed #CBD5E1",
          background: "none",
          color: "#2563EB",
          fontWeight: 600,
          fontSize: ".82rem",
          cursor: "pointer",
        }}
      >
        + Ajouter un témoignage
      </button>
    </>
  );
}
