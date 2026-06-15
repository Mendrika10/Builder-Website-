"use client";

import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";
import { FieldTextArea } from "../ui/FieldTextArea";
import { FieldColor } from "../ui/FieldColor";

export function EditPanelExpertises({
  data,
  onUpdate,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const items = (data.items as { icon: string; label: string }[]) ?? [];

  const updateItem = (i: number, field: string, value: string) => {
    const next = items.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item,
    );
    set("items", next);
  };

  const removeItem = (i: number) =>
    set(
      "items",
      items.filter((_, idx) => idx !== i),
    );

  const addItem = () =>
    set("items", [...items, { icon: "bi-star", label: "Nouveau service" }]);

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
      <FieldTextArea
        label="Sous-titre"
        value={data.subtitle as string}
        onChange={(v) => set("subtitle", v)}
        rows={2}
      />
      <FieldText
        label="Texte du lien"
        value={data.ctaText as string}
        onChange={(v) => set("ctaText", v)}
      />
      <SectionLabel>Couleur de fond</SectionLabel>
      <FieldColor
        label="Couleur de fond"
        value={(data.bgColor as string) || "#0F172A"}
        onChange={(v) => set("bgColor", v)}
      />
      <SectionLabel>Services ({items.length})</SectionLabel>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#F8FAFC",
            borderRadius: 8,
            padding: "8px 10px",
            marginBottom: 6,
            border: "1px solid #E2E8F0",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <input
              value={item.icon}
              onChange={(e) => updateItem(i, "icon", e.target.value)}
              placeholder="bi-icon"
              style={{
                flex: 1,
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                fontSize: ".8rem",
                outline: "none",
              }}
            />
            <button
              onClick={() => removeItem(i)}
              style={{
                background: "#FEE2E2",
                border: "none",
                borderRadius: 6,
                color: "#EF4444",
                cursor: "pointer",
                padding: "0 8px",
                fontSize: ".8rem",
              }}
            >
              ✕
            </button>
          </div>
          <input
            value={item.label}
            onChange={(e) => updateItem(i, "label", e.target.value)}
            placeholder="Nom du service"
            style={{
              width: "100%",
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              fontSize: ".8rem",
              outline: "none",
            }}
          />
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
        + Ajouter un service
      </button>
    </>
  );
}
