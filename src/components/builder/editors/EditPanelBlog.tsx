"use client";

import { useState } from "react";
import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";

export function EditPanelBlog({
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
      tag: string;
      titre: string;
      desc: string;
      imageUrl?: string;
      imageBg: string;
      imageEmoji: string;
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
        tag: "ARTICLE",
        titre: "Nouvel article",
        desc: "Description de l'article.",
        imageUrl: "",
        imageBg: "#EFF6FF",
        imageEmoji: "📝",
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
      <FieldText
        label="Titre"
        value={data.title as string}
        onChange={(v) => set("title", v)}
      />
      <FieldText
        label="Lien (texte)"
        value={data.ctaText as string}
        onChange={(v) => set("ctaText", v)}
      />
      <SectionLabel>Articles ({items.length})</SectionLabel>
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
                value={item.tag}
                onChange={(e) => updateItem(i, "tag", e.target.value)}
                placeholder="Tag (ex: CMS)"
                style={{
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  fontSize: ".82rem",
                  outline: "none",
                }}
              />
              <input
                value={item.titre}
                onChange={(e) => updateItem(i, "titre", e.target.value)}
                placeholder="Titre"
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
                <input
                  value={item.imageEmoji}
                  onChange={(e) => updateItem(i, "imageEmoji", e.target.value)}
                  placeholder="Emoji 📝"
                  style={{
                    width: 60,
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid #E2E8F0",
                    fontSize: "1rem",
                    outline: "none",
                    textAlign: "center",
                  }}
                />
                <input
                  type="color"
                  value={item.imageBg}
                  onChange={(e) => updateItem(i, "imageBg", e.target.value)}
                  style={{
                    width: 36,
                    height: 32,
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: ".75rem", color: "#64748B" }}>
                  Fond carte
                </span>
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
        + Ajouter un article
      </button>
    </>
  );
}
