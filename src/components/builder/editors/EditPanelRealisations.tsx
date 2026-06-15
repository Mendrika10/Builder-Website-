"use client";

import { useState } from "react";
import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";
import { FieldTextArea } from "../ui/FieldTextArea";

export function EditPanelRealisations({
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
      titre: string;
      desc: string;
      bg: string;
      color: string;
      imageUrl?: string;
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
        titre: "Nouveau Projet",
        desc: "Description du projet.",
        bg: "#1A1A1A",
        color: "#fff",
        imageUrl: "",
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
      <FieldText
        label="Lien (texte)"
        value={data.ctaText as string}
        onChange={(v) => set("ctaText", v)}
      />
      <SectionLabel>Projets ({items.length})</SectionLabel>
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
              {item.titre}
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
                value={item.titre}
                onChange={(e) => updateItem(i, "titre", e.target.value)}
                placeholder="Titre du projet"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  outline: "none",
                }}
              />
              <textarea
                value={item.desc}
                onChange={(e) => updateItem(i, "desc", e.target.value)}
                rows={2}
                placeholder="Description"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  resize: "vertical",
                  outline: "none",
                }}
              />
              <input
                value={item.imageUrl || ""}
                onChange={(e) => updateItem(i, "imageUrl", e.target.value)}
                placeholder="URL image (optionnel)"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <label style={{ fontSize: ".75rem", color: "#64748B" }}>
                  Fond :
                </label>
                <input
                  type="color"
                  value={item.bg}
                  onChange={(e) => updateItem(i, "bg", e.target.value)}
                  style={{
                    width: 32,
                    height: 28,
                    border: "1px solid #E2E8F0",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                />
                <label style={{ fontSize: ".75rem", color: "#64748B" }}>
                  Texte :
                </label>
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => updateItem(i, "color", e.target.value)}
                  style={{
                    width: 32,
                    height: 28,
                    border: "1px solid #E2E8F0",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                />
              </div>
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
        + Ajouter un projet
      </button>
    </>
  );
}
